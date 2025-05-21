import React, { useEffect, useState, useRef } from "react";
import { Droppable } from "../Droppable";
import { data } from "../../data/cards";
import { useAtomValue } from "jotai";
import { myTurnAtom, pokemonPlacementTurnAtom, gameTurnCountAtom } from "../../atom";

interface BattleCardProps {
    id: string;
    isMyCard: boolean;
    droppedCards: Record<string, string>;
    energy: number;
    hp: number;
    isAttack: boolean;
    onCardClick?: () => void;
}

export const BattleCard: React.FC<BattleCardProps> = ({
    id,
    isMyCard,
    droppedCards,
    energy,
    hp,
    isAttack,
    onCardClick
}) => {
    const myTurn = useAtomValue(myTurnAtom);
    const pokemonPlacementTurn = useAtomValue(pokemonPlacementTurnAtom);
    const gameTurnCount = useAtomValue(gameTurnCountAtom);
    
    // 진화 가능 여부 확인
    const canEvolve = droppedCards[id] && 
                     (gameTurnCount - (pokemonPlacementTurn[id] || 0) >= 1);
    
    const shouldHighlight = !droppedCards[id] &&
        ((isMyCard && myTurn) || (!isMyCard && !myTurn));
    
    // 진화 가능한 포켓몬에 대한 특별 하이라이트
    const evolutionHighlight = canEvolve ? 
        "0 0 15px 5px rgba(255, 215, 0, 0.6)" : // 황금색 하이라이트
        "0 0 0px 3px rgba(255, 255, 255, 1)";
    
    // 애니메이션을 위한 상태 추가
    const [isEvolving, setIsEvolving] = useState(false);
    const prevCardRef = useRef<string | null>(null);
    
    // droppedCards[id]가 변경될 때마다 애니메이션 트리거
    useEffect(() => {
        // 카드가 있고, 이전 카드와 다르다면 진화 중
        if (droppedCards[id] && prevCardRef.current !== droppedCards[id]) {
            setIsEvolving(true);
            
            // 애니메이션 시간 후 상태 초기화
            const timer = setTimeout(() => {
                setIsEvolving(false);
            }, 1500); // 애니메이션 지속 시간 늘림
            
            return () => clearTimeout(timer);
        }
        
        // 현재 카드 저장
        prevCardRef.current = droppedCards[id];
    }, [droppedCards[id]]);

    // 진화 애니메이션 클래스 결정
    const animationClass = isEvolving ? 
        (isMyCard ? "cardEntryAnimation" : "cardEntryAnimationReverse") : "";

    return (
        <Droppable id={id}>
            <div
                className={`w-32 h-44 border-3 rounded-lg ${isMyCard ? 'mb-4' : 'mt-4'} flex items-center justify-center`}
                style={{
                    borderWidth: 2,
                    boxShadow: shouldHighlight
                        ? "0 0 15px 5px rgba(0, 255, 255, 0.6)"
                        : evolutionHighlight,
                    borderRadius: "8px",
                    transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: myTurn ? "scale(1)" : "scale(-1, -1)",
                    transformOrigin: "center center",
                    perspective: "1000px",
                }}
                onClick={onCardClick}
            >
                {droppedCards[id] && (
                    <div key={droppedCards[id]} className={`drop-card ${isAttack ? "attack" : ""} ${animationClass}`}>
                        {canEvolve && (
                            <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center z-10 animate-pulse">
                                <span className="text-xs font-bold">↑</span>
                            </div>
                        )}
                        <div
                            className={`absolute text-black font-bold text-3xl mt-[-10]`}
                            style={{
                                textShadow: "-1px 0px white, 0px 1px white, 1px 0px white, 0px -1px white",
                                marginLeft: (hp) >= 100 ? "5rem" : "6rem" // 3자리수면 공간 줄이고, 2자리수면 더 많은 공간 주기
                            }}
                        >{hp}</div>
                        <progress
                            className="text-green-300 progress absolute mt-[20] w-12 ml-20 h-[.7rem] border-3 border-black rounded-full"
                            id="progress"
                            value={`${hp}`}
                            max={`${data[droppedCards[id]].hp}`}
                        ></progress>
                        {Array(energy >= 5 ? 1 : energy).fill(0).map((_, index) => (
                            <img
                                key={index}
                                src="ui/energy.png"
                                className="absolute h-[1.5rem] mt-34"
                                style={{ paddingLeft: `${index * 1.7}rem` }}
                            />
                        ))}
                        {energy >= 5 &&
                            <div
                                className="absolute h-[1.5rem] pl-[2rem] text-white font-bold mt-34 "
                                style={{
                                    textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
                                }}
                            >{energy}</div>
                        }
                        <img
                            src={droppedCards[id]}
                            alt={droppedCards[id]}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>
        </Droppable>
    );
};