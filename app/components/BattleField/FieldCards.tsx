import { Droppable } from "../Droppable";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { data } from "../../data/cards";

import { 
    myBattlePokemonEnergyAtom, 
    myBattlePokemonHPAtom, 
    enemyBattlePokemonEnergyAtom, 
    enemyBattlePokemonHPAtom,
    myWaitingPokemonEnergyAtom,
    myWaitingPokemonHPAtom,
    enemyWaitingPokemonEnergyAtom,
    enemyWaitingPokemonHPAtom,
    myGameScoreAtom,
    enemyGameScoreAtom,
    myTurnAtom,
    droppedCardsAtom,
    openingRotateAtom,
    finalGroundRotateAtom
} from "../../atom";
import { Draggable } from "../Draggable";
import { BattleCard } from "./BattleCard";
import { DeckArea } from "../Area/DeckArea";
import { scale } from "framer-motion";
import { useFieldCards } from "../../hooks/useFieldCards";
import SlidingBanner from "../SlidingBanner";
import { useCardManagement } from '../../hooks/useCardManagement';

interface FieldCardsProps {
    onEndTurn: any;
}

export const BattleFieldCards: React.FC<FieldCardsProps> = ({ onEndTurn }) => {
    // Jotai atom에서 직접 상태 가져오기
    const [myTurn] = useAtom(myTurnAtom);
    const [droppedCards, setDroppedCards] = useAtom(droppedCardsAtom);
    
    const {
        isReadyToAttack,
        setIsReadyToAttack,
        attackingCard,
        setAttackingCard,
        gameOver,
        isMyAttack,
        isEnemyAttack,
        handleAttack,
        handleRetreat,
        myBattlePokemonEnergy,
        myBattlePokemonHP,
        enemyBattlePokemonEnergy,
        enemyBattlePokemonHP,
        myGameScore,
        enemyGameScore
    } = useFieldCards({
        myTurn,
        droppedCards,
        setDroppedCards,
        onEndTurn
    });

    const [showAttackEffect, setShowAttackEffect] = useState(false);
    const [attackPosition, setAttackPosition] = useState<'opponent' | 'player'>('opponent');

    useEffect(() => {
        if (isMyAttack || isEnemyAttack) {
            // 공격 위치 설정 - 내 턴일 때는 상대방 위치에, 상대방 턴일 때는 내 위치에
            setAttackPosition(myTurn ? 'opponent' : 'player');
            
            // 1.75초 후에 이펙트 표시
            const timer = setTimeout(() => {
                setShowAttackEffect(true);
            }, 1600);

            return () => {
                clearTimeout(timer);
                setShowAttackEffect(false);
            };
        }
    }, [isMyAttack, isEnemyAttack, myTurn]);

    return (
        <div className={`z-50 flex flex-row w-full justify-between items-center`}>
            {/* Display scores */}
            {gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">
                            {myGameScore >= 3 ? "You Win!" : "You Lose!"}
                        </h2>
                        <p className="mb-4">Final Score: {myGameScore} - {enemyGameScore}</p>
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => window.location.reload()}
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {
                (isMyAttack || isEnemyAttack) &&       
                <SlidingBanner
                    title="트로피컬 해머"
                    subtitle="알로라 나시"
                    bgColor="bg-green-600"
                    textColor="text-white"
                    tiltAngle="-8deg"
                    bottomOffset="bottom-10"
                    isReverse={isEnemyAttack}
                />
            }

            {
                showAttackEffect &&       
                <div className={`attack-effect ${attackPosition}`}>
                    <video
                        autoPlay
                        muted={false}
                        playsInline
                        onEnded={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.remove();
                            setShowAttackEffect(false);
                        }}
                    >
                        <source src="/Bomb.webm" type="video/webm" />
                    </video>
                </div>
            }
            
            {isReadyToAttack && !gameOver && (
                <div className={`${myTurn ? 'items-end justify-end w-full h-full ' : 'items-start justify-start  w-[100%] h-[90%]'} absolute flex  is-ready-to-attack-apr`} style={{ zIndex: 9999 }}>
                    <img 
                        src={droppedCards[attackingCard || 'my_battle']} 
                        alt=""
                        onClick={() => {
                            setIsReadyToAttack(false);
                        }}
                        className={`m-12 w-60 is-ready-to-attack-inf ${!myTurn ? 'scale-x-[-1] scale-y-[-1]' : ''}`}
                        style={{ 
                            position: 'relative', 
                            zIndex: 10000,
                            transition: 'transform 0.3s ease'
                        }}
                    />
                    <div className={`flex flex-col w-36 my-24 mx-12 absolute justify-end items-end ${!myTurn ? 'scale-x-[-1] scale-y-[-1]' : ''}`}
                        style={{ 
                            zIndex: 10001,
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        {data[droppedCards[attackingCard || 'my_battle']].skill.map((skill, index) => (
                            <div 
                                key={index} 
                                className="
                                    mb-2
                                    p-3 
                                    rounded-lg 
                                    shadow-lg 
                                    border-2 
                                    border-gray-400 
                                    z-9 
                                    w-72
                                    cursor-pointer
                                    font-bold
                                    text-black
                                    "
                                style={{
                                    background: 'linear-gradient(135deg, #ABABAB 0%, #EDEDED 50%, #ABABAB 100%)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.2)',
                                }}
                                onClick={() => handleAttack(skill)}
                            >
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex items-center">
                                        {Array(skill.energy >= 5 ? 1 : skill.energy).fill(0).map((_, i) => (
                                            <img 
                                                key={i} 
                                                src="/ui/energy.png"
                                                className="h-[1.5rem]"
                                                style={{marginLeft: i > 0 ? '-0.5rem' : '0'}}
                                            />
                                        ))}
                                        {skill.energy >= 5 &&
                                            <span className="ml-1 font-bold">{skill.energy}</span>
                                        }
                                    </div>
                                    <div>{skill.name}</div>
                                    <div>{skill.damage}</div>
                                </div>
                            </div>
                        ))}
                        <div
                          className="
                            bg-gray-300 
                            text-gray-900 
                            flex
                            items-center
                            justify-between
                            p-3
                            rounded-lg 
                            shadow-lg 
                            border-2 
                            border-gray-400 
                            z-10
                            font-bold
                            w-48
                            h-8
                            "
                          onClick={handleRetreat}
                        >
                            {Array(data[droppedCards[attackingCard || 'my_battle']].retreatCost).fill(0).map((_, i) => (
                                <img 
                                    key={i} 
                                    src="/ui/energy.png"
                                    className="h-[1rem]"
                                    style={{marginLeft: i > 0 ? '-0.5rem' : '0'}}
                                />
                            ))}
                            <div>후퇴</div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 적의 효과칸과 덱 */}
            <DeckArea isMyDeck={false} onEndTurn={onEndTurn} />
            
            {/* 배틀 필드 */}
            <div>
                <BattleCard 
                    id="y_battle"
                    isMyCard={false}
                    energy={enemyBattlePokemonEnergy}
                    hp={enemyBattlePokemonHP}
                    isAttack={isEnemyAttack}
                    onCardClick={() => {
                        if (!myTurn && droppedCards['y_battle']) {
                            setAttackingCard('y_battle');
                            setIsReadyToAttack(true);
                        }
                    }}
                />
                
                <BattleCard 
                    id="my_battle"
                    isMyCard={true}
                    energy={myBattlePokemonEnergy}
                    hp={myBattlePokemonHP}
                    isAttack={isMyAttack}
                    onCardClick={() => {
                        if (myTurn && droppedCards['my_battle']) {
                            setAttackingCard('my_battle');
                            setIsReadyToAttack(true);
                        }
                    }}
                />
            </div>
            
            {/* 나의 효과칸과 덱 */}
            <DeckArea isMyDeck={true} onEndTurn={onEndTurn} />
        </div>
    );
};

// FieldCards 컴포넌트는 이미 Jotai atom을 사용하고 있으므로 변경 필요 없음
export const FieldCards: React.FC<FieldCardsProps> = ({ onEndTurn }) => {
    const [myTurn] = useAtom(myTurnAtom);
    const [droppedCards] = useAtom(droppedCardsAtom);
    const [openingRotate, setOpeningRotate] = useAtom(openingRotateAtom);
    const [finalGroundRotate, setFinalGroundRotate] = useAtom(finalGroundRotateAtom);
    
    const { onEndTurn: endTurnHandler } = useCardManagement();

    const handleEndTurn = () => {
        endTurnHandler(openingRotate, setOpeningRotate, finalGroundRotate, setFinalGroundRotate);
        onEndTurn();
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <button 
                onClick={handleEndTurn}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                {myTurn ? '내 턴 종료' : '상대 턴 종료'}
            </button>
        </div>
    )
}