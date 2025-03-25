import React from "react";
import { Droppable } from "../Droppable";

interface BattleCardProps {
    id: string;
    isMyCard: boolean;
    myTurn: boolean;
    droppedCards: Record<string, string>;
    energy: number;
    hp: number;
    onCardClick?: () => void;
}

export const BattleCard: React.FC<BattleCardProps> = ({
    id,
    isMyCard,
    myTurn,
    droppedCards,
    energy,
    hp,
    onCardClick
}) => {
    const shouldHighlight = !droppedCards[id] && 
        ((isMyCard && myTurn) || (!isMyCard && !myTurn));
    
    return (
        <Droppable id={id}>
            <div 
                className={`w-32 h-44 border-3 rounded-lg ${isMyCard ? 'mb-4' : 'mt-4'} flex items-center justify-center`}
                style={{
                    borderWidth: 2,
                    borderColor: shouldHighlight ? "blue" : "transparent",
                    boxShadow: shouldHighlight
                        ? "0 0 15px 5px rgba(0, 0, 255, 0.6)"
                        : "0 0 0px 3px rgba(255, 255, 255, 1)",
                    borderRadius: "8px",
                    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                }}
                onClick={onCardClick}
            >
                {droppedCards[id] && (
                    <div>
                        {Array(energy >= 5 ? 1 : energy).fill(0).map((_, index) => (
                            <img 
                                key={index} 
                                src="ui/energy.png"
                                className="absolute h-[1.5rem]"
                                style={{paddingLeft: `${index*1.7}rem`}}
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
                        <div 
                            className="bg-green-700 absolute mt-34 p-1 border-4"
                            style={{ 
                                textShadow: "1px 1px 0 #000" 
                            }}
                        >{hp}</div>
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