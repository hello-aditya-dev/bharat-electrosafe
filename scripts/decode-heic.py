"""Decode HEIC/HEIF sources to intermediate PNGs for the asset builder.

The sharp build in this toolchain reports HEIF input support but has no
HEVC decoder, so HEIC sources fail. pillow-heif ships its own decoder and
handles them. Output PNGs are written without EXIF: Pillow only writes
metadata that is explicitly passed to save(), and nothing is passed here.
Orientation is applied first via ImageOps.exif_transpose so the pixels are
upright before the metadata is dropped.

Usage:
    python scripts/decode-heic.py --source "<archive>" --out "<temp dir>"

Requires: pip install pillow-heif pillow
"""

import argparse
import sys
from pathlib import Path

try:
    import pillow_heif
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Missing dependency. Run: pip install pillow-heif pillow")

pillow_heif.register_heif_opener()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    source = Path(args.source)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    files = sorted(
        p for p in source.iterdir()
        if p.is_file() and p.suffix.lower() in {".heic", ".heif"}
    )

    if not files:
        print(f"No HEIC/HEIF files found in {source}")
        return 0

    ok, failed = 0, 0
    for path in files:
        target = out / f"{path.stem}.png"
        try:
            with Image.open(path) as image:
                upright = ImageOps.exif_transpose(image)
                # Drop alpha only if absent; keep colour fidelity otherwise.
                if upright.mode not in ("RGB", "RGBA"):
                    upright = upright.convert("RGB")
                # No exif= / icc_profile= arguments: metadata is not carried over.
                upright.save(target, format="PNG", optimize=False)
            print(f"decoded  {path.name} -> {target.name}  {upright.size[0]}x{upright.size[1]}")
            ok += 1
        except Exception as error:  # noqa: BLE001 - report and continue
            print(f"FAILED   {path.name}: {error}")
            failed += 1

    print(f"\n{ok} decoded, {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
