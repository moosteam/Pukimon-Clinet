"use client"

import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import AutoplayVideo from './components/AutoplayVideo';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';
import { PlayerCard } from './components/PlayerCard'
import { OpeningOverlay } from "./components/OpeningOverlay";
import { PlayerCards } from "./components/PlayerCards";
import { GameBoard } from "./components/GameBoard";
import { EnemyHand } from "./components/EnemyHand";
import { EnemyWating } from "./components/EnemyWating";
import { FieldCards } from "./components/FieldCards";
import { CoinAnimation } from "./components/CoinAnimation";
import { MyWating } from "./components/MyWating"
import { MyHand } from "./components/MyHand";

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
        time: 3200,
        action: () => {
          setSecondaryMyCardRotate(20);
          setSecondaryMyCardPosition(60);
          setOpeningScale(1.6);
        }
      },
      {
        time: 3600,
        action: () => {
          setStartVideo(true);
        }
      },
      {
        time: 5000,
        action: () => {
          setOpeningScale(2.4);
          setCoinTextOpacity(100);
        }
      },
      {
        time: 7000,
        action: () => {
          setOpeningScale(1);
          setCoinTextOpacity(0);
        }
      },
      {
        time: 7500,
        action: () => {
          setStartVideo(false);
        }
      },
      {
        time: 8500,
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
    }, 10000); // 10000ms = 10초

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미


  const [myTurn, setMyTurn] = useState(true);

  const addCardToMyHand = (cycle: number) => {
    const addSingleCard = (index: number) => {
      if (index >= cycle) return;

      setTimeout(() => {
        setMyHandList(prevHandList => [...prevHandList, "리자몽"])
        addSingleCard(index + 1);
      }, 300);
    };
    addSingleCard(0);
  };

  const addCardToEnemyHand = (cycle: number) => {
    const addSingleCard = (index: number) => {
      if (index >= cycle) return;

      setTimeout(() => {
        setEnemyHandList(prevHandList => [...prevHandList, "리자몽"])
        addSingleCard(index + 1);
      }, 300);
    };
    addSingleCard(0);
  };

  const onEndTurn = () => {
    setOpeningRotate(openingRotate + 180);
    setFinalGroundRotate(finalGroundRotate * -1);
    setMyTurn(!myTurn);
    if (enemyHandList.length == 0) {
      addCardToEnemyHand(4);
    }
  }

  // 게임플레이를 위한 변수들
  const [myCardList] = useState<string[]>(["리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽"]);
  const [enemyCardList] = useState<string[]>(["리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽"]);
  const [myHandList, setMyHandList] = useState<string[]>([]);
  const [enemyHandList, setEnemyHandList] = useState<string[]>([]);
  const [myUsedList] = useState<string[]>([]);
  const [enemyUsedList] = useState<string[]>([]);
  const [playedCards, setPlayedCards] = useState<{ [key: string]: boolean }>({});

  // Add state to track cards in droppable areas
  const [droppedCards, setDroppedCards] = useState<{ [key: string]: string }>({});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      // Get the card ID and the droppable area ID
      const cardId = active.id as string;
      const dropzoneId = over.id as string;

      // Check if it's a waiting area
      if (dropzoneId.includes('waiting_')) {
        // Only allow dropping in waiting areas if there's a card in battle area
        if (droppedCards['my_battle'] || droppedCards['y_battle']) {
          console.log(`Card ${cardId} dropped on ${dropzoneId}`);

          // Mark the card as played
          setPlayedCards(prev => ({
            ...prev,
            [cardId]: true
          }));

          // Store which card is in which droppable area
          setDroppedCards(prev => ({
            ...prev,
            [dropzoneId]: cardId
          }));
        } else {
          console.log("Cannot place card in waiting area - no card in battle area yet");
          // You could add a visual feedback or notification here
        }
      }
      // If it's a battle area, always allow dropping
      else if (dropzoneId === 'my_battle' || dropzoneId === 'y_battle') {
        console.log(`Card ${cardId} dropped on ${dropzoneId}`);

        // Mark the card as played
        setPlayedCards(prev => ({
          ...prev,
          [cardId]: true
        }));

        // Store which card is in which droppable area
        setDroppedCards(prev => ({
          ...prev,
          [dropzoneId]: cardId
        }));
      }
    }
  }

  // 클라이언트 사이드 렌더링 될 때까지 아무것도 렌더링하지 않음
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full bg-[#C2DAF6] relative">

        {/* 플레이어 카드 1 */}
        <PlayerCards
          secondaryMyCardRotate={secondaryMyCardRotate}
          secondaryMyCardPosition={secondaryMyCardPosition}
          myImageSrc={"/player1.png"}
          emenyImageSrc={"/player2.png"}
        />
        {/* 오프닝 애니메이션 오버레이 */}
        <OpeningOverlay openingOpacity={openingOpacity} />
        {/* 게임 필드 */}
        <GameBoard openingRotate={openingRotate} openingScale={openingScale} finalGroundRotate={finalGroundRotate}>
          {/* 적 카드 영역 */}
          <EnemyHand
            enemyHandList={enemyHandList}
            playedCards={PlayerCards}
          />
          {/* 필드 카드 영역 */}
          <EnemyWating
            droppedCards={droppedCards}
          />
          {/* 중앙 카드 영역 */}
          <FieldCards
            onEndTurn={onEndTurn}
            myTurn={myTurn}
            droppedCards={droppedCards}
          />
          {/* 비디오 영역 */}
          <CoinAnimation
            startVideo={startVideo}
            coinTextOpacity={coinTextOpacity}
          />

          {/* 하단 필드 카드 영역 */}
          <MyWating
            droppedCards={droppedCards}
          />

          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <MyHand
            myHandList={myHandList}
            playedCards={PlayerCards}
          />
        </GameBoard>
      </div >
    </DndContext >
  );
}