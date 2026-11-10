#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Критический CSS для редизайна (redesign.css).

Зачем: redesign.css подключён блокирующим тегом, и первый экран ждёт
загрузки всех 196 КБ. Лайтхаус показывал «Render-blocking requests —
950 мс», и это был самый дорогой пункт отчёта. Оба скрипта страницы
(redesign.js, script.js) уже стоят с defer и рендер не блокируют —
таблица стилей оставалась единственной преградой.

Решение то же, что у build-critical-css.py для старого дизайна:
правила первого экрана уезжают в <style> внутрь страницы, а сам
redesign.css грузится без блокировки рендера
(media="print" + onload, с <noscript> для отключённого JS).

⚠️ Инлайн — это КОПИЯ правил из redesign.css. Правка в файле не доходит
до страниц сама: после неё нужно прогнать этот скрипт заново, иначе
первый экран будет собран по старым правилам, а остальное — по новым.
Расхождение тихое, поэтому скрипт умеет себя проверять:

    python build-critical-redesign.py            # собрать и вставить
    python build-critical-redesign.py --check    # сверить инлайн с css

⚠️ Набор CRITICAL получен ЗАМЕРОМ в браузере, а не на глаз: для каждого
из 520 селекторов redesign.css проверялось, попадает ли хоть один
подходящий элемент в первый экран. Замер шёл по девяти страницам (все
шаблоны: главные трёх языков, хаб Батуми, лендинг услуги, лендинг
района, юридическая страница) в двух ширинах — 1280 и 375. Поэтому
список покрывает и десктоп, и телефон.

Правило берётся ЦЕЛИКОМ, вместе со всеми своими @media-версиями:
иначе на телефоне первый экран собрался бы по десктопным правилам.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'redesign.css'

BEGIN = '<!-- critical:redesign.css — НЕ ПРАВИТЬ РУКАМИ, см. build-critical-redesign.py -->'
END = '<!-- /critical:redesign.css -->'

