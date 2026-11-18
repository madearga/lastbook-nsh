#!/usr/bin/env python3
"""Generate readers.batch.ts dari halaman yang sudah dirender + assets/books.yml.

Pakai (dari root repo): python3 tools/integrate.py
Input:
  assets/<id>/p-NN.png  : halaman hasil render sesi sourcing
  assets/books.yml      : metadata per dokumen (title, credit_en, credit_id)
Output:
  readers.batch.ts      : data buku batch (import asset + dimensi via PIL)
Bolong pada nomor halaman tidak masalah: yang dirender hanya halaman dirujuk,
tapi nomor halaman di nama file harus tetap nomor rujukan yang benar.
"""
import glob
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "readers.batch.ts")
META = os.path.join(ROOT, "assets", "books.yml")

if not os.path.exists(META):
    print("belum ada assets/books.yml — tidak ada yang diintegrasikan")
    sys.exit(0)

meta = {}
cur = None
for line in open(META):
    line = line.rstrip("\n")
    if not line or line.lstrip().startswith("#"):
        continue
    if not line.startswith(" ") and line.endswith(":"):
        cur = line[:-1]
        meta[cur] = {}
    elif ": " in line:
        k, v = line.strip().split(": ", 1)
        meta[cur][k] = v

HEADER = """// DIHASILKAN oleh tools/integrate.py — jangan edit tangan.
// Sumber: assets/books.yml + assets/<id>/p-NN.png
"""

TYPE = """export type BatchBook = {
  id: string;
  title: string;
  credit: { en: string; id: string };
  pages: { src: string; w: number; h: number }[];
};
"""

imports = []
bodies = []
count = 0
for bid, m in meta.items():
    files = glob.glob(os.path.join(ROOT, "assets", bid, "p-*.png"))
    if not files:
        print(f"  skip {bid}: belum ada halaman")
        continue
    items = []
    for f in files:
        n = int(re.search(r"p-(\d+)\.png$", f).group(1))
        items.append((n, f))
    items.sort()
    refs = []
    for i, (n, path) in enumerate(items):
        with Image.open(path) as im:
            w, h = im.size
        rel = os.path.relpath(path, ROOT).replace(os.sep, "/")
        v = f"bp{count:03d}"
        count += 1
        imports.append(f'import {v} from "./{rel}";')
        refs.append(f"    {{ src: {v}, w: {w}, h: {h} }},  // hal. {n}")
    title = m.get("title", bid).replace('"', '\\"')
    cen = m.get("credit_en", "").replace('"', '\\"')
    cid = m.get("credit_id", cen).replace('"', '\\"')
    bodies.append(
        "  {\n"
        f'    id: "{bid}",\n'
        f'    title: "{title}",\n'
        f'    credit: {{ en: "{cen}", id: "{cid}" }},\n'
        "    pages: [\n" + "\n".join(refs) + "\n    ],\n"
        "  },"
    )
    print(f"  ok {bid}: {len(items)} halaman")

if count == 0:
    print("tidak ada dokumen dengan halaman — readers.batch.ts kosong")
    body = "export const BATCH_BOOKS: BatchBook[] = [];\n"
else:
    body = (
        "\n".join(imports)
        + "\n\n"
        + TYPE
        + "\nexport const BATCH_BOOKS: BatchBook[] = [\n"
        + "\n".join(bodies)
        + "\n];\n"
    )

with open(OUT, "w") as f:
    f.write(HEADER + body)
print(f"generated {OUT} ({count} halaman)")
