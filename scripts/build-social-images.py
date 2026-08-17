#!/usr/bin/env python3
"""
Build Bharat Electrosafe Open Graph and Twitter/X social preview images.

Produces:
    src/app/opengraph-image.png   (1200×630)
    src/app/twitter-image.png     (1200×630)

Layout (1200×630, all critical text ≥60px from every edge):
    ┌───────────────────────────────────────┬───────────────────┐
    │  [logo]                               │                   │
    │                                       │   Hero photo      │
    │  Electrical Insulating Mats           │   (technician +   │
    │  Engineered for Safer Workplaces      │    insulating mat │
    │                                       │    + switchgear)  │
    │  Certified electrical insulation      │                   │
    │  and industrial protection solutions  │                   │
    │  ───                                  │                   │
    │  IS 15652:2006 · BIS Licensed · …     │                   │
    │                                       │                   │
    │  bharatelectrosafe.com                │                   │
    └───────────────────────────────────────┴───────────────────┘
       55% navy panel                             45% photo

Source assets (real, existing — no AI generation):
    • public/brand/bharat-electrosafe-logo-header.png  (891×349 RGBA)
    • public/media/hero/bharat-electrosafe-insulating-mat-hero.webp (1200×900)

Usage:
    python3 scripts/build-social-images.py
"""

from pathlib import Path
import io
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ──────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent

LOGO_PATH = REPO_ROOT / "public" / "brand" / "bharat-electrosafe-logo-header.png"
HERO_PATH = REPO_ROOT / "public" / "media" / "hero" / "bharat-electrosafe-insulating-mat-hero.webp"

OG_OUT = REPO_ROOT / "src" / "app" / "opengraph-image.png"
TWITTER_OUT = REPO_ROOT / "src" / "app" / "twitter-image.png"

# Brand colours
NAVY = (0, 39, 91)            # #00275B — be-navy-800 (matches header)
NAVY_DEEP = (0, 26, 67)       # #001A43 — be-navy-950 (subtle gradient end)
YELLOW = (255, 196, 0)        # #FFC400 — be-yellow-500
YELLOW_LIGHT = (255, 212, 59) # #FFD43B — be-yellow-400
WHITE = (255, 255, 255)
GREY_LIGHT = (220, 226, 235)  # pale blue-grey for supporting copy

# Canvas
WIDTH = 1200
HEIGHT = 630
SAFE_MARGIN = 60              # all critical text ≥60px from every edge

# Layout regions
LEFT_PANEL_WIDTH = 660        # 55% of canvas
RIGHT_PANEL_WIDTH = WIDTH - LEFT_PANEL_WIDTH  # 540

# Font paths — Carlito is a Calibri-compatible modern sans-serif
# shipped with the system. Falls back to DejaVu Sans Bold if missing.
FONT_REGULAR = "/usr/share/fonts/truetype/english/Carlito-Regular.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/english/Carlito-Bold.ttf"
FONT_FALLBACK_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_FALLBACK_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


# ──────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────

def load_font(path: str, fallback: str, size: int) -> ImageFont.FreeTypeFont:
    """Load a font at the given size, falling back to the alternate path."""
    try:
        return ImageFont.truetype(path, size)
    except (OSError, IOError):
        return ImageFont.truetype(fallback, size)


def draw_wrapped_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    box: tuple[int, int, int, int],
    font: ImageFont.FreeTypeFont,
    fill: tuple,
    line_spacing: int = 6,
) -> int:
    """Draw word-wrapped text inside a box.

    Returns the y-coordinate just below the last drawn line.
    """
    x, y, max_w, _ = box
    words = text.split()
    line = ""
    line_height = font.size

    for word in words:
        candidate = (line + " " + word).strip()
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] - bbox[0] <= max_w:
            line = candidate
        else:
            draw.text((x, y), line, font=font, fill=fill)
            y += line_height + line_spacing
            line = word
    if line:
        draw.text((x, y), line, font=font, fill=fill)
        y += line_height + line_spacing
    return y


def prepare_hero_crop() -> Image.Image:
    """Load the hero photo and center-crop it to fit the right panel.

    The right panel is 540×630 (aspect ~0.857). The source is 1200×900
    (aspect 1.333). To preserve technician + mat + switchgear, we
    center-crop horizontally: scale source height to 630, then take a
    540-wide slice from the horizontal center.
    """
    src = Image.open(HERO_PATH).convert("RGB")
    src_w, src_h = src.size  # 1200, 900

    target_w = RIGHT_PANEL_WIDTH  # 540
    target_h = HEIGHT             # 630

    # Scale source so its height matches target_h (so we crop only width)
    scale = target_h / src_h       # 0.7
    scaled_w = int(src_w * scale)  # 840
    scaled_h = target_h            # 630
    scaled = src.resize((scaled_w, scaled_h), Image.LANCZOS)

    # Center-crop the width down to target_w
    left = (scaled_w - target_w) // 2
    right = left + target_w
    cropped = scaled.crop((left, 0, right, target_h))

    return cropped


def prepare_logo_transparent_bg() -> Image.Image:
    """Load the horizontal logo PNG (RGBA).

    The logo has transparency — when composited onto the navy panel,
    only the logo's actual pixels (the BE symbol + wordmark text) will
    appear. The transparent background stays as the underlying navy.
    """
    return Image.open(LOGO_PATH).convert("RGBA")


