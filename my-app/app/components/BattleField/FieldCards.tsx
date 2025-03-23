import { Droppable } from "../Droppable";
import { useState } from "react";
import { useAtom } from "jotai";

import { data } from "../../data/cards";
import { myBattlePokemonEnergyAtom, myBattlePokemonHPAtom, enemyBattlePokemonEnergyAtom, enemyBattlePokemonHPAtom } from "../../atom";
import { Draggable } from "../Draggable";
import { BattleCard } from "./BattleCard";
import { DeckArea } from "../Area/DeckArea";

interface FieldCardsProps {
    onEndTurn: any;
    myTurn: any;
    droppedCards: Record<string, string>;
}

export const FieldCards: React.FC<FieldCardsProps> = ({
    onEndTurn,
    myTurn,
    droppedCards,
}) => {
    
    const [myBattlePokemonEnergy, setMyBattlePokemonEnergy] = useAtom(myBattlePokemonEnergyAtom);
    const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(myBattlePokemonHPAtom);
    const [enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy] = useAtom(enemyBattlePokemonEnergyAtom);
    const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(enemyBattlePokemonHPAtom);
    
    const [isReadyToAttack, setIsReadyToAttack] = useState(false);
    
    return (
        <div className="z-50 flex flex-row w-full justify-between items-center">
            {isReadyToAttack && (
                <div className="absolute w-full h-full flex items-center z-1">
                    <img src={droppedCards['my_battle']} alt=""
                        onClick={() => {
                            setIsReadyToAttack(false);
                        }}
                    />
                    <div className="flex flex-col w-36 m-4">
                        {data[droppedCards['my_battle']].skill.map((skill, index) => (
                            <div key={index} className="bg-gray-300 text-gray-900 p-3 rounded-lg shadow-lg border-2 border-gray-400 z-10"
                                onClick={() => {
                                    setIsReadyToAttack(false);
                                    alert("Attack");
                                    setEnemyBattlePokemonHP(prev => prev - skill.damage);
                                    onEndTurn();
                                }}
                            >
                                <div className="flex flex-row justify-between">
                                    <div>{skill.name}</div>
                                    <div>{skill.damage}</div>
                                </div>
                                <div>필요에너지 : {skill.energy}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* 적의 효과칸과 덱 */}
            <DeckArea isMyDeck={false} myTurn={myTurn} onEndTurn={onEndTurn} />
            
            {/* 배틀 필드 */}
            <div>
                <BattleCard 
                    id="y_battle"
                    isMyCard={false}
                    myTurn={myTurn}
                    droppedCards={droppedCards}
                    energy={enemyBattlePokemonEnergy}
                    hp={enemyBattlePokemonHP}
                />
                
                <BattleCard 
                    id="my_battle"
                    isMyCard={true}
                    myTurn={myTurn}
                    droppedCards={droppedCards}
                    energy={myBattlePokemonEnergy}
                    hp={myBattlePokemonHP}
                    onCardClick={() => setIsReadyToAttack(true)}
                />
            </div>
            
            {/* 나의 효과칸과 덱 */}
            <DeckArea isMyDeck={true} myTurn={myTurn} onEndTurn={onEndTurn} />
        </div>
    );
};