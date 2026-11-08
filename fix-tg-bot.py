# -*- coding: utf-8 -*-
"""Заменяет устаревшую Telegram-ссылку t.me/job_kot на клиентский бот
по языку страницы (mastera_ru_bot / mastera_en_bot / mastera_ka_bot)."""
import os
import io

ROOT = os.path.dirname(os.path.abspath(__file__))

BOT = {
    'en': 'mastera_en_bot',
    'ge': 'mastera_ka_bot',
    'ru': 'mastera_ru_bot',
}


def lang_of(rel):
    p = rel.split('/')[0]
    if p == 'en':
        return 'en'
    if p == 'ge':
        return 'ge'
    return 'ru'


n = 0
for dp, _dirs, fs in os.walk(ROOT):
    if '.git' in dp:
        continue
    for f in fs:
        if not f.endswith('.html'):
            continue
        p = os.path.join(dp, f)
        rel = os.path.relpath(p, ROOT).replace('\\', '/')
        s = io.open(p, encoding='utf-8', newline='').read()
        if 'https://t.me/job_kot' not in s:
            continue
        bot = BOT[lang_of(rel)]
        s = s.replace('https://t.me/job_kot', 'https://t.me/' + bot)
        io.open(p, 'w', encoding='utf-8', newline='').write(s)
        n += 1
print('changed', n)