def render_social_image() -> Image.Image:
    """Compose the final 1200×630 social preview image."""
    # ── Base canvas: navy left panel + hero right panel ────────
    canvas = Image.new("RGB", (WIDTH, HEIGHT), NAVY)

    # Subtle navy gradient on the left panel (top → bottom, navy → navy_deep)
    # for a polished corporate feel without distracting decoration.
    left_panel = Image.new("RGB", (LEFT_PANEL_WIDTH, HEIGHT), NAVY)
    gradient = Image.new("L", (1, HEIGHT), 0)
    for y in range(HEIGHT):
        # Smooth lerp from 255 (full NAVY) at top to ~210 (mostly NAVY_DEEP) at bottom
        t = y / (HEIGHT - 1)
        gradient.putpixel((0, y), int(255 - (t * 45)))
    gradient = gradient.resize((LEFT_PANEL_WIDTH, HEIGHT))
    navy_deep_panel = Image.new("RGB", (LEFT_PANEL_WIDTH, HEIGHT), NAVY_DEEP)
    left_panel = Image.composite(left_panel, navy_deep_panel, gradient)
    canvas.paste(left_panel, (0, 0))

    # ── Right panel: hero photograph ──────────────────────────
    hero = prepare_hero_crop()
    canvas.paste(hero, (LEFT_PANEL_WIDTH, 0))

    # Very thin yellow seam between the two panels — brand connect.
    draw = ImageDraw.Draw(canvas)
    seam_x = LEFT_PANEL_WIDTH
    draw.rectangle(
        [(seam_x - 1, 0), (seam_x, HEIGHT)],
        fill=YELLOW,
    )

    # ── Left panel content ────────────────────────────────────
    # Logo at top-left, scaled to a comfortable ~260px wide
    logo = prepare_logo_transparent_bg()
    logo_w, logo_h = logo.size  # 891, 349
    target_logo_w = 260
    target_logo_h = int(logo_h * (target_logo_w / logo_w))  # ~102
    logo_scaled = logo.resize((target_logo_w, target_logo_h), Image.LANCZOS)

    # Composite the logo (with transparency) onto the canvas
    canvas.paste(logo_scaled, (SAFE_MARGIN, SAFE_MARGIN), logo_scaled)

    # Headline — bold, large, white
    headline_font = load_font(FONT_BOLD, FONT_FALLBACK_BOLD, 36)
    headline_y = SAFE_MARGIN + target_logo_h + 28
    headline_y = draw_wrapped_text(
        draw,
        "Electrical Insulating Mats Engineered for Safer Workplaces",
        box=(SAFE_MARGIN, headline_y, LEFT_PANEL_WIDTH - 2 * SAFE_MARGIN, 0),
        font=headline_font,
        fill=WHITE,
        line_spacing=4,
    )

    # Supporting line — regular, smaller, pale grey
    supporting_font = load_font(FONT_REGULAR, FONT_FALLBACK_REGULAR, 18)
    supporting_y = headline_y + 16
    supporting_y = draw_wrapped_text(
        draw,
        "Certified electrical insulation and industrial protection solutions",
        box=(SAFE_MARGIN, supporting_y, LEFT_PANEL_WIDTH - 2 * SAFE_MARGIN, 0),
        font=supporting_font,
        fill=GREY_LIGHT,
        line_spacing=4,
    )

    # Yellow accent line
    accent_y = supporting_y + 18
    draw.rectangle(
        [(SAFE_MARGIN, accent_y), (SAFE_MARGIN + 60, accent_y + 3)],
        fill=YELLOW,
    )

    # Trust line — bold, small, yellow
    trust_font = load_font(FONT_BOLD, FONT_FALLBACK_BOLD, 15)
    trust_y = accent_y + 18
    draw.text(
        (SAFE_MARGIN, trust_y),
        "IS 15652:2006  ·  BIS Licensed  ·  ERDA / NTH Tested",
        font=trust_font,
        fill=YELLOW_LIGHT,
    )

    # Production domain — bold, larger, yellow, near the bottom
    domain_font = load_font(FONT_BOLD, FONT_FALLBACK_BOLD, 22)
    domain_y = HEIGHT - SAFE_MARGIN - 24
    draw.text(
        (SAFE_MARGIN, domain_y),
        "bharatelectrosafe.com",
        font=domain_font,
        fill=YELLOW,
    )

    return canvas


# ──────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────

def main() -> None:
    # Verify source assets exist
    for p in (LOGO_PATH, HERO_PATH):
        if not p.exists():
            raise SystemExit(f"Source asset not found: {p}")

    # Ensure output directory exists
    OG_OUT.parent.mkdir(parents=True, exist_ok=True)

    print("Composing social preview images…")
    print(f"  Logo:   {LOGO_PATH.relative_to(REPO_ROOT)}")
    print(f"  Hero:   {HERO_PATH.relative_to(REPO_ROOT)}")
    print()

    image = render_social_image()

    # Write OG and Twitter images (identical layout — both 1200×630)
    for out_path in (OG_OUT, TWITTER_OUT):
        print(f"  → {out_path.relative_to(REPO_ROOT)} ({WIDTH}×{HEIGHT})")
        image.save(str(out_path), "PNG", optimize=True)

    print()
    print("Done.")
    print()
    print("Next steps:")
    print("  • Verify src/app/opengraph-image.png is 1200×630")
    print("  • Verify src/app/twitter-image.png is 1200×630")
    print("  • Create src/app/opengraph-image.alt.txt + twitter-image.alt.txt")
    print("  • Update src/app/layout.tsx metadata to remove explicit images")
    print("  • Run `bun run build` to confirm Next.js picks up the new images")


if __name__ == "__main__":
    main()
