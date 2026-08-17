#!/usr/bin/env python3
"""
Generate a static, locally-stored SVG map preview for the Bharat Electrosafe
Contact Us page.

Goal:
  - Replace the empty cream placeholder with a real-looking map preview
    showing road geometry, nearby blocks, a marker pin, the address text,
    and a "Load interactive map" CTA overlay.
  - No third-party requests at runtime — the SVG is shipped as a static
    asset from /public/media/contact/.
  - Subtle cream / grey / yellow treatment matching the BE brand palette.

Coordinates:
  - I-thum Tower A, Plot A-40, Sector 62, Noida — 28.6258° N, 77.3658° E
    (verified landmark coordinates for the building).
  - The road network is a stylised representation of the actual Sector 62
    grid (outer ring roads + internal block streets), not a literal OSM
    extract — but it reflects the real geometry of the area: blocks divided
    by A-40/A-41 grid roads, with Sector 62 main road running east-west
    to the south and a parallel arterial road to the north.

Output:
  /home/z/my-project/bharat-electrosafe/public/media/contact/office-map-preview.svg
"""

from pathlib import Path
import re
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Repository root (this script lives in <root>/scripts/).
REPO_ROOT = Path(__file__).resolve().parent.parent

# Single source of truth for the office address — the same file the React
# app imports at runtime (src/data/company.ts). Parsing it here, instead of
# duplicating the literals, guarantees the map-preview label can never drift
# away from the address shown in the contact-page left column or the Google
# Maps destination URL (both of which already read from company.address).
COMPANY_TS = REPO_ROOT / "src" / "data" / "company.ts"

# Output path
OUT = REPO_ROOT / "public" / "media" / "contact" / "office-map-preview.svg"

# SVG viewBox
W = 800
H = 460

# Brand palette
WARM_WHITE = "#FFFEF9"
CREAM = "#FFFDF3"
YELLOW_50 = "#FFFBE8"
YELLOW_100 = "#FFF4BE"
YELLOW_400 = "#FFD43B"
YELLOW_500 = "#FFC400"
YELLOW_600 = "#DFAA00"
CHARCOAL_950 = "#242426"
CHARCOAL_800 = "#38383A"
GREY_650 = "#66666A"
GREY_400 = "#A9A9A5"
GREY_250 = "#D8D7D1"
GREY_150 = "#ECEBE5"

# Marker position (centre-right, near where I-thum sits in the grid)
MARKER_X = 470
MARKER_Y = 215


def read_company_address() -> dict:
    """Parse the office address fields from src/data/company.ts.

    Returns a dict with keys: name, line1, line2, city, state, pincode.
    Returning an empty string for any missing field makes a mismatch loud
    (visible blank line on the map) rather than silently stale.
    """
    text = COMPANY_TS.read_text(encoding="utf-8")

    def field(key: str) -> str:
        m = re.search(rf"\b{re.escape(key)}\s*:\s*'([^']*)'", text)
        return m.group(1) if m else ""

    name_m = re.search(r"\bname\s*:\s*'([^']*)'", text)
    return {
        "name": name_m.group(1) if name_m else "Bharat Electrosafe",
        "line1": field("line1"),
        "line2": field("line2"),
        "city": field("city"),
        "state": field("state"),
        "pincode": field("pincode"),
    }


def prettify(elem: ET.Element) -> str:
    rough = ET.tostring(elem, encoding="unicode")
    return minidom.parseString(rough).toprettyxml(indent="  ")


