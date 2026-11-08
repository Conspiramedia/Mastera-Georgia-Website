# -*- coding: utf-8 -*-
"""
Преобразует прайс на лендингах услуг Mastera Georgia:

  price-card (список «название … цена»)
      ↓
  price-previews (3 карточки-превью) + price-cta + price-full (полный
  прайс с поиском), плюс добавляет секции «Почему выбирают нас» (.why-grid)
  и «За что обращаются» (.about-list).

Перегенерирующий: если секции уже есть, они перестраиваются заново на языке
страницы (полезно после исправления перевода). Эталон с ручным оформлением
(содержит .price-preview__unit) пропускается.

Запуск:
  python build-landing-prices.py
"""

import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

WHY_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
]

I18N = {
    'ru': {
        'prices_eyebrow': 'Цены',
        'prices_note': 'Цена зависит от объёма и сложности. Согласуем стоимость до начала работ.',
        'cta_text': 'Полная стоимость — до начала работ',
        'cta_btn': 'Рассчитать мою задачу',
        'full_title': 'Полный прайс — все работы',
        'search_placeholder': 'Найти работу в прайсе',
        'search_reset': 'Сбросить',
        'why_eyebrow': 'Почему мы',
        'why_h2': 'Почему выбирают Mastera',
        'why': [
            ('Гарантия на работу', 'Устраняем недочёты и даём гарантию на выполненные работы.'),
            ('Проверенные мастера', 'Каждый специалист проходит проверку документов, а клиенты ставят оценку.'),
            ('Цена до начала работ', 'Стоимость согласуем заранее — без доплат и сюрпризов.'),
            ('Выезд в день обращения', 'Отклик за 60 минут, выезд — сегодня или в удобное время.'),
        ],
        'about_eyebrow': 'Наш подход',
        'about_h2': 'За что вы обращаетесь в Mastera',
        'about': [
            ('Цена согласована до начала работ', 'Мастер называет стоимость до того, как возьмётся за работу. Решение продолжать — за вами.'),
            ('Мастер проверен', 'Регистрация с документами и рейтинг по отзывам клиентов. Специалисты с низким рейтингом перестают получать заявки.'),
            ('Приедем в удобное время', 'Выезд в день обращения или к назначенному времени. Срочные заявки берём в работу первыми.'),
            ('Гарантия на работу', 'На работы, где это применимо, мастер даёт гарантию. Споры решаем по переписке и фотографиям.'),
        ],
    },
    'en': {
        'prices_eyebrow': 'Prices',
        'prices_note': 'The price depends on the scope and complexity. We agree on the cost before work starts.',
        'cta_text': 'Full price — before work starts',
        'cta_btn': 'Calculate my task',
        'full_title': 'Full price list — all jobs',
        'search_placeholder': 'Find a job in the price list',
        'search_reset': 'Reset',
        'why_eyebrow': 'Why us',
        'why_h2': 'Why choose Mastera',
        'why': [
            ('Guaranteed work', 'We fix any issues and provide a warranty on completed work.'),
            ('Vetted masters', 'Every specialist is verified with documents and rated by clients.'),
            ('Price before work', 'We agree on the cost in advance — no hidden extras.'),
            ('Same-day visit', 'Response within 60 minutes, visit today or at your convenience.'),
        ],
        'about_eyebrow': 'Our approach',
        'about_h2': 'Why you turn to Mastera',
        'about': [
            ('Price agreed before work', 'The master quotes a price before starting. You decide whether to proceed.'),
            ('Vetted master', 'Document registration and client ratings. Low-rated specialists stop receiving requests.'),
            ('Visit at your convenience', 'Same-day visit or a scheduled time. Urgent requests are handled first.'),
            ('Warranty on work', 'Where applicable, the master provides a warranty. Disputes are resolved via messages and photos.'),
        ],
    },
    'ka': {
        'prices_eyebrow': 'ფასები',
        'prices_note': 'ფასი დამოკიდებულია მოცულობასა და სირთულეზე. ღირებულებას ვათანხმებთ მუშაობის დაწყებამდე.',
        'cta_text': 'სრული ღირებულება — მუშაობის დაწყებამდე',
        'cta_btn': 'გამოთვალე ჩემი დავალება',
        'full_title': 'სრული ფასები — ყველა სამუშაო',
        'search_placeholder': 'იპოვე სამუშაო ფასებში',
        'search_reset': 'გასუფთავება',
        'why_eyebrow': 'რატომ ჩვენ',
        'why_h2': 'რატომ ირჩევენ Mastera-ს',
        'why': [
            ('გარანტია სამუშაოზე', 'ვასწორებთ ხარვეზებს და ვაძლევთ გარანტიას შესრულებულ სამუშაოზე.'),
            ('შემოწმებული ხელოსნები', 'ყველა სპეციალისტი გადის დოკუმენტების შემოწმებას და კლიენტები აფასებენ.'),
            ('ფასი მუშაობამდე', 'ღირებულებას წინასწარ ვათანხმებთ — დამალული დანამატების გარეშე.'),
            ('გასვლა მიმართვის დღეს', 'პასუხი 60 წუთში, გასვლა — დღეს ან თქვენთვის მოსახერხებელ დროს.'),
        ],
        'about_eyebrow': 'ჩვენი მიდგომა',
        'about_h2': 'რატომ მოგმართავთ Mastera-ს',
        'about': [
            ('ფასი შეთანხმებულია მუშაობამდე', 'ხელოსანი ასახელებს ღირებულებას მუშაობის დაწყებამდე. გაგრძელება თქვენზეა.'),
            ('ხელოსანი შემოწმებულია', 'რეგისტრაცია დოკუმენტებით და რეიტინგი კლიენტების შეფასებით. დაბალი რეიტინგის სპეციალისტები წყვეტენ განაცხადების მიღებას.'),
            ('მოვალთ მოსახერხებელ დროს', 'გასვლა მიმართვის დღეს ან შეთანხმებულ დროს. სასწრაფო განაცხადებს პირველები ვიღებთ.'),
            ('გარანტია სამუშაოზე', 'სადაც შესაძლებელია, ხელოსანი იძლევა გარანტიას. დავებს ვაგვარებთ მიმოწერით და ფოტოებით.'),
        ],
    },
}


