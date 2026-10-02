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

- [ ] Every localized service/category page must canonicalize to itself.
- [ ] RU pages → their RU URL.
- [ ] GE pages → their GE URL.
- [ ] EN pages → their EN URL.
- [ ] Fix language root canonicals:
  - `/ru/`
  - `/ge/`
  - `/en/`
- [ ] Standardize canonical URLs with trailing slash.
- [ ] Ensure canonical URLs use HTTPS and the production domain.

## P0.3 Hreflang

- [ ] Each localized page must reference itself.
- [ ] Each localized page must reference the corresponding RU/GE/EN versions.
- [ ] Remove unrelated Batumi alternates from Tbilisi pages.
- [ ] Fix Batumi service hreflang paths.
- [ ] Use full absolute production URLs.
- [ ] Make `x-default` intentional and consistent with the chosen root/language architecture.
- [ ] Verify reciprocal hreflang links across all language variants.

## P0.4 Root `/` language handling

Current root combines `noindex`, canonical, meta refresh and JS redirect.

- [ ] Choose one intentional root strategy.
- [ ] Remove conflicting SEO signals.
- [ ] Preserve the desired language-selection/fallback behavior.
- [ ] Ensure `x-default` points to the intended root/selector URL.
- [ ] Verify crawler behavior and browser behavior separately.

## P0.5 BreadcrumbList

- [ ] Make BreadcrumbList URLs match the actual localized page URLs.
- [ ] Fix examples such as:
  - `/ru/tbilisi/santehnik-tbilisi/`
  - `/ru/batumi/santehnik-batumi/`
- [ ] Apply the same correction to GE and EN pages.
- [ ] Verify breadcrumb URLs use trailing slash consistently.

## P0.6 Trailing slash consistency

Canonical, sitemap, hreflang, Open Graph URL, Schema.org and internal links should use one convention.

Chosen convention:

`/ru/tbilisi/santehnik-tbilisi/`

- [ ] Standardize all SEO URLs to trailing slash.
- [ ] Check internal links for mixed slash/no-slash variants.
- [ ] Check OG `og:url`.
- [ ] Check Schema.org URLs.
- [ ] Check language switcher URLs.

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
