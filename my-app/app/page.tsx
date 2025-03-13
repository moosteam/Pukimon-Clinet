"use client"

import { useEffect, useState } from "react";
import AutoplayVideo from './components/AutoplayVideo';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';

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

  // clientSide 렌더링만 하도록 설정
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // 클라이언트 사이드 렌더링 확인
    setIsClient(true);
    
    // 초기 상태 설정
    setOpeningRotate(0);
    setOpeningScale(1);
    setOpeningOpacity(0);
    
    // 애니메이션 시퀀스 정의
    const animationSequence = [
      {
        time: 0,
        action: () => {
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
      },
      {
        time: 9500,
        action: () => {
          addCardToHand(1);
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

  const addCardToHand = (cycle: number) => {
    const addSingleCard = (index: number) => {
      if (index >= cycle) return; 
      
      setTimeout(() => {
        setMyHandList(prevHandList => [...prevHandList, "리자몽"])
        addSingleCard(index + 1);
      }, 300);
    };
    addSingleCard(0);
  };

  // 게임플레이를 위한 변수들
  const [myCardList] = useState<string[]>(["리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽"]);
  const [enemyCardList] = useState<string[]>(["리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽", "리자몽"]);
  const [myHandList, setMyHandList] = useState<string[]>([]);
  const [enemyHandList] = useState<string[]>([]);
  const [myUsedList] = useState<string[]>([]);
  const [enemyUsedList] = useState<string[]>([]);
  const [playedCards, setPlayedCards] = useState<{[key: string]: boolean}>({});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && over.id === 'battlefield') {
      console.log("Card dropped on battlefield:", active.id);
      setPlayedCards(prev => ({
        ...prev,
        [active.id]: true
      }));
    }
  }

  // 클라이언트 사이드 렌더링 될 때까지 아무것도 렌더링하지 않음
  if (!isClient) {
    return null;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full bg-[#C2DAF6] relative">
        {/* 배경 필드 */}
        <img
          src="pukimon_battle_field.png"
          alt=""
          className="absolute object-cover top-0 left-0 scale-170 translate-y-45 w-full h-full z-10 pointer-events-none"
        />
        
        {/* 플레이어 카드 */}
        <div className="w-full flex justify-center">
          <div className="absolute border-2 border-amber-100 w-48 h-70 z-20 flex justify-center transition-all duration-3000 overflow-hidden pointer-events-none"
            style={{
              transform: `perspective(800px) rotateY(${secondaryMyCardRotate}deg) scale(1) translateX(${secondaryMyCardPosition}rem) translateY(${4}rem)`
            }}>
            <img src="player1.png" className="w-72 h-72 object-cover" />
          </div>
        </div>
        
        <div className="w-full flex justify-center">
          <div className="absolute border-2 border-amber-100 w-48 h-70 z-20 flex justify-center transition-all duration-3000 overflow-hidden pointer-events-none"
            style={{
              transform: `perspective(800px) rotateY(${secondaryMyCardRotate * -1}deg) scale(1) translateX(${secondaryMyCardPosition * -1}rem) translateY(${26}rem)`
            }}>
            <img src="player2.png" className="w-72 h-72 object-cover" />
          </div>
        </div>

        {/* 오프닝 애니메이션 오버레이 */}
        <div className="absolute w-full h-full bg-white z-30 transition-all duration-1000 pointer-events-none"
          style={{ opacity: `${openingOpacity}` }}></div>
        
        {/* 게임 필드 */}
        <div className="absolute w-full h-full z-40 bg-none flex justify-between flex-col items-center p-2 transition-all duration-1500"
          style={{
            transform: `perspective(800px) rotateZ(${openingRotate}deg) scale(${openingScale}) rotateX(${finalGroundRotate}deg) translateY(${finalGroundRotate*-1/3.5}rem)`,
            pointerEvents: finalGroundRotate > 0 ? "auto" : "none"
          }}>
          
          {/* 적 카드 영역 */}
          <div className="z-50 flex flex-row">
            <img src="Charizard.jpg" alt="" className="w-18" />
            <img src="Charizard.jpg" alt="" className="w-18" />
            <img src="Charizard.jpg" alt="" className="w-18" />
          </div>
          
          {/* 필드 카드 영역 */}
          <div className="z-50 flex flex-row gap-3">
            <div className="w-18 h-25 border-3 rounded-lg"></div>
            <Droppable id="battlefield">
              <div className="w-18 h-25 border-3 rounded-lg bg-yellow-100/50"></div>
            </Droppable>
            <div className="w-18 h-25 border-3 rounded-lg"></div>
          </div>
          
          {/* 중앙 카드 영역 */}
          <div className="z-50 flex flex-row w-full justify-between items-center">
            <div>
              <img src="pukimon_card_back.png" alt="" className="w-18" />
              <div className="h-6"></div>
              <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
            </div>
            <div>
              <div className="w-18 h-25 border-3 rounded-lg mt-8 mb-4"></div>
              <div className="h-6"></div>
              <div className="w-18 h-25 border-3 rounded-lg mb-8 mt-4"></div>
            </div>
            <div>
              <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
              <div className="h-6"></div>
              <img src="pukimon_card_back.png" alt="" className="w-18" />
            </div>
          </div>
          
          {/* 비디오 영역 */}
          {startVideo && (
            <AutoplayVideo 
              src="FlipBack.webm" 
              className="w-full max-w-lg absolute top-[52%] left-[50%] z-60 transform scale-50 translate-x-[-50%] translate-y-[-50%] pointer-events-none"
            />
          )}
          
          {/* 코인 텍스트 */}
          <div
            className="w-[35%] max-w-lg absolute z-70 top-[42%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center rounded-4xl bg-gradient-to-r from-[#09B9FE] to-[#3A8AFE] font-extrabold transform transition-all duration-1500 text-[.8rem]" 
            style={{ opacity: `${coinTextOpacity}` }}>
            후공
          </div>
          
          {/* 코인 배경 효과 */}
          <div className="w-full h-full absolute z-65 transition-all duration-1000 bg-[linear-gradient(to_bottom,#FE8E68,#FF9C6A,#FFB679,#FF9C6A,#FE8E68)]"
            style={{ opacity: `${coinTextOpacity}`, pointerEvents: "none" }}>
          </div>
          
          {/* 하단 필드 카드 영역 */}
          <div className="z-50 flex flex-row gap-3">
            <div className="w-18 h-25 border-3 rounded-lg"></div>
            <div className="w-18 h-25 border-3 rounded-lg"></div>
            <div className="w-18 h-25 border-3 rounded-lg"></div>
          </div>
          
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <div className="z-50 flex flex-row mt-4">
            {myHandList && myHandList.map((card, index) => (
              !playedCards[`card-${index}`] && (
                <Draggable key={`draggable-${index}`} id={`card-${index}`}>
                  <div className="relative">
                    <img 
                      src="Charizard.jpg" 
                      alt="" 
                      className="w-18 transition-all duration-500 cursor-grab hover:scale-110"
                    />
                  </div>
                </Draggable>
              )
            ))}
            {myHandList.length === 0 && 
              <img 
                src="Charizard.jpg" 
                alt="" 
                className="w-18 transition-all duration-1500 invisible"
              />
            }
          </div>
        </div>
      </div>
    </DndContext>
  );
}