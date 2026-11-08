#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Критический CSS для лендингов услуг.

Зачем: на 105 лендингах service.css подключён блокирующим тегом, и первый
экран ждёт его загрузки (на живом сайте 928→946 мс). При этом LCP-элемент
лендинга — .service-hero — описан именно в service.css, поэтому просто
сделать файл асинхронным нельзя: замер показал, что без него hero теряет
фон и высоту (770→264 px), H1 падает с 56 до 32 px, кнопка расползается
на всю ширину. Это был бы скачок вёрстки вместо выигрыша.

Решение: правила первого экрана уезжают в <style> внутрь страницы, а сам
service.css грузится без блокировки рендера.

⚠️ Инлайн — это КОПИЯ правил из service.css. Правка в файле не доходит до
страниц сама: после неё нужно прогнать этот скрипт заново, иначе первый
экран будет собран по старым правилам, а остальное — по новым. Расхождение
тихое, поэтому скрипт умеет себя проверять:

    python build-critical-css.py            # собрать и вставить
    python build-critical-css.py --check    # сверить инлайн с service.css

Набор селекторов получен замером на живой странице: для каждого правила
service.css проверялось, попадает ли хоть один подходящий элемент в первый
экран (см. список CRITICAL ниже).
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'service.css'

BEGIN = '<!-- critical:service.css — НЕ ПРАВИТЬ РУКАМИ, см. build-critical-css.py -->'
END = '<!-- /critical:service.css -->'

# Селекторы первого экрана лендинга. Порядок не важен: правила берутся
# из service.css в исходном порядке, иначе каскад разъехался бы.
CRITICAL = {
    '.service-hero',
    '.service-hero h1',
    '.service-hero .lead',
    '.service-cta-top',
    '.city-switcher',
    '.city-switcher-icon',
    '.city-switcher-icon svg',
    '.city-btn',
    '.city-btn.active',
    '.city-switcher .city-btn',
    '.city-switcher .city-btn:not(.active)',
    '.city-switcher > .city-btn.active',
    '.city-switcher > .city-switcher-icon',
    '.header-controls',
    '.header-controls .header-group',
    '.language-switcher',
    'header .city-switcher',
    'header .audience-link',
    'header .online-counter',
}


def split_rules(css):
    """Разбор CSS на правила верхнего уровня и медиаблоки.

    Свой разбор, а не регулярка на всё сразу: в файле есть вложенные фигурные
    скобки (@media), и одной регуляркой их не поймать без ошибок.
    """
    out, i, n = [], 0, len(css)
    while i < n:
        # комментарий
        if css.startswith('/*', i):
            j = css.find('*/', i + 2)
            i = n if j < 0 else j + 2
            continue
        if css[i] in ' \t\r\n':
            i += 1
            continue
        brace = css.find('{', i)
        if brace < 0:
            break
        prelude = css[i:brace].strip()
        # ищем парную закрывающую скобку
        depth, j = 1, brace + 1
        while j < n and depth:
            if css[j] == '{':
                depth += 1
            elif css[j] == '}':
                depth -= 1
            j += 1
        body = css[brace + 1:j - 1]
        out.append((prelude, body, css[i:j]))
        i = j
    return out


def selectors_of(prelude):
    return [s.strip() for s in prelude.split(',') if s.strip()]


def collect():
    """Критические правила в порядке их появления в service.css."""
    css = SRC.read_text(encoding='utf-8')
    parts = []
    for prelude, body, whole in split_rules(css):
        if prelude.startswith('@media'):
            inner = []
            for p2, b2, w2 in split_rules(body):
                if p2.startswith('@'):
                    continue
                if any(s in CRITICAL for s in selectors_of(p2)):
                    inner.append(w2.strip())
            if inner:
                parts.append(prelude + '{' + ''.join(inner) + '}')
        elif not prelude.startswith('@'):
            if any(s in CRITICAL for s in selectors_of(prelude)):
                parts.append(whole.strip())
    return parts


def minify(css):
    """Сжатие: комментарии, лишние пробелы и последняя точка с запятой."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{}:;,>])\s*', r'\1', css)
    css = css.replace(';}', '}')
    return css.strip()


def build_block():
    body = minify(''.join(collect()))
    return (f'  {BEGIN}\n'
            f'  <style>{body}</style>\n'
            f'  {END}\n'), body


def landings():
    """Лендинги услуг: страницы, где подключён service.css и есть .service-hero.
    Языковые главные и хаб Батуми сюда не попадают — там своя схема."""
    for lang in ('ru', 'ge', 'en'):
        for f in sorted((ROOT / lang).rglob('index.html')):
            s = f.read_text(encoding='utf-8')
            if 'service.css' in s and 'class="service-hero"' in s:
                yield f, s


def main():
    check = '--check' in sys.argv
    block, body = build_block()

    # шаблон подключения: style.css блокирующий, service.css — нет
    # ⚠️ Замена через функцию, а не строку-шаблон: в onload есть одинарные
    # кавычки, и обратный слэш в строке-шаблоне re.sub съел бы их как
    # экранирование — в HTML уехало бы onload="this.media=\'all\'".
    link_old = re.compile(r'[ \t]*<link rel="stylesheet" href="/service\.css\?v=(\d+)">\n')

    def link_new(m):
        v = m.group(1)
        return (f'  <link rel="stylesheet" href="/service.css?v={v}" media="print" '
                f'onload="this.media=\'all\'">\n'
                f'  <noscript><link rel="stylesheet" href="/service.css?v={v}"></noscript>\n')

    done = stale = 0
    for f, s in landings():
        cur = re.search(re.escape(BEGIN) + r'\n\s*<style>(.*?)</style>', s, re.S)
        if check:
            if not cur:
                print(f'НЕТ ИНЛАЙНА: {f.relative_to(ROOT).as_posix()}')
                stale += 1
            elif cur.group(1) != body:
                print(f'РАЗОШЁЛСЯ:   {f.relative_to(ROOT).as_posix()}')
                stale += 1
            continue

        # убираем прежний блок, если был
        s = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END) + r'\n', '', s, flags=re.S)
        # ставим новый перед подключением style.css
        # ⚠️ Отступ тега задаём своим, а не возвращаем захваченный: block
        # заканчивается двумя пробелами, и при подстановке \1 вместе со старым
        # отступом они копились с каждым прогоном — строка уехала с 30 пробелов
        # до 58. На вид страницы это не влияет, поэтому росло молча.
        s, n = re.subn(r'[ \t]*(<link rel="stylesheet" href="/style\.css\?v=\d+">\n)',
                       block + r'  \1', s, count=1)
        if not n:
            sys.exit(f'не найдено место для вставки: {f}')
        # и снимаем блокировку с service.css
        s, n = link_old.subn(link_new, s, count=1)
        if not n and 'media="print"' not in s:
            sys.exit(f'не найден тег service.css: {f}')
        f.write_text(s, encoding='utf-8')
        done += 1

    if check:
        if stale:
            print(f'\nрасхождений: {stale} — прогоните build-critical-css.py')
            sys.exit(1)
        print(f'инлайн совпадает с service.css на всех страницах ({len(list(landings()))})')
    else:
        print(f'критический CSS: {len(body)} байт, вставлен в {done} страниц')


if __name__ == '__main__':
    main()
