#!/usr/bin/env python3
"""
Build Bharat Electrosafe brand icon assets from the official BE symbol SVG.

Produces:
    src/app/favicon.ico            (multi-size: 16, 32, 48)
    src/app/apple-icon.png         (180×180)
    public/icons/icon-192.png      (192×192, standard)
    public/icons/icon-512.png      (512×512, standard)
    public/icons/icon-192-maskable.png  (192×192, maskable safe-zone)
    public/icons/icon-512-maskable.png  (512×512, maskable safe-zone)

Design:
    The BE monogram (lightning-bolt "B" + "E") sits on a square deep-navy
    background (#00275B, be-navy-800) — the same colour as the site header.
    Standard icons fill the canvas; maskable variants add ~20% padding so
    the BE symbol stays inside Android's 80%-radius safe zone.

Usage:
    python3 scripts/build-brand-icons.py
"""

from pathlib import Path
import cairosvg
from PIL import Image, ImageDraw

# ──────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
SVG_PATH = REPO_ROOT / "src" / "app" / "icon.svg"

# Brand colours (mirror globals.css tokens)
NAVY = (0, 39, 91)          # #00275B — be-navy-800 (header colour)
WHITE = (255, 255, 255)     # BE symbol
YELLOW = (255, 196, 0)      # #FFC400 — be-yellow-500 (maskable accent)

# Output files
OUTPUTS = [
    ("apple-icon",          REPO_ROOT / "src" / "app" / "apple-icon.png",         180, False),
    ("icon-192",            REPO_ROOT / "public" / "icons" / "icon-192.png",       192, False),
    ("icon-512",            REPO_ROOT / "public" / "icons" / "icon-512.png",       512, False),
    ("icon-192-maskable",   REPO_ROOT / "public" / "icons" / "icon-192-maskable.png", 192, True),
    ("icon-512-maskable",   REPO_ROOT / "public" / "icons" / "icon-512-maskable.png", 512, True),
]

# ICO sizes (multi-resolution favicon)
ICO_SIZES = [(16, 16), (32, 32), (48, 48)]


# ──────────────────────────────────────────────────────────────
# Rendering helpers
# ──────────────────────────────────────────────────────────────

def render_standard_png(size: int) -> Image.Image:
    """Render the standard icon: SVG fills the canvas edge-to-edge.

    The SVG already has the navy rounded-square background baked in, so
    we rasterise it directly at the target size.
    """
    png_bytes = cairosvg.svg2png(
        url=str(SVG_PATH),
        output_width=size,
        output_height=size,
    )
    import io
    return Image.open(io.BytesIO(png_bytes)).convert("RGBA")


def render_maskable_png(size: int) -> Image.Image:
    """Render the maskable icon: navy fills the canvas, BE symbol scaled
    to fit inside Android's 80%-radius safe zone.

    Maskable icons must keep all critical content inside a circle of
    radius 40% of the canvas (the "safe zone"). We achieve this by:
      1. Filling the entire canvas with navy.
      2. Rendering the BE symbol SVG at 64% of the canvas size.
      3. Centring the symbol on the navy background.
    """
    # Start with a solid navy canvas
    canvas = Image.new("RGBA", (size, size), NAVY + (255,))

    # Render the BE symbol SVG at 64% of the canvas size.
    # 64% of the canvas width means the symbol's bounding box stays
    # well inside the 80% safe-zone diameter.
    symbol_size = int(size * 0.64)
    import io
    png_bytes = cairosvg.svg2png(
        url=str(SVG_PATH),
        output_width=symbol_size,
        output_height=symbol_size,
    )
    symbol = Image.open(io.BytesIO(png_bytes)).convert("RGBA")

    # Centre the symbol on the navy canvas
    offset = ((size - symbol_size) // 2, (size - symbol_size) // 2)
    canvas.paste(symbol, offset, symbol)

    return canvas


def build_favicon(path: Path) -> None:
    """Build a multi-resolution favicon at 16×16, 32×32 and 48×48.

    PIL's IcoImagePlugin writes a single .ico containing all three sizes;
    browsers pick the appropriate size for tab display, taskbar pinning
    and shortcut creation.

    Implementation note: PIL's ICO writer accepts a single largest image
    and a `sizes=[...]` list — it auto-downscales from the supplied image
    for each requested size. Passing `append_images` with pre-rendered
    copies does NOT embed them as separate directory entries; only the
    first image plus the `sizes` list works reliably.
    """
    # Render once at the largest size, then let PIL downscale for each
    # entry in `sizes`. Pre-rendering each size separately and using
    # `append_images` was unreliable — PIL only registered the first.
    largest_size = max(w for w, _ in ICO_SIZES)
    master = render_standard_png(largest_size)
    # Flatten onto navy so the ICO has no alpha-channel surprises on
    # legacy renderers (Windows taskbar sometimes renders transparency
    # as black).
    bg = Image.new("RGBA", master.size, NAVY + (255,))
    bg.paste(master, (0, 0), master)
    master = bg
    master.save(
        str(path),
        format="ICO",
        sizes=ICO_SIZES,
    )


# ──────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────

def main() -> None:
    if not SVG_PATH.exists():
        raise SystemExit(f"Source SVG not found: {SVG_PATH}")

    # Ensure output directories exist
    (REPO_ROOT / "public" / "icons").mkdir(parents=True, exist_ok=True)

    print(f"Rendering brand icons from {SVG_PATH.name}…")
    print(f"  Background: navy #{NAVY[0]:02X}{NAVY[1]:02X}{NAVY[2]:02X}")
    print(f"  Symbol: white")
    print()

    # Render PNGs
    for name, out_path, size, maskable in OUTPUTS:
        print(f"  → {out_path.relative_to(REPO_ROOT)} ({size}×{size}"
              f"{' maskable' if maskable else ''})")
        img = render_maskable_png(size) if maskable else render_standard_png(size)
        # Flatten RGBA onto an opaque background (PNG can keep alpha, but
        # some social platforms render transparency as black; flattening
        # onto navy guarantees the intended appearance everywhere).
        if not maskable:
            bg = Image.new("RGBA", img.size, NAVY + (255,))
            bg.paste(img, (0, 0), img)
            img = bg
        img.save(str(out_path), "PNG", optimize=True)

    # Build multi-size ICO
    ico_path = REPO_ROOT / "src" / "app" / "favicon.ico"
    print(f"  → {ico_path.relative_to(REPO_ROOT)} ({len(ICO_SIZES)} sizes)")
    build_favicon(ico_path)

    print()
    print("Done.")
    print()
    print("Next steps:")
    print("  • Verify the new favicon appears in src/app/")
    print("  • Verify public/icons/ contains 4 PNG files")
    print("  • Run `bun run build` to confirm Next.js picks up the icons")


if __name__ == "__main__":
    main()
