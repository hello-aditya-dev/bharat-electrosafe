# BHARAT ELECTROSAFE — FINAL SOURCE-VERIFIED AUDIT

**Audit type:** Final forensic PDF-sourced product + technical audit (client instruction: "read the txt file word by word and use vlm on the pdf make sure to do the full work end to end in english and save it")
**Repository:** https://github.com/hello-aditya-dev/bharat-electrosafe
**Live website:** https://bharat-electrosafe.vercel.app/
**Report date:** 2025 (final round — Round 8, PDF-sourced forensic pass)
**Author of all commits:** hello-aditya-dev <hi.aditya.dev@gmail.com>

---

## Overall Status

**READY**

All acceptance criteria from the instruction set pass. Every client-visible technical fact on the website is traceable either to (a) explicit client-approved content, or (b) a supplied authoritative PDF with page reference. The three findings of this round were fixed, verified in a production build with a real browser, and pushed to main.

---

## 0. PDF FORENSIC REVIEW (both PDFs inspected visually, page by page)

| PDF | Pages | Classification | Reason |
|---|---|---|---|
| `BharatElectrosafe- All Products_compressed.pdf` | 12 | **LEVEL 2 — client-approved content. Primary source for all Bharat Electrosafe product data.** | Client's own brochure. Bharat Electrosafe branding throughout. Contains the authoritative BES 001–005 IEC class table (p. 4), product portfolio (p. 2–3), PVC Geomembrane data (p. 5–7), Water Stopper data (p. 8–10), certification band (p. 11), global presence + contact (p. 12). |
| `2023 - Raychem RPG - Electrical Safety Protection.pdf` | 35 | **LEVEL 3 — supplier reference ONLY. No image from this PDF may be published.** | Every page carries Kamfet / Raychem RPG branding (covers, product photos, glove marking diagrams, mat marking photos, contact page). Used strictly as an independent cross-check of IEC 61111:2009 class voltage/withstand values (p. 18 table) and standard context (p. 15–18, 32). Zero assets extracted for publication. |

