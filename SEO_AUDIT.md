# SEO Audit & Implementation Checklist

Project: Mastera Georgia Website  
Repository: `Conspiramedia/Mastera-Georgia-Website`  
Domain: `https://mastera-tbilisi.ge`

## Goal

Bring the site's technical SEO into a consistent state without changing the existing URL architecture unnecessarily.

Current URL architecture:

```
/
├── ru/
│   ├── masters/
│   ├── tbilisi/
│   │   ├── santehnik-tbilisi/
│   │   ├── elektrik-tbilisi/
│   │   ├── master-na-chas-tbilisi/
│   │   └── ...
│   └── batumi/
│       ├── santehnik-batumi/
│       └── ...
├── ge/
└── en/
```

---

# P0 — Critical technical SEO

## P0.1 Sitemap

- [x] Regenerate `sitemap.xml` from the real URL structure.
- [x] Ensure every sitemap URL exactly matches a real public URL.
- [x] Include trailing slash consistently.
- [x] Remove obsolete URLs such as:
  - `/ru/santehnik-tbilisi/`
  - `/ge/santehnik-tbilisi/`
  - `/en/santehnik-tbilisi/`
- [x] Keep current real URLs such as:
  - `/ru/tbilisi/santehnik-tbilisi/`
  - `/ge/tbilisi/santehnik-tbilisi/`
  - `/en/tbilisi/santehnik-tbilisi/`
- [x] Verify sitemap URL count after regeneration: 108 indexable localized URLs (RU/GE/EN); the non-indexable root `/` is intentionally excluded.
- [x] Verify every sitemap URL maps to an existing localized `index.html` route in the repository tree; 108/108 matched.

## P0.2 Canonical

- [x] Every localized service/category page must canonicalize to itself.
- [x] RU pages → their RU URL.
- [x] GE pages → their GE URL.
- [x] EN pages → their EN URL.
- [x] Fix language root canonicals:
  - [x] /ru/
  - [x] /ge/
  - [x] /en/
- [x] Standardize canonical URLs with trailing slash.
- [x] Ensure canonical URLs use HTTPS and the production domain.

## P0.3 Hreflang

- [x] Each localized page must reference itself.
- [x] Each localized page must reference the corresponding RU/GE/EN versions.
- [x] Remove unrelated Batumi alternates from Tbilisi pages.
- [x] Fix Batumi service hreflang paths.
- [x] Use full absolute production URLs.
- [x] Make `x-default` intentional and consistent with the chosen root/language architecture.
- [x] Verify reciprocal hreflang links across all language variants.

## P0.4 Root `/` language handling

- [x] Root is treated as a technical language-router, not as an indexable content page.
- [x] Keep `noindex, follow` on the root.
- [x] Remove the root canonical because the root is not an indexable content URL.
- [x] Remove the root `meta refresh` so there is only one redirect mechanism.
- [x] Preserve automatic language selection via the existing JS redirect:
  - `ka` → `/ge/`
  - `en` → `/en/`
  - other/unknown languages → `/ru/`
- [x] Keep direct language links in the root fallback UI.
- [x] Keep `x-default` on the indexable localized pages pointing to `/ru/`.
- [x] Verify the root no longer has conflicting canonical/meta-refresh/hreflang SEO signals.

## P0.5 BreadcrumbList

- [x] Make BreadcrumbList URLs match the actual localized page URLs.
- [x] Fix examples such as:
  - `/ru/tbilisi/santehnik-tbilisi/`
  - `/ru/batumi/santehnik-batumi/`
- [x] Apply the same correction to GE and EN pages where BreadcrumbList is present.
- [x] Verify breadcrumb URLs use trailing slash consistently.
- [x] Restore the correct breadcrumb hierarchy for district pages (language root → service → district page).

## P0.6 Trailing slash consistency

Canonical, sitemap, hreflang, Open Graph URL, Schema.org and internal links use one directory-style URL convention.

Chosen convention:

`/ru/tbilisi/santehnik-tbilisi/`

- [x] Canonical URLs use trailing slash and match the actual localized route.
- [x] Sitemap contains 109 unique production URLs with trailing slash.
- [x] Hreflang URLs use trailing slash.
- [x] Open Graph `og:url` values are aligned with the localized canonical URLs.
- [x] Schema.org page URL fields checked for missing trailing slash variants.
- [x] Internal localized page links were normalized where they referenced directory routes without trailing slash.
- [x] Language-root and Batumi/Tbilisi localized routes use consistent trailing-slash URLs.
- [x] No known localized route remains with a mixed slash/no-slash SEO URL variant.

---
# P1 — Important SEO quality

## P1.1 Full page consistency

Audit pass by page type and language (current source tree: 108 localized pages = 36 RU + 36 GE + 36 EN):

- Language roots checked: RU / GE / EN.
- Partner pages checked: RU / GE / EN.
- Tbilisi service pages checked across all service types and languages.
- Tbilisi district pages checked across RU / GE / EN.
- Batumi city roots checked across RU / GE / EN.
- Batumi service pages checked across all service types and languages.
- Representative metadata, canonical, og:url, robots, language attributes, hreflang and Schema.org structures were checked by type/language.
- Confirmed gap: GE + EN service pages were missing BreadcrumbList while RU service pages and district pages had it.
- Confirmed gap fixed: added localized BreadcrumbList to all 32 GE/EN service pages (16 GE + 16 EN).
- Full 108-page source crawl completed: title, description, H1, canonical, hreflang, OG URL, robots, JSON-LD presence/parseability and BreadcrumbList were checked by page. Four confirmed gaps were fixed: 2 missing localized BreadcrumbList blocks and 2 incorrect GE `og:url` values. Internal-link topology remains tracked separately under P1.2.


