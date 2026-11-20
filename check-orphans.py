# -*- coding: utf-8 -*-
"""
Проверка перелинковки: ищем страницы-сироты. Только чтение.

Зачем нужен отдельный скрипт рядом с check-links.py. Тот ловит ссылки
в никуда (404) — ошибку видимую. Сирота — ошибка невидимая: страница
есть, отдаёт 200, стоит в sitemap, но ведёт на неё две-три ссылки, и
Google её не сканирует вовсе. В Search Console это выглядит как
«Обнаружена, не проиндексирована» с пустым «Последнее сканирование»:
адрес роботу известен, заходить он не стал.

Так в ноябре 2026 набралось 27 таких страниц: пять подрайонов Тбилиси
(Авчала, Дигоми, Мухиани, Ортачала, Варкетили), три услуги (Wi-Fi,
бойлеры, посудомоечные машины) и три страницы для мастеров. На
проиндексированные страницы вело 33-38 ссылок, на эти — 3.

⚠️ Считаем ТОЛЬКО ссылки из <a> в теле. hreflang и canonical из <head>
есть у каждой страницы и веса не передают — если их учитывать, сирота
выглядит благополучной (у неё всегда есть два языковых близнеца).

⚠️ Подвал сайта перестраивается скриптом redesign.js на лету: статичная
разметка в HTML заменяется целиком. Этот скрипт видит статичный вариант
— тот, что достаётся краулеру ДО отрисовки JS. Поэтому ссылка, которая
есть только в redesign.js, здесь не посчитается, и это правильно: до
рендеринга её не существует.
"""

import io
import os
import re
from collections import defaultdict
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))

# Ниже этого числа ссылок страница считается сиротой. Порог выбран по
# факту: у проиндексированных страниц сайта их 14 и больше, у всех
# непроиндексированных было 3.
THRESHOLD = 3

SKIP_DIRS = {".git", "node_modules", ".github", "facebook-posts"}


class LinkGrab(HTMLParser):
    """Собирает href отдельно из <a> (тело) и из <link rel> (служебные)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.body = []
        self.head = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        href = (d.get("href") or "").strip()
        if not href:
            return
        if tag == "a":
            self.body.append(href)
        elif tag == "link":
            rel = (d.get("rel") or "").lower()
            if "alternate" in rel or "canonical" in rel:
                self.head.append(href)


def norm(href):
    """href → путь страницы ('ru/tbilisi/x') либо None, если ссылка чужая."""
    h = href.strip()
    if h.startswith(("mailto:", "tel:", "javascript:", "#", "data:", "//")):
        return None
    h = re.sub(r"^https?://(www\.)?mastera\.ge", "", h, flags=re.I)
    if h.startswith("http"):
        return None
    h = h.split("#")[0].split("?")[0].strip("/")
    if h.endswith("/index.html"):
        h = h[: -len("/index.html")]
    elif h == "index.html":
        h = ""
    return h


def rel_path(fpath):
    rel = os.path.relpath(fpath, ROOT).replace("\\", "/")
    if rel.endswith("/index.html"):
        rel = rel[: -len("/index.html")]
    elif rel == "index.html":
        rel = ""
    return rel


def main():
    sitemap = os.path.join(ROOT, "sitemap.xml")
    if not os.path.exists(sitemap):
        print("нет sitemap.xml — проверять нечего")
        return 0
    with io.open(sitemap, encoding="utf-8") as f:
        xml = f.read()
    pages = []
    for loc in re.findall(r"<loc>([^<]+)</loc>", xml):
        pages.append(re.sub(r"^https?://[^/]+/?", "", loc.strip()).strip("/"))

    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.endswith(".html"):
                files.append(os.path.join(dirpath, fn))

    body_in = defaultdict(set)
    head_in = defaultdict(set)
    for path in files:
        try:
            with io.open(path, encoding="utf-8") as f:
                text = f.read()
        except OSError as e:
            print(f"не прочитан {path}: {e}")
            continue
        src = rel_path(path)
        p = LinkGrab()
        p.feed(text)
        for href in p.body:
            t = norm(href)
            # Self-ссылку не считаем: вес она не передаёт.
            if t is not None and t != src:
                body_in[t].add(src)
        for href in p.head:
            t = norm(href)
            if t is not None and t != src:
                head_in[t].add(src)

    rows = []
    for page in pages:
        if page:
            rows.append((page, len(body_in.get(page, ())), len(head_in.get(page, ()))))
    rows.sort(key=lambda r: (r[1], r[0]))

    orphans = [r for r in rows if r[1] <= THRESHOLD]
    print(f"страниц в sitemap: {len(rows)}")
    print(f"HTML-файлов просмотрено: {len(files)}")
    if orphans:
        print(f"СИРОТЫ (<= {THRESHOLD} ссылок в теле): {len(orphans)}")
        print("ссылок  страница")
        for page, b, _h in orphans:
            print(f"{b:6}  {page}")
        return 1
    print(f"сирот нет, минимум ссылок на страницу: {min(r[1] for r in rows)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
