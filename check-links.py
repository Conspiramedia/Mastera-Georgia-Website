# -*- coding: utf-8 -*-
"""Проверка внутренних ссылок сайта на битые (404). Только чтение."""
import os
import re
import io

root = os.path.dirname(os.path.abspath(__file__))

SKIP_PREFIX = ('#', 'http://', 'https://', 'mailto:', 'tel:', '//', 'javascript:', 'data:')


def resolve(href):
    if href.startswith(SKIP_PREFIX):
        return None
    path = href.split('#')[0].split('?')[0]
    if not path.startswith('/'):
        return None
    rel = path.lstrip('/')
    if not rel:
        return os.path.join(root, 'index.html')
    if rel.endswith('/'):
        return os.path.join(root, rel, 'index.html')
    return os.path.join(root, rel)


def main():
    broken = []
    checked = 0
    for dp, _dirs, fs in os.walk(root):
        if '.git' in dp:
            continue
        for f in fs:
            if not f.endswith('.html'):
                continue
            p = os.path.join(dp, f)
            s = io.open(p, encoding='utf-8').read()
            for m in re.finditer(r'href="([^"]+)"', s):
                href = m.group(1).strip()
                t = resolve(href)
                if t is None:
                    continue
                checked += 1
                if not os.path.exists(t):
                    broken.append((os.path.relpath(p, root), href))
    for rel, href in broken:
        print(rel + '  ->  ' + href)
    print('\nПроверено ссылок:', checked)
    print('Битых ссылок:', len(broken))


if __name__ == '__main__':
    main()
