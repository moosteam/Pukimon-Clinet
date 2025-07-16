import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { myGameScoreAtom, enemyGameScoreAtom } from '../atom';

interface ScoreAnimationProps {
  isVisible: boolean;
  isMyScore: boolean;
  onAnimationComplete: () => void;
  profileImg?: string;
  nickname?: string;
}

export const ScoreAnimation: React.FC<ScoreAnimationProps> = ({
  isVisible,
  isMyScore,
  onAnimationComplete,
  profileImg = "/ui/player1.png",
  nickname = "포켓마스터"
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showScoreGlow, setShowScoreGlow] = useState(false);

  const myGameScore = useAtomValue(myGameScoreAtom);
  const enemyGameScore = useAtomValue(enemyGameScoreAtom);

  const currentScore = isMyScore ? myGameScore : enemyGameScore;

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      
      // 0.8초 후 점수 글로우 효과
      const glowTimer = setTimeout(() => {
        setShowScoreGlow(true);
      }, 800);
      
      // 2.5초 후 애니메이션 완료
      const completeTimer = setTimeout(() => {
        setShowAnimation(false);
        setShowScoreGlow(false);
        onAnimationComplete();
      }, 2500);
      
      return () => {
        clearTimeout(glowTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <>
      {/* 전체 화면 오버레이 - GameBoard transform 완전 무시 */}
      <div 
        className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-none"
        style={{ 
          transform: 'none !important',
          perspective: 'none !important',
          transformStyle: 'flat',
          isolation: 'isolate'
        }}
      >
        {/* 배경 어두운 오버레이 (블러 제거) */}
        <div 
          className="absolute inset-0 " 
          style={{ transform: 'none' }}
        />
        
        {/* 메인 컨테이너 */}
        <div 
          className={`
            relative transition-all duration-700 ease-out
            ${showAnimation ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8'}
          `}
          style={{ 
            transform: showAnimation 
              ? 'scale(1) translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' 
              : 'scale(0.75) translateY(8px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
            transformStyle: 'flat',
            perspective: 'none'
          }}
        >
          
          {/* 글로우 배경 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-sky-300/40 to-blue-500/30 rounded-3xl blur-2xl scale-110" />
          
          {/* 프로필 이미지 */}
          <div className="relative -mb-16 z-20 flex justify-center">
            <div className="relative">
              {/* 프로필 외곽 글로우 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-300 rounded-full blur-lg scale-110 opacity-60" />
              
              {/* 프로필 컨테이너 */}
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white via-blue-50 to-blue-100 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
                  <img
                    src={profileImg}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                </div>
              </div>
              
              {/* 프로필 테두리 애니메이션 */}
              <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-pulse" />
            </div>
          </div>
          
          {/* 메인 카드 */}
          <div className="relative bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 rounded-3xl shadow-2xl p-8 pt-20 min-w-[480px]">
            
            {/* 카드 내부 글로우 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl" />
            
            {/* 닉네임 */}
            <div className="text-center mb-8">
              <h2 className="text-white text-3xl font-black tracking-wide drop-shadow-lg">
                {nickname}
              </h2>
            </div>
            
            {/* 점수 표시 */}
            <div className="flex justify-center items-center gap-8">
              {[1, 2, 3].map((num) => {
                const isActive = num <= currentScore;
                const isCurrent = num === currentScore;
                
                return (
                  <div key={num} className="relative">
                    
                    {/* 점수 글로우 배경 */}
                    {isCurrent && showScoreGlow && (
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl scale-150 opacity-60 animate-pulse" />
                    )}
                    
                    {/* 점수 원 */}
                    <div
                      className={`
                        relative w-20 h-20 rounded-full flex items-center justify-center
                        font-black text-4xl border-4 transition-all duration-500
                        ${isActive 
                          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 text-blue-900 shadow-2xl' 
                          : 'bg-gradient-to-br from-blue-200 to-blue-300 border-blue-100 text-blue-600 opacity-60'
                        }
                        ${isCurrent && showScoreGlow ? 'scale-110 animate-bounce' : ''}
                      `}
                      style={{
                        boxShadow: isActive 
                          ? '0 0 30px rgba(255, 235, 59, 0.6), 0 8px 25px rgba(0, 0, 0, 0.3)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {num}
                      
                      {/* 활성 점수 내부 글로우 */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                      )}
                    </div>
                    
                    {/* 점수 하이라이트 링 */}
                    {isCurrent && showScoreGlow && (
                      <div className="absolute inset-0 border-4 border-yellow-300 rounded-full animate-ping opacity-75" />
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* 하단 장식 */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-b-3xl" />
          </div>
          
          {/* 카드 하단 그림자 */}
          <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 rounded-full blur-xl" />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: scale(1.1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          40%, 43% {
            transform: scale(1.15) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
      `}</style>
    </>
  );
}; 