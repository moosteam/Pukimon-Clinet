"use client"

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useAtom } from "jotai";
import { showStartPageAtom, gameOptionsAtom, userProfileAtom } from "./atom";

// 동적 import로 SSR 비활성화
const DynamicGameApp = dynamic(() => import('./components/GameApp'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#C2DAF6] flex items-center justify-center">
    <div className="text-2xl font-bold">Loading...</div>
  </div>
});

const DynamicStartPage = dynamic(() => import('./components/StartPage').then(mod => ({ default: mod.StartPage })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#FFD700] flex items-center justify-center">
    <div className="text-2xl font-bold">Loading...</div>
  </div>
});

export default function App() {
  const [showStartPage, setShowStartPage] = useAtom(showStartPageAtom);
  const [gameOptions, setGameOptions] = useAtom(gameOptionsAtom);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);

  const handleStartGame = (options: { 
    useWebOnly: boolean; 
    useCamera: boolean;
    profileImage?: string;
    nickname?: string;
  }) => {
    setGameOptions(options);
    
    // 프로필 정보가 있으면 업데이트
    if (options.profileImage && options.nickname) {
      setUserProfile({
        profileImage: options.profileImage,
        nickname: options.nickname
      });
    }
    
    // START 버튼 클릭 시 게임 화면으로 전환
    setShowStartPage(false);
  };

  // 시작페이지 표시
  if (showStartPage) {
    return <DynamicStartPage onStart={handleStartGame} />;
  }
  
  return <DynamicGameApp />;
}