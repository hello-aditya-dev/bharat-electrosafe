# FINAL POLESHIELD + IMAGE RESTORATION AUDIT

**Audit type:** Client correction round — Bharat PoleShield hierarchy + domestic/Global image restoration
**Repository:** https://github.com/hello-aditya-dev/bharat-electrosafe
**Live website:** https://bharat-electrosafe.vercel.app/
**Report date:** 2025 (correction round following the PDF-sourced forensic audit)
**Author of all commits:** hello-aditya-dev <hi.aditya.dev@gmail.com>

**Starting commit:** `4d91727` (main, clean tree, in sync with origin/main)

---

## Product Hierarchy

Domestic Electrical Insulating Mats:
- HV Insulating Mats — `/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats`
- Auto Glow — `/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats`
- Bi-Color — `/products/electrical-insulating-mats/bi-color-insulating-mats`
- Bharat PoleShield — `/products/bharat-poleshield`
- Colored Strip — `/products/electrical-insulating-mats/coloured-strip-insulating-mats` (retained — pre-existing approved product; its removal was not requested)

Global:
- HV Insulating Mats — `/products/electrical-insulating-mats/international-iec-61111/hv-insulating-mats`
- Bi-Color (Dual Layer Dual Colour) — `/products/electrical-insulating-mats/dual-layer-dual-colour`
- no Auto Glow (legacy `/auto-glow-hv` 308 → Global IEC hub — re-verified live)
- no PoleShield

**Hierarchy correction applied (data level, not a UI workaround):**
1. `src/data/product-navigation.ts` — Bharat PoleShield moved out of its own
   top-level sub-group INTO the "Domestic Mats" items list (order: HV → Auto
   Glow → Bi-Colour → **Bharat PoleShield** → Colored Strip). It is a direct
   child of Electrical Insulating Mats, NOT a child of HV Insulating Mats.
2. `src/data/product-routes.ts` — `bharat-poleshield.parentKey` changed
   `products` → `electrical-insulating-mats`, so the breadcrumb chain builder
   now walks Home → Products → Electrical Insulating Mats → Bharat PoleShield.
3. `src/app/products/bharat-poleshield/PoleShieldClient.tsx` (visible
   breadcrumb) and `page.tsx` (JSON-LD BreadcrumbList) — "Electrical
   Insulating Mats" level added, exactly matching the required chain.
4. Dead `.slice(2)` "Additional specialized brand directions" special-cases
   removed from `Header.tsx` (mobile drawer) and `ProductsMegaMenu.tsx`
   (desktop mega-menu) — PoleShield now renders inside the Domestic list from
   the shared data source on both desktop and mobile.

PoleShield page context re-verified: real client logo + "Protecting Every
Pole • Protecting Every Life" tagline; no IEC 61111 claim; no IS 15652 claim
in page content (the only "IS 15652:2006 · BIS Licence" string on that URL is
the site-wide footer company-credentials line, present on every page — not a
PoleShield product claim). No technical specs invented.

## Image Restoration

DOMESTIC (restored to the exact pre-audit mapping, verified against
`git show d0cd64e` ground truth — §9 regression test: BEFORE = AFTER):

- Domestic HV: RESTORED / PASS — never touched by the recent audit commits
  (verified: `git diff d0cd64e HEAD -- hv-insulating-mats/` empty before this
  round; unchanged again after).
- Domestic Auto Glow: RESTORED / PASS — same verification, never touched.
- Domestic Bi-Color: RESTORED / PASS — `biColourVisuals` (card
  `client-approved/bi-colour-card-cross-section.webp`, hero
  `client-bi-colour/product-01.png`, gallery `product-02/03.png` +
  `01-dual-layer-roll.webp`, technicalDetail `product-demo-bi-color.webp`,
  menu/home previews `bcim-hero-dual-layer-insulating-mat.webp`) and
  `products.ts` BCIM thumbnail `card.webp` + 4-image `bcimGallery` restored
  byte-for-byte to the previously approved state. `BiColorClient.tsx` fully
  restored (Layer Construction shows the client cross-section image again).
  Live check: 8 restored client images rendering, 0 schematic, 0 brochure
  crops, no orange text.
- Domestic PoleShield: PASS — logo/tagline untouched.

GLOBAL:

- Global HV: PASS — hero `client-hv-approved/domestic-hv-card.webp`
  (unchanged pre-approved mapping), table/estimator imagery unchanged.
