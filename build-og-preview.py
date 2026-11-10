#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Генератор OG-превью (картинка для ссылок в соцсетях и мессенджерах).

Композиция повторяет превью старого сайта: слева фотография мастера,
справа — название с подчёркиванием, подзаголовок, пилюля с городами,
телефон, строка мессенджеров и домен внизу. Отличия от старого:
белый фон вместо чёрного и синие акценты вместо жёлтых — по палитре
редизайна.

Шрифт — тот же Inter, которым набран сайт. ⚠️ В /fonts/ он лежит
двумя сабсетами (латиница отдельно, кириллица отдельно) и в формате
woff2, который Pillow не читает. Поэтому сабсеты сливаются в один
временный TTF нужного веса: подменять шрифт системным нельзя —
начертание разойдётся с сайтом.

Грузинская версия набирается NotoSansGeorgian (как и сайт), но
запятой в нём нет — она берётся из Inter, см. draw_mixed().

Запуск:
    python build-og-preview.py          # собрать все три языка
    python build-og-preview.py --check  # проверить, что файлы на месте

Размер 1200x630 — требование Open Graph; меньше 600x315 соцсети
показывают маленькой карточкой вместо крупной.
"""
import io
import os
import pathlib
import sys

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
except ImportError:
    sys.exit('нужен Pillow: pip install Pillow')

try:
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    from fontTools.merge import Merger
except ImportError:
    sys.exit('нужен fontTools: pip install fonttools brotli')

ROOT = pathlib.Path(__file__).resolve().parent
FONTS = ROOT / 'fonts'
IMAGE = ROOT / 'image'
TMP = ROOT / '.og-build'          # временные TTF, в .gitignore

W, H = 1200, 630

# Палитра редизайна (:root в redesign.css)
INK = (20, 34, 61)                # --ink
MUTED = (85, 98, 122)             # --muted
BLUE = (31, 98, 210)              # --blue-700
BLUE_100 = (231, 241, 255)        # --blue-100
GREEN = (32, 185, 131)            # --green-500
WHITE = (255, 255, 255)
SOFT = (244, 247, 251)            # --soft

# ⚠️ Название бренда — ВЕЗДЕ «Mastera Georgia», латиницей, независимо
# от языка страницы: так оно набрано в шапке сайта на всех трёх
# языках. Переводить его («Мастера Грузии», «საქართველოს ოსტატები»)
# нельзя — в превью ссылки бренд должен узнаваться одинаково.
BREND = 'Mastera Georgia'

TEKSTY = {
    'ru': {
        'zagolovok': BREND,
        'podzagolovok': 'Сантехник, электрик, мастер на час',
        'goroda': 'Тбилиси и Батуми',
        'telefon': '+995 557 645 196',
        'svyaz': 'WhatsApp · Telegram · Звонок',
    },
    'en': {
        'zagolovok': BREND,
        'podzagolovok': 'Plumber, electrician, handyman',
        'goroda': 'Tbilisi and Batumi',
        'telefon': '+995 557 645 196',
        'svyaz': 'WhatsApp · Telegram · Call',
    },
    'ka': {
        'zagolovok': BREND,
        'podzagolovok': 'სანტექნიკოსი, ელექტრიკოსი, ოსტატი საათით',
        'goroda': 'თბილისი და ბათუმი',
        'telefon': '+995 557 645 196',
        'svyaz': 'WhatsApp · Telegram · ზარი',
    },
}

DOMEN = 'mastera.ge'

# Акцентная черта под заголовком и под доменом. Размер снят замером с
# превью прода (чёрно-жёлтый дизайн): там обе черты одинаковые, 86x7.
CHERTA_W, CHERTA_H = 86, 7

# ⚠️ Зазор «низ букв -> верх черты». ОДНО значение на оба места
# (заголовок и домен): раньше считалось по-разному и давало 15 px
# против 10 — верхняя черта заметно отваливалась от заголовка.
#
# Отсчитываем от БАЗОВОЙ ЛИНИИ (ascent шрифта), а не от textbbox
# всей строки: bbox захватывает нижний выносной элемент «g», но над
# самой чертой стоят буквы без выносных, и на глаз зазор читается
# именно до них. По bbox выходило 21 px под заголовком против 17 под
# доменом — при формально одинаковом числе.
ZAZOR_CHERTA = 14


def sobrat_shrift(ves):
    """Сливает латинский и кириллический сабсеты Inter в один TTF.

    Шрифт переменный (ось wght 400-800), поэтому сначала фиксируем
    вес, затем объединяем — иначе Pillow нарисует только тот алфавит,
    который оказался в выбранном файле.
    """
    TMP.mkdir(exist_ok=True)
    itog = TMP / ('inter-%d.ttf' % ves)
    if itog.exists():
        return str(itog)
    chasti = []
    for imya in ('inter-latin', 'inter-cyrillic'):
        f = TTFont(str(FONTS / ('%s.woff2' % imya)))
        inst = instancer.instantiateVariableFont(f, {'wght': ves},
                                                 inplace=False)
        inst.flavor = None
        p = TMP / ('%s-%d.ttf' % (imya, ves))
        inst.save(str(p))
        chasti.append(str(p))
    slit = Merger().merge(chasti)
    slit.save(str(itog))
    for p in chasti:
        os.remove(p)
    return str(itog)


def gruzinskiy(ves):
    """NotoSansGeorgian в TTF: Pillow не читает woff2."""
    TMP.mkdir(exist_ok=True)
    imya = 'notosansgeorgian-black' if ves >= 800 else (
        'notosansgeorgian-bold' if ves >= 700 else 'notosansgeorgian')
    itog = TMP / ('%s.ttf' % imya)
    if not itog.exists():
        f = TTFont(str(FONTS / ('%s.woff2' % imya)))
        f.flavor = None
        f.save(str(itog))
    return str(itog)


def est_glif(shrift_put, simvol):
    """Есть ли символ в шрифте (чтобы не рисовать пустой квадрат)."""
    f = TTFont(shrift_put)
    for t in f['cmap'].tables:
        if ord(simvol) in t.cmap:
            return True
    return False


def draw_mixed(d, xy, text, osnovnoy, zapasnoy, fill, anchor='la'):
    """Рисует строку, подставляя запасной шрифт там, где в основном
    нет глифа.

    ⚠️ Нужно для грузинского: в NotoSansGeorgian-Black нет запятой,
    и без подмены на её месте вышел бы пустой прямоугольник.
    Ширину считаем по каждому куску отдельно и сдвигаем курсор.
    """
    x, y = xy
    if anchor == 'ma':          # по центру
        shirina = izmerit_mixed(d, text, osnovnoy, zapasnoy)
        x -= shirina // 2
    kuski = []
    tek, tek_sh = '', None
    for ch in text:
        # ⚠️ Пробел берём из ЗАПАСНОГО (Inter), а не из грузинского.
        # В NotoSansGeorgian пробел вдвое шире (14 px против 7 при
        # кегле 24), и строка расползалась двойными промежутками.
        # На сайте то же самое: в font-family Inter стоит ПЕРВЫМ,
        # грузинские буквы берутся из NotoGeo, а пробел — из Inter.
        sh = zapasnoy if ch == ' ' else (
            osnovnoy if est_glif_kesh(osnovnoy.path, ch) else zapasnoy)
        if sh is not tek_sh and tek:
            kuski.append((tek, tek_sh))
            tek = ''
        tek += ch
        tek_sh = sh
    if tek:
        kuski.append((tek, tek_sh))
    for kusok, sh in kuski:
        d.text((x, y), kusok, font=sh, fill=fill, anchor='la')
        x += d.textlength(kusok, font=sh)


_KESH = {}


def est_glif_kesh(put, simvol):
    klyuch = (put, simvol)
    if klyuch not in _KESH:
        _KESH[klyuch] = est_glif(put, simvol)
    return _KESH[klyuch]


def izmerit_mixed(d, text, osnovnoy, zapasnoy):
    """Ширина строки с подменой шрифта. Правило выбора шрифта должно
    совпадать с draw_mixed, иначе центрирование и подбор кегля
    посчитаются не по той ширине, что будет нарисована."""
    w = 0
    for ch in text:
        sh = zapasnoy if ch == ' ' else (
            osnovnoy if est_glif_kesh(osnovnoy.path, ch) else zapasnoy)
        w += d.textlength(ch, font=sh)
    return w


def logotip(storona):
    """Значок бренда (синий квадрат с гаечным ключом) для заголовка.

    Берём PNG из манифеста (512x512 с альфой) — он же стоит в шапке
    сайта и в иконках приложения, поэтому превью ссылки и сайт
    узнаются как одно целое.
    """
    im = Image.open(IMAGE / 'web-app-manifest-512x512.png').convert('RGBA')
    return im.resize((storona, storona), Image.LANCZOS)


def podgotovit_foto(shirina, vysota):
    """Фотография мастера для левой части.

    Кадрируем по центру фигуры и растворяем правый край в белом —
    так снимок стыкуется с белым фоном без жёсткой границы, как
    фигура на чёрном в старом превью.
    """
    im = Image.open(IMAGE / 'hero-bg.webp').convert('RGB')

    # ⚠️ Масштаб считаем ПО ФИГУРЕ, а не «залить зону». При заливке
    # (max по ширине/высоте) правый локоть с предплечьем срезало краем
    # кадра.
    #
    # ⚠️ Границы размечены по сетке поверх снимка, а НЕ автопоиском:
    # детектор по тёмным пикселям дал верх 130, потеряв белую каску
    # (она сливалась со светлым фоном), и в результате макушку
    # обрезало. Детектор по резкости вернул весь кадр целиком.
    # Числа ниже — каска, колено с книгой и оба локтя.
    FIG_L, FIG_R, FIG_T, FIG_B = 250, 670, 28, 630
    fig_w, fig_h = FIG_R - FIG_L, FIG_B - FIG_T

    POLE_V = 22          # воздух сверху и снизу
    POLE_G = 16          # воздух слева/справа от фигуры
    k = min((vysota - POLE_V * 2) / float(fig_h),
            (shirina - POLE_G * 2) / float(fig_w))

    nw, nh = int(round(im.width * k)), int(round(im.height * k))
    im = im.resize((nw, nh), Image.LANCZOS)

    # Центр фигуры в масштабированных координатах — по нему и равняем,
    # чтобы мастер стоял по середине своей зоны, а не по середине кадра.
    c_x = ((FIG_L + FIG_R) / 2.0) * k
    c_y = ((FIG_T + FIG_B) / 2.0) * k
    left = int(round(c_x - shirina / 2.0))
    top = int(round(c_y - vysota / 2.0))

    # Если кадр вышел за пределы снимка — подложим белое поле, а не
    # сдвинем кадр: сдвиг снова срезал бы фигуру с другой стороны.
    holst = Image.new('RGB', (shirina, vysota), (255, 255, 255))
    holst.paste(im, (-left, -top))
    im = holst

    # Растворение правого края: маска с градиентом по горизонтали.
    maska = Image.new('L', (shirina, vysota), 255)
    gr = ImageDraw.Draw(maska)
    # ⚠️ Узкая полоса (7%), а не 30%: фигура доходит до X≈544 из 560,
    # и широкий градиент растворял 152 px правой руки в белом фоне.
    rastvor = int(shirina * 0.07)
    for i in range(rastvor):
        x = shirina - rastvor + i
        # к правому краю прозрачность растёт плавно (квадратично)
        dolya = i / float(rastvor)
        gr.line([(x, 0), (x, vysota)], fill=int(255 * (1 - dolya ** 1.6)))
    # и лёгкое растворение снизу, чтобы низ не обрывался полосой
    niz = int(vysota * 0.10)
    for i in range(niz):
        y = vysota - niz + i
        dolya = i / float(niz)
        tek = maska.crop((0, y, shirina, y + 1)).point(
            lambda v: int(v * (1 - dolya)))
        maska.paste(tek, (0, y))
    return im, maska


def sobrat(lang):
    t = TEKSTY[lang]
    gruz = (lang == 'ka')

    f800 = ImageFont.truetype(sobrat_shrift(800), 60)
    f_zag = ImageFont.truetype(
        gruzinskiy(800) if gruz else sobrat_shrift(800), 58 if gruz else 64)
    f_pod = ImageFont.truetype(
        gruzinskiy(400) if gruz else sobrat_shrift(400), 24 if gruz else 26)
    f_gor = ImageFont.truetype(
        gruzinskiy(700) if gruz else sobrat_shrift(700), 24)
    f_tel = ImageFont.truetype(sobrat_shrift(800), 52)
    f_svz = ImageFont.truetype(
        gruzinskiy(400) if gruz else sobrat_shrift(400), 24)
    f_dom = ImageFont.truetype(sobrat_shrift(800), 34)
    # запасной для грузинского (запятая и латиница внутри грузинских строк)
    f_zap_pod = ImageFont.truetype(sobrat_shrift(400), 24 if gruz else 26)
    f_zap_svz = ImageFont.truetype(sobrat_shrift(400), 24)
    f_zap_gor = ImageFont.truetype(sobrat_shrift(700), 24)
    f_zap_zag = ImageFont.truetype(sobrat_shrift(800), 58 if gruz else 64)

    holst = Image.new('RGB', (W, H), WHITE)

    # ── фотография слева
    # 470 хватает: фигура 380x595 вписывается по ВЫСОТЕ (k=0.985,
    # получается 374x586), и ширина зоны уже не ограничивает.
    FOTO_W = 470
    foto, maska = podgotovit_foto(FOTO_W, H)
    holst.paste(foto, (0, 0), maska)

    d = ImageDraw.Draw(holst)

    # ── текстовая колонка справа
    X = 556
    PRAVO = W - 60

    # ── значок с гаечным ключом + заголовок в одну строку
    # Заголовок везде латиницей (BREND), поэтому грузинский шрифт и
    # подбор кегля под язык здесь больше не нужны: ширина одинаковая.
    dostupno = PRAVO - X

    ZNAK = 86                 # сторона значка
    ZAZOR_ZNAK = 22           # отступ от значка до текста
    f_zag = ImageFont.truetype(sobrat_shrift(800), 56)
    f_zap_zag = f_zag
    shir_zag = d.textlength(t['zagolovok'], font=f_zag)
    # если вдруг не влезает вместе со значком — уменьшаем кегль
    while shir_zag + ZNAK + ZAZOR_ZNAK > dostupno and f_zag.size > 30:
        f_zag = ImageFont.truetype(sobrat_shrift(800), f_zag.size - 2)
        f_zap_zag = f_zag
        shir_zag = d.textlength(t['zagolovok'], font=f_zag)

    y = 150
    znak = logotip(ZNAK)
    # Значок выравниваем по оптическому центру строки, а не по её
    # верху: иначе он «висит» выше букв.
    y_znak = y + int(f_zag.size * 1.18 / 2) - ZNAK // 2 + 2
    holst.paste(znak, (X, y_znak), znak)

    X_text = X + ZNAK + ZAZOR_ZNAK
    d.text((X_text, y), t['zagolovok'], font=f_zag, fill=INK, anchor='la')

    # ⚠️ Подчёркивание — короткий акцент фиксированной длины, как в
    # превью старого сайта, а НЕ линия во всю ширину заголовка.
    # Размер снят замером с прода: там обе черты (под заголовком и под
    # доменом) одинаковые — 86x7.
    #
    # ⚠️ Зазор до текста — ZAZOR_CHERTA, ОДИН И ТОТ ЖЕ здесь и под
    # доменом. Раньше было 15 px против 10: на глаз верхняя черта
    # заметно отваливалась от заголовка, замер это подтвердил.
    # Базовая линия = y + ascent шрифта.
    y_cherta = y + f_zag.getmetrics()[0] + ZAZOR_CHERTA
    d.rounded_rectangle([X_text, y_cherta,
                         X_text + CHERTA_W, y_cherta + CHERTA_H],
                        radius=CHERTA_H // 2, fill=BLUE)

    # подзаголовок
    # ⚠️ Кегль тоже подбираем: грузинское «სანტექნიკოსი, ელექტრიკოსი,
    # ოსტატი საათით» — 567 px при кегле 24, шире колонки.
    kp = 24 if gruz else 26
    while kp > 16:
        proba_p = ImageFont.truetype(
            gruzinskiy(400) if gruz else sobrat_shrift(400), kp)
        proba_pz = ImageFont.truetype(sobrat_shrift(400), kp)
        wp = (izmerit_mixed(d, t['podzagolovok'], proba_p, proba_pz) if gruz
              else d.textlength(t['podzagolovok'], font=proba_p))
        if wp <= dostupno:
            break
        kp -= 1
    f_pod, f_zap_pod = proba_p, proba_pz

    y = y_cherta + 40
    if gruz:
        draw_mixed(d, (X, y), t['podzagolovok'], f_pod, f_zap_pod, MUTED)
    else:
        d.text((X, y), t['podzagolovok'], font=f_pod, fill=MUTED, anchor='la')

    # пилюля с городами
    y += int(f_pod.size * 1.5) + 18
    if gruz:
        w_gor = izmerit_mixed(d, t['goroda'], f_gor, f_zap_gor)
    else:
        w_gor = d.textlength(t['goroda'], font=f_gor)
    PAD_X, PAD_Y = 22, 12
    vys_pil = f_gor.size + PAD_Y * 2
    d.rounded_rectangle([X, y, X + w_gor + PAD_X * 2, y + vys_pil],
                        radius=vys_pil // 2, fill=BLUE)
    if gruz:
        draw_mixed(d, (X + PAD_X, y + PAD_Y - 2), t['goroda'],
                   f_gor, f_zap_gor, WHITE)
    else:
        d.text((X + PAD_X, y + PAD_Y - 2), t['goroda'], font=f_gor,
               fill=WHITE, anchor='la')

    # телефон
    y += vys_pil + 24
    d.text((X, y), t['telefon'], font=f_tel, fill=INK, anchor='la')
    w_tel = d.textlength(t['telefon'], font=f_tel)

    # строка мессенджеров
    # ⚠️ Кегль подбираем под ФАКТИЧЕСКУЮ ширину телефона, а не зашиваем
    # числом: строка должна тянуться ровно на его длину, а она разная
    # на трёх языках («Звонок» / «Call» / «ზარი»). Вес 500, а не 400 —
    # при 400 строка выглядела жидкой рядом с крупным телефоном.
    VES_SVZ = 500
    luchshiy = None
    for kegl in range(18, 44):
        proba_s = ImageFont.truetype(
            gruzinskiy(400) if gruz else sobrat_shrift(VES_SVZ), kegl)
        proba_sz = ImageFont.truetype(sobrat_shrift(VES_SVZ), kegl)
        ws = (izmerit_mixed(d, t['svyaz'], proba_s, proba_sz) if gruz
              else d.textlength(t['svyaz'], font=proba_s))
        if ws > dostupno:
            break
        if luchshiy is None or abs(ws - w_tel) < abs(luchshiy[2] - w_tel):
            luchshiy = (proba_s, proba_sz, ws)
    if luchshiy:
        f_svz, f_zap_svz = luchshiy[0], luchshiy[1]

    y += int(f_tel.size * 1.12) + 6
    if gruz:
        draw_mixed(d, (X, y), t['svyaz'], f_svz, f_zap_svz, MUTED)
    else:
        d.text((X, y), t['svyaz'], font=f_svz, fill=MUTED, anchor='la')

    # домен внизу, с подчёркиванием — как в старом превью
    # ⚠️ Черта той же длины, что под заголовком (86 px), а НЕ по ширине
    # слова: по ширине выходило 195 px — вдвое длиннее продовой, и две
    # черты на одной картинке выглядели разными элементами. На проде
    # обе одинаковые, замерено: 86x7.
    y_dom = H - 92
    d.text((X, y_dom), DOMEN, font=f_dom, fill=INK, anchor='la')
    y_pod = y_dom + f_dom.getmetrics()[0] + ZAZOR_CHERTA
    d.rounded_rectangle([X, y_pod, X + CHERTA_W, y_pod + CHERTA_H],
                        radius=CHERTA_H // 2, fill=BLUE)

    return holst


def main():
    if '--check' in sys.argv:
        net = [l for l in TEKSTY
               if not (IMAGE / ('og-preview-%s.jpg' % l)).exists()]
        if net:
            print('нет файлов: %s' % ', '.join(net))
            sys.exit(1)
        print('все три превью на месте')
        return

    for lang in TEKSTY:
        im = sobrat(lang)
        put = IMAGE / ('og-preview-%s.jpg' % lang)
        im.save(str(put), 'JPEG', quality=88, optimize=True,
                progressive=True)
        print('%s — %d байт' % (put.name, put.stat().st_size))


if __name__ == '__main__':
    main()
