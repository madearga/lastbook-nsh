# Batch C report — dok med-* (Hesperian / WHO / MSF / Sphere)

Tanggal: 2025-11-18 · Sumber PDF: hanya kanal resmi penerbit (hesperian.org Language Hub, cdn.who.int, iris.who.int, applications.emro.who.int, medicalguidelines.msf.org, sphere-standards-media S3, icrc.org, globalfirstaidcentre.org).
Metode: PDF diunduh ke `assets/pdf/<id>.pdf`, hanya halaman yang dirujuk dirender `pdftoppm -png -gray -scale-to-x 900` (retry 800 jika >250KB) → `assets/<id>/p-NN.png` (NN = nomor halaman sumber). Verifikasi isi per halaman dengan `pdftotext` + kata kunci dari label/note rujukan.

**Hasil akhir: 31 OK · 0 MISMATCH · 0 NOT FOUND · 6 SKIP (lisensi).**
Halaman dirender: 70 PNG (18,1 MB), cocok 70/70 dengan pasangan (dok, halaman) unik yang dirujuk dok OK. Ukuran halaman terkecil 131 KB, terbesar 583 KB; 24 halaman >250 KB setelah retry 800px (gambar/ilustrasi dominan) — sesuai instruksi retry, dibiarkan.

---

## OK — Hesperian (CC BY-SA per daftar lisensi yang disetujui; PDF resmi dari hesperian.org)

Base URL: `https://hesperian.org/wp-content/uploads/pdf/`

