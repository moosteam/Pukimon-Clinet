"use client"

import { useEffect, useState } from "react";
import AutoplayVideo from './components/AutoplayVideo';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';
import { PlayerCard } from './components/PlayerCard'

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

  // clientSide 렌더링만 하도록 설정
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드 렌더링 확인
    setIsClient(true);

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
      },
      {
        time: 9500,
        action: () => {
          addCardToMyHand(4);
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
  if (!isClient) {
    return null;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full bg-[#C2DAF6] relative">

        {/* 플레이어 카드 1 */}
        <PlayerCard
          imageSrc="/player1.png"
          rotate={secondaryMyCardRotate}
          position={secondaryMyCardPosition}
          translateY={4}
        />
        {/* 플레이어 카드 2 */}
        <PlayerCard
          imageSrc="/player2.png"
          rotate={-secondaryMyCardRotate}
          position={-secondaryMyCardPosition}
          translateY={26}
        />

        {/* 오프닝 애니메이션 오버레이 */}
        <div className="absolute w-full h-full bg-white z-30 transition-all duration-1000 pointer-events-none"
          style={{ opacity: `${openingOpacity}` }}></div>

        {/* 게임 필드 */}
        <div className="absolute w-full h-full z-40 bg-none flex justify-between flex-col items-center p-2 transition-all duration-1500"
          style={{
            transform: `perspective(800px) rotateZ(${openingRotate}deg) scale(${openingScale}) rotateX(${finalGroundRotate}deg) translateY(${finalGroundRotate * -1 / 3.5}rem)`,
            // 오프닝 부분 클릭 금지를 위해 rotate가 0일때 클릭할 수 없게 함
            pointerEvents: finalGroundRotate != 0 ? "auto" : "none" 
          }}>
          {/* 배경 필드 */}
          <div className="w-full h-full absolute">
            <img
              src="pukimon_battle_field.png"
              alt="Battle Field"
              className="absolute object-cover top-0 left-0 scale-170 translate-y-45 w-full h-full z-10 pointer-events-none"
              style={{ minWidth: '100%', height: 'auto' }}
            />
          </div>

          {/* 적 카드 영역 */}
          <div className="z-50 flex flex-row">
          {enemyHandList && enemyHandList.map((card, index) => {
              const cardId = `enemy-card-${index}`;
              // Only show cards that haven't been played yet
              if (!playedCards[cardId]) {
                return (
                  <Draggable isReversed={true} key={`enemy-draggable-${index}`} id={`${cardId}`}>
                    <div className="relative"> 
                      <img
                        src="Charizard.jpg"
                        alt=""  
                        className="w-18 transition-all duration-500 cursor-grab hover:scale-110"
                      />
                    </div>
                  </Draggable>
                );
              }
              return null;
            })}
            {myHandList.length === 0 &&
              <img
                src="Charizard.jpg"
                alt=""
                className="w-18 transition-all duration-1500 invisible"
              />
            }
          </div>

          {/* 필드 카드 영역 */}
          <div className="z-50 flex flex-row gap-3">
          <Droppable id="enemy_waiting_1">
              <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                {droppedCards['enemy_waiting_1'] && (
                  <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Droppable>
            <Droppable id="enemy_waiting_2">
              <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                {droppedCards['enemy_waiting_2'] && (
                  <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Droppable>
            <Droppable id="enemy_waiting_3">
              <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                {droppedCards['enemy_waiting_3'] && (
                  <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Droppable>
          </div>

          {/* 중앙 카드 영역 */}
          <div className="z-50 flex flex-row w-full justify-between items-center">
            {/* 적의 효과칸과 덱 */}
            <div>
              <img src="pukimon_card_back.png" alt="" className="w-18" />

              <div>
                <button
                  onClick={onEndTurn}
                  className="bg-white text-black hover:bg-blue-100 text-sm mt-4 mb-4 font-bold py-2 px-2 rounded-full shadow-lg transition-all duration-300"
                  style={{visibility : !myTurn ? "visible" : "hidden", transform: 'scale(-1, -1)'}}
                >
                  턴 종료하기
                </button>
                <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>

              </div>
            </div>
            {/* 배틀 필드 */}
            <div>
              <Droppable id="my_battle">
                <div className="w-18 h-25 border-3 rounded-lg mt-8 mb-4 bg-yellow-50 flex items-center justify-center">
                  {droppedCards['my_battle'] && (
                    <img
                      src="Charizard.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Droppable>
              <div className="h-6"></div>
              <Droppable id="y_battle">
                <div className="w-18 h-25 border-3 rounded-lg mb-8 mt-4 bg-yellow-50 flex items-center justify-center">
                  {droppedCards['y_battle'] && (
                    <img
                      src="Charizard.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Droppable>
            </div>
            {/* 나의 효과칸과 덱 */}
            <div className="flex items-center flex-col">
              <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
              <div>
                <button
                  onClick={onEndTurn}
                  className="bg-white text-black hover:bg-blue-100 text-sm mt-4 mb-4 font-bold py-2 px-2 rounded-full shadow-lg transition-all duration-300"
                  style={{visibility : myTurn ? "visible" : "hidden"}}
                >
                  턴 종료하기
                </button>
              </div>
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
            <Droppable id="waiting_1">
              <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                {droppedCards['waiting_1'] && (
                  <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Droppable>
            <Droppable id="waiting_2">
              <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                {droppedCards['waiting_2'] && (
                  <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Droppable>
            <Droppable id="waiting_3">
              <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                {droppedCards['waiting_3'] && (
                  <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Droppable>
          </div>

          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <div className="z-50 flex flex-row mt-4 gap-2">
            {myHandList && myHandList.map((card, index) => {
              const cardId = `card-${index}`;
              // Only show cards that haven't been played yet
              if (!playedCards[cardId]) {
                return (
                  <Draggable isReversed={false} key={`draggable-${index}`} id={cardId}>
                    <div className="relative">
                      <img
                        src="Charizard.jpg"
                        alt=""
                        className="w-18 transition-all duration-500 cursor-grab hover:scale-110"
                      />
                    </div>
                  </Draggable>
                );
              }
              return null;
            })}
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