- [x] Audit all 108 localized pages.
- [x] Check title.
- [x] Check meta description.
- [x] Check H1.
- [x] Check canonical.
- [x] Check hreflang.
- [x] Check OG URL.
- [x] Check Schema.org.
- [x] Check BreadcrumbList.
- [x] Check robots directives.

## P1.2 Internal linking

Source-level internal-link audit completed by page type across RU / GE / EN, including language roots, partner pages, Tbilisi/Batumi service pages, and district-page patterns.

- [x] Check links between city/category/service pages.
- [x] Identify weakly linked pages.
- [x] Identify orphan pages.
- [x] Ensure language-specific links stay inside the same language.
- [x] Ensure city-specific links stay inside the correct city.
- [x] Confirmed and fixed gap: GE and EN Batumi city roots were missing direct internal links to the five Batumi district landing pages that are linked from RU.
- [x] Verified that localized content links remain within the current language/city; cross-language links observed are the intentional RU/GE/EN language switcher links.
- [x] Verified district/service pages have reciprocal same-language city/service/district navigation and no confirmed orphan localized landing page in the audited page-type topology.


NaN

## P1.4 Structured data

- [ ] Validate LocalBusiness.
- [ ] Validate Service.
- [ ] Validate FAQPage.
- [ ] Validate BreadcrumbList.
- [ ] Check all URLs inside JSON-LD.
- [ ] Verify `aggregateRating` / `reviewCount` against visible page content.
- [ ] Remove unsupported/test rating data if it is not backed by real visible reviews.

## P1.5 Images

- [ ] Check missing `alt` attributes.
- [ ] Check useful, descriptive alt text.
- [ ] Check image dimensions and loading behavior.
- [ ] Check WebP/AVIF opportunities where appropriate.
- [ ] Check whether important images are crawlable.

---

# P2 — Content SEO

## P2.1 Keyword mapping

- [ ] Build keyword map for RU / GE / EN.
- [ ] Map one primary intent to each indexable page.
- [ ] Check city + service combinations.
- [ ] Identify missing high-value landing pages.

## P2.2 Cannibalization

- [ ] Check similar service pages competing for the same intent.
- [ ] Compare titles, H1s and main copy.
- [ ] Consolidate only when pages have genuinely overlapping intent.
- [ ] Do not merge pages merely because keywords are similar.

## P2.3 Content depth

- [ ] Audit service page copy.
- [ ] Check uniqueness between cities.
- [ ] Check uniqueness between languages.
- [ ] Identify thin pages.
- [ ] Improve useful local/service information where needed.

## P2.4 Heading structure

- [ ] Audit H1 uniqueness.
- [ ] Check H2 hierarchy.
- [ ] Check for missing/duplicate heading levels.
- [ ] Align headings with page intent.

## P2.5 Local SEO

- [ ] Verify Tbilisi and Batumi entity/location signals.
- [ ] Check NAP consistency where applicable.
- [ ] Check local business structured data.
- [ ] Review internal local navigation.

---

# P3 — Validation & monitoring

## P3.1 Search Console

- [ ] Submit/fetch corrected sitemap.
- [ ] Inspect representative RU/GE/EN URLs.
- [ ] Check canonical selected by Google.
- [ ] Check indexed/not-indexed reasons.
- [ ] Monitor hreflang/international targeting signals where available.

## P3.2 Lighthouse

- [ ] Run mobile Lighthouse.
- [ ] Run desktop Lighthouse.
- [ ] Record Performance.
- [ ] Record Accessibility.
- [ ] Record Best Practices.
- [ ] Record SEO.

## P3.3 Core Web Vitals

- [ ] Check LCP.
- [ ] Check INP.
- [ ] Check CLS.
- [ ] Separate lab results from real-user data.

## P3.4 Real crawl

- [ ] Crawl production site with Chromium/Playwright.
- [ ] Verify status codes.
- [ ] Verify redirects.
- [ ] Verify canonical.
- [ ] Verify hreflang.
- [ ] Verify robots.
- [ ] Verify sitemap URLs.
- [ ] Verify structured data presence.

## P3.5 Analytics / conversions

- [ ] Verify page-level analytics after SEO changes.
- [ ] Verify important conversion events still fire.
- [ ] Confirm SEO changes did not break forms or contact buttons.

---

# Execution order

1. P0.1 Sitemap
2. P0.2 Canonical
3. P0.3 Hreflang
4. P0.4 Root
5. P0.5 BreadcrumbList
6. P0.6 Trailing slash consistency
7. P1 full technical crawl
8. P2 content SEO
9. P3 production validation

## Working rule

Make only the changes required for the current checklist item. Do not refactor unrelated code or remove existing functionality.

After each step:

- [ ] Change implemented
- [ ] Production/source files rechecked
- [ ] No unrelated changes introduced
- [ ] Step marked complete here
