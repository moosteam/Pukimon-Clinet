import { atom } from "jotai";

export const backgroundColorAtom = atom<string>("");

export const myCardListAtom = atom<string[]>([
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
]);

export const enemyCardListAtom = atom<string[]>([
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
  "리자몽",
]);

export const myHandListAtom = atom<string[]>([]);
export const enemyHandListAtom = atom<string[]>([]);
export const myUsedListAtom = atom<string[]>([]);
export const enemyUsedListAtom = atom<string[]>([]);
