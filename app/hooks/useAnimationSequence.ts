import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import {
  boardRotateZAtom,
  boardScaleAtom,
  boardOpacityAtom,
  playerCardRotateAtom,
  playerCardPositionAtom,
  startVideoAtom,
  coinTextOpacityAtom,
  boardRotateXAtom
} from "../atom";

export function useAnimationSequence() {
  const [boardRotateZ, setBoardRotateZ] = useAtom(boardRotateZAtom);
  const [boardScale, setBoardScale] = useAtom(boardScaleAtom);
  const [boardOpacity, setBoardOpacity] = useAtom(boardOpacityAtom);
  const [playerCardRotate, setPlayerCardRotate] = useAtom(playerCardRotateAtom);
  const [playerCardPosition, setPlayerCardPosition] = useAtom(playerCardPositionAtom);
  const [startVideo, setStartVideo] = useAtom(startVideoAtom);
  const [coinTextOpacity, setCoinTextOpacity] = useAtom(coinTextOpacityAtom);
  const [boardRotateX, setBoardRotateX] = useAtom(boardRotateXAtom);

  const startAnimation = useCallback(() => {
    // 초기 상태 설정
    setBoardRotateZ(120);
    setBoardScale(1.5);
    setBoardOpacity(0);

    // 애니메이션 시퀀스 정의
    const sequence = [
      { delay: 0, action: () => setBoardRotateZ(70) },
      { delay: 1000, action: () => setBoardOpacity(100) },
      { delay: 2000, action: () => setPlayerCardRotate(-30) },
      { delay: 2500, action: () => setPlayerCardPosition(-130) },
      { delay: 3000, action: () => setBoardScale(0.5) },
      { delay: 4000, action: () => setStartVideo(true) },
      { delay: 5000, action: () => setCoinTextOpacity(100) },
      { delay: 6000, action: () => setBoardRotateX(0) },
    ];

    // 각 애니메이션 단계 실행
    sequence.forEach(({ delay, action }) => {
      setTimeout(action, delay);
    });
  }, [setBoardRotateZ, setBoardScale, setBoardOpacity, setPlayerCardRotate, setPlayerCardPosition, setStartVideo, setCoinTextOpacity, setBoardRotateX]);

  return {
    boardRotateZ,
    boardScale,
    boardOpacity,
    playerCardRotate,
    playerCardPosition,
    startVideo,
    coinTextOpacity,
    boardRotateX,
    startAnimation
  };
}