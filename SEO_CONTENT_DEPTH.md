# SEO Content Depth Audit — P2.3

Scope: 108 localized indexable pages (RU / GE / EN).

## Findings

### 1. Service-page city duplication

The Tbilisi and Batumi versions of the same service use an almost identical content template, with the city name being one of the main differences.

Representative normalized comparisons:

| Service | RU Tbilisi vs Batumi |
|---|---:|
| Бытовой ремонт | ~99% shared normalized wording |
| Электрик | ~99% |
| Грузчики | ~99% |
| Клининг | ~99% |

The comparison was performed after normalizing the city names, HTML markup and whitespace. This confirms a content-depth/local-value issue rather than merely similar titles.

The same template pattern is present across the localized service architecture, so the remediation target is the Batumi service set rather than changing URLs or merging cities.

### 2. District pages

Representative district pages contain substantially more location-specific material than the generic city service pages, including named local areas and district-specific use cases. No thin-content removal or consolidation is justified for these pages.

### 3. Language variants

RU / GE / EN are intentional language variants and are not treated as duplicate content with each other. Each language needs useful localized wording rather than literal cross-language duplication.

## Remediation

Added a dedicated Batumi-local section to:
- /ru/batumi/bytovoy-remont-batumi/
- /ru/batumi/elektrik-batumi/
- /ru/batumi/gruzchiki-batumi/

These sections add local Batumi coverage, concrete service scenarios and information useful for preparing a request.

The remaining Batumi service pages require the same treatment before P2.3 can be considered fully closed.

## P2.3 status

- [x] Audited content depth and city-level uniqueness on representative service pages.
- [x] Confirmed the Tbilisi/Batumi near-template duplication pattern.
- [x] Confirmed district pages have stronger local differentiation.
- [x] Kept language variants separate.
- [x] Started targeted remediation on confirmed Batumi service pages.
- [ ] Complete the same local-content remediation across the remaining Batumi service pages.
