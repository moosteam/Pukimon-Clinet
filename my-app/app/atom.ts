import { atom } from "jotai";

export const myBattleAtom = atom<string>("myBattle");
export const enemyBattleAtom = atom<string>("enemyBattle");

export const isNowTurnGiveEnergyAtom = atom<boolean>(true);

export const myCardListAtom = atom<string[]>([
  "파이리",
  "파이리",
  "파이리",
  "파이리",
  "파이리",
  "파이리",
]);

export const enemyCardListAtom = atom<string[]>([
  "파이리",
  "파이리",
  "파이리",
  "파이리",
  "파이리",
  "파이리",
]);

export const myCardRearAtom = atom<number>(0);

export const myHandListAtom = atom<string[]>([]);
export const enemyHandListAtom = atom<string[]>([]);
export const myUsedListAtom = atom<string[]>([]);
export const enemyUsedListAtom = atom<string[]>([]);

export const myBattlePokemonEnergyAtom = atom<number>(0);
export const myWaitingPokemonEnergyAtom = atom<number[]>([0, 0, 0]);

export const myBattlePokemonHPAtom = atom<number>(0);
export const myWaitingPokemonHPAtom = atom<number[]>([0, 0, 0]);

export const enemyBattlePokemonEnergyAtom = atom<number>(0);
export const enemyWaitingPokemonEnergyAtom = atom<number[]>([0, 0, 0]);

export const enemyBattlePokemonHPAtom = atom<number>(0);
export const enemyWaitingPokemonHPAtom = atom<number[]>([0, 0, 0]);

// Add score atoms for tracking defeated Pokémon
export const myGameScoreAtom = atom<number>(0);
export const enemyGameScoreAtom = atom<number>(0);

