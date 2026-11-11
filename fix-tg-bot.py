# -*- coding: utf-8 -*-
"""ОТКЛЮЧЁН. Разовая правка от 05.11.2026, свою работу уже сделал.

Заменял Telegram-ссылку t.me/job_kot на клиентский бот по языку страницы
(mastera_ru_bot / mastera_en_bot / mastera_ka_bot).

⚠️ ЗАПУСКАТЬ НЕЛЬЗЯ. Решение владельца от 08.11.2026 развело две роли
ссылки, а скрипт их не различает — он меняет ВСЕ вхождения подряд:

  • t.me/job_kot — личный чат владельца. Сюда ведут шесть кнопок
    «Написать в Telegram» (CTA на главных и нижняя панель связи).
    Это живой диалог с человеком, а не бот.
  • t.me/mastera_<lang>_bot — клиентские боты. На них ведёт ссылка
    «Telegram-бот» в подвале, и только она.

Запуск стёр бы первое вторым: кнопки «написать» молча ушли бы в бота,
и разницы в разметке видно не было бы — адрес выглядит рабочим.

Оставлен как запись о том, что правка была. Нужна похожая — пишите новый
скрипт с проверкой контекста ссылки, а не только её адреса.
"""
import sys

sys.exit("Скрипт отключён намеренно — см. докстринг выше. "
         "Он стирает ссылки на личный чат t.me/job_kot.")

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
