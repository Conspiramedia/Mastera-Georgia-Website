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
- [x] Sitemap contains 108 unique production URLs with trailing slash.
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


## P1.3 404 / redirects

Source-level validation completed. Production HTTP validation remains pending because the current execution environment cannot resolve/reach `mastera-tbilisi.ge`.

- [x] Sitemap contains only current localized indexable routes; `/` is excluded because it is `noindex`.
- [x] All 108 sitemap URLs map to existing localized `index.html` routes.
- [x] No obsolete localized URL remains in the current sitemap.
- [x] Legacy redirect targets in `404.html` use canonical trailing-slash URLs.
- [x] `404.html` uses `window.location.replace()` only as a client-side fallback; it is not represented as an HTTP 301.
- [ ] Verify production 404 response status with an actual HTTP request.
- [ ] Verify production legacy redirects return HTTP 301/308 at the hosting layer and do not rely on `404.html` JavaScript.
- [ ] Verify redirect chains terminate directly on canonical localized URLs.

## P1.4 Structured data

Full source-level structured-data audit completed across the 108 localized pages, with confirmed issues corrected only where evidence was found.

- [x] JSON-LD blocks parsed successfully on the representative RU/GE/EN service, district and city-root page types checked during P1.4.
- [x] `Service` schema is present on representative Tbilisi/Batumi service and district pages.
- [x] `FAQPage` schema is present on representative service/city pages and its `mainEntity` structure parses correctly.
- [x] `BreadcrumbList` schema parses correctly on the representative page types and uses localized canonical trailing-slash URLs.
- [x] Confirmed Batumi `LocalBusiness.areaServed` error on RU/GE city roots: both incorrectly declared Tbilisi; corrected to Batumi.
- [x] Validated `LocalBusiness` on RU/GE/EN Tbilisi and Batumi city roots and RU/GE/EN partner pages: name, URL, address, geo and area scope are internally consistent with the page type.
- [x] Validated `Service` + `FAQPage` + `BreadcrumbList` JSON-LD on representative RU/GE/EN Tbilisi/Batumi service and district pages; JSON parses without errors.
- [x] Checked the non-candidate page groups (language roots, partner pages, and the three newer service categories) for unsupported `aggregateRating`; none found.
- [x] Removed unsupported `aggregateRating` blocks from all 81 localized service/district pages where the field was actually present; no other JSON-LD fields were changed.
- [x] Rechecked representative pages after removal: JSON-LD remains parseable and Service/FAQPage/BreadcrumbList structures remain present.
- [x] Current source tree contains no confirmed unsupported `aggregateRating` on the audited 108-page set.
- [x] FAQPage remains semantically valid structured data, but Google removed the FAQ rich-result feature in 2026; it is not treated as an active rich-result target.
- [x] Checked JSON-LD URL fields on representative localized service/district pages for HTTPS production-domain consistency; no confirmed URL mismatch was found.
- [ ] Run Google Rich Results Test / Search Console URL Inspection against production URLs after deployment.

## P1.5 Images

Source-level image audit completed across all 108 localized pages (36 RU + 36 GE + 36 EN). Google recommends standard HTML `img` elements with crawlable `src` URLs and useful alt text; CSS background images are not indexed as page images.

- [x] Checked all 108 localized pages for `<img>` elements: each page contains one WhatsApp floating-button image; no page has a missing `alt` attribute.
- [x] Checked alt quality: all 108 image instances use `alt="WhatsApp"`, which accurately identifies the linked WhatsApp control and is not keyword stuffing.
- [x] Checked loading behavior: all 108 image instances use native `loading="lazy"`; the image is a floating contact control rather than an above-the-fold content/LCP image.
- [x] Checked dimensions: the image itself has no HTML `width/height` attributes, but the containing `.whatsapp-fab` is fixed at 65×65px and its child image is constrained to `width:100%; height:100%` in CSS; no confirmed source-level dimension defect was therefore found.
- [x] Checked image formats/assets: the HTML image is PNG; CSS hero/footer background assets are already WebP. Google supports PNG, WebP and AVIF among other formats, so no confirmed format defect requires a change.
- [x] Checked important image discovery: the only HTML `<img>` is the WhatsApp control. The site's visual hero/footer images are CSS backgrounds, so they are not treated as indexable content images; the social preview image is exposed through `og:image` and the Schema.org `image` field on audited representative pages.
- [x] Confirmed image asset paths are repository-backed: `/image/whatsapp-icon.png`, `/image/hero-bg.webp`, `/image/footer-cta-bg.webp`, and `/image/og-preview.png` exist in the source tree.
- [x] Confirmed and fixed the only source-level path inconsistency found in the 108-page image pass: RU/GE/EN Batumi city roots used `/../image/whatsapp-icon.png`; normalized all three to the consistent absolute path `/image/whatsapp-icon.png`.
- [ ] Verify production image HTTP status/crawlability with Google URL Inspection or an actual production HTTP request after deployment.