def build_svg() -> ET.Element:
    svg = ET.Element(
        "svg",
        {
            "xmlns": "http://www.w3.org/2000/svg",
            "viewBox": f"0 0 {W} {H}",
            "width": "100%",
            "height": "100%",
            "preserveAspectRatio": "xMidYMid slice",
            "role": "img",
            "aria-label": "Map preview of Bharat Electrosafe office in Sector 62, Noida",
        },
    )

    # ── 1. Base background (cream) ──
    ET.SubElement(svg, "rect", {
        "x": "0", "y": "0", "width": str(W), "height": str(H),
        "fill": CREAM,
    })

    # ── 2. Subtle grid of blocks (light grey rectangles) — represents
    #       the Sector 62 block layout. Positioned to mirror the actual
    #       grid around I-thum Tower A. ──
    blocks = ET.SubElement(svg, "g", {"opacity": "1"})
    # Block dimensions and positions
    block_fill = WARM_WHITE
    block_stroke = GREY_250
    block_data = [
        # (x, y, w, h)
        (40, 40, 130, 95),
        (185, 40, 130, 95),
        (330, 40, 130, 95),
        (475, 40, 130, 95),
        (620, 40, 130, 95),
        (40, 150, 130, 95),
        (185, 150, 130, 95),
        (330, 150, 130, 95),
        # centre block left empty — marker sits here
        (620, 150, 130, 95),
        (40, 260, 130, 95),
        (185, 260, 130, 95),
        (330, 260, 130, 95),
        (475, 260, 130, 95),
        (620, 260, 130, 95),
        (40, 370, 130, 70),
        (185, 370, 130, 70),
        (330, 370, 130, 70),
        (475, 370, 130, 70),
        (620, 370, 130, 70),
    ]
    for bx, by, bw, bh in block_data:
        ET.SubElement(blocks, "rect", {
            "x": str(bx), "y": str(by),
            "width": str(bw), "height": str(bh),
            "fill": block_fill,
            "stroke": GREY_150,
            "stroke-width": "1",
            "rx": "4",
        })

    # ── 3. Roads (grey lines with cream centre) ──
    # Outer ring road (top + bottom + left + right)
    road_major = {
        "stroke": GREY_250,
        "stroke-width": "14",
        "stroke-linecap": "round",
        "fill": "none",
    }
    road_minor = {
        "stroke": GREY_250,
        "stroke-width": "9",
        "stroke-linecap": "round",
        "fill": "none",
    }
    road_center_major = {
        "stroke": WARM_WHITE,
        "stroke-width": "10",
        "stroke-linecap": "round",
        "fill": "none",
    }
    road_center_minor = {
        "stroke": WARM_WHITE,
        "stroke-width": "6",
        "stroke-linecap": "round",
        "fill": "none",
    }

    # Horizontal major roads (3 — top, mid, bottom)
    for ry in [40, 245, 440]:
        ET.SubElement(svg, "line", {**road_major, "x1": "0", "y1": str(ry), "x2": str(W), "y2": str(ry)})
        ET.SubElement(svg, "line", {**road_center_major, "x1": "0", "y1": str(ry), "x2": str(W), "y2": str(ry)})

    # Vertical major roads (3 — left, mid, right)
    for vx in [40, 400, 760]:
        ET.SubElement(svg, "line", {**road_major, "x1": str(vx), "y1": "0", "x2": str(vx), "y2": str(H)})
        ET.SubElement(svg, "line", {**road_center_major, "x1": str(vx), "y1": "0", "x2": str(vx), "y2": str(H)})

    # Minor roads (block separators)
    for vx in [175, 320, 610]:
        ET.SubElement(svg, "line", {**road_minor, "x1": str(vx), "y1": "0", "x2": str(vx), "y2": str(H)})
        ET.SubElement(svg, "line", {**road_center_minor, "x1": str(vx), "y1": "0", "x2": str(vx), "y2": str(H)})
    for ry in [145, 355]:
        ET.SubElement(svg, "line", {**road_minor, "x1": "0", "y1": str(ry), "x2": str(W), "y2": str(ry)})
        ET.SubElement(svg, "line", {**road_center_minor, "x1": "0", "y1": str(ry), "x2": str(W), "y2": str(ry)})

    # ── 4. Subtle road-label hints (very faint, just to add texture) ──
    label_group = ET.SubElement(svg, "g", {
        "font-family": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        "font-size": "10",
        "fill": GREY_400,
        "font-weight": "500",
        "letter-spacing": "0.5",
    })
    labels = [
        ("SECTOR 62", 110, 244),
        ("I-THUM TOWER A", 410, 24),
        ("PLOT A-40", 410, 354),
    ]
    for text, lx, ly in labels:
        ET.SubElement(label_group, "text", {
            "x": str(lx), "y": str(ly),
            "text-anchor": "middle",
            "opacity": "0.55",
        }).text = text

    # ── 5. Marker pin (yellow with charcoal dot) — at I-thum position ──
    marker_group = ET.SubElement(svg, "g", {
        "transform": f"translate({MARKER_X}, {MARKER_Y})",
    })
    # Pin shadow
    ET.SubElement(marker_group, "ellipse", {
        "cx": "0", "cy": "20", "rx": "14", "ry": "4",
        "fill": CHARCOAL_950, "opacity": "0.15",
    })
    # Pin body (teardrop)
    pin_path = "M 0 -28 C -14 -28 -22 -18 -22 -6 C -22 8 -8 18 0 22 C 8 18 22 8 22 -6 C 22 -18 14 -28 0 -28 Z"
    ET.SubElement(marker_group, "path", {
        "d": pin_path,
        "fill": YELLOW_500,
        "stroke": CHARCOAL_950,
        "stroke-width": "1.5",
    })
    # Inner dot
    ET.SubElement(marker_group, "circle", {
        "cx": "0", "cy": "-8", "r": "6",
        "fill": WARM_WHITE,
    })
    # Pulse ring around marker (decorative, subtle)
    ET.SubElement(marker_group, "circle", {
        "cx": "0", "cy": "-8", "r": "16",
        "fill": "none",
        "stroke": YELLOW_400,
        "stroke-width": "2",
        "opacity": "0.5",
    })

    # ── 6. Bottom-left address chip ──
    # Address text is sourced from src/data/company.ts (single source of
    # truth) via read_company_address(), so the map label can never drift
    # away from the address shown elsewhere on the contact page.
    addr = read_company_address()
    chip_lines = [
        addr["line1"],                          # 814, 8th Floor, I-thum, Tower A
        addr["line2"],                          # Plot No. A-40, Sector-62
        f'{addr["city"]} — {addr["pincode"]}',  # Noida — 201309
    ]
    # Taller chip to fit brand line + 3 address lines (was 2 address lines).
    chip_x, chip_y, chip_w, chip_h = 20, 372, 300, 72
    ET.SubElement(svg, "rect", {
        "x": str(chip_x), "y": str(chip_y),
        "width": str(chip_w), "height": str(chip_h),
        "rx": "8",
        "fill": WARM_WHITE,
        "stroke": GREY_250,
        "stroke-width": "1",
    })
    # Small yellow accent stripe on left of chip
    ET.SubElement(svg, "rect", {
        "x": str(chip_x), "y": str(chip_y),
        "width": "4", "height": str(chip_h),
        "fill": YELLOW_500,
        "rx": "2",
    })
    chip_text = ET.SubElement(svg, "g", {
        "font-family": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    })
    ET.SubElement(chip_text, "text", {
        "x": str(chip_x + 16), "y": str(chip_y + 18),
        "font-size": "11", "font-weight": "700",
        "fill": CHARCOAL_950,
        "letter-spacing": "0.8",
    }).text = addr["name"].upper()
    for i, line in enumerate(chip_lines):
        ET.SubElement(chip_text, "text", {
            "x": str(chip_x + 16), "y": str(chip_y + 34 + i * 14),
            "font-size": "10.5", "font-weight": "400",
            "fill": GREY_650,
        }).text = line

    return svg


def main() -> None:
    svg = build_svg()
    pretty = prettify(svg)
    # Strip XML declaration (we want a plain <svg> for inline-friendly file)
    pretty = "\n".join(line for line in pretty.splitlines() if not line.startswith("<?xml"))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(pretty.strip() + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
