#!/bin/bash
# FINAL MASTER AUDIT — live browser QA (single-invocation: server + checks)
cd /home/z/my-project
pkill -f "next-server" 2>/dev/null; pkill -f "next start" 2>/dev/null; sleep 1
NODE_ENV=production nohup bun run start --port 3200 > /tmp/qa-server.log 2>&1 &
SERVER_PID=$!
for i in $(seq 1 20); do curl -s -o /dev/null http://localhost:3200/ && break; sleep 0.5; done
echo "== server ready (pid $SERVER_PID) =="

B="agent-browser"
pass=0; fail=0
check() { # $1=route $2=label $3=expected-substring(innerText) $4=forbidden-substring
  local route="$1" label="$2" expect="$3" forbid="$4"
  $B open "http://localhost:3200$route" > /dev/null 2>&1
  sleep 1.2
  local title errors text
  title=$($B get title 2>/dev/null)
  errors=$($B get errors 2>/dev/null | tr -d '\n' | head -c 120)
  text=$($B eval "document.body.innerText" 2>/dev/null)
  local status="PASS"
  [[ "$title" == *"Error"* || "$title" == *"404"* ]] && status="FAIL(title:$title)"
  [[ "$errors" == *"error:"* || "$errors" == *"Error:"* ]] && status="FAIL(console)"
  if [[ -n "$expect" && "$text" != *"$expect"* ]]; then status="FAIL(missing:'$expect')"; fi
  if [[ -n "$forbid" && "$text" == *"$forbid"* ]]; then status="FAIL(forbidden:'$forbid')"; fi
  if [[ "$status" == "PASS" ]]; then pass=$((pass+1)); echo "PASS  $label  [$title]";
  else fail=$((fail+1)); echo "$status  $label  [$title]"; fi
}

echo "== ROUTE + CONTENT QA =="
check "/" "Homepage" "Bharat Electrosafe" ""
check "/products" "Products hub" "Products" ""
check "/products/electrical-insulating-mats" "EIM family hub" "Electrical Insulating Mats" ""
check "/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats" "DOMESTIC HV" "IS 15652:2006" "Class 0"
check "/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats" "DOMESTIC AUTO GLOW" "Auto Glow" "IEC 61111:2009 Classes"
check "/products/electrical-insulating-mats/bi-color-insulating-mats" "DOMESTIC BI-COLOUR" "Bi-Color Insulating Mats" ""
check "/products/electrical-insulating-mats/international-iec-61111" "GLOBAL IEC HUB" "IEC 61111:2009" "IS 15652:2006 Class A"
check "/products/electrical-insulating-mats/international-iec-61111/hv-insulating-mats" "GLOBAL HV" "IEC 61111:2009" "IS 15652:2006 Class A"
check "/products/electrical-insulating-mats/dual-layer-dual-colour" "DUAL LAYER BI-COLOUR" "Dual Layer Bi-Colour" ""
check "/products/bharat-poleshield" "POLESHIELD" "Protecting Every Pole" ""
check "/products/geo-membrane-lining" "GEO MEMBRANE" "Geo Membrane" ""
check "/products/water-stop-seal" "WATER STOP" "Water Stop" ""
check "/products/pvc-flooring-solutions" "PVC FLOORING" "PVC Flooring" ""
check "/products/waterproofing-solutions" "WATERPROOFING" "Waterproofing" ""
check "/products/other-products" "OTHER PRODUCTS" "Rubber Sheet" ""
check "/about-us" "About" "About" ""
check "/contact-us" "Contact" "Contact" ""

echo "== GLOBAL HUB CARD GRID =="
$B open "http://localhost:3200/products/electrical-insulating-mats/international-iec-61111" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const t = document.body.innerText;
  return JSON.stringify({
    hvCard: t.includes('HV Insulating Mats'),
    biColourCard: t.includes('Dual Layer Bi-Colour'),
    autoGlowAbsent: !t.includes('Auto Glow'),
    poleShieldAbsent: !t.includes('PoleShield'),
    thickness: t.includes('2.0–5.2 mm'),
    classes: t.includes('0, 1, 2, 3, 4'),
    classRows: ['BES 001','BES 002','BES 003','BES 004','BES 005'].every(c => t.includes(c)),
    proofCol: t.includes('AC Proof Voltage'),
    dielectricCol: t.includes('Dielectric Strength'),
    weightCol: t.includes('Approximate Weight') || t.includes('Approx. Weight'),
  });
})()" 2>/dev/null

echo "== GLOBAL HV PAGE SPEC CHECK =="
$B open "http://localhost:3200/products/electrical-insulating-mats/international-iec-61111/hv-insulating-mats" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const t = document.body.innerText;
  return JSON.stringify({
    class0to4: ['Class 0','Class 1','Class 2','Class 3','Class 4'].every(c => t.includes(c)),
    values_36kV: t.includes('36.0 kV') || t.includes('36 kV'),
    thickness_5_2: t.includes('5.2 mm'),
    is15652_clean: !(t.includes('3.3 kV') && t.includes('Class A')),
    estimator: t.includes('Estimated weight') || t.includes('weight estimator') || t.includes('Estimated Weight') || t.includes('Estimate Total Mat Weight'),
  });
})()" 2>/dev/null

