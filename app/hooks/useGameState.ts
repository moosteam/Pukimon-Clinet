import { useAtom } from "jotai";
import * as Atoms from '../atom';

export function useGameState() {
  const [myCardList, setMyCardList] = useAtom(Atoms.myCardListAtom);
  const [enemyCardList, setEnemyCardList] = useAtom(Atoms.enemyCardListAtom);
  const [myHandList, setMyHandList] = useAtom(Atoms.myHandListAtom);
  const [enemyHandList, setEnemyHandList] = useAtom(Atoms.enemyHandListAtom);
  const [myUsedList, setMyUsedList] = useAtom(Atoms.myUsedListAtom);
  const [enemyUsedList, setEnemyUsedList] = useAtom(Atoms.enemyUsedListAtom);
  const [myBattlePokemonEnergy, setMyBattlePokemonEnergy] = useAtom(Atoms.myBattlePokemonEnergyAtom);
  const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(Atoms.myBattlePokemonHPAtom);
  const [enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy] = useAtom(Atoms.enemyBattlePokemonEnergyAtom);
  const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(Atoms.enemyBattlePokemonHPAtom);
  const [myWaitingHP, setMyWaitingHP] = useAtom(Atoms.myWaitingPokemonHPAtom);
  const [myWaitingEnergy, setMyWaitingEnergy] = useAtom(Atoms.myWaitingPokemonEnergyAtom);
  const [enemyWaitingHP, setEnemyWaitingHP] = useAtom(Atoms.enemyWaitingPokemonHPAtom);
  const [enemyWaitingEnergy, setEnemyWaitingEnergy] = useAtom(Atoms.enemyWaitingPokemonEnergyAtom);
  const [isNowTurnGiveEnergy, setIsNowTurnGiveEnergy] = useAtom(Atoms.isNowTurnGiveEnergyAtom);
  const [myGameScore, setMyGameScore] = useAtom(Atoms.myGameScoreAtom);
  const [enemyGameScore, setEnemyGameScore] = useAtom(Atoms.enemyGameScoreAtom);

  return {
    myCardList, setMyCardList,
    enemyCardList, setEnemyCardList,
    myHandList, setMyHandList,
    enemyHandList, setEnemyHandList,
    myUsedList, setMyUsedList,
    enemyUsedList, setEnemyUsedList,
    myBattlePokemonEnergy, setMyBattlePokemonEnergy,
    myBattlePokemonHP, setMyBattlePokemonHP,
    enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy,
    enemyBattlePokemonHP, setEnemyBattlePokemonHP,
    myWaitingHP, setMyWaitingHP,
    myWaitingEnergy, setMyWaitingEnergy,
    enemyWaitingHP, setEnemyWaitingHP,
    enemyWaitingEnergy, setEnemyWaitingEnergy,
    isNowTurnGiveEnergy, setIsNowTurnGiveEnergy,
    myGameScore, setMyGameScore,
    enemyGameScore, setEnemyGameScore
  };
}