"use client"

import { useEffect } from "react";
import { DndContext } from '@dnd-kit/core';
import { OpeningOverlay } from "./AnimationManager/OpeningOverlay";
import { CoinAnimation } from "./AnimationManager/CoinAnimation";
import { PlayerCards } from "./Card/PlayerCards";
import { GameBoard } from "./BattleField/GameBoard";
import { FieldCards } from "./BattleField/FieldCards";
import { Hand } from "./Area/Hand";
import { Waiting } from "./Area/Waiting";
import { ScoreTimer } from "./ScoreTimer";
// Import custom hooks
import { useAnimationSequence } from "../hooks/useAnimationSequence";
import { useCardManagement } from "../hooks/useCardManagement";
import { useDragHandlers } from "../hooks/useDragHandlers";
import { useBGM } from "../hooks/useBGM";
import { showFullScreenEffectAtom } from "../atom";
import { useAtom } from "jotai";
import { showScoreAnimationAtom, scoreAnimationPropsAtom, userProfileAtom } from "../atom";
import { ScoreAnimation } from "./ScoreAnimation";
import { Tutorial } from "./Tutorial";

export default function GameApp() {
  // Use animation hook
  const {
    boardRotateZ, 
    boardOpacity,
    playerCardRotate,
    playerCardPosition,
    startVideo,
    coinTextOpacity,
    startAnimation
  } = useAnimationSequence();

  // Use attack animation hook
  const {
    boardScale,
  } = useAnimationSequence();

  const {
    addCardToMyHand,
  } = useCardManagement();

  // Use drag handlers hook
  const { handleDragEnd } = useDragHandlers();

  // Use BGM hook
  const { hasUserInteracted } = useBGM();

  const [showFullScreenEffect, setShowFullScreenEffect] = useAtom(showFullScreenEffectAtom);
  const [showScoreAnimation] = useAtom(showScoreAnimationAtom);
  const [scoreAnimationProps] = useAtom(scoreAnimationPropsAtom);
  const [userProfile] = useAtom(userProfileAtom);

  // 게임 시작 시 애니메이션 시작 (START 버튼에서 호출됨)
  useEffect(() => {
    // 애니메이션은 page.tsx에서 START 버튼 클릭 시 시작
    startAnimation();
  }, [startAnimation]);

  // Initial card draw effect
  useEffect(() => {
    // 8초 후에 실행될 타이머 설정
    const timer = setTimeout(() => {
      addCardToMyHand(4);
    }, 8000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, [addCardToMyHand]);
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* 전체 화면 이펙트 */}
      {showFullScreenEffect && (
        <div className="fixed inset-0 z-[99999] pointer-events-none">
          <video
            autoPlay
            muted={true}
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => setShowFullScreenEffect(false)}
          >
            <source src="/fullscreeneffect.webm" type="video/webm" />
          </video>
        </div>
      )}

      {/* 점수 애니메이션 - GameBoard와 완전 분리 */}
      {showScoreAnimation && (
        <ScoreAnimation {...scoreAnimationProps} />
      )}

      {/* 튜토리얼 - GameBoard와 완전 분리 */}
      <Tutorial />

      <div className="w-full h-full bg-[#C2DAF6] relative overflow-hidden">
        <ScoreTimer isPrimary/>
        <ScoreTimer/>
        {/* 플레이어 카드 */}
        <PlayerCards
          playerCardRotate={playerCardRotate}
          playerCardPosition={playerCardPosition}
          myImageSrc={userProfile.profileImage}
          emenyImageSrc={"/ui/player2.png"}
        />
        {/* 오프닝 애니메이션 오버레이 */}
        <OpeningOverlay boardOpacity={boardOpacity} />
        {/* 게임 필드 */}
        <GameBoard boardRotateZ={boardRotateZ} boardScale={boardScale}>
          {/* 적 카드 영역 */}
          <Hand isMy={false}/>
          {/* 필드 카드 영역 */}
          <Waiting isMy={false} />
          {/* 중앙 카드 영역 */}
          <FieldCards />
          {/* 하단 필드 카드 영역 */}
          <Waiting isMy={true} />
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <Hand isMy={true} />
          {/* 비디오 영역 */}
          <CoinAnimation startVideo={startVideo} coinTextOpacity={coinTextOpacity} />
        </GameBoard>
      </div>
    </DndContext>
  );
} 