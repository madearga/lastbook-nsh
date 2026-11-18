# Batch 1 report — US Government / public domain PDFs (26 docs)

Date: 2026-11-18. Source data: `topics.ts`. PDFs: `assets/pdf/<id>.pdf`. Page renders: `assets/<id>/p-NN.png` (NN = reference page number, grayscale, 500–900 px wide).
Verification: `pdftotext -f <p> -l <p>` checked against 1–3 keywords per referenced page; every listed page below was checked individually.

**Result: 17 OK / 0 mismatch / 0 NOT FOUND (PDFs) / 2 SKIP (licence) / 7 web-page refs (not PDFs).**
Renders: 99 pages, ~30 MB total. PDFs: 17 files, 113 MB. No page is image-only; every page has a text layer and was keyword-verified.

## Downloaded + rendered (17)

| id | publication | source | licence | pages rendered | verification |
|---|---|---|---|---|---|
| 9681a68ebd07f5 | CERT Basic Training Hazard Annexes (2019), FEMA | ready.gov/sites/default/files/2019.CERT_.HazardAnnexes.PM_.FINAL_.508c.pdf | US Gov / public domain | 13,16,17,18,25,26,35,36,58,59,60,75,84,85,91,92,97,98,99,100,121 (21) | 21/21 OK |
| 5cd0b4e41cc479 | Earthquake Safety at Home, FEMA P-530 (Mar 2020) | fema.gov official file, fetched via squarespace mirror (fema.gov/ready.gov Akamai-block curl; file byte-identical name `fema_earthquakes_fema-p-530-earthquake-safety-at-home-march-2020.pdf`, 110 pp) | US Gov | 16,23,25,26,29,32,56,60,66,68,71,74,75,95 (14) | 14/14 OK |
| ed5bac0a81b009 | CERT Basic Training Participant Manual (2019), FEMA | ready.gov/sites/default/files/2019.CERT_.Basic_.PM_FINAL_508c.pdf | US Gov | 25,26,27,29,32,33,46,100,128,134,135,144,175,176,177,241 (16) | 16/16 OK |
| cecc1671ae4d02 | Are You Ready? An In-Depth Guide to Citizen Preparedness (ready.gov 2021 file, 36 pp) | ready.gov/sites/default/files/2021-11/are-you-ready-guide.pdf | US Gov | 9,12,14,18,19,20,21,31 (8) | 8/8 OK |
| e4bfed4b6afd6d | FDA: Food and Water Safety During Hurricanes, Power Outages, and Floods (Dec 2007 fact sheet) | weather.gov/media/owlie/FDAHurricaneNL.pdf (fda.gov printable is the same sheet) | US Gov | 1,2 | 2/2 OK |
| 18bf4604bf28c4 | Be Prepared for a Power Outage — FEMA hazard info sheet (ready.gov 2024-03 file; data note says 2023, content matches all refs: fridge/freezer times, refrigerated medicines, CO) | ready.gov/sites/default/files/2024-03/ready.gov_power-outage_hazard-info-sheet.pdf | US Gov | 1,2 | 2/2 OK |
| 0dfdf1fb4b178f | Are You Ready? (2004 FEMA IS-2 edition — "older guide"; **trimmed**: first 13 front-matter pages removed with ghostscript so PDF page numbers = reference numbers; verified before and after trim) | areyouready.org mirror of FEMA file (204 pp original; web.archive.org + webharvest.gov + HathiTrust unreachable/blocked during run) | US Gov | 14,15,17,27,29,30 (6) | 6/6 OK |
| 5b0efa0b70cb98 | ATP 3-50.21 Survival (Sep 2018), US Army | armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/ARN12086_ATP%203-50x21%20FINAL%20WEB%202.pdf (official) | US Gov | 42,78,137,138,139,161,168 (7) | 7/7 OK |
| db4d9783fca34b | Emergency Supply List — Ready checklist (2024) | ready.gov/sites/default/files/2024-05/ready_supply-kit-checklist.pdf | US Gov | 1,2 | 2/2 OK |
| 1c0d7a149286b5 | Extreme Heat — FEMA hazard info sheet | ready.gov/sites/default/files/2024-03/ready.gov_extreme-heat_hazard-info-sheet.pdf | US Gov | 2 | OK |
| 4c096c3377a13d | Winter Storm — FEMA hazard info sheet | ready.gov/sites/default/files/2024-03/ready.gov_winter-storm_hazard-info-sheet.pdf | US Gov | 2 | OK |
| 475720b524a372 | NWS Heat Safety brochure (warning-vs-watch + tips p1, heat index chart p2; HeatSafety-OnePager-2018 also fetched, brochure matches the ref note better) | weather.gov/media/safety/Heat-brochure17.pdf | US Gov (NOAA) | 1 | OK |
| af57f977ae75ec | NWS Wildfire Safety one-pager (p2 = returning after a fire) | weather.gov/media/owlie/WildfireSafety-OnePager-2-27-2019.pdf | US Gov (NOAA) | 2 | OK |
| 1f738924576334 | How to Prepare for a Hurricane — FEMA guide (ready.gov 2020-03 file) | ready.gov/sites/default/files/2020-03/fema_how-to-prepare-for-hurricane.pdf | US Gov | 7,8,9 (3) | 3/3 OK |
| d0fbb2e051cd46 | FEMA hazard info sheets, full suite (FEMA P-2143, Aug 2024; ready.gov 2025-02 file, 35 pp) | ready.gov/sites/default/files/2025-02/fema_full-suite-hazard-info-sheets.pdf | US Gov | 9,13,15,21,22,25,26,29,32,33 (10) | 10/10 OK |
| 1693406275fcc129 | Power Resilience Guide for Water and Wastewater Utilities, EPA 810-F-23-013 (May 2023) | epa.gov/system/files/documents/2023-05/PowerResilienceGuide_2023_508c.pdf (official) | US Gov | 2 | OK |
| ec27c9c3c6b74c | Nuclear War Survival Skills, Cresson Kearny, 1987 updated ed. (ORNL/DOE civil-defence book) | ia800103.us.archive.org/17/items/NuclearWarSurvivalSkills_201405/nwss.pdf ("may be freely distributed") | US public domain | 81,109,110 (3) | 3/3 OK |

