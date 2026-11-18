import { expect, open, test } from "nsh/test";

const ID = { storage: { "lastbook.prefs": '{"lang":"id"}' } };
const openApp = () => open("./App.tsx", ID);

const WATER = "Get safe drinking water";
const SEARCH = "label:Cari topik";
const HAPPENING = "Apa yang terjadi?";

test("lists topics, opens one, goes back", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor(HAPPENING);
  expect(app.texts()).toContain("Batas");
  await app.press("‹ Semua topik");
  await app.waitFor(WATER);
});

test("home groups topics by urgency", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  expect(app.texts()).toContain("DARURAT SEKARANG");
  expect(app.texts()).toContain("BELAJAR & BERSIAP");
  expect(app.texts()).toContain("14 topik · semua tersedia tanpa internet");
});

test("search finds topics by Indonesian keyword", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.type(SEARCH, "gempa");
  await app.waitFor("Stay safe in an earthquake, storm, fire, flood or tsunami");
  expect(app.texts()).toContain("1 topik cocok");
  expect(app.shows(WATER)).toBe(false);
  // The clear button empties the field and brings every topic back.
  await app.press("label:Kosongkan pencarian");
  await app.waitFor(WATER);
  expect(app.value(SEARCH)).toBe("");
});

test("search with no match shows an empty state that recovers", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.type(SEARCH, "zzqx");
  await app.waitFor("Tidak ada topik untuk “zzqx”");
  expect(app.shows(WATER)).toBe(false);
  // A suggestion fills the query.
  await app.press("role:button[air]");
  await app.waitFor(WATER);
  expect(app.value(SEARCH)).toBe("air");
  await app.clear(SEARCH);
  await app.type(SEARCH, "zzqx");
  await app.press("Hapus pencarian");
  await app.waitFor(WATER);
  expect(app.value(SEARCH)).toBe("");
});

test("a match inside a situation opens the topic with that situation expanded", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.type(SEARCH, "tourniquet");
  await app.waitFor("Cocok: Bleeding, a cut or a wound");
  await app.press("Someone is hurt or sick");
  await app.waitFor("Stop bleeding with direct, firm pressure");
});

test("situation cards expand and collapse their readings", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor(HAPPENING);
  expect(app.shows("How long to boil water, and how to fix the taste")).toBe(false);
  await app.press("I can boil water");
  await app.waitFor("How long to boil water, and how to fix the taste");
  // Opening another closes the first: one situation at a time.
  await app.press("I have household bleach");
  await app.waitFor("Bleach drops per gallon and the smell test");
  await app.waitFor("How long to boil water, and how to fix the taste", { state: "gone" });
  await app.press("I have household bleach");
  await app.waitFor("Bleach drops per gallon and the smell test", { state: "gone" });
});

test("detail: section chips, long limits, text size and next topic", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor(HAPPENING);
  for (const nav of ["Situasi", "Batas", "Siapkan", "Pelajari"]) {
    expect(app.shows(`label:Ke bagian ${nav}`)).toBe(true);
  }
  await app.press("label:Ke bagian Batas");
  await app.press(HAPPENING);

  // Long limit lists show a preview and expand on demand.
  await app.press("Tampilkan semua (11)");
  await app.waitFor("Tampilkan lebih sedikit");
  await app.press("Tampilkan lebih sedikit");
  await app.waitFor("Tampilkan semua (11)");

  // Larger reading text is remembered on the device.
  await app.press("label:Teks besar");
  await app.waitUntil(() => JSON.parse(app.storage()["lastbook.prefs"] ?? "{}").large === true);

  // The last topic leads on to the first.
  await app.press("Komunikasi & arah — Communicate & find your way");
  await app.waitFor("Communicate & find your way");
  await app.press("‹ Semua topik");
  await app.waitFor("TERAKHIR DIBUKA");
  const prefs = JSON.parse(app.storage()["lastbook.prefs"]);
  expect(prefs.recent).toEqual(["comms", "water"]);
});

test("recently opened topics are one press away", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  expect(app.shows("TERAKHIR DIBUKA")).toBe(false);
  await app.press(WATER);
  await app.waitFor(HAPPENING);
  await app.press("‹ Semua topik");
  await app.waitFor("TERAKHIR DIBUKA");
  await app.press("role:button[/Air minum/]");
  await app.waitFor(HAPPENING);
});

test("language switch updates the whole UI and survives storage", async () => {
  const app = await openApp();
  await app.waitFor("14 topik · semua tersedia tanpa internet");
  await app.press("English");
  await app.waitFor("14 topics · all available offline");
  expect(app.shows("Periksa pembaruan")).toBe(false);
  await app.press("Indonesia");
  await app.waitFor("14 topik · semua tersedia tanpa internet");
  expect(JSON.parse(app.storage()["lastbook.prefs"]).lang).toBe("id");
});

test("reader opens FEMA 477 at the cited page and navigates", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor(HAPPENING);
  await app.press("I can boil water");
  await app.waitFor("Buka hal. 13");
  await app.press("Buka hal. 13");
  await app.waitFor("Hal. 13");
  await app.press("Berikutnya ›");
  await app.waitFor("Hal. 14");
  await app.press("‹ Sebelumnya");
  await app.waitFor("Hal. 13");
  await app.press("‹ Kembali");
  await app.waitFor(HAPPENING);
  expect(app.shows("Hal. 13")).toBe(false);
});

test("reader handles sparse pages by real page number", async () => {
  const app = await openApp();
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor(HAPPENING);
  await app.press("I can boil water");
  // "Buka hal. 23" also matches a Siapkan reading from another doc: take the first (WTND).
  await app.waitFor("Buka hal. 23 >> nth=0");
  await app.press("Buka hal. 23 >> nth=0");
  await app.waitFor("Hal. 23");
  // Pages 9..22 are not rendered: previous must be 8, not 22.
  await app.press("‹ Sebelumnya");
  await app.waitFor("Hal. 8");
  await app.press("‹ Kembali");
  await app.waitFor(HAPPENING);
});