def lang_of(rel_path):
    parts = rel_path.split('/')
    if parts and parts[0] == 'ge':
        return 'ka'
    if parts and parts[0] == 'en':
        return 'en'
    return 'ru'


def clean_name(name):
    """Убирает пояснение в скобках в конце названия для карточки-превью."""
    return re.sub(r'\s*\([^)]*\)\s*$', '', name).strip()


def extract_items(section):
    """Достаёт пары (название, цена) из price-card или price-line."""
    names = re.findall(r'price-card__name">([^<]+)</span>', section)
    vals = re.findall(r'price-card__val">([^<]+)</span>', section)
    if names and len(names) == len(vals):
        return list(zip(names, vals))
    names = re.findall(r'price-line__name">([^<]+)</span>', section)
    vals = re.findall(r'price-line__val">([^<]+)</span>', section)
    if names and len(names) == len(vals):
        return list(zip(names, vals))
    return None


def build_previews(items):
    parts = []
    for name, val in items[:3]:
        parts.append(
            '      <div class="price-preview">\n'
            '        <h3>%s</h3>\n'
            '        <div class="price-preview__value">%s</div>\n'
            '      </div>' % (clean_name(name), val)
        )
    return '\n'.join(parts)


def build_full_lines(items):
    parts = []
    for name, val in items:
        parts.append(
            '          <div class="price-line"><span class="price-line__name">%s</span>'
            '<span class="price-line__val">%s</span></div>' % (name, val)
        )
    return '\n'.join(parts)


