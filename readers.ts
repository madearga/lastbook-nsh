// Registry pembaca: semua dokumen PDF yang halamannya sudah dirender & ikut paket.
import { BOOKLET_H, BOOKLET_ID, BOOKLET_TITLE, BOOKLET_W, PAGES } from "./reader";

export type Book = {
  id: string;
  title: string;
  credit: { en: string; id: string };
  w: number;
  h: number;
  pages: string[];
};

const BOOKS: Record<string, Book> = {
  [BOOKLET_ID]: {
    id: BOOKLET_ID,
    title: BOOKLET_TITLE,
    credit: {
      en: "FEMA 477 · American Red Cross (2004) · public domain",
      id: "FEMA 477 · American Red Cross (2004) · domain publik",
    },
    w: BOOKLET_W,
    h: BOOKLET_H,
    pages: PAGES,
  },
};

export const bookOf = (doc: string): Book | undefined => BOOKS[doc];