| id | publikasi (edisi file) | file sumber | URL | halaman dirender | verifikasi |
|---|---|---|---|---|---|
| med-443ae5cfaa6ecc68 | New Where There Is No Doctor — First Aid (advance chapters, rev. 2014) | en_nwtnd_2014_03g.pdf | …/en_nwtnd_2011/en_nwtnd_2014_03g.pdf | 1,2,5,9,12,13,14,16,19,22,24,28,29,30,36,38,51,55,57,60 (20) | OK, semua kata kunci cocok |
| med-953dfe1df69e0773 | New WTND — Water and Sanitation: Keys to Staying Healthy (rev. 2011) | en_nwtnd_2011_32b.pdf | …/en_nwtnd_2011/en_nwtnd_2011_32b.pdf | 3,4,5,6,8,23,24,25 (8 unik) | OK (p6 fly trap; p23 = 2 rujukan: boil + bleach chart) |
| med-8bd4770a63b99cc6 | New WTND — Belly Pain, Diarrhea, and Worms (rev. 2014) | en_nwtnd_2014_15d.pdf | …/en_nwtnd_2011/en_nwtnd_2014_15d.pdf | 20,22,25,29 | OK |
| med-d9ac20e4a9829e89 | New WTND — Caring for Children (2011) — bagian anak dehidrasi/diare | en_nwtnd_2011_28d.pdf | …/en_nwtnd_2011/en_nwtnd_2011_28d.pdf | 7,8 | OK (bukan chapter Belly Pain: halaman 7-8 chapter Belly Pain tidak cocok label; ditemukan di chapter Caring for Children, verifikasi teks: "signs that dehydration is getting worse", "avoid anti-diarrhea medicines") |
| med-a840a35b017c5748 | New WTND — Diabetes (rev. 2016) | en_nwtnd_2016_21a.pdf | …/en_nwtnd_2011/en_nwtnd_2016_21a.pdf | 2,3,31 | OK |
| med-f0d080c42e81de5f | New WTND — Heart Disease and High Blood Pressure (rev. 2018) | en_nwtnd_2018_14.pdf | …/en_nwtnd_2011/en_nwtnd_2018_14.pdf | 7,13,20 | OK |
| med-c8a380e07e30f3e3 | New WTND — Pregnancy and Birth (rev. 2014) | en_nwtnd_2014_26d.pdf | …/en_nwtnd_2011/en_nwtnd_2014_26d.pdf | 19 | OK (danger signs labor & birth) |
| med-27894636f99b2041 | New WTND — contents/front matter | en_nwtnd_2014_tocd.pdf | …/en_nwtnd_2011/en_nwtnd_2014_tocd.pdf | — (tanpa rujukan halaman) | PDF 5 hal; konten = planned contents, cocok note |
| med-ea4055db35ff180d | A Community Guide to Environmental Health (2012) — ch. 6 Protecting Community Water | en_cgeh_2012_06.pdf | …/en_cgeh_2012/en_cgeh_2012_06.pdf | 12,21,23,24,29,36 | OK |
| med-0e083d57bbe5021a | CGEH (2012) — ch. 7 Building Toilets | en_cgeh_2012_07.pdf | …/en_cgeh_2012/en_cgeh_2012_07.pdf | 12 | OK (simple trench latrine) |
| med-2ca695c9db63d020 | CGEH (2012) — ch. 15 Sustainable Farming | en_cgeh_2012_15.pdf | …/en_cgeh_2012/en_cgeh_2012_15.pdf | 20,22,33,35 | OK |
| med-e7a8569d25995a83 | CGEH (2012) — ch. 18 Solid Waste (compost/worm box + burn vs bury) | en_cgeh_2012_18.pdf | …/en_cgeh_2012/en_cgeh_2012_18.pdf | 15,24 | OK (compost di ch.18, bukan ch.15) |
| med-304a093a918ce1d6 | CGEH (2012) — ch. 5 Health Problems from Unsafe Water | en_cgeh_2012_05.pdf | …/en_cgeh_2012/en_cgeh_2012_05.pdf | 16 | OK ("Toxic Pollution in Water") |
| med-f65faa1b8cb4c8f9 | Disabled Village Children (ed. 2025) — ch. 24 Pressure Sores | en_dvc_2025_24.pdf | …/en_dvc_2025/en_dvc_2025_24.pdf | 1 | OK |
| med-2883a38b5d8e0b34 | Disabled Village Children (ed. 2025) — front matter/contents | en_dvc_2025_fm.pdf | …/en_dvc_2025/en_dvc_2025_fm.pdf | — | PDF 18 hal |
| med-d60d65e8fbbab512 | A Health Handbook for Women with Disabilities (2008) — ch. 15 Support for caregivers | en_WWD_2008_15.pdf | …/en_wwd_2008/en_WWD_2008_15.pdf | 1 | OK |
| med-683f49e28486c712 | A Workers' Guide to Health and Safety (2015) — ch. 12 Dust | en_wgthas_2015_12.pdf | …/en_wgthas_2015/en_wgthas_2015_12.pdf | 1 | OK (sanding, grinding, cutting) |
| med-4453675fb0dcc5d9 | Workers' Guide (2015) — ch. 18 PPE | en_wgthas_2015_18.pdf | …/en_wgthas_2015/en_wgthas_2015_18.pdf | 3 | OK ("Eye protection": glasses, goggles, face shields, rinse) |
| med-323535ddfa576a04 | Promoting Community Mental Health (2025) — ch. 4 People in crisis | en_pcmh_2025_04.pdf | …/en_pcmh_2025/en_pcmh_2025_04.pdf | 3,7 | OK (peer support lines; suicide — take seriously, ask directly) |
| med-0faf49d8c0bd8eb2 | Promoting Community Mental Health (2025) — ch. 2 | en_pcmh_2025_02.pdf | …/en_pcmh_2025/en_pcmh_2025_02.pdf | 8 | OK ("HOW TO Offer emotional support") |
| med-38945e48ce6b835c | Promoting Community Mental Health (2025) — contents | en_pcmh_2025_fm.pdf | …/en_pcmh_2025/en_pcmh_2025_fm.pdf | — | PDF 9 hal |

Catatan edisi Hesperian: note di topics menyebut "2017"/"2020 advance chapter" untuk beberapa dok; file resmi yang halamannya cocok adalah revisi yang ditandai nama file (rev. 2011–2018). Kesesuaian halaman diverifikasi per halaman via teks, jadi edisi yang dipakai adalah edisi yang memang dirujuk. Halaman hak cipta cetak Hesperian tertulis "All rights reserved", tetapi Hesperian menyediakan unduhan gratis resmi dan kontennya disetujui pemilik app sebagai CC BY-SA; kalau akan redistribusi lebih luas, konfirmasi lisensi langsung ke Hesperian.

## OK — WHO / WHO-ICRC (CC BY-NC-SA 3.0 IGO per daftar lisensi yang disetujui)

Base URL: `https://cdn.who.int/media/docs/default-source/wash-documents/` (WHO technical notes on WASH in emergencies, WHO 2013)

