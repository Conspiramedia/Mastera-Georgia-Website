# -*- coding: utf-8 -*-
"""Добавляет карточку с примером цены (.hero__price) в hero главных страниц
(ru/en/ge × корневая и batumi). Идемпотентен."""
import os
import io

ROOT = os.path.dirname(os.path.abspath(__file__))

SVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
       'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
       '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>')

CARD = {
    'ru': ('Мастер на час', 'от 40 ₾', 'Примерная цена · все услуги'),
    'en': ('Handyman', 'from 40 ₾', 'Sample price · all services'),
    'ka': ('ოსტატი საათით', '40 ₾-დან', 'სავარაუდო ფასი · ყველა სერვისი'),
}


def lang_of(rel):
    p = rel.split('/')[0]
    if p == 'en':
        return 'en'
    if p == 'ge':
        return 'ka'
    return 'ru'


def build_card(t):
    label, value, more = t
    return ('      <a href="#services" class="hero__price">\n'
            '        <span class="hero__price__label">' + label + '</span>\n'
            '        <span class="hero__price__value">' + value + '</span>\n'
            '        <span class="hero__price__more">' + more + ' ' + SVG + '</span>\n'
            '      </a>')


def main():
    changed = 0
    for dp, _dirs, fs in os.walk(ROOT):
        if '.git' in dp:
            continue
        if 'index.html' not in fs:
            continue
        p = os.path.join(dp, 'index.html')
        rel = os.path.relpath(p, ROOT).replace('\\', '/')
        parts = rel.split('/')
        # Только главные: {lang}/index.html или {lang}/batumi/index.html
        if len(parts) not in (2, 3):
            continue
        if len(parts) == 3 and parts[1] != 'batumi':
            continue

        s = io.open(p, encoding='utf-8', newline='').read()
        if 'hero__price' in s:
            continue
        if '      <div class="hero__cta">' not in s:
            continue

        card = build_card(CARD[lang_of(rel)])
        s = s.replace('      <div class="hero__cta">',
                      card + '\n\n      <div class="hero__cta">', 1)
        io.open(p, 'w', encoding='utf-8', newline='').write(s)
        changed += 1
        print('OK  ' + rel)
    print('\nИзменено файлов: %d' % changed)


if __name__ == '__main__':
    main()