- Global Bi-Color / Dual Layer: PREVIOUS IMAGE RESTORED / PASS — hub
  "Bi-Colour" hero slot + Dual Layer variant card consume
  `iecVisuals.gallery[0]` = `client-approved/bi-colour-card-cross-section.webp`
  again; Dual Layer page hero = `client-bi-colour/product-01.png` (verified
  live via decoded next/image URL), innovation cross-section =
  `product-demo-bi-color.webp`, labelled `ColourwaySchematic` diagram retained
  in the innovation section and on the Global IEC variant card exactly as in
  the pre-audit approved layout (non-primary, clearly labelled).
- Global IEC family card + menu preview: previous assets restored
  (`eim-hero-electrical-insulating-mat.webp`, pre-audit mapping).

New unwanted visuals — REMOVED FROM PRIMARY DISPLAY:
- `bi-colour-schematic-black-yellow.svg`: 0 active references (asset retained
  in repo as inert; legitimate non-primary future use only, never a photo).
- `client-brochure-bi-colour-black-yellow.webp` +
  `client-brochure-black-fabric-roll.webp`: 0 active references (genuine
  client-brochure crops retained on disk, unreferenced — client judged them
  visually worse).

No fabricated photography was created, used, or presented as a photo. The
BLACK/YELLOW colourway direction remains in TEXT (product copy + labelled
diagram labels), per the client's rule that text communicates the colourway
while imagery stays the previously approved assets. Alt text on restored
images describes them accurately (no false Black/Yellow photo claims).

Image diff classification (§19): every image change in `731517b` + `8bdd77b`
was classified; category A (intended global correction, now superseded by
this newer client instruction → reverted), category B (accidental domestic
change → reverted), category C (valid data-only changes → PRESERVED: Classes
A–C label fix, BES CD / Fine-Ribbed variant removal, iecSpecialVariants
removal, estimator/technical work), category D (unrelated) — none found.

## Technical Accuracy

Domestic: **PASS** — IS 15652:2006, Class A/B/C, 3.3/11/33 kV working,
10/22/36 kV proof, 30/45/65 kV dielectric, 2.0/2.5/3.0 mm, BIS
CM/L:8800129617 — all re-verified live in the browser (spec-check JSON all
true; zero IEC class/voltage data on the domestic page).