| id | publikasi | file sumber | halaman | verifikasi |
|---|---|---|---|---|
| med-7dfe05843f324a5d | WHO TN 1 — Cleaning and disinfecting wells | who-tn-01-…wells.pdf | — | PDF 4 hal |
| med-f23a61430c6e8cc0 | WHO TN 3 — Cleaning and disinfecting water storage tanks and tankers | who-tn-03-…tanks…pdf | — | PDF 4 hal |
| med-3a93d7d4c97d404d | WHO TN 5 — Emergency treatment of drinking-water at the point of use | who-tn-05-…point-of-use.pdf | 2,3,4 | OK (boil/chlorine; chlorine tablet guide; Box 5.1 handwashing 4 kali — persis) |
| med-c6ff5672759900f4 | WHO TN 7 — Solid waste management in emergencies | who-tn-07-…solid-waste…pdf | 1 | OK |
| med-9691a9d4a1231acf | WHO TN 9 — How much water is needed | who-tn-09-…water-is-needed.pdf | 1 | OK |
| med-ece1337373486dc8 | WHO TN 10 — Hygiene promotion in emergencies | who-tn-10-…hygiene…pdf | — | PDF 4 hal |
| med-e8a37d03a1e05532 | WHO TN 13 — Planning for excreta disposal in emergencies | who-tn-13-…planning…pdf | — | PDF 4 hal |
| med-d57916742d1eec74 | WHO TN 14 — Technical options for excreta disposal | who-tn-14-…options…pdf | 2,4 | OK (trench/family latrine p2; sealable bags + chemical toilets p4) |
| med-68adb7585ea5d7e0 | WHO-ICRC Basic Emergency Care: approach to the acutely ill and injured (2018) | iris.who.int/server/api/core/bitstreams/63432b9f-8808-44c5-9692-cea717c0cbda/content | 25 | OK ("Elements of the ABCDE approach"; lisensi CC BY-NC-SA 3.0 IGO tertulis di PDF) |
| med-e85fab191a13185e | WHO mhGAP Intervention Guide v2.0 — Arabic edition (WHO-EMRO, 2019) | applications.emro.who.int/docs/EMROPUB_2019_2606_AR.pdf | — | PDF 174 hal; CC BY-NC-SA 3.0 IGO tertulis di PDF |

Catatan WHO TN: teks di PDF 2013 memakai rumusan lama "© WHO 2013. All rights reserved" (sebelum kebijakan CC WHO); lisensi CC BY-NC-SA 3.0 IGO untuk publikasi WHO berlaku sesuai daftar lisensi yang disetujui pemilik app. BCEC dan mhGAP (2018/2019) menyatakan CC BY-NC-SA 3.0 IGO eksplisit.

## SKIP — 6 dokumen (publikasi © murni, tidak berlisensi CC)

1. **med-2e83e22162a9a006** — IFRC International First Aid, Resuscitation and Education Guidelines 2025 (594 hal; globalfirstaidcentre.org/wp-content/uploads/2026/05/Guidelines_2025.pdf). Bukti: "© International Federation of Red Cross and Red Crescent Societies, Geneva, 2025"; permintaan reproduksi → secretariat@ifrc.org. Tidak ada lisensi CC.
2. **med-99953e703fef507a** — MSF, Public Health Engineering in Precarious Situations, 2nd ed. 2010 (medicalguidelines.msf.org/sites/default/files/2022-06/Public_health_engineering_2010.pdf). Bukti: "© Médecins Sans Frontières – 2010. All rights reserved for all countries. No reproduction, translation and adaptation may be done without the prior permission of the Copyright owner."
3. **med-fe020d4fcf31e31a** — MSF, Clinical Guidelines — Diagnosis and treatment manual, December 2024 (medicalguidelines.msf.org/sites/default/files/2026-05/guideline-170-en.pdf). Bukti: "© Médecins Sans Frontières. All rights reserved… prior permission."
4. **med-f5c6cb5340c1fd3d** — MSF, Management of a Cholera Epidemic (medicalguidelines.msf.org/sites/default/files/pdf/guideline-800-en.pdf). Bukti: teks © yang sama.
5. **med-8884c589eaca56bd** — Sphere Association, The Sphere Handbook 2018 (sphere-standards-media.s3.eu-central-1.amazonaws.com/app/uploads/2026/06/26023354/Sphere-Handbook-2018-EN.pdf; halaman hak cipta + halaman resmi spherestandards.org/intellectual-property). Bukti: "All rights reserved… may be reproduced without fee for educational purposes… For copying in other circumstances, posting online, reuse in other publications or for translation or adaptation, prior written permission must be obtained." → mem-posting halaman online butuh izin tertulis; bukan CC. (CC BY 4.0 hanya untuk "resources" lain Sphere, bukan Handbook.)
6. **med-c1d102b9e751af81** — ICRC, First Aid in Armed Conflicts and Other Situations of Violence (2006, 286 hal; icrc.org/sites/default/files/external/doc/en/assets/files/other/icrc_002_0870.pdf). Bukti: hanya "© ICRC, April 2006", tanpa klausul izin/lisensi CC; halaman 233 (annex first aid bag) tidak dirender.

