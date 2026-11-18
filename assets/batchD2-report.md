# Batch D2 report — bagian hash Batch D (16 dok OK dari 23 id)

Tanggal: 2025-11-18 · Sumber data: `/tmp/batchD_brief.txt` + `topics.ts` (read-only).
Metode: PDF diunduh ke `assets/pdf/<id>.pdf` (curl + UA browser; ready.gov/fema.gov/phmsa memblokir curl → via archive.org atau mirror), hanya halaman dirujuk dirender `pdftoppm -png -gray -scale-to-x 900` (retry 800 jika >250KB) → `assets/<id>/p-NN.png`. Verifikasi isi per halaman dengan `pdftotext` + kata kunci dari label/note rujukan.

**Hasil: 16 OK · 0 MISMATCH · 0 NOT FOUND · 7 SKIP (lisensi) · 0 WEB.**
Halaman dirender: 23 PNG, 7,4 MB. PDF tersimpan: 16 file, 45,2 MB (terbesar ERG 2024 11,6 MB).
Semua halaman punya text layer dan diverifikasi kata kunci (tidak ada image-only di dok OK).

## OK — diunduh + dirender + terverifikasi (urut rujukan terbanyak)

| id | publikasi (edisi) | URL sumber | lisensi | halaman | verifikasi |
|---|---|---|---|---|---|
| 31a7235cab119ccb | USDA Complete Guide to Home Canning, Guide 1 (rev. 07-2015, 40 pp) | nchfp.uga.edu/papers/guide/GUIDE01_HomeCan_rev0715.pdf (resmi NCHFP) | US Gov / public domain | 8,17,26,27 | 4/4: "Food acidity and processing methods" (p8), "Recommended canners" (p17), "Storing/Identifying…spoiled" (p26), detoksifikasi/botulism (p27) |
| 2848f4bffb8109 | FEMA "How to Prepare for a Wildfire" (03-2014 508c, 13 pp) | mirror belmont-ma.gov/DocumentCenter/View/410 dari fema.gov/media-library-data/…/how_to_prepare_wildfire_033014_508.pdf | US Gov | 5,7,8,9 | 4/4: NWR/evacuation routes (p5), Go Bag + "Five Ps" (p7), "lights on…garage door openers…help firefighters" (p8), "When driving away…smoke…trapped" (p9) |
| 2c619f4fe19187 | FEMA P-1093 "Know Your Alerts and Warnings" (Juli 2018, 4 pp) | web.archive.org capture ready.gov/…/ready_know-your-alerts-and-warnings.pdf (20211230145111) | US Gov | 1,2 | 2/2: WEA + "car, solar-powered, or hand crank charger" (p1), NOAA Weather Radio + SAME (p2) |
| bf9e99715ecdde | USGS FS-035-01 "Finding Your Way with Map and Compass" (2001, 2 pp) | pubs.usgs.gov/fs/2001/0035/report.pdf (resmi) | US Gov | 1 | OK: warna/simbol topo, scale, bearing |
| 8bb952fd2f238b | FM 21-76 US Army Survival Manual (1992, edisi abridged 233 pp) | archive.org/details/Fm21-76SurvivalManual (pemindaian warga, tanpa © penerbit) | US Gov (konten Army) | 109,200 | 2/2: Ch.10 Poisonous Plants "Ingestion/contact/absorption" (p109), Ch.19 Signaling "fire, light, contrast, patterns" (p200) |
| a8defaa10a263bba | USDA Complete Guide to Home Canning, front section (rev. 2015, 193 pp) | mirror healthycanning.com/…/USDA-Complete-Guide-to-Home-Canning-2015-revision.pdf | US Gov | 5 | OK: "For Safety's Sake" + peringatan botulisme + checklist boiling |
| 4bd70335aa10ef | NWS brochure "The Voice of NOAA's National Weather Service" (NOAA/PA 94062 rev. Okt 2021, 4 pp) | weather.gov/media/dsb/NWR_Brochure_NOAA_PA_94062.pdf (resmi) | US Gov (NOAA) | 3 | OK: daftar frekuensi 162.x, "coverage…40 miles", "receiver should be tested" |
| e74ed9511d24c6 | FEMA P-1095 "Family Emergency Communication Plan" form isian (2017, 2 pp) | web.archive.org capture ready.gov/…/family-communication-plan_fillable-card.pdf (2025) | US Gov | 1 | OK: household info + school/workplace sections |
| 68b98222512b05 | NWS "Tsunami Safety" one-pager (2019, 2 pp) | weather.gov/media/owlie/TsunamiSafety-OnePager-02-28-2019.pdf (resmi) | US Gov (NOAA) | 1 | OK: "Plan to evacuate on foot", natural vs official warning, "cancellation…does not mean the danger has passed" |
| 53da8d3443e35e | FEMA Ready "Commuter Emergency Plan" form isian (±2013, 1 pp) | mirror puyallupwa.gov/DocumentCenter/View/12115 dari ready.gov | US Gov | 1 | OK: rute normal/alternatif, bus/train/ferry, taxi/bus |
| a7a60dbbb26052 | "BE PREPARED FOR A TSUNAMI" hazard info sheet (ready.gov 2024-08, 2 pp) | web.archive.org capture ready-gov_tsunami_info-sheet.pdf (20250103060842) | US Gov | 2 | OK: peta zona & rute evakuasi, "natural signs or an official warning", bagian AFTER |
| dee61b224a1299 | "BE PREPARED FOR A FLOOD" FEMA V-1005 (Mar 2018, 2 pp) | mirror uslweb.com/library/files/ready-gov-flood-hazard-info-sheet.pdf | US Gov | 2 | OK: BEFORE/DURING/AFTER + "FEMA's Flood Map Service Center" |
| 2aadecc420798e | "BE PREPARED FOR A LANDSLIDE" FEMA V-1007 (Mei 2018, 2 pp) | mirror uslweb.com/library/files/ready-gov-landslide-hazard-info-sheet.pdf | US Gov | 1 | OK: "Landslides cause 25–50 deaths…", mudflow, tanda peringatan |
| 11c57afd0384b8 | USGS "Topographic Map Symbols" (GIP, 4 pp) | pubs.usgs.gov/gip/TopographicMapSymbols/topomapsymbols.pdf (resmi) | US Gov | 1 | OK: apa itu peta topo, contour, simbol standar |
| d2213d245d582c | USFA "5 Steps to Portable Generator Safety" (1 pp) | usfa.fema.gov/downloads/pdf/publications/5-step-to-portable-generator-safety-handout.pdf (resmi) | US Gov | 1 | OK: outdoor/ventilasi, CO alarm, jangan isi ulang saat menyala |
| e02dc81261aae7 | Emergency Response Guidebook 2024 (US DOT/PHMSA, 392 pp) | web.archive.org capture phmsa.dot.gov/…/ERG2024-Eng-Web-a.pdf (20250206085740) | US Gov | 358 | OK: "CONSIDERATIONS FOR LITHIUM BATTERY AND (EV) FIRES", thermal runaway, swelling/odor/leaking |