# Селекторы первого экрана. Замерено в браузере, см. докстринг.
CRITICAL = {
    '*', '*::after', '*::before', ':root', 'html', 'body', 'a', 'a:hover',
    'h1', 'h2', 'p', 'img',
    # шапка и верхняя полоса
    '.topbar', '.topbar__inner', '.topbar__item', '.topbar__item svg',
    '.topbar__item--hours', '.topbar__item--promise', '.topbar__phone',
    '.topbar__phone:hover', '.topbar__phone-eye', '.topbar__phone-eye svg',
    '.topbar__phone-eye:hover', '.topbar__phone-num',
    '.site-header', '.site-header__inner', '.header-actions',
    '.header-actions .button',
    '.logo', '.logo:hover', '.logo__geo', '.logo__mark', '.logo__mark svg',
    '.logo__name', '.logo__sub', '.logo__text',
    '.city-pill', '.city-pill svg', '.city-pill .city-pill__chev',
    '.city-pill:hover',
    '.lang-drop', '.lang-drop__btn', '.lang-drop__btn:hover',
    '.lang-drop__chev', '.lang-drop__globe',
    '.burger', '.burger span', '.burger:hover',
    '.burger span:nth-child(1)', '.burger span:nth-child(2)',
    '.burger span:nth-child(3)',
    # общая обвязка
    '.container', '.section', '.section-head__eyebrow',
    '.section-head__eyebrow::before',
    # кнопки
    '.button', '.button--ghost', '.button--ghost:hover', '.button--large',
    '.button--primary', '.button--primary:hover', '.button::after',
    '.button:hover::after',
    # hero главных страниц
    '.hero', '.hero h1', '.hero__cta', '.hero__cta .button', '.hero__eyebrow',
    '.hero__eyebrow::before', '.hero__form', '.hero__grid', '.hero__lead',
    '.hero__media', '.hero__perks', '.hero__perks li', '.hero__perks svg',
    '.hero__photo', '.hero__price', '.hero__price:hover',
    '.hero__price:hover .hero__price__more svg', '.hero__price__label',
    '.hero__price__more', '.hero__price__more svg', '.hero__price__value',
    '.hero__text',
    # hero лендингов
    '.v-hero', '.v-hero h1', '.v-hero-copy', '.v-hero-grid', '.v-hero-img',
    '.v-hero-media', '.v-hero-note', '.v-intro', '.v-jumpbar',
    '.v-jumpbar__inner', '.v-kicker', '.v-kicker__dot', '.v-text-link',
    '.v-text-link:hover',
    '.v-actions', '.v-actions .v-button', '.v-button', '.v-button svg',
    '.v-button::after', '.v-button:hover',
    '.v-consent', '.v-consent a', '.v-consent a:hover', '.v-consent input',
    '.v-float-form', '.v-float-form .form-control', '.v-float-form .v-button',
    '.v-float-form .v-button svg', '.v-float-form h2', '.v-float-form__row',
    '.v-float-form__sub',
    # быстрая цена
    '.u-quick-price', '.u-quick-price:hover', '.u-quick-price__label',
    '.u-quick-price:hover .u-quick-price__more svg', '.u-quick-price__more',
    '.u-quick-price__more svg', '.u-quick-price__value',
    # поля формы первого экрана
    '.form-control', '.form-control::placeholder', '.form-control:focus',
    '.form-gotcha',
    # хлебные крошки
    '.breadcrumbs', '.breadcrumbs a', '.breadcrumbs a:hover',
    '.breadcrumbs__current', '.breadcrumbs__inner', '.breadcrumbs__sep',
    # панель связи: видна сразу, без неё внизу зияет пустота
    '.contact-bar', '.contact-bar__btn', '.contact-bar__btn > *',
    '.contact-bar__btn img', '.contact-bar__btn--tg', '.contact-bar__btn--wa',
    '.contact-bar__btn--wa img', '.contact-bar__btn::after',
    '.contact-bar__btn:active', '.contact-bar__btn:active::after',
    '.contact-bar__btn:focus', '.contact-bar__btn:hover', '.contact-bar__ico',
    'body.has-contact-bar',
    # юридические страницы
    '.legal', '.legal a', '.legal a:hover', '.legal h1', '.legal h2',
    '.legal p', '.legal strong', '.legal__lead',

    # ⚠️ СКРЫТЫЕ панели — замером их не поймать (у них нулевой размер),
    # но без их правил первый экран уезжает вниз. Скрипт дописывает в
    # шапку выпадающие списки услуг и районов, меню телефона и панель
    # языков; пока не подъехал внешний css, они разворачиваются в поток
    # и растягивают шапку: замерено 3134 px вместо 76, hero уходил на
    # y=3170. Это и был бы тот самый скачок вёрстки, ради предотвращения
    # которого критический css и собирают.
    '.site-nav', '.site-nav__link', '.site-nav__link:hover',
    '.nav-dropdown', '.nav-dropdown__btn', '.nav-dropdown__chev',
    '.nav-dropdown__panel', '.nav-dropdown::after',
    '.lang-switch', '.lang-switch__btn', '.lang-switch__btn.is-active',
    '.lang-switch__btn:hover', '.lang-drop__panel', '.lang-drop__panel::before',
    '.mobile-menu', '.mobile-menu[hidden]', '.mobile-menu .mobile-menu__inner',
    '.districts-panel', '.city-modal', '.city-modal[hidden]',
    '.lead-modal', '.lead-modal[hidden]', '.ty-modal', '.ty-modal[hidden]',
    '[hidden]',
}


