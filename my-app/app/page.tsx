"use client"

import { useEffect } from "react";
import { DndContext } from '@dnd-kit/core';
import { OpeningOverlay } from "./components/AnimationManager/OpeningOverlay";
import { CoinAnimation } from "./components/AnimationManager/CoinAnimation";
import { PlayerCards } from "./components/Card/PlayerCards";
import { GameBoard } from "./components/BattleField/GameBoard";
import { FieldCards } from "./components/BattleField/FieldCards";
import { Hand } from "./components/Area/Hand";
import { Waiting } from "./components/Area/Waiting";

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
    openingRotate, setOpeningRotate,
    openingScale, setOpeningScale,
    openingOpacity,
    secondaryMyCardRotate,
    secondaryMyCardPosition,
    startVideo,
    coinTextOpacity,
    finalGroundRotate, setFinalGroundRotate
  } = useAnimationSequence();

  // Use card management hook
  const {
    myTurn,
    droppedCards, setDroppedCards,
    addCardToMyHand,
    onEndTurn,
    myHandList,
    enemyHandList
  } = useCardManagement();

  // Use drag handlers hook
  const { handleDragEnd } = useDragHandlers(myTurn, droppedCards, setDroppedCards);

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
          <Hand handList={enemyHandList} playedCards={PlayerCards} isMy={false}  />
          {/* 필드 카드 영역 */}
          <Waiting droppedCards={droppedCards} isMy={false} />
          {/* 중앙 카드 영역 */}
          <FieldCards 
            onEndTurn={() => onEndTurn(openingRotate, setOpeningRotate, finalGroundRotate, setFinalGroundRotate)} 
            myTurn={myTurn} 
            droppedCards={droppedCards} 
            setDroppedCards={setDroppedCards}
          />
          {/* 하단 필드 카드 영역 */}
          <Waiting droppedCards={droppedCards} isMy={true} />
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <Hand handList={myHandList} playedCards={PlayerCards} isMy={true} />
          {/* 비디오 영역 */}
          <CoinAnimation startVideo={startVideo} coinTextOpacity={coinTextOpacity} />
        </GameBoard>
      </div>
    </DndContext>
  );
}