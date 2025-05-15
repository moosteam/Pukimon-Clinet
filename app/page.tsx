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
import Alert from "./components/Alert";
import { useAtom } from "jotai";

// 커스텀 훅 임포트
import { useAnimationSequence } from "./hooks/useAnimationSequence";
import { useCardManagement } from "./hooks/useCardManagement";
import { useDragHandlers } from "./hooks/useDragHandlers";

// atom 임포트
import {
  showAlertAtom,
  isDraggingAtom,
  originalRotateAtom,
  myTurnAtom,
  finalGroundRotateAtom
} from "./atom";

export default function App() {
  // jotai atom 사용
  const [showAlert, setShowAlert] = useAtom(showAlertAtom);
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);
  const [originalRotate, setOriginalRotate] = useAtom(originalRotateAtom);
  const [myTurn] = useAtom(myTurnAtom);
  const [finalGroundRotate, setFinalGroundRotate] = useAtom(finalGroundRotateAtom);

  // 애니메이션 훅 사용 (초기화 목적으로만 사용)
  useAnimationSequence();

  // 카드 매니지먼트 툴
  const { addCardToMyHand } = useCardManagement();

  // Use drag handlers hook
  const { handleDragEnd } = useDragHandlers();

  // 드래그 시작 핸들러 추가
  const handleDragStart = () => {
    setIsDragging(true);
    setOriginalRotate(finalGroundRotate); // 현재 회전 값 저장
    // 내 턴과 상대 턴에 따라 기울어지는 정도와 방향을 다르게 설정
    if (myTurn) {
      // 내 턴일 때는 양수 값으로 기울어지게
      setFinalGroundRotate(8);
    } else {
      // 상대 턴일 때는 음수 값으로 반대 방향으로 기울어지게
      setFinalGroundRotate(-4);
    }
  };

  // 드래그 종료 핸들러 수정
  const handleDragEndWithReset = (event: DragEndEvent) => {
    setIsDragging(false);
    setFinalGroundRotate(originalRotate); // 원래 회전 값으로 복원
    handleDragEnd(event); // 기존 드래그 종료 핸들러 호출
  };

  // Initial card draw effect
  useEffect(() => {
    // 10초 후에 실행될 타이머 설정
    const timer = setTimeout(() => {
      addCardToMyHand(4);
    }, 8000); // 10000ms = 10초

    // 9초 후에 Alert 표시
    const alertTimer = setTimeout(() => {
      setShowAlert(true);
      
      // 3초 후에 Alert 숨기기
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }, 9000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearTimeout(timer);
      clearTimeout(alertTimer);
    };
  }, []);

  // 클라이언트 사이드 렌더링 될 때까지 아무것도 렌더링하지 않음
  return (
    <DndContext onDragEnd={handleDragEndWithReset} onDragStart={handleDragStart}>
      <div className="w-full h-full bg-[#C2DAF6] relative overflow-hidden">
        {/* 드래그 중일 때 검정 오버레이 추가 - 드롭 가능 영역 제외 */}
        {isDragging && (
          <div className="absolute inset-0 bg-black opacity-20 z-45 pointer-events-none">
            {/* 드롭 가능한 영역에 대한 구멍 생성 */}
            <div className="absolute top-[60%] left-0 right-0 bottom-0 bg-black opacity-40 z-100"></div>
            <div className="absolute top-0 left-0 right-0 h-[30%] bg-black opacity-40 z-100"></div>
            <div className="absolute top-[30%] left-[10%] right-[10%] h-[30%] bg-black opacity-40 z-100"></div>
          </div>
        )}
        <Alert
          mainText="기본 포켓몬을 배틀필드로 내보내 주십시오"
          subText="당신이 선공입니다"
          isVisible={showAlert}
        />       
        <ScoreTimer isPrimary myTurn={myTurn}/>
        <ScoreTimer myTurn={myTurn}/>
        {/* 플레이어 카드 */}
        <PlayerCards
          myImageSrc={"/ui/player1.png"}
          emenyImageSrc={"/ui/player2.png"}
        />
        {/* 오프닝 애니메이션 오버레이 */}
        <OpeningOverlay />
        {/* 게임 필드 */}
        <GameBoard>
          {/* 적 카드 영역 */}
          <Hand isMy={false} playedCards={PlayerCards} />
          {/* 필드 카드 영역 */}
          <Waiting isMy={false} />
          {/* 중앙 카드 영역 */}
          <FieldCards onEndTurn={() => {}} />
          {/* 하단 필드 카드 영역 */}
          <Waiting isMy={true} />
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <Hand isMy={true} playedCards={PlayerCards} />
          {/* 비디오 영역 */}
          <CoinAnimation />
        </GameBoard>
      </div>
    </DndContext>
  );
}