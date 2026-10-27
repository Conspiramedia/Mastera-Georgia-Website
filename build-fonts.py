#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Сборка шрифтов сайта из исходников (D:\\Шрифты).

Что было: пять статических начертаний Montserrat (400/500/600/700/900),
каждое ~100 КБ, итого 498 КБ на каждой загрузке страницы. При этом:

  * в Montserrat НЕТ грузинских глифов (0 из 43) — на /ge/ все пять файлов
    качались впустую, текст рисовался системным шрифтом;
  * на странице используются шесть весов (400/500/600/700/800/900), то есть
    800 браузер и так синтезировал.

Что собирается здесь:

  montserrat-var.woff2   — вариативный Montserrat, веса 400-900 одним файлом,
                           латиница + кириллица. Заменяет все пять статических.
  notosansgeorgian.woff2 — грузинский Noto Sans, только грузинские глифы.
                           Подключается ТОЛЬКО для :lang(ka) — на русских и
                           английских страницах не скачивается.

Подрезка по диапазонам Unicode, а не по фактическому тексту сайта: иначе
новый район или услуга с непривычной буквой остались бы без глифа, и дефект
был бы тихим — буква просто нарисовалась бы другим шрифтом.

    python build-fonts.py

⚠️ Требует fontTools и brotli. Исходники лежат вне репозитория (SRC ниже),
поэтому скрипт нужен только при пересборке шрифтов, не при каждом деплое.
"""
import pathlib
import sys

SRC = pathlib.Path(r'D:\Шрифты')
OUT = pathlib.Path(__file__).resolve().parent / 'fonts'

# Диапазоны символов. Берём алфавиты целиком, с запасом на будущие тексты.
LATIN = (
    'U+0020-007E,'      # базовая латиница, цифры, пунктуация
    'U+00A0-00FF,'      # расширенная латиница-1 (включая ё в некоторых раскладках)
    'U+2010-2027,'      # типографские тире, кавычки, многоточие
    'U+20A0-20BF,'      # валютные знаки (₾ лари — U+20BE)
    'U+2116,'           # №
    'U+2022,U+2026,U+00B7'   # буллиты и многоточие, явно
)
CYRILLIC = 'U+0400-045F,U+0490-0491'      # русский алфавит + украинские ґ/Ґ
GEORGIAN = 'U+10A0-10FF,U+1C90-1CBF'      # мхедрули + мтаврули (заглавные)

JOBS = [
    {
        'name': 'montserrat-var',
        'src': SRC / 'Montserrat' / 'Montserrat-VariableFont_wght.ttf',
        'unicodes': LATIN + ',' + CYRILLIC,
        # Сайт использует 400-900. Диапазон обрезаем, чтобы не тащить
        # начертания Thin/Light, которых в вёрстке нет.
        'axis': 'wght=400:900',
    },
    {
        'name': 'notosansgeorgian',
        'src': SRC / 'Noto_Sans_Georgian' / 'NotoSansGeorgian-Regular.ttf',
        'unicodes': GEORGIAN,
        'axis': None,
    },
    {
        'name': 'notosansgeorgian-bold',
        'src': SRC / 'Noto_Sans_Georgian' / 'NotoSansGeorgian-Bold.ttf',
        'unicodes': GEORGIAN,
        'axis': None,
    },
    {
        'name': 'notosansgeorgian-black',
        'src': SRC / 'Noto_Sans_Georgian' / 'NotoSansGeorgian-Black.ttf',
        'unicodes': GEORGIAN,
        'axis': None,
    },
]


def build(job):
    import tempfile
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    src = job['src']
    if not src.exists():
        sys.exit(f'нет исходника: {src}')

    out = OUT / f"{job['name']}.woff2"
    tmp = None

    # Обрезка диапазона оси — отдельный шаг ДО подрезки символов: у
    # fonttools subset своей опции для этого нет, этим занимается instancer.
    # Срезаем Thin/Light (100-300), которых в вёрстке сайта нет.
    if job['axis']:
        tag, rng_ = job['axis'].split('=')
        lo, hi = rng_.split(':')
        font = TTFont(src)
        instancer.instantiateVariableFont(font, {tag: (float(lo), float(hi))}, inplace=True)
        tmp = pathlib.Path(tempfile.gettempdir()) / f"{job['name']}-axis.ttf"
        font.save(tmp)

    args = [
        str(tmp or src),
        f"--unicodes={job['unicodes']}",
        f'--output-file={out}',
        '--flavor=woff2',
        '--layout-features=kern,liga,calt',   # кернинг и лигатуры нужны
        '--no-hinting',                       # хинтинг не влияет на рендер в вебе
        '--desubroutinize',
        '--drop-tables+=DSIG',
        '--name-IDs=1,2,3,4,6',               # имена семейства оставляем
    ]
    subset.main(args)
    if tmp:
        tmp.unlink(missing_ok=True)

    f = TTFont(out)
    cmap = f.getBestCmap()
    kb = out.stat().st_size / 1024
    src_kb = src.stat().st_size / 1024
    axes = [(a.axisTag, a.minValue, a.maxValue) for a in f['fvar'].axes] if 'fvar' in f else None
    return {
        'file': out.name, 'kb': round(kb, 1), 'src_kb': round(src_kb),
        'glyphs': len(cmap), 'axes': axes,
        'cyr': sum(1 for c in range(0x0410, 0x0450) if c in cmap),
        'geo': sum(1 for c in range(0x10D0, 0x10FB) if c in cmap),
        'lat': sum(1 for c in range(0x41, 0x7B) if c in cmap),
        'lari': 0x20BE in cmap,
    }


def main():
    OUT.mkdir(exist_ok=True)
    total = 0
    for job in JOBS:
        r = build(job)
        total += r['kb']
        print(f"{r['file']:34} {r['src_kb']:>5} KB -> {r['kb']:>6} KB  "
              f"glyphs={r['glyphs']:<5} lat={r['lat']} cyr={r['cyr']} geo={r['geo']} "
              f"lari={'yes' if r['lari'] else 'NO'}")
        if r['axes']:
            print(f"{'':34} axes: {r['axes']}")
    print(f"\nитого собрано: {total:.1f} KB")
    print('для сравнения: пять статических Montserrat = 498 KB')


if __name__ == '__main__':
    main()