Global: **PASS** — IEC 61111:2009, Classes 0–4 (BES 001–005 rows: 2.0/2.0/3.0/4.0/5.2 mm;
1.0/7.5/17.0/26.5/36.0 kV working; 5/10/20/30/40 kV proof; 10/20/30/40/50 kV
dielectric; 3.2/3.2/4.8/4.8/6.4 kg/m²), 2.0–5.2 mm summary — re-verified live
(10/10 hub assertions true). Weight estimator intact ("Estimate Total Mat
Weight", brochure kg/m² values, URL persistence).

Cross-contamination: **NONE** — full §25 term scan executed: Raychem/RPG 0;
auto-glow-hv 0; ACL 0 real (only base64-icon false positive); black+orange 0;
PoleShield in Global surfaces 0; every IS 15652 / IEC 61111 occurrence
classified (DOMESTIC / VALID SHARED disambiguation / comment) — the domestic
HV page's single "IEC 61111" line is the legitimate separation note ("the
domestic range is separate from the IEC 61111:2009 global range"), and the
domestic class selector's export-market guidance line is likewise a
separation message, not contamination.

Certification data untouched by the image rollback: ACL REMOVED, CE RETAINED.

## Routes

| Route | Canonical | Page content | Context | Status |
|---|---|---|---|---|
| `/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats` | self | IS 15652:2006 + Class A–C + domestic imagery | DOMESTIC HV | 200 PASS |
| `/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats` | self | Auto Glow domestic context | DOMESTIC AUTO GLOW | 200 PASS |
| `/products/electrical-insulating-mats/bi-color-insulating-mats` | self | Bi-Color + restored imagery | DOMESTIC BI-COLOR | 200 PASS |
| `/products/bharat-poleshield` | self | Brand direction, no specs | DOMESTIC EIM direct child | 200 PASS |
| `/products/electrical-insulating-mats/international-iec-61111` | self (legacy `/products/international-iec-61111` 308) | IEC 61111:2009, BES 001–005, HV + Bi-Colour cards | GLOBAL hub | 200 PASS |
| `/products/electrical-insulating-mats/international-iec-61111/hv-insulating-mats` | self | IEC 61111:2009 classes 0–4 + estimator | GLOBAL HV | 200 PASS |
| `/products/electrical-insulating-mats/dual-layer-dual-colour` | self | Dual Layer + restored imagery | GLOBAL BI-COLOR | 200 PASS |
| `/products/electrical-insulating-mats/auto-glow-hv` | → Global IEC hub | 308 redirect | GLOBAL AUTO GLOW | 308 REMOVED ✓ |

7/7 legacy redirects re-verified live (308 with correct targets). No route
files moved; every URL's H1/breadcrumb/data/CTA match its product context.

## Navigation

Desktop: **PASS** — mega-menu (verified by opening the menu in a real
browser): Domestic column renders HV Insulating Mats → Auto Glow →
Bi-Colour → **Bharat PoleShield** → Colored Strip; International column
renders HV Insulating Mats + Dual Layer Dual Colour only; no PoleShield and
no Auto Glow in International.

Mobile: **PASS** — drawer at 390 px (verified by expanding the Products
accordion; screenshot captured): identical hierarchy, PoleShield as a direct
Domestic item with correct link.

Sitemap/footer/products-overpage derive from the same corrected data source
(`product-navigation.ts` / `getAllProductHrefs()`), so PoleShield remains
listed once, under Electrical Insulating Mats. `/products` overview page
already presented PoleShield as an EIM-section brand card (not under HV) —
no change needed there.

## Build

Typecheck: **PASS** (`tsc --noEmit` exit 0)
Lint: **PASS** (`bun run lint` exit 0)
Build: **PASS** (production build, all routes prerendered, exit 0)

Runtime: **PASS** — production server QA (port 3200): 17/17 route+content
checks PASS, 0 console errors on inspected pages, zero horizontal overflow
at 390 px on the three key pages, no hydration errors, no broken images
(all restored assets HTTP-served through next/image).

QA script updated to assert the RESTORED state (previous-approved images
expected; schematic/brochure crops expected absent; PoleShield hierarchy +
breadcrumb + mega-menu checks added; estimator pattern fixed to the actual
heading; domestic-HV forbidden pattern narrowed to IEC class tokens so the
legitimate separation note doesn't false-fail).

## Remaining Issues

1. **None blocking.** Two inert unreferenced assets remain on disk by design
   (schematic SVG + two brochure crops) — documented in
   `docs/PRODUCT-PHOTOGRAPHY-GAPS.md` §8; delete on request.
2. Colored Strip retained in the Domestic navigation (pre-existing approved
   product; the client's menu drawing did not list it, but no instruction
   requested its removal — flagging for client awareness).
3. Carried over from the previous round (unchanged, client decisions
   pending): six numeric performance claims flagged for source confirmation;
   high-resolution BLACK/YELLOW studio photography offer stands if the
   client ever wants new imagery (current visuals are the approved ones).

## Git

Starting commit: `4d91727`
Final commit: see git log (single correction commit on main)
Pushed: **YES** (normal push to main — NO force push, no history rewrite, no
unrelated reverts; commit contains only this correction's files)

Files changed (13):
```
docs/PRODUCT-PHOTOGRAPHY-GAPS.md                                          (§8 rewritten)
scripts/final-audit-browser-qa.sh                                          (restored-state assertions)
src/app/products/bharat-poleshield/PoleShieldClient.tsx                    (breadcrumb + EIM level)
src/app/products/bharat-poleshield/page.tsx                                (JSON-LD breadcrumb + EIM level)
src/app/.../bi-color-insulating-mats/BiColorClient.tsx                     (restored pre-audit file)
src/app/.../dual-layer-dual-colour/DualLayerClient.tsx                     (restored pre-audit file)
src/app/.../international-iec-61111/IECClient.tsx                          (schematic re-added as labelled diagram; technical fixes kept)
src/components/layout/Header.tsx                                           (dead PoleShield sub-group case removed)
src/components/layout/ProductsMegaMenu.tsx                                 (dead PoleShield sub-group case removed)
src/data/product-navigation.ts                                             (PoleShield → Domestic item)
src/data/product-routes.ts                                                 (parentKey → electrical-insulating-mats)
src/data/product-visuals.ts                                                (biColourVisuals + iecVisuals restored)
src/data/products.ts                                                       (BCIM gallery/thumbnail restored)
```

---

*Every restoration was performed against `git show d0cd64e:<file>` ground
truth (not memory); technical corrections from earlier rounds were preserved
intact; every image, breadcrumb, navigation group and route was re-verified
in a real browser against the production build.*