Semua 6 PDF di atas diunduh hanya untuk audit lisensi ke /tmp (di luar repo) — tidak ada file untuk id ini yang ditulis ke repo.

## Ringkasan ukuran

- 70 PNG halaman: 18,1 MB di `assets/med-*/p-NN.png`
- 31 PDF sumber di `assets/pdf/med-*.pdf`: 152 MB (arsip verifikasi; tidak dirujuk App.tsx/readers)
- Yang tidak dicek: tidak ada render ulang cek visual per halaman (OCR/teks saja); halaman >250KB tetap 800px sesuai instruksi dan tidak dipaksa lebih kecil

---

## Alternatif IFRC (tindak lanjut 2025-11-18)

Dicek: apakah edisi IFRC lama berlisensi lebih terbuka.

| edisi | file | lisensi tertulis |
|---|---|---|
| 2025 (dirujuk data, 594 hal) | Guidelines_2025.pdf | "© IFRC 2025 … reproduction should be directed to the IFRC" → izin diperlukan |
| 2020 EN (488 hal) | ifrc2020_en.pdf (globalfirstaidcentre.org, 6,7 MB) | "© IFRC, Geneva, 2020. **Copies of all or part of this study may be made for non-commercial use, providing the source is acknowledged.** Requests for commercial reproduction should be directed to the IFRC." |

Hasil: 2020 bukan CC, tetapi memberi izin salin **non-komersial + atribusi** (setara CC BY-NC tanpa ShareAlike). 2025 justru lebih ketat.

Namun nomor halaman tidak bisa dipindahkan begitu saja: 2020 = 488 hal, 2025 = 594 hal; topik yang sama jatuh di halaman berbeda.

| topik (halaman 2025) | halaman padanan di 2020 |
|---|---|
| recovery position (152) | 128–133 |
| CPR / chest compression (159) | 89–96 |
| burn, air mengalir (288–289) | 213–215 |
| anaphylaxis / epinephrine (376–377) | 279–287 |
| carbon monoxide (353) | 258–263 |
| heat stroke (446) | 332–336 |
| hypothermia (461) | 343–353 |
| traumatic event (486) | 366–385 |
| shock (388) | 288–289, 304–305 |
| spinal (307) | 128–133 |
| head injury (312) | 228–239 |
| poison (347–348) | 258–261 |

Konsekuensi: memakai edisi 2020 mengharuskan nomor `page` di `topics.ts` diubah per rujukan (file itu di luar wewenang saya), dan `credit` di `assets/books.yml` harus menyebut edisi 2020 — kalau tidak, app akan mengutip halaman yang salah.

## Blocker integrasi yang ditemukan (penting, berlaku untuk semua batch)

`App.tsx` memakai nomor halaman sumber sebagai **indeks array**, bukan label:

- baris 56–57: `canRead` → `item.page <= b.pages.length` (jumlah halaman yang dirender)
- baris 678: `book().pages[page() - 1]`

Karena konvensi batch hanya merender halaman yang dirujuk (bolong), tombol "buka halaman" hilang untuk setiap rujukan yang nomor halamannya lebih besar dari jumlah gambar. Terukur di batch C: **52 dari 78 rujukan berhalaman tidak bisa dibuka** (mis. `med-443ae5cfaa6ecc68`: 20 halaman dirender untuk rujukan sampai halaman 60 → 11 rujukan tidak terjangkau).

Dua jalan keluar, keduanya di file yang tidak boleh saya sentuh:
1. Simpan label halaman di `readers.batch.ts` (mis. `{ n: 60, src, w, h }`) dan cari berdasarkan label, bukan `pages[page-1]`; `canRead` ikut cek label.
2. Render rapat semua halaman sampai nomor rujukan terbesar — untuk batch C saja ±900 halaman/250 MB, dan untuk `med-2e83e22162a9a006` berarti 486 halaman.
