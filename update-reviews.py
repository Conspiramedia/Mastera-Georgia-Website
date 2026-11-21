#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Обновление числа отзывов и рейтинга Google по всему сайту.

Запуск:
    python update-reviews.py 8 4.5

Число и рейтинг стоят в четырёх разных видах, и забыть один легко:

  1. redesign.js — константы GR_COUNT и GR_RATING, из них строится блок
                   отзывов на лендингах;
  2. redesign.js — подпись rvStarsLabel («Оценка 4,4 из 5») на трёх
                   языках, причём у английского точка, а не запятая;
  3. HTML (6 главных) — видимый блок: data-gr-rating, data-gr-count и
                   aria-label звёзд;
  4. HTML (147 стр.) — JSON-LD aggregateRating: ratingValue и
                   reviewCount, их читает Google для сниппета в выдаче.

Правка руками означала бы обойти 147 файлов. Пропущенное место не ломает
сайт явно: страница покажет старую цифру, а в выдаче Google останется
прежний рейтинг — расхождение заметят не скоро.

⚠️ Числа заменяются ТОЛЬКО по этим якорям, а не поиском самой цифры.
В блоке отзывов есть `<span class="review-card__avatar">7</span>` —
первая буква имени автора «777Crazy777». Замена всех `>7<` переименовала
бы автора в «8».