Key pages inspected visually:
- BE brochure p. 3 — Electrical Safety Insulating Mats: IEC 61111/2009 CERTIFIED, CLASS 0 TO CLASS 4, 1KV TO 36KV; Quality Tested; Premium Material ("Elastomer-free; combination of natural rubber and synthetic polymers with anti-slip surface."); Visual Authenticity ("product name marking on every metre"); **1 Year Warranty**.
- BE brochure p. 4 — Technical Specifications IEC 61111/2009: Finish – Fabric Finish; Standard Colours – Blue OR Black; **Bi – Colour - Blue and Orange/ Black and Yellow**; Standard Sizes 1.0 m × 10.0 m and 1.2 m × 10.0 m; Custom sizes; Standard Black (no metallic derivatives); **BES 001–005 class table**; two genuine product photos (black fabric-finish roll; **BLACK/YELLOW bi-colour roll**).
- BE brochure p. 11 — Certifications: ISO 9001, ISO 14001, BIS Certified, MSME, **CE Mark**, IEC/ASTM/PGI. **No ACL anywhere** — consistent with the client's remove-ACL/keep-CE rule.
- Raychem RPG p. 18 — IEC 61111:2009 class table (independent cross-check of working/proof/withstand/DC values).
- Raychem RPG p. 16–30 — matting finishes/colourways (Raychem's own bi-colour is Black/Orange — classified REFERENCE ONLY; see conflict record below).

---

## 1. PRODUCT CONTEXT

| Product | Status |
|---|---|
| Domestic HV (`/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats`) | **PASS** — IS 15652:2006 / Class A–C / 3.3–33 kV context; zero IEC data (re-verified live). |
| Global HV (`/products/electrical-insulating-mats/international-iec-61111/hv-insulating-mats`) | **PASS** — IEC 61111:2009 only; BES 001–005 table; estimator intact (Class 2 + 100 m² → 480 kg). |
| Domestic Auto Glow (`/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats`) | **PASS — KEPT** (client rule: domestic Auto Glow remains). |
| Global Auto Glow | **REMOVED** — no route, no card, no nav entry; legacy `/auto-glow-hv` intentionally 301s to the Global IEC hub; domestic Auto Glow route untouched. |
| Domestic Bi-Color (`/products/electrical-insulating-mats/bi-color-insulating-mats`) | **PASS** — IS 15652:2006 context; hero/gallery now use genuine BLACK/YELLOW photo; construction diagram clearly labelled. |
| Global Bi-Color (Global IEC hub card + `/products/electrical-insulating-mats/dual-layer-dual-colour`) | **PASS** — BLACK/YELLOW product photograph live in hub hero slot, hub variant card, and Dual Layer hero. |
| Domestic PoleShield (`/products/bharat-poleshield`) | **PASS** — sits inside the domestic EIM family; real client logo + tagline; no invented specifications. |
| Global PoleShield | **REMOVED** — absent from Global IEC hub, cards, and international navigation. |

---

## 2. TECHNICAL ACCURACY

**Total technical claims audited in this PDF-sourced pass:** 83 (35 BES-table fields, 6 dimension fields, 6 brochure-claim fields, 10 FAQ answers, 6 quick-facts values, 20 cross-check fields against the Raychem RPG p. 18 table)

**Verified (source-matched, kept):** 77
**Corrected (numeric):** 0 — the BES 001–005 table, dimensions, warranty, certificate, marking and material claims already matched the client brochure exactly.
**Unsupported — REMOVED from client view:** 3 product entries (BES RB 001, BES RB 002, BES CD — 24 spec fields withdrawn).
**Unsupported — FLAGGED (retained per §53 do-not-modify-approved-content):** 6 numeric performance claims — 70 N puncture, 50 N slip, 80% / 168 h / 70 ± 2 °C ageing, −25 ± 3 °C low temperature, 75% acid/oil retention. Not present (even without numbers) in the two PDFs supplied this round; they originate from the earlier client-approved Bharat Electrosafe IEC brochure that this data file was built from, and the FAQ qualifies them as values "to be confirmed against type-test documentation". Flagged in the ledger; removal or source-supply is a client decision.
**Conflicting:** 2 (both resolved — see conflict records below).

### Corrected / removed facts this round (complete list)

1. **REMOVED — "Fine Ribbed Variants" section (BES RB 001, BES RB 002)** from `GlobalHVClient.tsx` and `IECClient.tsx`. Codes not present in the client All-Products brochure (p. 4 lists BES 001–005 only). Client rule: verify-or-remove → removed.
2. **REMOVED — "BES CD / Custom" table row** (hardcoded) from the Global IEC classification table in `IECClient.tsx`. Same rule.
3. **REMOVED — `iecSpecialVariants` export + `IECSpecialVariant` interface** from `src/data/iec-61111.ts` so the codes cannot silently re-enter any client surface. A documented note explains the removal.
4. **REPLACED — Global IEC hub hero "Bi-Colour" slot + "Dual Layer Dual Colour" variant card image**: previously the generic single-colour roll (and, before this round, the schematic); now the genuine BLACK/YELLOW client photograph.
5. **REPLACED — Global IEC card + menu preview**: previously an AI-render-style generic image (`eim-hero-electrical-insulating-mat.webp`); now the genuine black fabric-finish roll photo from the client brochure (IEC-context asset).
6. **REPLACED — Dual Layer Dual Colour hero**: previously the labelled schematic with an outdated "photography to follow" note; now the genuine product photograph. The schematic remains in the Innovation section as the clearly-labelled construction diagram.
7. **REPLACED — Domestic Bi-Color thumbnail/gallery/overview** (`products.ts`): product photograph first, construction diagram second with honest caption.
8. **UPDATED — stale note** "BLACK/YELLOW product photography to follow" on the domestic Bi-Colour Layer Construction section → now says the construction diagram is an illustration and the product photograph is in the gallery.

### Conflict records (SOURCE A / SOURCE B / DECISION / REASON)

1. **Bi-Colour colourway.** SOURCE A: Raychem RPG catalogue p. 19/21 — Raychem's own bi-colour matting is Black/Orange. SOURCE B: Bharat Electrosafe brochure p. 4 — "Bi – Colour - Blue and Orange/ Black and Yellow". SOURCE C (LEVEL 1): client instruction — active Bi-Color presentation must be **BLACK / YELLOW**. DECISION: BLACK/YELLOW everywhere active. REASON: hierarchy — latest explicit client instruction outranks both documents; the Raychem Black/Orange render is a different company's product. The site's orange brand accent (UI design colour) is untouched.
2. **Class-specific thickness.** SOURCE A: Raychem RPG catalogue (fabric-finish mats: 2.2 / 2.3 / 2.6 / 3.3 / 5.2 mm). SOURCE B: Bharat Electrosafe brochure p. 4 (BES 001–005: **2.0 / 2.0 / 3.0 / 4.0 / 5.2 mm**). DECISION: BE brochure values. REASON: LEVEL 2 client-approved content outranks LEVEL 3 supplier material; the Raychem values belong to Raychem's product line, not Bharat Electrosafe's. Repository matches SOURCE B exactly; Global summary stays 2.0–5.2 mm with class-specific rows intact.

---

## 3. TECHNICAL SOURCE LEDGER (corrected / critical specifications)

| PRODUCT | FIELD | VALUE | SOURCE PDF | PAGE | STATUS |
|---|---|---|---|---|---|
| Global IEC | BES 001 / Class 0 — thickness, working, AC proof, dielectric, weight | 2.0 mm / 1.0 kV / 5.0 kV / 10.0 kV / 3.2 kg/m² | BharatElectrosafe- All Products | 4 | VERIFIED (also matches Raychem p. 18 cross-check) |
| Global IEC | BES 002 / Class 1 — same fields | 2.0 mm / 7.5 kV / 10.0 kV / 20.0 kV / 3.2 kg/m² | BharatElectrosafe- All Products | 4 | VERIFIED |
| Global IEC | BES 003 / Class 2 — same fields | 3.0 mm / 17.0 kV / 20.0 kV / 30.0 kV / 4.8 kg/m² | BharatElectrosafe- All Products | 4 | VERIFIED (matches live BE printed-mat marking photo) |
| Global IEC | BES 004 / Class 3 — same fields | 4.0 mm / 26.5 kV / 30.0 kV / 40.0 kV / 4.8 kg/m² | BharatElectrosafe- All Products | 4 | VERIFIED |
| Global IEC | BES 005 / Class 4 — same fields | 5.2 mm / 36.0 kV / 40.0 kV / 50.0 kV / 6.4 kg/m² | BharatElectrosafe- All Products | 4 | VERIFIED |
| Global IEC | Standard sizes | 1.0 m × 10.0 m; 1.2 m × 10.0 m; custom W × L | BharatElectrosafe- All Products | 4 | VERIFIED |
| Global IEC | Finish / standard colours | Fabric Finish; Blue OR Black; standard black (no metallic derivatives) | BharatElectrosafe- All Products | 4 | VERIFIED |
| Global IEC | Bi-Colour | Black / Yellow (active) | BharatElectrosafe- All Products p.4 + client instruction | 4 | VERIFIED |
| Global IEC | Material copy | "Elastomer-free; combination of natural rubber and synthetic polymers with anti-slip surface." | BharatElectrosafe- All Products | 3 | VERIFIED verbatim |
| Global IEC | Warranty | 1-year warranty with every supply | BharatElectrosafe- All Products | 3 | VERIFIED |
| Global IEC | Test certificate | Test certificate with every supply; accredited internationally recognised laboratories; product name marking | BharatElectrosafe- All Products | 3 | VERIFIED |
| Global IEC | Scope / voltage span | IEC 61111:2009, Classes 0–4, up to 36,000 V AC, 2.0–5.2 mm | BharatElectrosafe- All Products | 3–4 | VERIFIED |
| Global IEC | BES RB 001 / BES RB 002 / BES CD | (any values) | — none — | — | REMOVED (unsupported) |
| Global IEC | 70 N / 50 N / 80%·168 h·70 ± 2 °C / −25 ± 3 °C / 75% | retained | Earlier client-approved BE IEC brochure (pre-dates this round's PDFs) | — | FLAGGED for client confirmation |
| Domestic HV | IS 15652:2006 / Class A–C / 3.3–33 kV / 2.0–3.0 mm / CM/L:8800129617 | unchanged from previous audit | Client-approved domestic content (previous rounds) | — | VERIFIED in previous round; re-checked live this round — no IEC contamination |

---

## 4. PDF IMAGE AUDIT

**PDFs inspected:** both (visual page-by-page inspection; embedded images additionally extracted with `pdfimages` and evaluated individually).

**Relevant image pages:**
- BE brochure p. 1 (product hero collage), p. 2 (portfolio photos), p. 4 (two-product strip: black roll + BLACK/YELLOW bi-colour roll), p. 5–9 (geomembrane/waterstop photos), p. 12 (global map).
- Raychem RPG: all product pages — REFERENCE ONLY (Kamfet/Raychem RPG marks).

**Useful approved/current images found:**
- `be-024` right crop → genuine **BLACK/YELLOW bi-colour roll** (client brochure p. 4) — **USED**.
- `be-024` left crop → genuine **black fabric-finish roll** (client brochure p. 4) — **USED** for Global IEC card/menu/gallery.
- BE p. 4 marking photos already in the repo (`iec-61111.webp`, `iec-61111-class-2.webp`) — re-verified as genuine "Bharat Electrosafe / IEC 61111/2009 - CLASS 2 / 17000 V / 20000 V / 30000 V" printed markings — **RETAINED**.

**Images replaced this round:** 5 slots (see §2 items 4–8).

**Images NOT used and why:** every Raychem RPG image (legacy third-party branding — publication would misrepresent Bharat Electrosafe as another company). No AI-generated photograph was created or presented as a product photo.

**Missing assets:** see §20.

---

## 5. MAT IMAGE STATUS

| Surface | Status |
|---|---|
| Domestic HV | **PASS** — client HV product photos (coined/dotted/hexagon), no branding issues |
| Global HV | **PASS** — hero: generic client blue coin mat (standard brochure colour); card/menu/gallery: genuine client black fabric roll |
| Domestic Auto Glow | **PASS** — client-approved autoglow photos (domestic context only) |
| Bi-Color (domestic + global) | **PASS** — genuine BLACK/YELLOW product photograph live; labelled construction diagram retained as a diagram |
| Legacy Raychem imagery | **NONE** (0 grep hits in src; all live product photos verified brand-safe) |
| Black/Orange active presentation | **NONE** (0 matches; site orange UI accent untouched) |
| Black/Yellow | **PASS** — card, hero, gallery, menu preview, home preview, hub slots |

---

## 6. ROUTE AUDIT

- Filesystem routes enumerated from `src/app/**/page.tsx` + `route.ts`: **20 product pages + 8 supporting pages + 2 API routes** (build prerenders 37 routes incl. robots/sitemap/OG images).
- Canonicals, navigation, breadcrumbs, CTA targets, sitemap: consistent (validated in the previous full pass; **no route file changed this round**, re-verified by `git diff` scope + live spot checks).
- Legacy `/products/international-iec-61111` ↔ nested architecture: single canonical nested path family under `/products/electrical-insulating-mats/international-iec-61111/…`; legacy paths 308-redirect.
- Broken: **0**. Redirect mismatches: **0**. Route/content mismatches: **0** (spot-checked 6 routes live this round: `/`, Global IEC hub, Global HV, Dual Layer, Domestic Bi-Colour, Domestic HV — URL/H1/breadcrumb/image/data/CTA all describe the same product).

---

## 7. GLOBAL PRODUCT CARDS

- HV card: **PASS** (client imagery, IEC context).
- Bi-Color card: **PASS** (BLACK/YELLOW photograph).
- Auto Glow: **ABSENT**. PoleShield: **ABSENT**.
- Grid: **PASS** — exactly two valid international products in a balanced 1×2/2×1 grid; no filler cards invented.

---

## 8. CERTIFICATIONS

- ACL: **REMOVED** (0 references in `src/`; the old ACL image file remains unreferenced in `public/` — inert residue).
- CE: **RETAINED** (also confirmed by client brochure p. 11).
- Band layout: **PASS** — BIS/ISI/ERDA/NTH/ISO 9001/CE/ISO 14001/ISO 45001 reflow without holes or duplicates; matches brochure-backed set.

---

## 9. SECURITY

**PASS.** No secrets in client bundles (only env-var reference in server rate-limit helper); no `dangerouslySetInnerHTML` except the safe JSON-LD serializer; no SQL/path-traversal surface; forms use Zod validation + honeypot + rate limiting (verified in previous full audit; re-scanned this round with 0 findings).

---

## 10. AI / HALLUCINATION

**PASS.** 0 hits for ChatGPT/Claude/Gemini/Z.ai/DeepSeek/Lorem ipsum/TODO/FIXME/example.com in client-visible content. One pre-existing AI-render-style stock image was removed from the Global IEC card slot this round and replaced with a genuine client photograph. No fake testimonials/stats/certifications present.

---

## 11. FOREIGN-LANGUAGE AUDIT

**PASS.** 0 CJK/Japanese/Korean/Cyrillic matches across `src/` (UI, metadata, alt text, aria labels, product data, error messages).

---

## 12. SEO

**PASS.** Titles/descriptions/canonicals consistent with the route chain; sitemap builds only when indexing is enabled and contains the 18 canonical product/supporting URLs (no legacy or international-Auto-Glow entries); OG/Twitter images present; breadcrumb schema unchanged and correct.

---

## 13. RESPONSIVE

**PASS.** 390 px re-check on all changed pages: zero horizontal overflow (scrollWidth == clientWidth). Full 8-viewport matrix (1440/1366/1280/1024/768/390/375/360) validated in the previous pass; layout structure untouched by this round's content swaps.

---

## 14. RUNTIME

**PASS.** Production server QA (port 3200): Global IEC hub (table = BES 001–005 exactly; no BES CD; no Fine Ribbed; bi-colour photo in both hub slots), Global HV (estimator: Class 2 + 100 m² → **480 kg**, `?area=100` URL sync intact), Dual Layer (photo hero, diagram in Innovation section), Domestic Bi-Colour (photo hero + labelled diagram; IS 15652 context). Zero console errors on all inspected pages.

---

## 15. TYPECHECK

**PASS** (`tsc --noEmit` clean; one transient `type: 'diagram'` error during development fixed to the valid `'alternate'` image type).

---

## 16. LINT

**PASS** (`bun run lint` exit 0).

---

## 17. BUILD

**PASS** (production build: compiled successfully, 37/37 pages prerendered, no errors).

---

## 18. FILES CHANGED (this round)

```
docs/PRODUCT-PHOTOGRAPHY-GAPS.md                                                  (updated §8)
src/app/.../international-iec-61111/IECClient.tsx                                 (BES CD row + variants section removed)
src/app/.../international-iec-61111/hv-insulating-mats/GlobalHVClient.tsx         (variants section removed)
src/app/.../dual-layer-dual-colour/DualLayerClient.tsx                            (hero → genuine photo)
src/app/.../bi-color-insulating-mats/BiColorClient.tsx                            (stale note updated)
src/data/iec-61111.ts                                                             (iecSpecialVariants removed, documented)
src/data/product-visuals.ts                                                       (biColourVisuals + iecVisuals remapped)
src/data/products.ts                                                              (BCIM thumbnail/gallery/overview remapped)
public/media/products/bi-color-insulating-mats/client-brochure-bi-colour-black-yellow.webp  (NEW — from client PDF p. 4)
public/media/products/international-iec/client-brochure-black-fabric-roll.webp              (NEW — from client PDF p. 4)
```

Commit: `8bdd77b` (10 files, +100/−214).

---

## 19. REMAINING ISSUES

1. **Six numeric performance claims flagged, not removed** (70 N puncture, 50 N slip, 80%/168 h/70 ± 2 °C ageing, −25 ± 3 °C low-temp, 75% acid/oil): not present in the two PDFs supplied this round; retained because they come from the earlier client-approved BE IEC brochure and §53 forbids needless modification of approved content. **Client action requested:** either confirm these against the original brochure/type-test documents, or ask for removal.
2. ACL image file still sits unreferenced in `public/media` — inert; can be deleted on request.

---

## 20. MISSING CLIENT ASSETS

1. **High-resolution BLACK/YELLOW Bi-Colour studio photography** (≥2000 px, plain background + roll/edge shot + installed shot). A genuine client-brochure photograph (~460 px, from a compressed PDF) is now live and honest; studio-quality assets remain the preferred final imagery. Documented in `docs/PRODUCT-PHOTOGRAPHY-GAPS.md` §8.
2. **Switchgear-installation photo for the EIM family** (slot intentionally empty — no genuine archive photo; documented in the same file).

---

## 21. GIT

- **Starting commit:** `731517b` (main, clean tree, all history authored by hello-aditya-dev <hi.aditya.dev@gmail.com>)
- **Final commit:** `8bdd77b`
- **Pushed to main:** **YES** (`731517b..8bdd77b`, origin/main verified in sync; no force push used this round — none was needed or permitted)

---

*End of report. Every number above is traceable to the client brochure (with page), the supplier reference PDF (with page), explicit client instructions, or the repository diff — nothing was guessed, inferred from general knowledge, or invented.*
