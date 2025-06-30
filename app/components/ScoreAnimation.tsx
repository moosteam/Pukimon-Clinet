import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { myGameScoreAtom, enemyGameScoreAtom } from '../atom';

interface ScoreAnimationProps {
  isVisible: boolean;
  isMyScore: boolean; // true면 내 점수, false면 적 점수
  onAnimationComplete: () => void;
}

export const ScoreAnimation: React.FC<ScoreAnimationProps> = ({
  isVisible,
  isMyScore,
  onAnimationComplete
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showPoint, setShowPoint] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  // ATOM에서 현재 점수 가져오기
  const myGameScore = useAtomValue(myGameScoreAtom);
  const enemyGameScore = useAtomValue(enemyGameScoreAtom);

  // 현재 점수에 따라 애니메이션할 포인트 인덱스 결정
  const currentScore = isMyScore ? myGameScore : enemyGameScore;
  const targetPointIndex = currentScore - 1; // 0부터 시작하므로 -1

  useEffect(() => {
    if (isVisible) {
      // 글로우 효과 시작
      setShowGlow(true);
      
      // 프로필 애니메이션 시작
      setShowProfile(true);
      
      // 1초 후 포인트 애니메이션 시작
      const pointTimer = setTimeout(() => {
        setShowPoint(true);
      }, 1000);
      
      // 3초 후 애니메이션 완료
      const completeTimer = setTimeout(() => {
        setShowProfile(false);
        setShowPoint(false);
        setShowGlow(false);
        onAnimationComplete();
      }, 3000);
      
      return () => {
        clearTimeout(pointTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" style={{
        transform: isMyScore ? 'rotateZ(0deg)' : 'rotateZ(180deg)'
    }}>
      {/* 글로우 효과 */}
      {showGlow && (
        <div className="absolute inset-0 animate-pulse" />
      )}
      
      {/* 메인 애니메이션 컨테이너 - GameBoard 기울기 고려 */}
      <div className="absolute inset-0 flex items-center justify-center" style={{
        transform: 'perspective(800px) rotateX(-15deg) translateY(-2rem)'
      }}>
        {/* 가로 띠 형태의 애니메이션 */}
        <div className={`relative ${showProfile ? 'score-profile-animation' : ''}`}>
          <div className="flex items-center space-x-6">
            {/* 프로필 이미지 */}
            <div className="relative w-20 h-20 rounded-full bg-blue-600 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
              {/* 내부 글로우 효과 */}
              <div className={`absolute inset-0 bg-white/30 transition-all duration-1500 ${
                showGlow ? 'opacity-100' : 'opacity-0'
              }`} />
              
              {/* 프로필 아이콘 */}
              <div className="relative z-10">
                <span className="text-white text-2xl font-bold drop-shadow-lg">
                  {isMyScore ? '⚔️' : '💀'}
                </span>
              </div>
              
              {/* 회전하는 테두리 */}
              <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-white/50 transition-all duration-3000 ${
                showGlow ? 'animate-spin' : ''
              }`} />
            </div>
            
            {/* 포인트 표시 */}
            <div className="flex space-x-2">
              {[0, 1, 2].map((index) => {
                // 현재 채워진 포인트 수 계산
                const filledPoints = isMyScore ? myGameScore : enemyGameScore;
                
                return (
                  <div key={index} className="relative">
                    <div
                      className={`relative w-8 h-8 rounded-full border-2 border-white transition-all duration-800 ${
                        showPoint && index === targetPointIndex
                          ? 'bg-red-500 scale-110 point-fill-animation shadow-lg' 
                          : index <= filledPoints
                          ? 'bg-red-500' // 이미 채워진 포인트
                          : 'bg-gray-800' // 아직 안 채워진 포인트
                      }`}
                      style={{
                        boxShadow: showPoint && index === targetPointIndex
                          ? '0 0 15px rgba(239, 68, 68, 0.8)' 
                          : index <= filledPoints
                          ? '0 0 8px rgba(239, 68, 68, 0.5)' // 이미 채워진 포인트의 글로우
                          : 'none'
                      }}
                    >
                      {/* 포인트 내부 글로우 */}
                      {showPoint && index === targetPointIndex && (
                        <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 