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
- [x] Verify sitemap URL count after regeneration.
- [x] Verify every sitemap URL returns the expected page.

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

- [ ] Audit all 108 localized pages.
- [ ] Check title.
- [ ] Check meta description.
- [ ] Check H1.
- [ ] Check canonical.
- [ ] Check hreflang.
- [ ] Check OG URL.
- [ ] Check Schema.org.
- [ ] Check BreadcrumbList.
- [ ] Check robots directives.

## P1.2 Internal linking

- [ ] Check links between city/category/service pages.
- [ ] Identify weakly linked pages.
- [ ] Identify orphan pages.
- [ ] Ensure language-specific links stay inside the same language.
- [ ] Ensure city-specific links stay inside the correct city.

## P1.3 404 / redirects

- [ ] Crawl all internal links.
- [ ] Identify 404 pages.
- [ ] Identify obsolete URL variants.
- [ ] Add redirects only where an old URL should intentionally resolve to a current URL.
- [ ] Avoid redirect chains.

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
