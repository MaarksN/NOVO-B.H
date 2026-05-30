#!/usr/bin/env python3
"""Generate a local ZIP deliverable without committing binary artifacts."""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "birth-hub-360-reconstructed.zip"
EXCLUDED_NAMES = {".git", "node_modules", "database.json", OUTPUT.name}
EXCLUDED_SUFFIXES = {".zip", ".tar", ".tgz", ".gz", ".7z", ".rar"}


def should_include(path: Path) -> bool:
    relative = path.relative_to(ROOT)
    if any(part in EXCLUDED_NAMES for part in relative.parts):
        return False
    if path.suffix in EXCLUDED_SUFFIXES:
        return False
    return path.is_file()


def main() -> None:
    with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(ROOT.rglob("*")):
            if should_include(path):
                archive.write(path, path.relative_to(ROOT).as_posix())
    print(f"Created {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
