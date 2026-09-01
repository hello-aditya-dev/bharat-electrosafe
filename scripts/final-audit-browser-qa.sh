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
check "/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats" "DOMESTIC HV" "IS 15652:2006" "IEC 61111"
check "/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats" "DOMESTIC AUTO GLOW" "Auto Glow" "IEC 61111:2009 Classes"
check "/products/electrical-insulating-mats/bi-color-insulating-mats" "DOMESTIC BI-COLOUR" "Bi-Color Insulating Mats" ""
check "/products/electrical-insulating-mats/international-iec-61111" "GLOBAL IEC HUB" "IEC 61111:2009" "IS 15652:2006 Class A"
check "/products/electrical-insulating-mats/international-iec-61111/hv-insulating-mats" "GLOBAL HV" "IEC 61111:2009" "IS 15652:2006 Class A"
check "/products/electrical-insulating-mats/dual-layer-dual-colour" "DUAL LAYER DUAL COLOUR" "Dual Layer Dual Colour" ""
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
    biColourCard: t.includes('Dual Layer Dual Colour'),
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
    estimator: t.includes('Estimated weight') || t.includes('weight estimator') || t.includes('Estimated Weight'),
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

echo "== BI-COLOUR SCHEMATIC LIVE CHECK (domestic) =="
$B open "http://localhost:3200/products/electrical-insulating-mats/bi-color-insulating-mats" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src);
  const legacy = imgs.filter(s => /card-cross-section|client-bi-colour|product-demo-bi-color|dual-layer-roll|bcim-hero|card\.webp/.test(s) && s.includes('bi-color'));
  const t = document.body.innerText;
  return JSON.stringify({
    legacyImages: legacy.length,
    schematicSvg: imgs.some(s => s.includes('bi-colour-schematic-black-yellow')),
    schematicComponent: t.includes('Colourway') || t.includes('colourway'),
    blackYellowText: t.includes('Black') && t.includes('Yellow'),
    orangeText: /orange/i.test(t),
  });
})()" 2>/dev/null

echo "== BI-COLOUR ON GLOBAL HUB (image src check) =="
$B open "http://localhost:3200/products/electrical-insulating-mats/international-iec-61111" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src);
  return JSON.stringify({
    legacyBiColour: imgs.filter(s => /bi-colour-card-cross-section|client-bi-colour/.test(s)).length,
    schematicSvg: imgs.filter(s => s.includes('bi-colour-schematic-black-yellow')).length,
  });
})()" 2>/dev/null

echo "== DUAL LAYER PAGE CHECK =="
$B open "http://localhost:3200/products/electrical-insulating-mats/dual-layer-dual-colour" > /dev/null 2>&1; sleep 1.2
$B eval "
(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src);
  const t = document.body.innerText;
  return JSON.stringify({
    legacyBiColour: imgs.filter(s => /bi-colour-card-cross-section|client-bi-colour|product-demo-bi-color/.test(s)).length,
    schematicComponent: t.includes('Colourway'),
    blackYellow: t.includes('Black') && t.includes('Yellow'),
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
