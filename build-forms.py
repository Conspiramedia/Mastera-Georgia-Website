# -*- coding: utf-8 -*-
"""Ставит правильную форму «Начнём с вашей задачи» (с полем телефона,
кнопкой, honeypot и согласием) на главные страницы и все лендинги услуг/районов.

Идемпотентен: файлы, где уже есть .v-float-form__row, пропускаются.
"""

import os
import re
import io

ROOT = os.path.dirname(os.path.abspath(__file__))

SVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
       'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
       '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>')

I18N = {
    'ru': {
        'h2': 'Начнём с вашей задачи',
        'sub': 'Оставьте телефон — уточним детали и условия.',
        'placeholder': 'Ваш телефон',
        'btn': 'Узнать стоимость',
        'consent': 'Даю согласие на обработку персональных данных и принимаю '
                   '<a href="/ru/privacy/">политику конфиденциальности</a> и '
                   '<a href="/ru/terms/">пользовательское соглашение</a>',
    },
    'en': {
        'h2': "Let's start with your task",
        'sub': 'Leave your phone number and we will confirm the details.',
        'placeholder': 'Your phone number',
        'btn': 'Get a price',
        'consent': 'I consent to the processing of my personal data and accept the '
                   '<a href="/en/privacy/">privacy policy</a> and the '
                   '<a href="/en/terms/">terms of service</a>',
    },
    'ka': {
        'h2': 'დავიწყოთ თქვენი ამოცანით',
        'sub': 'დატოვეთ ტელეფონი — დავაზუსტებთ დეტალებსა და პირობებს.',
        'placeholder': 'თქვენი ტელეფონი',
        'btn': 'ფასის გაგება',
        'consent': 'თანახმა ვარ პერსონალური მონაცემების დამუშავებაზე და ვეთანხმები '
                   '<a href="/ge/privacy/">კონფიდენციალურობის პოლიტიკას</a> და '
                   '<a href="/ge/terms/">მომხმარებლის შეთანხმებას</a>',
    },
}


def lang_of(rel):
    p = rel.split('/')[0]
    if p == 'en':
        return 'en'
    if p == 'ge':
        return 'ka'
    return 'ru'


def build_form(t, extra_cls, indent):
    i = indent
    cls = 'v-float-form' + (' ' + extra_cls if extra_cls else '')
    parts = [
        i + '<div class="' + cls + '">',
        i + '  <h2>' + t['h2'] + '</h2>',
        i + '  <p class="v-float-form__sub">' + t['sub'] + '</p>',
        '',
        i + '  <form class="v-float-form__row">',
        i + '    <input type="tel" name="phone" class="form-control" placeholder="' + t['placeholder'] + '" required>',
        i + '    <button type="submit" class="v-button">',
        i + '      ' + t['btn'],
        i + '      ' + SVG,
        i + '    </button>',
        '',
        i + '    <!-- Ловушка для ботов: человек это поле не увидит. -->',
        i + '    <input type="text" name="_gotcha" class="form-gotcha" tabindex="-1" autocomplete="off">',
        i + '  </form>',
        '',
        i + '  <label class="v-consent">',
        i + '    <input type="checkbox" required>',
        i + '    <span>' + t['consent'] + '</span>',
        i + '  </label>',
        i + '</div>',
    ]
    return '\n'.join(parts)


def main():
    changed = 0
    for dp, _dirs, fs in os.walk(ROOT):
        if '.git' in dp:
            continue
        if 'index.html' not in fs:
            continue
        p = os.path.join(dp, 'index.html')
        rel = os.path.relpath(p, ROOT).replace('\\', '/')
        lang = lang_of(rel)
        t = I18N[lang]
        s = io.open(p, encoding='utf-8', newline='').read()
        orig = s

        if 'v-float-form__row' in s:
            continue

        if 'v-float-form hero__form' in s:
            # Главная: заменяем текущий блок (ссылка + note) на форму.
            form = build_form(t, 'hero__form', '      ')
            s = re.sub(r'<div class="v-float-form hero__form">.*?</div>',
                       lambda m: form, s, flags=re.DOTALL)
        elif 'v-hero-img' in s:
            # Лендинг услуги/района: вставляем форму после фото в v-hero-media.
            form = build_form(t, '', '      ')
            s, n = re.subn(r'(<img[^>]*class="v-hero-img"[^>]*>)\s*</div>',
                           lambda m: m.group(1) + '\n' + form + '\n    </div>',
                           s, count=1)
            if n == 0:
                continue
        else:
            continue

        if s != orig:
            io.open(p, 'w', encoding='utf-8', newline='').write(s)
            changed += 1
            print('OK  ' + rel)
    print('\nИзменено файлов: %d' % changed)


if __name__ == '__main__':
    main()