## SKIP — lisensi (7)

| id | publikasi | alasan |
|---|---|---|
| 255b448d041a65 | American Red Cross "Be Prepared" guide | © American Red Cross, bukan domain publik (pola sama dgn batch 1) |
| cae1149a714fc3 | Red Cross sheet (2014) high-rise fire | © American Red Cross |
| 4f6b406c191181 | ARRL ARES Manual (2015) | PDF tertulis "Copyright © 2015 ARRL… All rights reserved… except by written permission" |
| c91b2af6713df7 | ARRL ARES Field Resources Manual (rev. 2019) | karya ARRL tanpa pernyataan izin ulang → hak cipta berlaku; ragu → SKIP |
| a922465bee681e | ARRL Quickstart Guide (berisi iklan) | © ARRL, tanpa izin ulang |
| 89c91ae1008675d0 | Belize Energy Unit "Energy Access Handbook No. 2: Stand-alone Solar Systems" (24 pp, konten cocok dgn rujukan p11/15/16) | karya pemerintah asing, tidak ada pernyataan lisensi apa pun di PDF → ragu → SKIP |
| 7b1d42bb203e3a2f | UGA Extension/NCHFP "Preserving Food: Using Pressure Canners" (Circular C1334-02, 2025, 7 pp; p3 cocok) | publikasi University of Georgia Cooperative Extension, tidak ada pernyataan domain publik/izin ulang; konten USDA dalam PDF berbeda paginasi dgn Guide 1 |

## Catatan integrasi
- Page number = halaman PDF edisi yang diunduh dan sudah dicocokkan kata kunci per halaman; edisi dipilih agar cocok dgn rujukan (mis. FM 21-76 abridged: plants p109, signaling p200; Guide 1 standalone: 1-N = halaman PDF).
- 9 PNG tetap >250 KB setelah retry 800 px (halaman penuh ilustrasi/tabel: USDA p17/26/27, USGS x2, NWR p3, dll.) — dibiarkan, pola sama dgn batch sebelumnya.
- ready.gov/fema.gov/phmsa/dnr.wa.gov memblokir curl (403/418); archive.org kadang rate-limit (429) — unduhan wayback dilakukan dua-langkah (cdx/redirect lalu fetch) dgn jeda.
