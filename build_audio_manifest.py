#!/usr/bin/env python3
"""
build_audio_manifest.py - lists the audio files in Static/audio so AudioMapper.js knows what exists.
(A browser page can't list a folder, so this writes the list to a small JS file.)

Run it from the project root whenever you add, rename or remove audio:
    python build_audio_manifest.py
    python build_audio_manifest.py --audio Static/audio --strings tts-texts.txt   # also report strings with no audio

Output: Static/audio/audio-manifest.js   ->   window.AudioManifest = { "dog": ["dog.wav", "dog_1.wav"], ... }

File naming rules:
  * the name is the spoken text:            You listen to a teacher.wav
  * case and punctuation don't matter:      "Which word fits this shape?" may be saved as  Which word fits this shape.wav
  * retakes end in _<number>:               dog.wav, dog_1.wav, dog_2.wav ...  (all of them are used)
"""
import argparse, json, re, sys
from pathlib import Path

AUDIO_EXT = {".wav", ".mp3", ".m4a", ".ogg", ".oga", ".webm", ".aac", ".flac"}
NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
       "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten"}


def normalize(text: str) -> str:
    """MUST match normalize() in AudioMapper.js."""
    t = text.lower().replace("'", "").replace("’", "")
    t = re.sub(r"\b(10|[0-9])\b", lambda m: NUM[m.group(1)], t)
    t = re.sub(r"[^a-z ]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", default="Static/audio", help="folder with the audio files")
    ap.add_argument("--out", default=None, help="output file (default: <audio>/audio-manifest.js)")
    ap.add_argument("--strings", default=None, help="optional txt of strings, to list the ones with no audio")
    a = ap.parse_args()

    root = Path(a.audio)
    if not root.is_dir():
        sys.exit(f"Folder not found: {root}")

    found = {}                          # key -> [(take_number, relative_path)]
    skipped = []
    for f in sorted(root.rglob("*")):
        if not f.is_file() or f.suffix.lower() not in AUDIO_EXT:
            continue
        base = f.stem
        m = re.search(r"_(\d+)$", base)           # dog_3 -> take 3 of "dog"
        take = int(m.group(1)) if m else 0
        text = base[: m.start()] if m else base
        key = normalize(text.replace("_", " "))
        if not key:
            skipped.append(f.name)
            continue
        found.setdefault(key, []).append((take, f.relative_to(root).as_posix()))

    manifest = {k: [p for _, p in sorted(v)] for k, v in sorted(found.items())}
    out = Path(a.out) if a.out else root / "audio-manifest.js"
    out.write_text("window.AudioManifest = " + json.dumps(manifest, indent=1, ensure_ascii=False) + ";\n",
                   encoding="utf-8")

    n_files = sum(len(v) for v in manifest.values())
    print(f"{n_files} audio files -> {len(manifest)} distinct texts -> {out}")
    multi = {k: len(v) for k, v in manifest.items() if len(v) > 1}
    if multi:
        print(f"{len(multi)} texts have retakes (e.g. " + ", ".join(f"{k}: {n}" for k, n in list(multi.items())[:4]) + ")")
    for s in skipped:
        print(f"  skipped (no usable text in the name): {s}")

    if a.strings:
        lines = [l.strip() for l in Path(a.strings).read_text(encoding="utf-8").splitlines()]
        keys = {normalize(l) for l in lines if l and not l.startswith("#")} - {""}
        missing = sorted(k for k in keys if k not in manifest and k.replace(" ", "") not in
                         {m.replace(" ", "") for m in manifest})
        print(f"\n{len(keys) - len(missing)} of {len(keys)} strings have audio; {len(missing)} will use TTS:")
        for k in missing:
            print("  -", k)


if __name__ == "__main__":
    main()
