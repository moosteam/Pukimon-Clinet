import { useState, useEffect } from "react";

export function useAnimationSequence() {
  const [openingRotate, setOpeningRotate] = useState(70);
  const [openingScale, setOpeningScale] = useState(0.5);
  const [openingOpacity, setOpeningOpacity] = useState(100);
  const [secondaryMyCardRotate, setSecondaryMyCardRotate] = useState(-30);
  const [secondaryMyCardPosition, setSecondaryMyCardPosition] = useState(-130);
  const [startVideo, setStartVideo] = useState(false);
  const [coinTextOpacity, setCoinTextOpacity] = useState(0);
  const [finalGroundRotate, setFinalGroundRotate] = useState(0);

  useEffect(() => {
    // 초기 상태 설정
    setOpeningRotate(120);
    setOpeningScale(1.5);
    setOpeningOpacity(0);

    // 애니메이션 시퀀스 정의
    const animationSequence = [
      {
        time: 0.1*0,
        action: () => {
          setOpeningRotate(0);
          setOpeningScale(1);
          setSecondaryMyCardRotate(-20);
          setSecondaryMyCardPosition(0);
        }
      },
      {
        time: 0.1*2400,
        action: () => {
          setSecondaryMyCardRotate(20);
          setSecondaryMyCardPosition(60);
          setOpeningScale(1.6);
        }
      },
      {
        time: 0.1*2600,
        action: () => {
          setStartVideo(true);
        }
      },
      {
        time: 0.1*4000,
        action: () => {
          setOpeningScale(2.4);
          setCoinTextOpacity(100);
        }
      },
      {
        time: 0.1*5500,
        action: () => {
          setOpeningScale(1);
          setCoinTextOpacity(0);
        }
      },
      {
        time: 0.1*6000,
        action: () => {
          setStartVideo(false);
        }
      },
      {
        time: 0.1*7000,
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

  return {
    openingRotate, setOpeningRotate,
    openingScale, setOpeningScale,
    openingOpacity, setOpeningOpacity,
    secondaryMyCardRotate, setSecondaryMyCardRotate,
    secondaryMyCardPosition, setSecondaryMyCardPosition,
    startVideo, setStartVideo,
    coinTextOpacity, setCoinTextOpacity,
    finalGroundRotate, setFinalGroundRotate
  };
}