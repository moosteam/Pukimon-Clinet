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

export const myBattlePokemonEnergyAtom = atom<number>(0);
export const myWatingPokemonEnergyAtom = atom<number[]>([0, 0, 0]);

export const myBattlePokemonHPAtom = atom<number>(0);
export const myWatingPokemonHPAtom = atom<number[]>([0, 0, 0]);

export const enemyBattlePokemonEnergyAtom = atom<number>(0);
export const enemyWatingPokemonEnergyAtom = atom<number[]>([0, 0, 0]);

export const enemyBattlePokemonHPAtom = atom<number>(0);
export const enemyWatingPokemonHPAtom = atom<number[]>([0, 0, 0]);

