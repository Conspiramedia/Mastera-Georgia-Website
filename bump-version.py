#!/usr/bin/env python3
"""
bump-version.py — поднимает версию статики во всём сайте одной командой.

Зачем: script.js, style.css и service.css подключаются с ?v=<номер>, и пока
номер прежний, браузер посетителя 4 часа отдаёт файл из своего кэша, не
спрашивая сервер (Cache-Control: max-age=14400). Правка при этом молча не
доходит до людей — ошибка тихая, в коде её не видно.

Номер живёт в ДВУХ местах, и они обязаны совпадать:
  • ASSET_VERSION в sw.js — из него собирается имя кэша и адреса PRECACHE_URLS;
  • ?v=<номер> в <script> и <link> всех HTML-страниц.

⚠️ Адреса прекэша сверяются с адресами страницы ПОСИМВОЛЬНО: caches.match()
сравнивает URL целиком вместе с ?v=. Разойдутся — service worker скачает файл
дважды, отдаст странице одну копию, а в кэш положит другую.

Запуск (из папки сайта):
    python bump-version.py          # поднять версию на единицу
    python bump-version.py 30       # поставить конкретный номер
    python bump-version.py --check  # только проверить, ничего не меняя

После запуска: закоммитить и запушить — деплой дойдёт до людей сразу,
сбрасывать кэш Cloudflare вручную (Purge Everything) больше не нужно.
"""

import re
import sys
from pathlib import Path

# Консоль Windows по умолчанию в cp1251 и падает на эмодзи (UnicodeEncodeError).
# Переключаем вывод на UTF-8, чтобы скрипт одинаково работал в PowerShell,
# cmd и терминале Git Bash.
for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass  # поток перенаправлен в файл или не поддерживает reconfigure

# Папка сайта — та, где лежит сам скрипт
ROOT = Path(__file__).resolve().parent
SW = ROOT / "sw.js"
SCRIPT = ROOT / "script.js"

# Файлы статики, у которых в HTML стоит ?v=<номер>.
# Пополняя список, добавь файл и в PRECACHE_URLS в sw.js.
ASSETS = ("script.js", "style.css", "service.css")

# OG-превью (картинка ссылки в соцсетях). Отдельно от ASSETS, потому что путь
# в разметке АБСОЛЮТНЫЙ (https://mastera.ge/image/...) — так требуют Facebook и
# Telegram. Шаблон ASSETS подставил бы относительный путь и сломал ссылку.
#
# Версия тут нужна острее, чем у CSS: соцсети кэшируют превью надолго и сами
# его не перечитывают. Без нового адреса в ленте неделями висела бы старая
# картинка.
OG_IMAGES = ("og-preview-ru.jpg", "og-preview-en.jpg", "og-preview-ka.jpg")


def read_sw_version():
    """Текущий номер из sw.js (ASSET_VERSION = '23')."""
    if not SW.exists():
        sys.exit(f"Не найден {SW} — запускай скрипт из папки сайта.")
    text = SW.read_text(encoding="utf-8")
    m = re.search(r"const\s+ASSET_VERSION\s*=\s*['\"](\d+)['\"]", text)
    if not m:
        sys.exit("В sw.js не найдена строка ASSET_VERSION = '<номер>'.")
    return int(m.group(1)), text


def html_files():
    """Все страницы сайта. Папка .git пропускается."""
    return [p for p in ROOT.rglob("*.html") if ".git" not in p.parts]


def scan_html():
    """Какие номера версий реально стоят в страницах: {номер: сколько ссылок}."""
    # Ищем /script.js?v=23 и т.п. — с версией или без неё
    pattern = re.compile(
        r'/(?:' + "|".join(a.replace(".", r"\.") for a in ASSETS) + r')(\?v=(\d+))?'
    )
    found = {}
    for path in html_files():
        for m in pattern.finditer(path.read_text(encoding="utf-8")):
            key = int(m.group(2)) if m.group(2) else None  # None = ссылка без версии
            found[key] = found.get(key, 0) + 1
    return found


def read_script_version():
    """Номер из script.js (MASTERA_VERSION), либо None, если константы нет."""
    if not SCRIPT.exists():
        return None
    m = re.search(
        r"const\s+MASTERA_VERSION\s*=\s*['\"](\d+)['\"]",
        SCRIPT.read_text(encoding="utf-8"),
    )
    return int(m.group(1)) if m else None