---

# P2 — Content SEO

## P2.1 Keyword mapping

- [x] Built a dedicated RU / GE / EN keyword-intent map for all 108 indexable pages in `SEO_KEYWORD_MAP.md`.
- [x] Assigned one primary intent to each indexable page: 36 RU + 36 GE + 36 EN.
- [x] Mapped city + service combinations separately for Tbilisi and Batumi.
- [x] Mapped all district pages to the district + handyman intent rather than duplicating generic city-service intent.
- [x] Kept provider/`masters/` pages on a separate B2B/provider intent.
- [x] Checked representative current RU / GE / EN titles, descriptions and H1s against the intent map.
- [x] Verified natural Georgian service-query formulations against current Georgian search results for representative services.
- [ ] Quantitative search-volume/competition validation is still open; no unsupported volume or “high-value” claims were added.
- [ ] P2.2 Cannibalization remains a separate next-stage audit; similar keywords alone are not treated as a reason to merge URLs.

## P2.2 Cannibalization

- [x] Audited all 108 localized pages against the P2.1 intent map, comparing root, provider, service and district page roles.
- [x] Identified a confirmed overlap between each language root and its dedicated Tbilisi handyman-by-hour page at title level.
- [x] Widened the RU, GE and EN root titles so the roots represent the general city-level matching service rather than the narrower handyman-by-hour intent.
- [x] Rechecked service + city pages and district + handyman pages; no additional confirmed same-intent pair requiring consolidation was found.
- [x] Kept RU / GE / EN language variants separate; language variants are not treated as cannibalization.
- [x] No URLs were merged, removed, redirected or canonicalized as part of P2.2.
- [x] Detailed findings recorded in SEO_CANNIBALIZATION.md.


## P2.3 Content depth

- [x] Audited representative service pages across RU / GE / EN and Tbilisi / Batumi.
- [x] Confirmed near-template duplication between Tbilisi and Batumi service pages; representative normalized comparisons were approximately 99% shared wording after city-name normalization.
- [x] Checked representative district pages; they contain stronger district-specific local context.
- [x] RU / GE / EN language variants are treated as intentional localized versions.
- [x] Added unique Batumi-local service sections to all 24 Batumi service pages (8 services × 3 languages).
- [x] Kept the remediation service-specific: бытовой ремонт, электрик, грузчики, клининг, навеска и монтаж, ремонт компьютеров, сантехник and сборка мебели.
- [x] Rechecked the 108-page localized source architecture after remediation: 36 RU + 36 GE + 36 EN; no P2.3 URL additions, removals or merges.
- [x] No canonical, hreflang, sitemap or Schema.org changes were introduced by the content remediation.
- [x] P2.3 closed at source level.
- [x] Detailed findings recorded in SEO_CONTENT_DEPTH.md.

## P2.4 Heading structure

- [x] Audited heading structure across the localized page architecture: language roots, partner pages, Tbilisi/Batumi service pages and district pages.
- [x] Confirmed one real hierarchy defect: testimonial names on the 3 language roots and 3 partner pages were marked H4 directly under an H2 section, skipping H3.
- [x] Corrected all 6 affected pages by changing only those testimonial headings from H4 to H3.
- [x] Rechecked representative service and district pages: their main content uses H1 → H2 → H3 without a confirmed heading-level skip.
- [x] No confirmed duplicate-H1 or missing-H1 issue was found in the reviewed page types.
- [x] Changes were limited to confirmed heading-structure defects; no URL, metadata, canonical, hreflang or content changes were introduced by P2.4.

## P2.5 Local SEO

- [x] Audited the RU / GE / EN local page architecture for Tbilisi and Batumi, including city roots, service pages and district pages.
- [x] Confirmed city-level LocalBusiness / Service structured data uses the intended city in `addressLocality` and `areaServed` on the reviewed local page types.
- [x] Confirmed district Service pages use district-specific `areaServed` values and localized breadcrumb paths.
- [x] Found and fixed Batumi root FAQ locality errors: the visible and JSON-LD FAQ answers incorrectly listed Tbilisi districts on all 3 Batumi language roots.
- [x] Found and fixed 5 Georgian Batumi district pages where copied Tbilisi-local signals remained in JSON-LD descriptions/FAQ answers and the parent breadcrumb label.
- [x] Replaced those copied signals with Batumi/district-specific local references; no URL, canonical, hreflang or sitemap changes were needed.
- [x] Ran targeted repository searches after remediation; the confirmed erroneous Georgian/Tbilisi phrases no longer remain in the indexed source.
- [x] No additional confirmed local SEO defect was found in the reviewed local architecture.
- [x] P2.5 closed at source level.

Production Google Business Profile, local-pack visibility, live NAP verification and Search Console validation remain production-level tasks and are not claimed here.

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
