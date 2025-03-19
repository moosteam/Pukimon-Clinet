import { atom } from "jotai";

export const backgroundColorAtom = atom<string>("");

export const myCardListAtom = atom<string[]>([
  "리자몽ex",
  "리자드",
  "파이리",
  "리자몽ex",
  "리자드",
  "파이리",
]);

export const enemyCardListAtom = atom<string[]>([
  "리자몽ex",
  "리자드",
  "파이리",
  "리자몽ex",
  "리자드",
  "파이리",
]);

export const myCardRearAtom = atom<number>(0);

export const myHandListAtom = atom<string[]>([]);
export const enemyHandListAtom = atom<string[]>([]);
export const myUsedListAtom = atom<string[]>([]);
export const enemyUsedListAtom = atom<string[]>([]);
