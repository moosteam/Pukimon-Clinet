import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  openingRotateAtom,
  openingScaleAtom,
  openingOpacityAtom,
  secondaryMyCardRotateAtom,
  secondaryMyCardPositionAtom,
  startVideoAtom,
  coinTextOpacityAtom,
  coinScaleAtom,
  finalGroundRotateAtom
} from "../atom";

export function useAnimationSequence() {
  const [openingRotate, setOpeningRotate] = useAtom(openingRotateAtom);
  const [openingScale, setOpeningScale] = useAtom(openingScaleAtom);
  const [openingOpacity, setOpeningOpacity] = useAtom(openingOpacityAtom);
  const [secondaryMyCardRotate, setSecondaryMyCardRotate] = useAtom(secondaryMyCardRotateAtom);
  const [secondaryMyCardPosition, setSecondaryMyCardPosition] = useAtom(secondaryMyCardPositionAtom);
  const [startVideo, setStartVideo] = useAtom(startVideoAtom);
  const [coinTextOpacity, setCoinTextOpacity] = useAtom(coinTextOpacityAtom);
  const [coinScale, setCoinScale] = useAtom(coinScaleAtom);
  const [finalGroundRotate, setFinalGroundRotate] = useAtom(finalGroundRotateAtom);

  useEffect(() => {
    // 초기 상태 설정
    setOpeningRotate(120);
    setOpeningScale(1.5);
    setOpeningOpacity(0);
    setCoinScale(1); // 초기 스케일 설정

    // 애니메이션 시퀀스 정의
    const animationSequence = [
      {
        time: 0,
        action: () => {
          setOpeningRotate(0);
          setOpeningScale(1);
          setSecondaryMyCardRotate(-20);
          setSecondaryMyCardPosition(0);
        }
      },
      {
        time: 2400,
        action: () => {
          setSecondaryMyCardRotate(20);
          setSecondaryMyCardPosition(60);
          setOpeningScale(1.6);
        }
      },
      {
        time: 2600,
        action: () => {
          setStartVideo(true);
        }
      },
      {
        time: 4000,
        action: () => {
          setOpeningScale(2.4);
          setCoinTextOpacity(100);
          setCoinScale(1); // 코인 표시 시 원래 크기
        }
      },
      {
        time: 5000, // 사라지기 시작하는 시간
        action: () => {
          setCoinScale(0.8); // 스케일 감소 시작
        }
      },
      {
        time: 5300, // 더 작아지는 시간
        action: () => {
          setCoinScale(0.5); // 더 작게
        }
      },
      {
        time: 5500,
        action: () => {
          setOpeningScale(1);
          setCoinTextOpacity(0);
          setCoinScale(0.2); // 아주 작게
        }
      },
      {
        time: 6000,
        action: () => {
          setStartVideo(false);
          setCoinScale(0); // 완전히 사라짐
        }
      },
      {
        time: 7000,
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
    coinScale, setCoinScale,
    finalGroundRotate, setFinalGroundRotate
  };
}