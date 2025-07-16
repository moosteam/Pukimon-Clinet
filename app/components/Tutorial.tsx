"use client"

import { useAtom } from "jotai";
import { tutorialActiveAtom, tutorialMessageAtom, myTurnAtom, gameTurnCountAtom } from "../atom";
import { useEffect, useState } from "react";

export function Tutorial() {
  const [tutorialActive, setTutorialActive] = useAtom(tutorialActiveAtom);
  const [tutorialMessage, setTutorialMessage] = useAtom(tutorialMessageAtom);
  const [myTurn] = useAtom(myTurnAtom);
  const [gameTurnCount] = useAtom(gameTurnCountAtom);
  const [isVisible, setIsVisible] = useState(false);
  const [showAfterDelay, setShowAfterDelay] = useState(false);

  // 10초 후에 튜토리얼 표시 허용
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAfterDelay(true);
    }, 10000); // 10초 후

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 10초가 지나지 않았으면 튜토리얼 표시하지 않음
    if (!showAfterDelay) return;

    // 튜토리얼 메시지 정의
    const getTutorialMessage = () => {
      if (gameTurnCount === 1) {
        if (myTurn) {
          return "배틀필드에 포켓몬 카드를 배치하세요!";
        } else {
          return "상대방이 포켓몬을 배치하는 중입니다.";
        }
      } else if (gameTurnCount === 2) {
        if (myTurn) {
          return "포켓몬에게 에너지를 붙여주세요!";
        } else {
          return "상대방이 에너지를 붙이는 중입니다.";
        }
      } else if (gameTurnCount === 3) {
        if (myTurn) {
          return "포켓몬을 클릭해서 공격하세요!";
        } else {
          return "상대방이 공격을 준비하는 중입니다.";
        }
      }
      return "";
    };

    // 첫 3턴 동안만 튜토리얼 표시
    if (gameTurnCount <= 3) {
      const message = getTutorialMessage();
      if (message) {
        setTutorialMessage(message);
        setTutorialActive(true);
        setIsVisible(true);
      }
    } else {
      setTutorialActive(false);
      setIsVisible(false);
    }
  }, [gameTurnCount, myTurn, setTutorialMessage, setTutorialActive, showAfterDelay]);

  const handleClose = () => {
    setTutorialActive(false);
    setIsVisible(false);
  };

  if (!tutorialActive || !isVisible) return null;

  return (
    <div className="tutorial-container">
      <div className="tutorial-panel">
        <div className="tutorial-header">
          <div className="tutorial-icon">💡</div>
          <h3>튜토리얼</h3>
          <button onClick={handleClose} className="tutorial-close">×</button>
        </div>
        <div className="tutorial-content">
          <p>{tutorialMessage}</p>
        </div>
        <div className="tutorial-step-indicator">
          <span>단계 {gameTurnCount}/3</span>
        </div>
      </div>

      <style jsx>{`
        .tutorial-container {
          position: fixed;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 999999;
          pointer-events: none;
        }

        .tutorial-panel {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #4a9eff;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(74, 158, 255, 0.2);
          backdrop-filter: blur(10px);
          max-width: 180px;
          width: calc(100vw / 3 - 40px);
          max-height: calc(100vh / 3);
          animation: tutorialSlideIn 0.5s ease-out;
          pointer-events: all;
          position: relative;
          overflow: hidden;
        }

        .tutorial-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(74, 158, 255, 0.05) 50%, transparent 70%);
          animation: tutorialShimmer 2s infinite;
          pointer-events: none;
        }

        .tutorial-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 6px;
        }

        .tutorial-icon {
          font-size: 16px;
          animation: tutorialPulse 2s infinite;
        }

        .tutorial-header h3 {
          margin: 0;
          color: #4a9eff;
          font-size: 12px;
          font-weight: 600;
          text-shadow: none;
          flex: 1;
        }

        .tutorial-close {
          background: none;
          border: none;
          color: #666;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .tutorial-close:hover {
          background: rgba(74, 158, 255, 0.1);
          color: #4a9eff;
        }

        .tutorial-content {
          margin-bottom: 8px;
        }

        .tutorial-content p {
          margin: 0;
          color: #333;
          font-size: 11px;
          line-height: 1.3;
          text-shadow: none;
        }

        .tutorial-step-indicator {
          text-align: center;
          padding-top: 6px;
          border-top: 1px solid rgba(74, 158, 255, 0.2);
        }

        .tutorial-step-indicator span {
          color: #4a9eff;
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes tutorialSlideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes tutorialPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes tutorialShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* 회전 영향 방지 */
        .tutorial-container,
        .tutorial-panel,
        .tutorial-header,
        .tutorial-content,
        .tutorial-step-indicator {
          transform-style: flat !important;
        }

        /* 미디어 쿼리 - 작은 화면 대응 */
        @media (max-width: 768px) {
          .tutorial-container {
            left: 10px;
          }
          
          .tutorial-panel {
            max-width: 160px;
            width: calc(100vw / 3 - 20px);
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
} 