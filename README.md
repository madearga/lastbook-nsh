# Lastbook Mobile

**Lastbook untuk Android & iOS** — perpustakaan survival offline: pertolongan pertama, air bersih, makanan, perbaikan, tenaga listrik, komunikasi darurat, kesiapsiagaan.

Dibangun dengan [nsh](https://github.com/longbridge/nsh) (UI TSX + runtime native) di atas **data topik asli** [lastbook](https://github.com/Immortal-Protocols/lastbook) (MIT). Tujuan: semua yang ada di [lastbook.org](https://lastbook.org) — yang hari ini hanya Mac/Windows/Linux — bisa dibuka dari HP, offline.

## Status

| Layar | Status |
|---|---|
| Daftar topik (14 topik asli) | ✅ jalan |
| Detail topik: "What's happening?", Limits, Prepare, Learn | ✅ jalan |
| Reader PDF (halaman manual) | ⬜ layar berikutnya |
| Peta offline | ⬜ |
| Chat AI lokal | ⬜ |
| Paket konten (signed packages nsh) | ⬜ |

## Coba di HP Android

1. Unduh `Lastbook.apk` (dibagikan via Telegram / rilis repo ini).
2. Buka file → izinkan "instal app tidak dikenal" → install. Saat ini APK di-sign debug key.
3. App berjalan sepenuhnya offline.

## Struktur

```
App.tsx        UI: daftar topik → detail (choices, limits, prepare, learn)
topics.ts      data topik asli dari content/topics/*.json lastbook (MIT)
nsh.json       manifest app nsh
scripts/android-gate.sh  build APK di Linux (teruji)
docs/gate-and-plan.md    hasil feasibility gate + rencana port lengkap
```

## Build

Perlu Linux/Mac dengan Rust stable ≥ 1.97 dan Android SDK:

```sh
./scripts/android-gate.sh          # bangun toolchain pertama kali (NDK, build-tools 35, libclang)
nsh package . --target android     # → .nsh/out/Lastbook.apk
```

Layar berjalan juga di desktop: `nsh dev` atau `cargo xtask run` dari checkout nsh.

## Rencana teknis singkat

- UI = TSX per layar, satu commit per layar (strangler — app desktop lastbook tetap jalan).
- Core Rust `lastbook-core` (rusqlite, katalog, PDF→gambar) menyusul via pola `examples/rust-exports` nsh.
- Konten besar (manual GB-an, video, peta) dikirim sebagai signed package nsh — unduh dalam app, tanpa rilis ulang.
- Detail lengkap + bukti gate: [`docs/gate-and-plan.md`](docs/gate-and-plan.md).

## Lisensi

Repo ini **MIT**. Data & konten: dari [lastbook](https://github.com/Immortal-Protocols/lastbook) (**MIT**). UI runtime: [nsh](https://github.com/longbridge/nsh) (**Apache-2.0**).