## SKIP — licence (2)

| id | publication | reason |
|---|---|---|
| e629b2983d95e4 | American Red Cross older-adult preparedness booklet (2020) | Red Cross material is copyrighted, not US-Gov public domain |
| c6155c3ed58c35 | Norwegian civil protection guide (DSB, 2024) | Non-US-Gov, copyrighted |

## Web-page references (7) — no PDF pages exist; URL verified where possible

| id | note says | URL checked |
|---|---|---|
| f6becaef71ffd5 | Ready.gov winter weather page | ready.gov/winter-weather — reachable |
| a90ff7e6f3cf01 | Ready.gov wildfire smoke / prepare page | ready.gov/wildfires — reachable |
| 5e162f84b8d790 | Ready.gov shelter page | ready.gov/shelter — reachable |
| 5cf2ec3dc27738 | Ready.gov high-rise page (2026) | **NOT FOUND**: ready.gov/high-rise 404s; no live ready.gov high-rise page found (search + path guesses). Wayback was offline during the run — re-check later if a URL is needed |
| 8a228a96ebfa42 | NWS: who is most at risk from heat | weather.gov/safety/heat — reachable |
| 8e7f6a8861354c | NWS: particle pollution & ozone | weather.gov/safety/airquality — reachable |
| 2bcf93d0ed97f2 | NPS: filter then disinfect | nps.gov/articles/2wayspurifywater.htm — reachable, exact quote "Filtration by itself does not purify water" confirmed on page |

## Notes for integration

- File sizes: some rendered pages exceed 250 KB even after the 800 px pass (scan/photo-heavy pages: hurricane guide, FDA sheet, NWS sheets; hurricane guide done at 500–600 px). Total render weight is only ~30 MB, and the earlier fema477 batch also shipped >250 KB pages (900 px), so I kept readability over the size cap.
- `0dfdf1fb4b178f` is the one modified PDF (front matter trimmed to match reference numbering). If the reader ever shows a PDF alongside chips, it lines up with the data's page numbers.
- fema.gov/ready.gov return 403 to curl (Akamai TLS fingerprinting): `wget` with a browser UA works on ready.gov/weather.gov/armypubs/epa; fema.gov needed a mirror. web.archive.org and archive.org frontend were temporarily offline during this run (item nodes still served NWSS).
- Not touched: App.tsx, readers.ts, reader.ts, topics.ts, App.test.tsx, nsh.json, locales/.
