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

export const isMyDrawCardAtom = atom<number>(0); // Add this atom to track the turn
export const isEnemyDrawCardAtom = atom<number>(0); // Add this atom to track the turn

// 새로 추가하는 atom들
export const showAlertAtom = atom<boolean>(false);
export const isDraggingAtom = atom<boolean>(false);
export const originalRotateAtom = atom<number>(0);
export const myTurnAtom = atom<boolean>(true);
export const droppedCardsAtom = atom<{ [key: string]: string }>({});

// useAnimationSequence 훅에서 사용하는 atom들
export const openingRotateAtom = atom<number>(70);
export const openingScaleAtom = atom<number>(0.5);
export const openingOpacityAtom = atom<number>(100);
export const secondaryMyCardRotateAtom = atom<number>(-30);
export const secondaryMyCardPositionAtom = atom<number>(-130);
export const startVideoAtom = atom<boolean>(false);
export const coinTextOpacityAtom = atom<number>(0);
export const coinScaleAtom = atom<number>(1);
export const finalGroundRotateAtom = atom<number>(0);