echo "== DOMESTIC HV SPEC CHECK =="
$B open "http://localhost:3200/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const t = document.body.innerText;
  return JSON.stringify({
    is15652: t.includes('IS 15652:2006'),
    classABC: t.includes('Class A') && t.includes('Class B') && t.includes('Class C'),
    voltages: t.includes('3.3 kV') && t.includes('11 kV') && t.includes('33 kV'),
    thickness_2_3: t.includes('2.0 – 3.0 mm') || t.includes('2.0–3.0 mm') || t.includes('2.0 mm'),
    noIECclasses: !t.includes('Class 0') && !t.includes('Class 4'),
    cmL: t.includes('CM/L:8800129617'),
  });
})()" 2>/dev/null

echo "== DOMESTIC BI-COLOUR RESTORED-IMAGE CHECK =="
$B open "http://localhost:3200/products/electrical-insulating-mats/bi-color-insulating-mats" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src);
  const t = document.body.innerText;
  return JSON.stringify({
    restoredClientImages: imgs.filter(s => /client-bi-colour|product-demo-bi-color|card-cross-section|01-dual-layer-roll/.test(s)).length,
    cardThumb: imgs.some(s => s.includes('bi-color-insulating-mats/card.webp')),
    schematicSvg: imgs.some(s => s.includes('bi-colour-schematic-black-yellow')),
    brochureCrop: imgs.some(s => s.includes('client-brochure-bi-colour')),
    orangeText: /orange/i.test(t),
  });
})()" 2>/dev/null

echo "== BI-COLOUR ON GLOBAL HUB (restored previous global image) =="
$B open "http://localhost:3200/products/electrical-insulating-mats/international-iec-61111" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src);
  return JSON.stringify({
    restoredBiColour: imgs.filter(s => s.includes('bi-colour-card-cross-section') || s.includes('client-bi-colour')).length,
    schematicSvg: imgs.filter(s => s.includes('bi-colour-schematic-black-yellow')).length,
    brochureCrop: imgs.filter(s => s.includes('client-brochure')).length,
  });
})()" 2>/dev/null

echo "== DUAL LAYER PAGE (restored previous global hero + labelled diagram) =="
$B open "http://localhost:3200/products/electrical-insulating-mats/dual-layer-dual-colour" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src);
  const t = document.body.innerText;
  return JSON.stringify({
    restoredHero: imgs.some(s => s.includes('client-bi-colour/product-01')),
    restoredCrossSection: imgs.some(s => s.includes('product-demo-bi-color')),
    schematicComponent: t.includes('Colourway') || t.includes('colourway'),
    blackYellowText: t.includes('Black') && t.includes('Yellow'),
    brochureCrop: imgs.some(s => s.includes('client-brochure')),
  });
})()" 2>/dev/null

echo "== POLESHIELD HIERARCHY CHECK (direct EIM child, breadcrumb + nav) =="
$B open "http://localhost:3200/products/bharat-poleshield" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const main = document.querySelector('main');
  const t = main ? main.innerText : document.body.innerText;
  return JSON.stringify({
    breadcrumbHasEIM: t.includes('Electrical Insulating Mats'),
    breadcrumbChain: t.includes('Products') && t.includes('Electrical Insulating Mats') && t.includes('Bharat PoleShield'),
    noIECclaim: !t.includes('IEC 61111'),
    noISclaim: !t.includes('IS 15652'),
  });
})()" 2>/dev/null
$B open "http://localhost:3200/" > /dev/null 2>&1; sleep 1.2
$B set viewport 1440 900 2>/dev/null || $B viewport 1440 900 2>/dev/null
$B click 'button[aria-controls="products-mega-menu"]' > /dev/null 2>&1; sleep 0.8
$B eval "
(() => {
  const menu = document.querySelector('#products-mega-menu');
  const links = menu ? Array.from(menu.querySelectorAll('a[href]')).map(a => a.getAttribute('href')) : [];
  const txt = menu ? menu.innerText : '';
  return JSON.stringify({
    poleShieldInDomesticGroup: txt.indexOf('Bharat PoleShield') > -1 && txt.indexOf('Bharat PoleShield') < txt.indexOf('International'),
    hrefPresent: links.includes('/products/bharat-poleshield'),
  });
})()" 2>/dev/null

echo "== REDIRECTS (HTTP status) =="
for r in "/products/international-iec-61111" "/products/electrical-insulating-mats/auto-glow-hv" "/products/electrical-insulating-mats/domestic" "/products/auto-glow-reflective-band-insulating-mats" "/products/bi-color-insulating-mats" "/products/bharat-membrane" "/products/bharat-hydro-seal"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3200$r")
  loc=$(curl -s -o /dev/null -w "%{redirect_url}" "http://localhost:3200$r")
  echo "$code  $r  →  $loc"
done

echo "== MOBILE 390px OVERFLOW CHECK (global hub + domestic HV) =="
$B set viewport 390 844 2>/dev/null || $B viewport 390 844 2>/dev/null
for r in "/products/electrical-insulating-mats/international-iec-61111" "/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats" "/products/electrical-insulating-mats/bi-color-insulating-mats"; do
  $B open "http://localhost:3200$r" > /dev/null 2>&1; sleep 1
  $B eval "JSON.stringify({overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth, scrollW: document.documentElement.scrollWidth})" 2>/dev/null | sed "s|^|$r → |"
done
$B set viewport 1440 900 2>/dev/null || $B viewport 1440 900 2>/dev/null

echo "== SITEMAP =="
curl -s http://localhost:3200/sitemap.xml | grep -o "<loc>[^<]*</loc>" | sed 's/<[^>]*>//g' | head -25

echo "== SUMMARY: PASS=$pass FAIL=$fail =="
kill $SERVER_PID 2>/dev/null
echo done
