import { expect, open, test } from "nsh/test";

const WATER = "Get safe drinking water";
const SEARCH = "label:Cari topik";

test("lists topics, opens one, goes back", async () => {
  const app = await open("./App.tsx");
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor("What's happening?");
  expect(app.texts()).toContain("Limits");
  await app.press("‹ Semua topik");
  await app.waitFor(WATER);
});

test("home groups topics by urgency", async () => {
  const app = await open("./App.tsx");
  await app.waitFor(WATER);
  expect(app.texts()).toContain("DARURAT SEKARANG");
  expect(app.texts()).toContain("BELAJAR & BERSIAP");
  expect(app.texts()).toContain("14 topik · semua tersedia tanpa internet");
});

test("search finds topics by Indonesian keyword", async () => {
  const app = await open("./App.tsx");
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
  const app = await open("./App.tsx");
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
  const app = await open("./App.tsx");
  await app.waitFor(WATER);
  await app.type(SEARCH, "tourniquet");
  await app.waitFor("Cocok: Bleeding, a cut or a wound");
  await app.press("Someone is hurt or sick");
  await app.waitFor("Stop bleeding with direct, firm pressure");
});

test("situation cards expand and collapse their readings", async () => {
  const app = await open("./App.tsx");
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor("What's happening?");
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
  const app = await open("./App.tsx");
  await app.waitFor(WATER);
  await app.press(WATER);
  await app.waitFor("What's happening?");
  for (const nav of ["Situasi", "Batas", "Siapkan", "Pelajari"]) {
    expect(app.shows(`label:Ke bagian ${nav}`)).toBe(true);
  }
  await app.press("label:Ke bagian Batas");
  await app.press("What's happening?");

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
  const app = await open("./App.tsx");
  await app.waitFor(WATER);
  expect(app.shows("TERAKHIR DIBUKA")).toBe(false);
  await app.press(WATER);
  await app.waitFor("What's happening?");
  await app.press("‹ Semua topik");
  await app.waitFor("TERAKHIR DIBUKA");
  await app.press("role:button[/Air minum/]");
  await app.waitFor("What's happening?");
});
