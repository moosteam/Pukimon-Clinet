import React from 'react';
import { Droppable } from '../Droppable';
import { useAtomValue } from 'jotai';
import { myTurnAtom, droppedCardsAtom } from '../../atom';

interface BattleCardProps {
    id: string;
    isMyCard: boolean;
    energy: number;
    hp: number;
    isAttack: boolean;
    onCardClick: () => void;
}

export const BattleCard: React.FC<BattleCardProps> = ({
    id,
    isMyCard,
    energy,
    hp,
    isAttack,
    onCardClick
}) => {
    const myTurn = useAtomValue(myTurnAtom);
    const droppedCards = useAtomValue(droppedCardsAtom);

    return (
        <Droppable id={id}>
            <div 
                className={`w-32 h-44 border-2 rounded-lg flex items-center justify-center ${isAttack ? 'animate-attack' : ''}`}
                style={{
                    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: myTurn ? "scale(1)" : "scale(-1, -1)",
                    transformOrigin: "center center",
                    perspective: "1000px"
                }}
                onClick={onCardClick}
            >
                {droppedCards[id] ? (
                    <div className="drop-card">
                        {/* Display energy icons */}
                        {Array(energy >= 5 ? 1 : energy).fill(0).map((_, i) => (
                            <img 
                                key={i} 
                                src="/ui/energy.png"
                                className="absolute h-[1.5rem]"
                                style={{paddingLeft: `${i*1.7}rem`}}
                            />
                        ))}
                        {energy >= 5 &&
                            <div
                                className="absolute h-[1.5rem] pl-[2rem] text-white font-bold"
                                style={{ 
                                    textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" 
                                }}
                            >{energy}</div>
                        }
                        
                        {/* Display HP */}
                        <div
                            className={`absolute text-black font-bold text-xl mt-[-10]`}
                            style={{
                                textShadow: "-1px 0px white, 0px 1px white, 1px 0px white, 0px -1px white",
                                marginLeft: hp >= 100 ? "4.2rem" : "3.2rem" // 3자리수면 공간 줄이고, 2자리수면 더 많은 공간 주기
                            }}
                        >{hp}</div>
                        <progress
                            className="text-green-300 progress absolute mt-[12] w-8 ml-10 h-[.6rem] border-2 border-black rounded-full"
                            id="progress"
                            value="100"
                            max="100"
                            style={{ zIndex: 10 }}
                        ></progress>
                        
                        <img 
                            src={droppedCards[id]} 
                            alt={droppedCards[id]}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="text-gray-400">{isMyCard ? '내 포켓몬' : '상대 포켓몬'}</div>
                )}
            </div>
        </Droppable>
    );
};