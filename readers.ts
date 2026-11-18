import type { ImageAsset } from "nsh";
// Registry pembaca: semua dokumen PDF yang halamannya sudah dirender & ikut paket.
// readers.batch.ts dihasilkan otomatis oleh tools/integrate.py — jangan edit tangan.
import { BOOKLET_H, BOOKLET_ID, BOOKLET_TITLE, BOOKLET_W, PAGES } from "./reader";
import { BATCH_BOOKS } from "./readers.batch";

export type BookPage = { src: string | ImageAsset; n: number; w: number; h: number };
export type Book = {
  id: string;
  title: string;
  credit: { en: string; id: string };
  pages: BookPage[];
};

const BOOKS: Record<string, Book> = {
  [BOOKLET_ID]: {
    id: BOOKLET_ID,
    title: BOOKLET_TITLE,
    credit: {
      en: "FEMA 477 · American Red Cross (2004) · public domain",
      id: "FEMA 477 · American Red Cross (2004) · domain publik",
    },
    pages: PAGES.map((src, i) => ({ src, n: i + 1, w: BOOKLET_W, h: BOOKLET_H })),
  },
};

const BATCH: Record<string, Book> = {};
for (const b of BATCH_BOOKS) BOOKS[b.id] = b;

export const bookOf = (doc: string): Book | undefined => BOOKS[doc];