def check(sw_version, found):
    """Сверяет sw.js, script.js и страницы. True, если всё согласовано."""
    print(f"sw.js: ASSET_VERSION = {sw_version}")
    if not found:
        print("В страницах не найдено ни одной ссылки на статику — проверь ASSETS.")
        return False

    ok = True

    script_version = read_script_version()
    if script_version is None:
        print("  (в script.js нет MASTERA_VERSION — проверка по консоли недоступна)")
    elif script_version != sw_version:
        print(f"  ⚠️  script.js: MASTERA_VERSION = {script_version} — расходится с sw.js")
        ok = False
    else:
        print(f"  ✅ script.js: MASTERA_VERSION = {script_version}")
    for version, count in sorted(found.items(), key=lambda x: (x[0] is None, x[0])):
        if version is None:
            print(f"  ⚠️  без версии: {count} ссылок — кэш их не обновит")
            ok = False
        elif version != sw_version:
            print(f"  ⚠️  ?v={version}: {count} ссылок — расходится с sw.js")
            ok = False
        else:
            print(f"  ✅ ?v={version}: {count} ссылок")
    return ok


def bump(old, new, sw_text):
    """Меняет номер в sw.js, script.js и во всех страницах."""
    # 1. sw.js
    new_sw = re.sub(
        r"(const\s+ASSET_VERSION\s*=\s*['\"])\d+(['\"])",
        rf"\g<1>{new}\g<2>",
        sw_text,
    )
    SW.write_text(new_sw, encoding="utf-8", newline="")

    # 2. script.js — константа MASTERA_VERSION, по ней в консоли видно,
    #    какой файл реально исполняется у посетителя. Разойдётся с ?v= —
    #    и проверка начнёт врать, поэтому поднимаем здесь же.
    if SCRIPT.exists():
        text = SCRIPT.read_text(encoding="utf-8")
        new_text, n = re.subn(
            r"(const\s+MASTERA_VERSION\s*=\s*['\"])\d+(['\"])",
            rf"\g<1>{new}\g<2>",
            text,
        )
        if n:
            SCRIPT.write_text(new_text, encoding="utf-8", newline="")

    # 2. Страницы. Заменяем и ссылки со старой версией, и забытые без неё —
    #    иначе страница, добавленная мимо скрипта, молча осталась бы без кэша.
    changed_files = 0
    changed_links = 0
    for path in html_files():
        text = path.read_text(encoding="utf-8")
        original = text
        for asset in ASSETS:
            esc = asset.replace(".", r"\.")
            # /asset?v=<любой номер>  →  /asset?v=<new>
            text, n1 = re.subn(rf"/{esc}\?v=\d+", f"/{asset}?v={new}", text)
            # /asset без версии (в кавычках, чтобы не задеть текст) → с версией
            text, n2 = re.subn(rf'(["\'])/{esc}\1', rf"\g<1>/{asset}?v={new}\g<1>", text)
            changed_links += n1 + n2

        # OG-превью: путь абсолютный, поэтому правим ТОЛЬКО хвост ?v=<номер>,
        # не трогая сам адрес (см. комментарий к OG_IMAGES выше).
        for img in OG_IMAGES:
            esc = img.replace(".", r"\.")
            text, n3 = re.subn(rf"({esc})\?v=\d+", rf"\g<1>?v={new}", text)
            # Без версии — дописываем её (кавычка закрывает значение атрибута).
            text, n4 = re.subn(rf"""({esc})(["'])""", rf"\g<1>?v={new}\g<2>", text)
            changed_links += n3 + n4
        if text != original:
            path.write_text(text, encoding="utf-8", newline="")
            changed_files += 1

    return changed_files, changed_links


def main():
    args = [a for a in sys.argv[1:]]
    sw_version, sw_text = read_sw_version()

    if "--check" in args:
        ok = check(sw_version, scan_html())
        print("\nВсё согласовано." if ok else "\nЕсть расхождения — запусти без --check.")
        sys.exit(0 if ok else 1)

    # Номер можно задать явно: python bump-version.py 30
    if args:
        if not args[0].isdigit():
            sys.exit(f"Непонятный аргумент: {args[0]}. Нужен номер версии или --check.")
        new_version = int(args[0])
        if new_version <= sw_version:
            # Понижение версии не обновит кэш: браузер уже видел этот адрес
            sys.exit(f"Новый номер {new_version} не больше текущего {sw_version}.")
    else:
        new_version = sw_version + 1

    print(f"Версия: {sw_version} → {new_version}")
    files, links = bump(sw_version, new_version, sw_text)
    print(f"Изменено: sw.js + {files} страниц ({links} ссылок)")

    ok = check(new_version, scan_html())
    if not ok:
        sys.exit("\n⚠️ После замены остались расхождения — проверь вручную.")

    print(
        "\nГотово. Дальше:\n"
        f'  git add sw.js $(git diff --name-only -- "*.html")\n'
        f'  git commit -m "Версия статики v{new_version}"\n'
        "  git push origin main"
    )


if __name__ == "__main__":
    main()
