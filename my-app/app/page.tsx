"use client"

import { clear } from "console";
import { use, useEffect, useState } from "react";
import AutoplayVideo from './components/AutoplayVideo';

export default function App({
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 오프닝을 위한 변수들
  const [openingRotate, setOpeningRotate] = useState(70);
  const [openingScale, setOpeningScale] = useState(0.5);
  const [openingOpacity, setOpeningOpacity] = useState(100);


  const [secondaryMyCardRotate, setSecondaryMyCardRotate] = useState(-30)
  const [secondaryMyCardPosition, setSecondaryMyCardPosition] = useState(-130)

  // 비디오 재생 시작을 제어하는 상태 추가
  const [startVideo, setStartVideo] = useState(false);
  const [coinTextOpacity, setCoinTextOpacity] = useState(0)

  const [finalGroundRotate, setFinalGroundRotate] = useState(0)

  useEffect(() => {
    setOpeningRotate(0)
    setOpeningScale(1)
    setOpeningOpacity(0)

    const timer1 = setTimeout(() => {
      setSecondaryMyCardRotate(-20)
      setSecondaryMyCardPosition(0)
    }, 0);

    const timer2 = setTimeout(() => {
      setSecondaryMyCardRotate(20)
      setSecondaryMyCardPosition(60)
      setOpeningScale(1.6)
    }, 3200);

    const timer3 = setTimeout(() => {
      // 여기서 비디오 재생 시작 트리거
      setStartVideo(true)
    }, 3600);

    const timer4 = setTimeout(() => {
      setOpeningScale(2.4)
      setCoinTextOpacity(100)
    }, 5000);

    const timer5 = setTimeout(() => {
      setOpeningScale(1)
      setCoinTextOpacity(0)
    }, 7000);

    const timer6 = setTimeout(() => {
      setStartVideo(false)
    }, 7500);

    // const timer6 = setTimeout(() => {
    //   setFinalGroundRotate(12)
    // }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      // clearTimeout(timer6);
    };
  }, []);

  // 게임플레이를 위한 변수들
  const [myCardList, setMyCardList] = useState<number[]>([])
  const [enemyCardList, setEnemyCardList] = useState<number[]>([])

  return (
    <div className="w-full h-full bg-[#C2DAF6]"
    >
      <div className="w-full flex justify-center">
        <div className="absolute border-2 border-amber-100 w-48 h-70 z-2000 flex justify-center  transition-all duration-3000 overflow-hidden"
          style={{
            transform:
              `perspective(800px) rotateY(${secondaryMyCardRotate}deg) scale(1) translateX(${secondaryMyCardPosition}rem) translateY(${4}rem)`,
          }}>
          <img src="player1.png" className="w-72 h-72 object-cover" />
        </div>
      </div>
      
      <div className="w-full flex justify-center">
        <div className="absolute border-2 border-amber-100 w-48 h-70 z-2000 flex justify-center  transition-all duration-3000 overflow-hidden"
          style={{
            transform:
              `perspective(800px) rotateY(${secondaryMyCardRotate * -1}deg) scale(1) translateX(${secondaryMyCardPosition * -1}rem) translateY(${26}rem)`,
          }}>
          <img src="player2.png" className="w-72 h-72 object-cover" />
        </div>
      </div>


      <div className="absolute w-full h-full bg-white z-1999 translate transition-all duration-1000"
        style={{
          opacity: `${openingOpacity}`,
        }}
      ></div>
      <div className="
      bg-[#C2DAF6] h-full flex justify-between flex-col items-center p-2 z-100 transition-all duration-1500
      "
        style={{
          transform:
            `perspective(800px) rotateZ(${openingRotate}deg) scale(${openingScale}) rotateX(${finalGroundRotate}deg) translateY(${finalGroundRotate*-1/6}rem)`,
        }}
      >
        <div className="z-100 flex  flex-row">
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
        </div>
        <div className="z-100 flex  flex-row gap-3">
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
        </div>
        <div className="z-100 flex  flex-row w-full justify-between items-center">
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
        {/* startVideo 상태에 따라 조건부 렌더링 또는 delay prop 전달 */}
        {startVideo && (
          <AutoplayVideo 
            src="FlipBack.webm" 
            className="w-full max-w-lg absolute top-[52%] left-[50%]  z-99999 transform scale-50 translate-x-[-50%] translate-y-[-50%]" 
          />
        )}
        <div
           className="
            w-[35%] max-w-lg absolute z-100000 top-[42%] left-[50%] 
            translate-x-[-50%] translate-y-[-50%]
            text-center
            rounded-4xl
            bg-gradient-to-r from-[#09B9FE] to-[#3A8AFE]
            font-extrabold
            transform transition-all duration-1500
            text-[.8rem]
            " 
            style={{
              opacity: `${ coinTextOpacity }`
            }}
          >
            후공
        </div>
        <div className="
          w-full h-full bg-white z-1999 absolute translate transition-all duration-1000
          bg-[linear-gradient(to_bottom,#FE8E68,#FF9C6A,#FFB679,#FF9C6A,#FE8E68)]
          "
          style={{
            opacity: `${ coinTextOpacity }`
          }}
        >

        </div>
        <div className="z-100 flex  flex-row gap-3">
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
        </div>
        <div className="z-100 flex  flex-row">
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
        </div>
        <img
          src="pukimon_battle_field.png"
          alt=""
          className="absolute object-cover top-0 left-0 scale-170 translate-y-45"
        />
      </div>
    </div>
  );
}