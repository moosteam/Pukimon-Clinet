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
import { Wating } from "./components/Area/Wating";

import { myCardListAtom, enemyCardListAtom, myHandListAtom, enemyHandListAtom, myUsedListAtom, enemyUsedListAtom, myCardRearAtom } from './atom'

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

  const [myCardList, setMyCardList] = useAtom(myCardListAtom)
  const [enemyCardList, setEnemyCardList] = useAtom(enemyCardListAtom)
  const [myHandList, setMyHandList] = useAtom(myHandListAtom)
  const [enemyHandList, setEnemyHandList] = useAtom(enemyHandListAtom)
  const [myUsedList, setMyUsedList] = useAtom(myUsedListAtom)
  const [enemyUsedList, setEnemyUsedList] = useAtom(enemyUsedListAtom)
  const [myCardRear, setMyCardRear] = useAtom(myCardRearAtom)

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
        time: 3200/4,
        action: () => {
          setSecondaryMyCardRotate(20);
          setSecondaryMyCardPosition(60);
          setOpeningScale(1.6);
        }
      },
      {
        time: 3600/4,
        action: () => {
          setStartVideo(true);
        }
      },
      {
        time: 5000/4,
        action: () => {
          setOpeningScale(2.4);
          setCoinTextOpacity(100);
        }
      },
      {
        time: 7000/4,
        action: () => {
          setOpeningScale(1);
          setCoinTextOpacity(0);
        }
      },
      {
        time: 7500/4,
        action: () => {
          setStartVideo(false);
        }
      },
      {
        time: 8500/4,
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
    }, 10000/4); // 10000ms = 10초

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
    setFinalGroundRotate(finalGroundRotate * -1);

    if (enemyHandList.length == 0) {
      addCardToEnemyHand(4);
    }
    else if (myTurn) {
      addCardToEnemyHand(1);
    }
    else if (!myTurn) {
      addCardToMyHand(1);
    }

    setMyTurn(!myTurn);

  }
  const [playedCards, setPlayedCards] = useState<{ [key: string]: boolean }>({});
  // Add state to track cards in droppable areas
  const [droppedCards, setDroppedCards] = useState<{ [key: string]: string }>({});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const cardName = active.data.current?.imgLink;
    const dropzoneId = over.id as string;
    const isMyCard = cardId.startsWith('card-');
    const isEnemyCard = cardId.startsWith('enemycard-');

    // Validate turn and ownership
    if ((myTurn && !isMyCard) || (!myTurn && !isEnemyCard)) return;

    // Get card index from ID
    const index = parseInt(cardId.split('-')[1]);

    // Battle area handling
    if (dropzoneId === 'my_battle' || dropzoneId === 'y_battle') {
        setDroppedCards(prev => ({ ...prev, [dropzoneId]: cardName }));
        // Move hand list update inside validation block
        if (myTurn) {
            setMyHandList(prev => prev.filter((_, i) => i !== index));
        } else {
            setEnemyHandList(prev => prev.filter((_, i) => i !== index));
        }
    }
    // Waiting area handling
    else if (dropzoneId.includes('waiting_')) {
        if (droppedCards['my_battle'] || droppedCards['y_battle']) {
            setDroppedCards(prev => ({ ...prev, [dropzoneId]: cardName }));
            // Move hand list update inside validation block
            if (myTurn) {
                setMyHandList(prev => prev.filter((_, i) => i !== index));
            } else {
                setEnemyHandList(prev => prev.filter((_, i) => i !== index));
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
          <Wating droppedCards={droppedCards} isMy={false} />
          {/* 중앙 카드 영역 */}
          <FieldCards onEndTurn={onEndTurn} myTurn={myTurn} droppedCards={droppedCards} />
          {/* 하단 필드 카드 영역 */}
          <Wating droppedCards={droppedCards} isMy={true} />
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <Hand handList={myHandList} playedCards={PlayerCards} isMy={true} />

          {/* 비디오 영역 */}
          <CoinAnimation startVideo={startVideo} coinTextOpacity={coinTextOpacity} />
        </GameBoard>
      </div >
    </DndContext >
  );
}