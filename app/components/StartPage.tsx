"use client"

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const DynamicCameraProfile = dynamic(() => import('./CameraProfile').then(mod => ({ default: mod.CameraProfile })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#FFD700] flex items-center justify-center z-[999999]">
    <div className="text-2xl font-bold text-black">카메라 로딩 중...</div>
  </div>
});

interface StartPageProps {
  onStart: (options: {
    useWebOnly: boolean;
    useCamera: boolean;
    profileImage?: string;
    nickname?: string;
  }) => void;
}

export function StartPage({ onStart }: StartPageProps) {
  const [playMode, setPlayMode] = useState<'web' | 'card'>('web');
  const [profileMode, setProfileMode] = useState<'camera' | 'direct'>('direct');
  const [showCamera, setShowCamera] = useState(false);
  const [userProfile, setUserProfile] = useState({
    profileImage: "/ui/player1.png",
    nickname: "포켓마스터"
  });

  const handleStart = () => {
    if (profileMode === 'camera') {
      setShowCamera(true);
    } else {
      onStart({
        useWebOnly: playMode === 'web',
        useCamera: false,
        profileImage: userProfile.profileImage,
        nickname: userProfile.nickname
      });
    }
  };

  const handleProfileSet = (profileImage: string, nickname: string) => {
    setUserProfile({ profileImage, nickname });
    setShowCamera(false);
    onStart({
      useWebOnly: playMode === 'web',
      useCamera: true,
      profileImage,
      nickname
    });
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
    setProfileMode('direct');
  };

  if (showCamera) {
    return (
      <DynamicCameraProfile 
        onProfileSet={handleProfileSet}
        onCancel={handleCameraCancel}
      />
    );
  }

  return (
    <div className="start-page">
      <div className="start-container">
        {/* 푸키몬 로고 */}
        <div className="logo-container">
          <Image
            src="/pukimon.png"
            alt="Pukimon"
            width={300}
            height={120}
            className="logo-image"
          />
        </div>

        {/* 게임 모드 선택 */}
        <div className="section">
          <h3 className="section-title">게임 모드</h3>
          <div className="radio-group">
            <label className={`radio-option ${playMode === 'web' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="playMode"
                value="web"
                checked={playMode === 'web'}
                onChange={() => setPlayMode('web')}
              />
              <span className="radio-text">웹에서만 플레이</span>
            </label>
            <label className={`radio-option ${playMode === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="playMode"
                value="card"
                checked={playMode === 'card'}
                onChange={() => setPlayMode('card')}
              />
              <span className="radio-text">카메라 사용</span>
            </label>
          </div>
        </div>

        {/* 프로필 설정 */}
        <div className="section">
          <h3 className="section-title">프로필 설정</h3>
          <div className="radio-group">
            <label className={`radio-option ${profileMode === 'direct' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="profileMode"
                value="direct"
                checked={profileMode === 'direct'}
                onChange={() => setProfileMode('direct')}
              />
              <span className="radio-text">기본 프로필로 시작</span>
            </label>
            <label className={`radio-option ${profileMode === 'camera' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="profileMode"
                value="camera"
                checked={profileMode === 'camera'}
                onChange={() => setProfileMode('camera')}
              />
              <span className="radio-text">카메라로 프로필 촬영</span>
            </label>
          </div>
        </div>

        {/* 시작 버튼 */}
        <button className="start-button" onClick={handleStart}>
          START
        </button>
      </div>

      <style jsx>{`
        .start-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #FFD700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
        }

        .start-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          padding: 40px;
          max-width: 450px;
          width: 100%;
        }

        .logo-container {
          margin-bottom: 10px;
        }

        .logo-image {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .section {
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .section-title {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .radio-option:hover {
          border-color: #FF8C00;
          background: #fff8f0;
        }

        .radio-option.selected {
          border-color: #FF8C00;
          background: #fff8f0;
        }

        .radio-option input[type="radio"] {
          margin-right: 12px;
          width: 18px;
          height: 18px;
          accent-color: #FF8C00;
        }

        .radio-text {
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }

        .start-button {
          background: #000;
          color: white;
          border: none;
          border-radius: 50%;
          width: 100px;
          height: 100px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          margin-top: 10px;
        }

        .start-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
        }

        .start-button:active {
          transform: scale(0.95);
        }

        /* 애니메이션 효과 */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .start-container > * {
          animation: fadeIn 0.6s ease-out;
        }

        .start-container > *:nth-child(1) { animation-delay: 0.1s; }
        .start-container > *:nth-child(2) { animation-delay: 0.2s; }
        .start-container > *:nth-child(3) { animation-delay: 0.3s; }
        .start-container > *:nth-child(4) { animation-delay: 0.4s; }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .start-container {
            padding: 20px;
            gap: 25px;
          }
          
          .logo-image {
            width: 250px;
            height: auto;
          }
          
          .section {
            padding: 15px;
          }
          
          .section-title {
            font-size: 16px;
          }
          
          .radio-text {
            font-size: 14px;
          }
          
          .start-button {
            width: 80px;
            height: 80px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
} 