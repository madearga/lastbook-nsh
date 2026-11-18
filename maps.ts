// Peta offline: katalog wilayah di GitHub, satu paket vektor per wilayah,
// disimpan di folder data app (bukan di dalam paket OTA).
import fs from "fs/promises";
import path from "path";

const BASE = "https://raw.githubusercontent.com/madearga/lastbook-nsh/peta/";

export type MapName = { id: string; en: string };
export type Bbox = [number, number, number, number]; // barat, selatan, timur, utara
export type MapRegion = { id: string; name: MapName; bbox: Bbox; file: string; bytes: number };
export type MapLine = { k: "coast" | "border" | "road" | "river"; p: number[] };
export type MapPlace = { n: string; p: [number, number]; r: number };
export type MapPack = { v: number; id: string; name: MapName; bbox: Bbox; lines: MapLine[]; places: MapPlace[] };

const root = () => {
  const dir = process.dataDir;
  if (!dir) throw new Error("host tidak memberi folder data");
  return path.join(dir, "peta");
};
const local = (region: MapRegion) => path.join(root(), region.file);

export async function catalogue(): Promise<MapRegion[]> {
  const res = await fetch(`${BASE}index.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = JSON.parse(await res.text());
  if (!Array.isArray(json?.regions)) throw new Error("katalog tidak dikenal");
  return json.regions as MapRegion[];
}

// id -> ukuran file yang sudah ada di perangkat
export async function saved(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  try {
    for (const name of await fs.readdir(root())) {
      if (!name.endsWith(".json")) continue;
      out[name.slice(0, -5)] = (await fs.stat(path.join(root(), name))).size;
    }
  } catch {
    // folder belum ada: belum ada peta yang diunduh
  }
  return out;
}

export async function download(region: MapRegion): Promise<void> {
  await fs.mkdir(root(), { recursive: true });
  const res = await fetch(`${BASE}${region.file}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await fs.writeFile(local(region), Buffer.from(await res.arrayBuffer()));
}

export async function remove(region: MapRegion): Promise<void> {
  try {
    await fs.unlink(local(region));
  } catch {
    // sudah tidak ada
  }
}

export async function pack(region: MapRegion): Promise<MapPack> {
  return JSON.parse(await fs.readFile(local(region), "utf8")) as MapPack;
}
