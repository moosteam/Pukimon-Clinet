import { useState } from "react";
import { useGameState } from "./useGameState";
import { useAtom } from "jotai";
import { isEnemyDrawCardAtom, isMyDrawCardAtom } from "../atom";

export function useCardManagement() {
  const {
    myCardList, setMyCardList,
    enemyCardList, setEnemyCardList,
    myHandList, setMyHandList,
    enemyHandList, setEnemyHandList,
    isNowTurnGiveEnergy, setIsNowTurnGiveEnergy
  } = useGameState();

  const [isMyDrawCard, setIsMyDrawCard] = useAtom(isMyDrawCardAtom);
  const [isEnemyDrawCard, setIsEnemyDrawCard] = useAtom(isEnemyDrawCardAtom);
  
  const [myTurn, setMyTurn] = useState(true);
  const [droppedCards, setDroppedCards] = useState<{ [key: string]: string }>({});

  const addCardToMyHand = (cycle: number) => {
    const initialCards = myCardList.slice(0, cycle);
    setMyCardList(prev => prev.slice(cycle));

    initialCards.forEach((card, index) => {
      setTimeout(() => {
        setIsMyDrawCard(prev => prev + 1)
        setMyHandList(prev => [...prev, card]);
      }, 200 * index);
    });
  };

  const addCardToEnemyHand = (cycle: number) => {
    const initialCards = enemyCardList.slice(0, cycle);
    setEnemyCardList(prev => prev.slice(cycle));

    initialCards.forEach((card, index) => {
      setTimeout(() => {
        setIsEnemyDrawCard(prev => prev + 1)
        setEnemyHandList(prev => [...prev, card]);
      }, 200 * index);
    });
  };

  const onEndTurn = (openingRotate: number, setOpeningRotate: (value: number) => void, 
                    finalGroundRotate: number, setFinalGroundRotate: (value: number) => void) => {
    setOpeningRotate(openingRotate + 180);
    setIsNowTurnGiveEnergy(false);
    setFinalGroundRotate(finalGroundRotate * -1);
    
    if (!myTurn) {
      if (myHandList.length === 0) {
        addCardToMyHand(4);
      } else {
        addCardToMyHand(1);
      }
    } else {
      if (enemyHandList.length === 0) {
        addCardToEnemyHand(4);

      } else {
        addCardToEnemyHand(1);
      }
    }
    
    setMyTurn(!myTurn);
  };

  return {
    myTurn,
    setMyTurn,
    droppedCards,
    setDroppedCards,
    addCardToMyHand,
    addCardToEnemyHand,
    onEndTurn,
    // 추가: myHandList와 enemyHandList 반환
    myHandList,
    enemyHandList
  };
}