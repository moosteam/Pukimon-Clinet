"use client"

import { useEffect } from "react";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { OpeningOverlay } from "./components/AnimationManager/OpeningOverlay";
import { CoinAnimation } from "./components/AnimationManager/CoinAnimation";
import { PlayerCards } from "./components/Card/PlayerCards";
import { GameBoard } from "./components/BattleField/GameBoard";
import { FieldCards } from "./components/BattleField/FieldCards";
import { Hand } from "./components/Area/Hand";
import { Waiting } from "./components/Area/Waiting";
import ScoreTimer from "./components/ScoreTimer";

// Import custom hooks
import { useAnimationSequence } from "./hooks/useAnimationSequence";
import { useCardManagement } from "./hooks/useCardManagement";
import { useDragHandlers } from "./hooks/useDragHandlers";

export default function App({
  children
}: Readonly<{
  children?: React.ReactNode;
}>) {
  // Use animation hook
  const {
    boardRotateZ, 
    boardScale,
    boardOpacity,
    playerCardRotate,
    playerCardPosition,
    startVideo,
    coinTextOpacity,
    boardRotateX,
  } = useAnimationSequence();

  // Use card management hook
  const {
    addCardToMyHand,
    // onEndTurn 제거
    myHandList,
    enemyHandList
  } = useCardManagement();

  // Use drag handlers hook
  const { handleDragEnd } = useDragHandlers();

  // Initial card draw effect
  useEffect(() => {
    // 10초 후에 실행될 타이머 설정
    const timer = setTimeout(() => {
      addCardToMyHand(4);
    }, 0.1*8000); // 10000ms = 10초

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, []);

  // 클라이언트 사이드 렌더링 될 때까지 아무것도 렌더링하지 않음
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full bg-[#C2DAF6] relative overflow-hidden">
        <ScoreTimer isPrimary/>
        <ScoreTimer/>
        {/* 플레이어 카드 */}
        <PlayerCards
          playerCardRotate={playerCardRotate}
          playerCardPosition={playerCardPosition}
          myImageSrc={"/ui/player1.png"}
          emenyImageSrc={"/ui/player2.png"}
        />
        {/* 오프닝 애니메이션 오버레이 */}
        <OpeningOverlay boardOpacity={boardOpacity} />
        {/* 게임 필드 */}
        <GameBoard boardRotateZ={boardRotateZ} boardScale={boardScale} boardRotateX={boardRotateX}>
          {/* 적 카드 영역 */}
          <Hand handList={enemyHandList} playedCards={PlayerCards} isMy={false}/>
          {/* 필드 카드 영역 */}
          <Waiting isMy={false} />
          {/* 중앙 카드 영역 */}
          <FieldCards />
          {/* 하단 필드 카드 영역 */}
          <Waiting isMy={true} />
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <Hand handList={myHandList} playedCards={PlayerCards} isMy={true} />
          {/* 비디오 영역 */}
          <CoinAnimation startVideo={startVideo} coinTextOpacity={coinTextOpacity} />
        </GameBoard>
      </div>
    </DndContext>
  );
}