"use client"

import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { OpeningOverlay } from "./components/AnimationManager/OpeningOverlay";
import { CoinAnimation } from "./components/AnimationManager/CoinAnimation";
import { PlayerCards } from "./components/Card/PlayerCards";
import { GameBoard } from "./components/BattleField/GameBoard";
import { FieldCards } from "./components/BattleField/FieldCards";
import { Hand } from "./components/Area/Hand";
import { Waiting } from "./components/Area/Waiting";
import { data } from "./data/cards";
// 
import * as Atoms from './atom';

interface EndTurnButtonProps {
  onEndTurn: () => void;
}

export default function App({
  children
}: Readonly<{
  children?: React.ReactNode;
}>) {
  // 오프닝을 위한 변수들
  const [openingRotate, setOpeningRotate] = useState(70);
  const [openingScale, setOpeningScale] = useState(0.5);
  const [openingOpacity, setOpeningOpacity] = useState(100);
  const [secondaryMyCardRotate, setSecondaryMyCardRotate] = useState(-30);
  const [secondaryMyCardPosition, setSecondaryMyCardPosition] = useState(-130);
  const [startVideo, setStartVideo] = useState(false);
  const [coinTextOpacity, setCoinTextOpacity] = useState(0);
  const [finalGroundRotate, setFinalGroundRotate] = useState(0);

  //#region atom
  const [myCardList, setMyCardList] = useAtom(Atoms.myCardListAtom)
  const [enemyCardList, setEnemyCardList] = useAtom(Atoms.enemyCardListAtom)
  const [myHandList, setMyHandList] = useAtom(Atoms.myHandListAtom)
  const [enemyHandList, setEnemyHandList] = useAtom(Atoms.enemyHandListAtom)
  const [myUsedList, setMyUsedList] = useAtom(Atoms.myUsedListAtom)
  const [enemyUsedList, setEnemyUsedList] = useAtom(Atoms.enemyUsedListAtom)
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
  //#endregion

  useEffect(() => {
    // 클라이언트 사이드 렌더링 확인

    // 초기 상태 설정
    setOpeningRotate(120);
    setOpeningScale(1.5);
    setOpeningOpacity(0);

    // 애니메이션 시퀀스 정의
    const animationSequence = [
      {
        time: 0,
        action: () => {
          setOpeningRotate(0)
          setOpeningScale(1)
          setSecondaryMyCardRotate(-20);
          setSecondaryMyCardPosition(0);
        }
      },
      {
        time: 3200/100,
        action: () => {
          setSecondaryMyCardRotate(20);
          setSecondaryMyCardPosition(60);
          setOpeningScale(1.6);
        }
      },
      {
        time: 3600/100,
        action: () => {
          setStartVideo(true);
        }
      },
      {
        time: 5000/100,
        action: () => {
          setOpeningScale(2.4);
          setCoinTextOpacity(100);
        }
      },
      {
        time: 7000/100,
        action: () => {
          setOpeningScale(1);
          setCoinTextOpacity(0);
        }
      },
      {
        time: 7500/100,
        action: () => {
          setStartVideo(false);
        }
      },
      {
        time: 8500/100,
        action: () => {
          setFinalGroundRotate(12);
        }
      }
    ];
    // 타이머 설정 및 실행
    const timers = animationSequence.map(({ time, action }) => {
      return setTimeout(action, time);
    });

    // 클린업: 모든 타이머 제거
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    // 10초 후에 실행될 타이머 설정
    const timer = setTimeout(() => {
      addCardToMyHand(4);
    }, 10000/100); // 10000ms = 10초

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, []);


  const [myTurn, setMyTurn] = useState(true);

  const addCardToMyHand = (cycle: number) => {
    const initialCards = myCardList.slice(0, cycle);
    setMyCardList(prev => prev.slice(cycle));

    initialCards.forEach((card, index) => {
      setTimeout(() => {
        setMyHandList(prev => [...prev, card]);
      }, 300 * index);
    });
  };

  const addCardToEnemyHand = (cycle: number) => {
    const initialCards = enemyCardList.slice(0, cycle);
    setEnemyCardList(prev => prev.slice(cycle));

    initialCards.forEach((card, index) => {
      setTimeout(() => {
        setEnemyHandList(prev => [...prev, card]);
      }, 300 * index);
    });
  };

  const onEndTurn = () => {
    setOpeningRotate(openingRotate + 180);
    setIsNowTurnGiveEnergy(false)
    setFinalGroundRotate(finalGroundRotate * -1);
    if (!myTurn) {
      if (myHandList.length == 0) {
        addCardToMyHand(4);
      }
      else {
        addCardToMyHand(1);
      }
    }
    else {
      if (enemyHandList.length == 0) {
        addCardToEnemyHand(4);
      }
      else {
        addCardToEnemyHand(1);
      }
    }
    setMyTurn(!myTurn);
  }
  // Add state to track cards in droppable areas
  const [droppedCards, setDroppedCards] = useState<{ [key: string]: string }>({});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const cardName = active.data.current?.imgLink as string;
    const dropzoneId = over.id as string;
    const isMyCard = cardId.startsWith('card-');
    const isEnemyCard = cardId.startsWith('enemycard-');

    if (cardId == "energy") {
      setIsNowTurnGiveEnergy(true)
      if (dropzoneId=='my_battle') {
        setMyBattlePokemonEnergy(prev => prev + 1)
      }
      else if (dropzoneId=='y_battle') {
        setEnemyBattlePokemonEnergy(prev => prev + 1)
      }
      // Handle energy for waiting/bench Pokémon
      // Check enemy first to avoid matching "my" in "enemy"
      else if (dropzoneId.includes('enemy_waiting_')) {
        // Extract the waiting position number (1, 2, or 3)
        const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
        
        // Make sure there's a Pokémon in this position
        if (droppedCards[dropzoneId]) {
          // Update energy for the specific waiting position
          const newEnergy = [...enemyWaitingEnergy];
          newEnergy[waitingPosition] = newEnergy[waitingPosition] + 1;
          setEnemyWaitingEnergy(newEnergy);
        }
      }
      else if (dropzoneId.includes('my_waiting_')) {
        // Extract the waiting position number (1, 2, or 3)
        const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
        
        // Make sure there's a Pokémon in this position
        if (droppedCards[dropzoneId]) {
          // Update energy for the specific waiting position
          const newEnergy = [...myWaitingEnergy];
          newEnergy[waitingPosition] = newEnergy[waitingPosition] + 1;
          setMyWaitingEnergy(newEnergy);
        }
      }
    }

    // Validate turn and ownership
    if ((myTurn && !isMyCard) || (!myTurn && !isEnemyCard)) return;

    // Get card index from ID
    const index = parseInt(cardId.split('-')[1]);

    // 이미 카드가 드롭되있으면 
    if (droppedCards[dropzoneId]){
      console.log("이미 카드가 드롭됨 : " + droppedCards[dropzoneId])
      // 진화체여야 낼 수 있음
      if (droppedCards[dropzoneId] != data[cardName]?.beforeEvo) {
        console.log("진화체가 아님")
        return
      }
    }
    // 카드가 없다면
    else {
      // 진화체가 없는 카드만 낼 수 있음
      if (data[cardName]?.beforeEvo != "") {
        return
      }
    }

    // Battle area handling
    if (dropzoneId === 'my_battle' || dropzoneId === 'y_battle') {
        setDroppedCards(prev => ({ ...prev, [dropzoneId]: cardName }));
        if (myTurn) {
            setMyBattlePokemonHP(data[cardName].hp)
            setMyHandList(prev => prev.filter((_, i) => i !== index));
        } else {
            setEnemyBattlePokemonHP(data[cardName].hp)
            setEnemyHandList(prev => prev.filter((_, i) => i !== index));
        }
    }
    // Waiting area handling - Requires battle area card
    else if (dropzoneId.includes('waiting_')) {
        // Check if corresponding battle area has a card
        const battleArea = dropzoneId.startsWith('enemy_') ? 'y_battle' : 'my_battle';
        if (droppedCards[battleArea]) {
            setDroppedCards(prev => ({ ...prev, [dropzoneId]: cardName }));
            
            // Extract the waiting position number (1, 2, or 3)
            const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
            
            // Check enemy first to avoid matching "my" in "enemy"
            if (dropzoneId.startsWith('enemy_')) {
                // Update enemy waiting Pokémon HP atom
                const newHP = [...enemyWaitingHP];
                newHP[waitingPosition] = data[cardName].hp;
                setEnemyWaitingHP(newHP);
                
                // Update enemy waiting Pokémon energy atom
                const newEnergy = [...enemyWaitingEnergy];
                newEnergy[waitingPosition] = 0; // Start with 0 energy
                setEnemyWaitingEnergy(newEnergy);
                
                setEnemyHandList(prev => prev.filter((_, i) => i !== index));
            } else {
                // Update my waiting Pokémon HP atom
                const newHP = [...myWaitingHP];
                newHP[waitingPosition] = data[cardName].hp;
                setMyWaitingHP(newHP);
                
                // Update my waiting Pokémon energy atom
                const newEnergy = [...myWaitingEnergy];
                newEnergy[waitingPosition] = 0; // Start with 0 energy
                setMyWaitingEnergy(newEnergy);
                
                setMyHandList(prev => prev.filter((_, i) => i !== index));
            }
        }
    }
}

  // 클라이언트 사이드 렌더링 될 때까지 아무것도 렌더링하지 않음
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full bg-[#C2DAF6] relative overflow-hidden">
        {/* 플레이어 카드 */}
        <PlayerCards
          secondaryMyCardRotate={secondaryMyCardRotate}
          secondaryMyCardPosition={secondaryMyCardPosition}
          myImageSrc={"/ui/player1.png"}
          emenyImageSrc={"/ui/player2.png"}
        />
        {/* 오프닝 애니메이션 오버레이 */}
        <OpeningOverlay openingOpacity={openingOpacity} />
        {/* 게임 필드 */}
        <GameBoard openingRotate={openingRotate} openingScale={openingScale} finalGroundRotate={finalGroundRotate}>
          {/* 적 카드 영역 */}
          <Hand handList={enemyHandList} playedCards={PlayerCards} isMy={false} />
          {/* 필드 카드 영역 */}
          <Waiting droppedCards={droppedCards} isMy={false} />
          {/* 중앙 카드 영역 */}
          <FieldCards onEndTurn={onEndTurn} myTurn={myTurn} droppedCards={droppedCards} setDroppedCards={setDroppedCards}/>
          {/* 하단 필드 카드 영역 */}
          <Waiting droppedCards={droppedCards} isMy={true} />
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <Hand handList={myHandList} playedCards={PlayerCards} isMy={true} />
          {/* 비디오 영역 */}
          <CoinAnimation startVideo={startVideo} coinTextOpacity={coinTextOpacity} />
        </GameBoard>
      </div >
    </DndContext >
  );
}