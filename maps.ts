// Peta offline: katalog wilayah di GitHub, satu paket vektor per wilayah,
// disimpan di Storage app (kuota 5 MB; seluruh katalog ±0,8 MB).
// Catatan: fs/promises tidak tersedia di Android (nsh: native_files hanya desktop).
import { Storage } from "nsh";

const BASE = "https://raw.githubusercontent.com/madearga/lastbook-nsh/peta/";
const KEY = (id: string) => `peta/${id}`;

export type MapName = { id: string; en: string };
export type Bbox = [number, number, number, number]; // barat, selatan, timur, utara
export type MapRegion = { id: string; name: MapName; bbox: Bbox; file: string; bytes: number };
export type MapLine = { k: "coast" | "border" | "road" | "river"; p: number[] };
export type MapPlace = { n: string; p: [number, number]; r: number };
export type MapPack = { v: number; id: string; name: MapName; bbox: Bbox; lines: MapLine[]; places: MapPlace[] };

export async function catalogue(): Promise<MapRegion[]> {
  const res = await fetch(`${BASE}index.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = JSON.parse(await res.text());
  if (!Array.isArray(json?.regions)) throw new Error("katalog tidak dikenal");
  return json.regions as MapRegion[];
}

// id -> ukuran teks yang tersimpan (byte ASCII ≈ panjang string)
export async function saved(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const key of await Storage.keys()) {
    if (!key.startsWith("peta/")) continue;
    out[key.slice(5)] = (await Storage.getItem(key))?.length ?? 0;
  }
  return out;
}

export async function download(region: MapRegion): Promise<void> {
  const res = await fetch(`${BASE}${region.file}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  JSON.parse(text); // tolak berkas rusak sebelum disimpan
  await Storage.setItem(KEY(region.id), text);
}

export async function remove(region: MapRegion): Promise<void> {
  await Storage.removeItem(KEY(region.id)).catch(() => {});
}

export async function pack(region: MapRegion): Promise<MapPack> {
  const raw = await Storage.getItem(KEY(region.id));
  if (!raw) throw new Error("peta belum diunduh");
  return JSON.parse(raw) as MapPack;
}