Скрипт сам поднимает версию статики (bump-version.py): без неё правка не
дойдёт до посетителей из-за Cache-Control max-age=14400.
"""

import re
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Консоль Windows по умолчанию cp1251: русский вывод превращается в кашу, а
# символы вроде звёзд роняют скрипт с UnicodeEncodeError уже после правки
# файлов — выглядит как провал удачного запуска. Переключаем вывод на UTF-8.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def fail(msg):
    print(f"Ошибка: {msg}")
    sys.exit(1)


def parse_args():
    """Разбор аргументов. Рейтинг принимаем и через точку, и через запятую."""
    if len(sys.argv) != 3:
        print(__doc__)
        fail("нужно два аргумента — число отзывов и рейтинг")

    raw_count, raw_rating = sys.argv[1], sys.argv[2].replace(",", ".")

    if not raw_count.isdigit() or int(raw_count) < 1:
        fail(f"число отзывов должно быть целым и больше нуля, получено «{sys.argv[1]}»")

    try:
        rating = float(raw_rating)
    except ValueError:
        fail(f"рейтинг должен быть числом, получено «{sys.argv[2]}»")

    # Рейтинг Google — от 1 до 5. Опечатка вида «45» вместо «4.5» разошлась
    # бы по 147 файлам и попала в выдачу Google, поэтому проверяем сразу.
    if not 1.0 <= rating <= 5.0:
        fail(f"рейтинг вне диапазона 1–5: {rating}")

    return int(raw_count), rating


def current_values():
    """Что стоит в коде сейчас — читаем из констант redesign.js."""
    js = (ROOT / "redesign.js").read_text(encoding="utf-8")

    m_count = re.search(r"var GR_COUNT = '(\d+)';", js)
    m_rating = re.search(r"var GR_RATING = '([\d,.]+)';", js)
    if not m_count or not m_rating:
        fail("в redesign.js не найдены GR_COUNT и GR_RATING — изменилась разметка?")

    return m_count.group(1), m_rating.group(1).replace(",", ".")


def plural_ru(n):
    """Русская форма: 1 отзыв, 2 отзыва, 5 отзывов.

    Одна захардкоженная форма дала бы «8 отзыва», поэтому выбираем по числу.
    """
    if 11 <= n % 100 <= 14:
        return "отзывов"
    last = n % 10
    if last == 1:
        return "отзыв"
    if last in (2, 3, 4):
        return "отзыва"
    return "отзывов"


def plural_en(n):
    return "review" if n == 1 else "reviews"


def apply(path, pairs):
    """Заменяет пары (шаблон, замена). Возвращает число правок."""
    text = original = path.read_text(encoding="utf-8")
    hits = 0

    for pattern, repl in pairs:
        text, n = re.subn(pattern, repl, text)
        hits += n

    if text != original:
        path.write_text(text, encoding="utf-8")
    return hits



def main():
    new_count, new_rating = parse_args()
    old_count, old_dot = current_values()

    # Рейтинг в двух написаниях: с точкой (JSON-LD и английский текст) и с
    # запятой (русский и грузинский). Одно значение, два формата.
    new_dot = f"{new_rating:.1f}"
    new_comma = new_dot.replace(".", ",")
    old_comma = old_dot.replace(".", ",")

    if (str(new_count), new_dot) == (old_count, old_dot):
        print(f"Уже стоит {new_count} и {new_comma} — менять нечего.")
        return

    print(f"Было:  {old_count} отзывов, рейтинг {old_comma}")
    print(f"Стало: {new_count} {plural_ru(new_count)}, рейтинг {new_comma}")
    print()

    oc, od, ocm = re.escape(old_count), re.escape(old_dot), re.escape(old_comma)

    # ── 1. redesign.js: константы, подписи, дата сверки ────────────────
    js_hits = apply(ROOT / "redesign.js", [
        (rf"var GR_COUNT = '{oc}';", f"var GR_COUNT = '{new_count}';"),
        (rf"var GR_RATING = '{ocm}';", f"var GR_RATING = '{new_comma}';"),
        (rf"Оценка {ocm} из 5", f"Оценка {new_comma} из 5"),
        (rf"Rated {od} out of 5", f"Rated {new_dot} out of 5"),
        (rf"შეფასება {ocm} 5-დან", f"შეფასება {new_comma} 5-დან"),
        (r"Сверено с Google Картами \d\d\.\d\d\.\d{4}: [\d,]+ при \d+ отзывах\.",
         f"Сверено с Google Картами {date.today():%d.%m.%Y}: "
         f"{new_comma} при {new_count} отзывах."),
    ])
    print(f"  redesign.js — правок: {js_hits}")

    # ── 2. HTML ────────────────────────────────────────────────────────
    html_pairs = [
        # JSON-LD: его читает Google для звёзд в выдаче.
        (rf'"ratingValue": "{od}"', f'"ratingValue": "{new_dot}"'),
        (rf'"reviewCount": "{oc}"', f'"reviewCount": "{new_count}"'),
        # Видимый блок — строго по якорям data-gr-*, не по самой цифре.
        # Разделитель подставляется по языку страницы (см. ниже): на EN
        # пишут 4.5, на RU и GE — 4,5.
        (rf"(data-gr-rating>)[\d,.]+(<)", r"\g<1>{sep}\g<2>"),
        (rf"(data-gr-count>){oc}(</span>)", rf"\g<1>{new_count}\g<2>"),
        # Подпись при числе: русская форма зависит от числа.
        (r"(data-gr-count>\d+</span>) отзыв[а-я]*",
         rf"\g<1> {plural_ru(new_count)}"),
        (r"(data-gr-count>\d+</span>) reviews?",
         rf"\g<1> {plural_en(new_count)}"),
        # Подпись звёзд для скринридеров.
        (rf'aria-label="Оценка {ocm} из 5"',
         f'aria-label="Оценка {new_comma} из 5"'),
        (rf'aria-label="Rated {od} out of 5"',
         f'aria-label="Rated {new_dot} out of 5"'),
        (rf'aria-label="შეფასება {ocm} 5-დან"',
         f'aria-label="შეფასება {new_comma} 5-დან"'),
        # Комментарий над блоком — чтобы цифры в нём не врали.
        (rf"равны профилю Google: {ocm} при {oc} отзывах\.",
         f"равны профилю Google: {new_comma} при {new_count} отзывах."),
    ]

    html_hits = touched = 0
    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        # Язык берём из пути (/en/... → английский): он решает, писать в
        # видимой цифре точку или запятую. Тот же выбор делает grRating()
        # в redesign.js для страниц, где блок строит JS.
        sep = new_dot if "en" in path.parts else new_comma
        n = apply(path, [(p, r.replace("{sep}", sep)) for p, r in html_pairs])
        if n:
            touched += 1
            html_hits += n
    print(f"  HTML — страниц: {touched}, правок: {html_hits}")

    if not js_hits or not html_hits:
        print()
        print("⚠️ Часть мест не найдена — проверьте разметку, прежде чем пушить.")

    # ── 3. Версия статики ──────────────────────────────────────────────
    print()
    print("Поднимаю версию статики:")
    # flush обязателен: bump-version.py печатает прямо в консоль, а наши
    # строки ждут в буфере — без него его вывод оказывается ВЫШЕ нашего,
    # и читается как будто версию поднимали до правки отзывов.
    sys.stdout.flush()
    subprocess.run([sys.executable, str(ROOT / "bump-version.py")], check=True)

    print()
    print("Проверьте diff и отправьте одной пачкой:")
    print("  git add -u redesign.js sw.js ru en ge")
    print(f'  git commit -m "Отзывы Google: {new_count}, рейтинг {new_comma}"')
    print("  git push origin main")


if __name__ == "__main__":
    main()