def build_prices(t, h2, items):
    return (
        '<section class="section section--soft" id="prices">\n'
        '  <div class="container">\n'
        '    <div class="section-head">\n'
        '      <span class="section-head__eyebrow">%s</span>\n'
        '      <h2>%s</h2>\n'
        '      <p>%s</p>\n'
        '    </div>\n'
        '\n'
        '    <div class="price-previews">\n'
        '%s\n'
        '    </div>\n'
        '\n'
        '    <div class="price-cta">\n'
        '      <span class="price-cta__text">%s</span>\n'
        '      <a href="#lead" class="button button--primary">%s</a>\n'
        '    </div>\n'
        '\n'
        '    <details class="price-full">\n'
        '      <summary>%s</summary>\n'
        '      <div class="price-full__body">\n'
        '        <div class="price-search">\n'
        '          <input type="search" placeholder="%s" aria-label="%s">\n'
        '          <button type="button">%s</button>\n'
        '        </div>\n'
        '\n'
        '%s\n'
        '      </div>\n'
        '    </details>\n'
        '  </div>\n'
        '</section>'
    ) % (
        t['prices_eyebrow'], h2, t['prices_note'],
        build_previews(items),
        t['cta_text'], t['cta_btn'],
        t['full_title'],
        t['search_placeholder'], t['search_placeholder'], t['search_reset'],
        build_full_lines(items),
    )


def build_why(t):
    cards = []
    for (title, text), icon in zip(t['why'], WHY_ICONS):
        cards.append(
            '      <div class="why-card">\n'
            '        <span class="why-card__icon">\n'
            '          %s\n'
            '        </span>\n'
            '        <h3>%s</h3>\n'
            '        <p>%s</p>\n'
            '      </div>' % (icon, title, text)
        )
    return (
        '<section class="section" id="why">\n'
        '  <div class="container">\n'
        '    <div class="section-head">\n'
        '      <span class="section-head__eyebrow">%s</span>\n'
        '      <h2>%s</h2>\n'
        '    </div>\n'
        '\n'
        '    <div class="why-grid">\n'
        '%s\n'
        '    </div>\n'
        '  </div>\n'
        '</section>' % (t['why_eyebrow'], t['why_h2'], '\n'.join(cards))
    )


def build_about(t):
    items = []
    for summary, body in t['about']:
        items.append(
            '      <details class="about-item">\n'
            '        <summary>%s</summary>\n'
            '        <div class="about-item__body"><p>%s</p></div>\n'
            '      </details>' % (summary, body)
        )
    return (
        '<section class="section section--soft" id="about">\n'
        '  <div class="container">\n'
        '    <div class="section-head">\n'
        '      <span class="section-head__eyebrow">%s</span>\n'
        '      <h2>%s</h2>\n'
        '    </div>\n'
        '\n'
        '    <div class="about-list">\n'
        '%s\n'
        '    </div>\n'
        '  </div>\n'
        '</section>' % (t['about_eyebrow'], t['about_h2'], '\n'.join(items))
    )


def transform_file(path, rel_path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Эталон, оформленный вручную с бейджами единиц и категориями.
    if 'price-preview__unit' in html:
        return False

    lang = lang_of(rel_path)
    t = I18N[lang]

    m = re.search(
        r'<section class="section section--soft" id="prices">.*?</section>',
        html, re.DOTALL)
    if not m:
        return False

    section = m.group(0)
    h2m = re.search(r'<h2>(.*?)</h2>', section, re.DOTALL)
    items = extract_items(section)
    if not h2m or not items:
        return False

    h2 = h2m.group(1).strip()
    new_prices = build_prices(t, h2, items)
    html = html.replace(m.group(0), new_prices)

    why = build_why(t)
    mw = re.search(r'<section class="section" id="why">.*?</section>', html, re.DOTALL)
    if mw:
        html = html.replace(mw.group(0), why)
    else:
        html = html.replace(new_prices, new_prices + '\n\n' + why)

    about = build_about(t)
    ma = re.search(r'<section class="section section--soft" id="about">.*?</section>', html, re.DOTALL)
    if ma:
        html = html.replace(ma.group(0), about)
    else:
        html = html.replace(why, why + '\n\n' + about)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    return True


def main():
    changed = 0
    for dirpath, _dirs, files in os.walk(ROOT):
        if 'index.html' not in files:
            continue
        path = os.path.join(dirpath, 'index.html')
        rel = os.path.relpath(path, ROOT).replace('\\', '/')
        if '/tbilisi/' not in rel and '/batumi/' not in rel:
            continue
        if transform_file(path, rel):
            changed += 1
            print('OK  ' + rel)
    print('\nИзменено файлов: %d' % changed)


if __name__ == '__main__':
    main()
