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
    setDroppedCards: (cards: Record<string, string>) => void;
}

export const FieldCards: React.FC<FieldCardsProps> = ({
    onEndTurn,
    myTurn,
    droppedCards,
    setDroppedCards,
}) => {
    
    const [myBattlePokemonEnergy, setMyBattlePokemonEnergy] = useAtom(myBattlePokemonEnergyAtom);
    const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(myBattlePokemonHPAtom);
    const [enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy] = useAtom(enemyBattlePokemonEnergyAtom);
    const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(enemyBattlePokemonHPAtom);
    
    const [isReadyToAttack, setIsReadyToAttack] = useState(false);
    const [attackingCard, setAttackingCard] = useState<string | null>(null);
    
    // Helper function to find the first available bench Pokémon
    const findFirstBenchPokemon = (prefix: string): number | null => {
        for (let i = 1; i <= 5; i++) {
            if (droppedCards[`${prefix}_bench_${i}`]) {
                return i;
            }
        }
        return null;
    };
    
    // Helper function to shift bench Pokémon after one is moved to battle
    const shiftBenchPokemon = (updatedCards: Record<string, string>, prefix: string, startIndex: number) => {
        for (let i = startIndex; i < 5; i++) {
            if (updatedCards[`${prefix}_bench_${i+1}`]) {
                updatedCards[`${prefix}_bench_${i}`] = updatedCards[`${prefix}_bench_${i+1}`];
                delete updatedCards[`${prefix}_bench_${i+1}`];
            } else {
                delete updatedCards[`${prefix}_bench_${i}`];
                break;
            }
        }
        return updatedCards;
    };
        
    return (
        <div className="z-50 flex flex-row w-full justify-between items-center">
            {isReadyToAttack && (
                <div className="absolute w-full h-full flex items-center z-1">
                    <img 
                        src={droppedCards[attackingCard || 'my_battle']} 
                        alt=""
                        onClick={() => {
                            setIsReadyToAttack(false);
                        }}
                    />
                    <div className="flex flex-col w-36 m-4">
                        {data[droppedCards[attackingCard || 'my_battle']].skill.map((skill, index) => (
                            <div key={index} className="bg-gray-300 text-gray-900 p-3 rounded-lg shadow-lg border-2 border-gray-400 z-10"
                                onClick={() => {
                                    setIsReadyToAttack(false);
                                    
                                    // Handle attack based on whose turn it is
                                    if (attackingCard === 'my_battle') {
                                        // Calculate new HP after damage
                                        const newEnemyHP = enemyBattlePokemonHP - skill.damage;
                                        setEnemyBattlePokemonHP(newEnemyHP);
                                        
                                        // Check if enemy Pokémon fainted
                                        if (newEnemyHP <= 0) {
                                            // Find first available bench Pokémon
                                            const benchIndex = findFirstBenchPokemon('y');
                                            
                                            if (benchIndex !== null) {
                                                // Move bench Pokémon to battle position
                                                const updatedDroppedCards = {...droppedCards};
                                                updatedDroppedCards['y_battle'] = updatedDroppedCards[`y_bench_${benchIndex}`];
                                                
                                                // Shift remaining bench Pokémon
                                                const finalCards = shiftBenchPokemon(updatedDroppedCards, 'y', benchIndex);
                                                
                                                // Update the dropped cards state
                                                setDroppedCards(finalCards);
                                                
                                                // Reset HP and energy for the new battle Pokémon
                                                setEnemyBattlePokemonHP(100); // Default HP value
                                                setEnemyBattlePokemonEnergy(0); // Reset energy
                                            } else {
                                                // No bench Pokémon available - game over
                                                alert("You win! Enemy has no more Pokémon!");
                                                // Reset game state or redirect to victory screen
                                            }
                                        }
                                    } else {
                                        // Calculate new HP after damage
                                        const newMyHP = myBattlePokemonHP - skill.damage;
                                        setMyBattlePokemonHP(newMyHP);
                                        
                                        // Check if my Pokémon fainted
                                        if (newMyHP <= 0) {
                                            // Find first available bench Pokémon
                                            const benchIndex = findFirstBenchPokemon('my');
                                            
                                            if (benchIndex !== null) {
                                                // Move bench Pokémon to battle position
                                                const updatedDroppedCards = {...droppedCards};
                                                updatedDroppedCards['my_battle'] = updatedDroppedCards[`my_bench_${benchIndex}`];
                                                
                                                // Shift remaining bench Pokémon
                                                const finalCards = shiftBenchPokemon(updatedDroppedCards, 'my', benchIndex);
                                                
                                                // Update the dropped cards state
                                                setDroppedCards(finalCards);
                                                
                                                // Reset HP and energy for the new battle Pokémon
                                                setMyBattlePokemonHP(100); // Default HP value
                                                setMyBattlePokemonEnergy(0); // Reset energy
                                            } else {
                                                // No bench Pokémon available - game over
                                                alert("You lose! You have no more Pokémon!");
                                                // Reset game state or redirect to defeat screen
                                            }
                                        }
                                    }
                                    
                                    setAttackingCard(null);
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
                    myTurn={myTurn}
                    droppedCards={droppedCards}
                    energy={myBattlePokemonEnergy}
                    hp={myBattlePokemonHP}
                    onCardClick={() => {
                        if (myTurn && droppedCards['my_battle']) {
                            setAttackingCard('my_battle');
                            setIsReadyToAttack(true);
                        }
                    }}
                />
            </div>
            
            {/* 나의 효과칸과 덱 */}
            <DeckArea isMyDeck={true} myTurn={myTurn} onEndTurn={onEndTurn} />
        </div>
    );
};