def split_rules(css):
    """Разбор CSS на правила верхнего уровня и медиаблоки.

    Свой разбор, а не регулярка на всё сразу: в файле есть вложенные
    фигурные скобки (@media), и одной регуляркой их не поймать без ошибок.
    """
    out, i, n = [], 0, len(css)
    while i < n:
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
    """Критические правила в порядке их появления в redesign.css.

    Порядок сохраняем: каскад решает, какое правило победит, и
    перестановка молча поменяла бы вид страницы.
    """
    css = SRC.read_text(encoding='utf-8')
    parts = []
    for prelude, body, whole in split_rules(css):
        # @font-face нужен целиком: без него первый экран рисуется
        # системным шрифтом и потом перескакивает на Inter.
        if prelude.startswith('@font-face'):
            parts.append(whole.strip())
        elif prelude.startswith('@media'):
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
    return ('  %s\n  <style>%s</style>\n  %s\n' % (BEGIN, body, END)), body


def pages():
    """Все страницы редизайна, где redesign.css подключён блокирующим тегом
    или уже обработан этим скриптом."""
    for f in sorted(ROOT.rglob('index.html')):
        rel = f.relative_to(ROOT).as_posix()
        if rel.split('/')[0] not in ('ru', 'en', 'ge'):
            continue
        s = f.read_text(encoding='utf-8')
        if 'redesign.css' in s:
            yield f, s


def main():
    check = '--check' in sys.argv
    block, body = build_block()

    # ⚠️ Замена через функцию, а не строку-шаблон: в onload есть одинарные
    # кавычки, и обратный слэш в строке-шаблоне re.sub съел бы их как
    # экранирование — в HTML уехало бы onload="this.media=\'all\'".
    link_old = re.compile(
        r'[ \t]*<link rel="stylesheet" href="/redesign\.css\?v=(\d+)">\n')

    def link_new(m):
        v = m.group(1)
        return ('  <link rel="stylesheet" href="/redesign.css?v=%s" '
                'media="print" onload="this.media=\'all\'">\n'
                '  <noscript><link rel="stylesheet" href="/redesign.css?v=%s">'
                '</noscript>\n' % (v, v))

    done = stale = 0
    vsego = 0
    for f, s in pages():
        vsego += 1
        cur = re.search(re.escape(BEGIN) + r'\n\s*<style>(.*?)</style>', s, re.S)
        if check:
            if not cur:
                print('НЕТ ИНЛАЙНА: %s' % f.relative_to(ROOT).as_posix())
                stale += 1
            elif cur.group(1) != body:
                print('РАЗОШЁЛСЯ:   %s' % f.relative_to(ROOT).as_posix())
                stale += 1
            continue

        # убираем прежний блок, если был
        s = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END) + r'\n', '',
                   s, flags=re.S)
        # ⚠️ Отступ тега задаём свой, а не возвращаем захваченный: block
        # заканчивается двумя пробелами, и при подстановке вместе со старым
        # отступом они копились бы с каждым прогоном.
        s, n = re.subn(
            r'[ \t]*(<link rel="stylesheet" href="/redesign\.css\?v=\d+">\n)',
            block + r'  \1', s, count=1)
        if not n:
            # уже обработанная страница: блок вставляем перед media="print"
            s, n = re.subn(
                r'[ \t]*(<link rel="stylesheet" href="/redesign\.css\?v=\d+" '
                r'media="print")',
                block + r'  \1', s, count=1)
            if not n:
                sys.exit('не найдено место для вставки: %s' % f)
        # и снимаем блокировку
        s2, n2 = link_old.subn(link_new, s, count=1)
        if n2:
            s = s2
        elif 'media="print"' not in s:
            sys.exit('не найден тег redesign.css: %s' % f)
        f.write_text(s, encoding='utf-8', newline='')
        done += 1

    if check:
        if stale:
            print('\nрасхождений: %d — прогоните build-critical-redesign.py'
                  % stale)
            sys.exit(1)
        print('инлайн совпадает с redesign.css на всех страницах (%d)' % vsego)
    else:
        print('критический CSS: %d байт, вставлен в %d страниц' % (len(body), done))


if __name__ == '__main__':
    main()
