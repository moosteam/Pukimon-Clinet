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
    enemyGameScoreAtom
} from "../../atom";
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
    
    // Add the waiting Pokémon atoms
    const [myWaitingEnergy, setMyWaitingEnergy] = useAtom(myWaitingPokemonEnergyAtom);
    const [myWaitingHP, setMyWaitingHP] = useAtom(myWaitingPokemonHPAtom);
    const [enemyWaitingEnergy, setEnemyWaitingEnergy] = useAtom(enemyWaitingPokemonEnergyAtom);
    const [enemyWaitingHP, setEnemyWaitingHP] = useAtom(enemyWaitingPokemonHPAtom);
    
    // Add game score atoms
    const [myGameScore, setMyGameScore] = useAtom(myGameScoreAtom);
    const [enemyGameScore, setEnemyGameScore] = useAtom(enemyGameScoreAtom);
    
    const [isReadyToAttack, setIsReadyToAttack] = useState(false);
    const [attackingCard, setAttackingCard] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    
    // Check for game over condition
    useEffect(() => {
        if (myGameScore >= 3) {
            setGameOver(true);
            alert("You win! You've defeated 3 Pokémon!");
        } else if (enemyGameScore >= 3) {
            setGameOver(true);
            alert("You lose! Your opponent has defeated 3 of your Pokémon!");
        }
    }, [myGameScore, enemyGameScore]);
    
    // Helper function to find the first available bench Pokémon
    const findFirstBenchPokemon = (prefix: string): number | null => {
        for (let i = 1; i <= 3; i++) {
            if (droppedCards[`${prefix}_waiting_${i}`]) {
                return i;
            }
        }
        return null;
    };
    
    // Helper function to shift bench Pokémon after one is moved to battle
    const shiftBenchPokemon = (updatedCards: Record<string, string>, prefix: string, startIndex: number) => {
        for (let i = startIndex; i < 3; i++) {
            if (updatedCards[`${prefix}_waiting_${i+1}`]) {
                updatedCards[`${prefix}_waiting_${i}`] = updatedCards[`${prefix}_waiting_${i+1}`];
                delete updatedCards[`${prefix}_waiting_${i+1}`];
            } else {
                delete updatedCards[`${prefix}_waiting_${i}`];
                break;
            }
        }
        return updatedCards;
    };
    
    // Function to handle attack
    const handleAttack = (skill: any) => {
        // Check if there's enough energy to use this skill
        const currentEnergy = attackingCard === 'my_battle' 
            ? myBattlePokemonEnergy 
            : enemyBattlePokemonEnergy;
        
        if (currentEnergy < skill.energy) {
            alert("Not enough energy to use this skill!");
            setIsReadyToAttack(false);
            return;
        }
        
        setIsReadyToAttack(false);
        
        // Handle attack based on whose turn it is
        if (attackingCard === 'my_battle') {
            // Calculate new HP after damage
            const newEnemyHP = enemyBattlePokemonHP - skill.damage;
            setEnemyBattlePokemonHP(newEnemyHP);
            
            // Check if enemy Pokémon fainted
            if (newEnemyHP <= 0) {
                // Increment player's score
                setMyGameScore(prev => prev + 1);
                
                // Find first available bench Pokémon
                const benchIndex = findFirstBenchPokemon('enemy');
                
                if (benchIndex !== null) {
                    // Move bench Pokémon to battle position
                    const updatedDroppedCards = {...droppedCards};
                    
                    // Store bench Pokémon info before moving
                    const benchPokemon = updatedDroppedCards[`enemy_waiting_${benchIndex}`];
                    const benchHP = enemyWaitingHP[benchIndex - 1];
                    const benchEnergy = enemyWaitingEnergy[benchIndex - 1];
                    
                    // Update battle position with bench Pokémon
                    updatedDroppedCards['y_battle'] = benchPokemon;
                    
                    // Remove the Pokémon from bench
                    delete updatedDroppedCards[`enemy_waiting_${benchIndex}`];
                    
                    // Shift remaining bench Pokémon
                    const finalCards = shiftBenchPokemon(updatedDroppedCards, 'enemy', benchIndex);
                    
                    // Update the dropped cards state
                    setDroppedCards(finalCards);
                    
                    // Update HP and energy for the new battle Pokémon
                    setEnemyBattlePokemonHP(benchHP);
                    setEnemyBattlePokemonEnergy(benchEnergy);
                    
                    // Update bench HP and energy arrays
                    const newWaitingHP = [...enemyWaitingHP];
                    const newWaitingEnergy = [...enemyWaitingEnergy];
                    
                    // Shift HP and energy values
                    for (let i = benchIndex - 1; i < 2; i++) {
                        if (i + 1 < 3) {
                            newWaitingHP[i] = newWaitingHP[i + 1];
                            newWaitingEnergy[i] = newWaitingEnergy[i + 1];
                        } else {
                            newWaitingHP[i] = 0;
                            newWaitingEnergy[i] = 0;
                        }
                    }
                    
                    setEnemyWaitingHP(newWaitingHP);
                    setEnemyWaitingEnergy(newWaitingEnergy);
                } else {
                    // No bench Pokémon available
                    delete droppedCards['y_battle'];
                    setDroppedCards({...droppedCards});
                    
                    // Check if this win gives the player 3 points total
                    const newScore = myGameScore + 1;
                    setMyGameScore(newScore);
                    
                    if (newScore >= 3) {
                        setGameOver(true);
                        alert("You win! You've defeated 3 Pokémon!");
                    } else {
                        alert("Enemy has no more Pokémon in this position!");
                    }
                }
            }
        } else {
            // Calculate new HP after damage
            const newMyHP = myBattlePokemonHP - skill.damage;
            setMyBattlePokemonHP(newMyHP);
            
            // Check if my Pokémon fainted
            if (newMyHP <= 0) {
                // Increment enemy's score
                setEnemyGameScore(prev => prev + 1);
                
                // Find first available bench Pokémon
                const benchIndex = findFirstBenchPokemon('my');
                
                if (benchIndex !== null) {
                    // Move bench Pokémon to battle position
                    const updatedDroppedCards = {...droppedCards};
                    
                    // Store bench Pokémon info before moving
                    const benchPokemon = updatedDroppedCards[`my_waiting_${benchIndex}`];
                    const benchHP = myWaitingHP[benchIndex - 1];
                    const benchEnergy = myWaitingEnergy[benchIndex - 1];
                    
                    // Update battle position with bench Pokémon
                    updatedDroppedCards['my_battle'] = benchPokemon;
                    
                    // Remove the Pokémon from bench
                    delete updatedDroppedCards[`my_waiting_${benchIndex}`];
                    
                    // Shift remaining bench Pokémon
                    const finalCards = shiftBenchPokemon(updatedDroppedCards, 'my', benchIndex);
                    
                    // Update the dropped cards state
                    setDroppedCards(finalCards);
                    
                    // Update HP and energy for the new battle Pokémon
                    setMyBattlePokemonHP(benchHP);
                    setMyBattlePokemonEnergy(benchEnergy);
                    
                    // Update bench HP and energy arrays
                    const newWaitingHP = [...myWaitingHP];
                    const newWaitingEnergy = [...myWaitingEnergy];
                    
                    // Shift HP and energy values
                    for (let i = benchIndex - 1; i < 2; i++) {
                        if (i + 1 < 3) {
                            newWaitingHP[i] = newWaitingHP[i + 1];
                            newWaitingEnergy[i] = newWaitingEnergy[i + 1];
                        } else {
                            newWaitingHP[i] = 0;
                            newWaitingEnergy[i] = 0;
                        }
                    }
                    
                    setMyWaitingHP(newWaitingHP);
                    setMyWaitingEnergy(newWaitingEnergy);
                } else {
                    // No bench Pokémon available
                    delete droppedCards['my_battle'];
                    setDroppedCards({...droppedCards});
                    
                    // Check if this win gives the enemy 3 points total
                    const newScore = enemyGameScore + 1;
                    setEnemyGameScore(newScore);
                    
                    if (newScore >= 3) {
                        setGameOver(true);
                        alert("You lose! Your opponent has defeated 3 of your Pokémon!");
                    } else {
                        alert("You have no more Pokémon in this position!");
                    }
                }
            }
        }
        
        setAttackingCard(null);
        onEndTurn();
    };
    // Function to handle retreat
    const handleRetreat = () => {
        // Check if there's enough energy to retreat (need 1 energy)
        const currentEnergy = attackingCard === 'my_battle' 
            ? myBattlePokemonEnergy 
            : enemyBattlePokemonEnergy;
        
        if (currentEnergy < 1) {
            alert("Not enough energy to retreat! You need at least 1 energy.");
            setIsReadyToAttack(false);
            return;
        }
        
        // Find first available bench Pokémon
        const prefix = attackingCard === 'my_battle' ? 'my' : 'enemy';
        const benchIndex = findFirstBenchPokemon(prefix);
        
        if (benchIndex === null) {
            alert("No Pokémon on bench to swap with!");
            setIsReadyToAttack(false);
            return;
        }
        
        // Create updated cards object
        const updatedDroppedCards = {...droppedCards};
        
        if (attackingCard === 'my_battle') {
            // Store current battle and bench Pokémon info
            const battlePokemon = updatedDroppedCards['my_battle'];
            const battleHP = myBattlePokemonHP;
            const battleEnergy = myBattlePokemonEnergy - 1; // Reduce energy by 1 for retreat
            
            const benchPokemon = updatedDroppedCards[`my_waiting_${benchIndex}`];
            const benchHP = myWaitingHP[benchIndex - 1];
            const benchEnergy = myWaitingEnergy[benchIndex - 1];
            
            // Swap Pokémon
            updatedDroppedCards['my_battle'] = benchPokemon;
            updatedDroppedCards[`my_waiting_${benchIndex}`] = battlePokemon;
            
            // Update HP and energy states
            setMyBattlePokemonHP(benchHP);
            setMyBattlePokemonEnergy(benchEnergy);
            
            // Update bench HP and energy
            const newWaitingHP = [...myWaitingHP];
            newWaitingHP[benchIndex - 1] = battleHP;
            setMyWaitingHP(newWaitingHP);
            
            const newWaitingEnergy = [...myWaitingEnergy];
            newWaitingEnergy[benchIndex - 1] = battleEnergy;
            setMyWaitingEnergy(newWaitingEnergy);
        } else {
            // Store current battle and bench Pokémon info
            const battlePokemon = updatedDroppedCards['y_battle'];
            const battleHP = enemyBattlePokemonHP;
            const battleEnergy = enemyBattlePokemonEnergy - 1; // Reduce energy by 1 for retreat
            
            const benchPokemon = updatedDroppedCards[`enemy_waiting_${benchIndex}`];
            const benchHP = enemyWaitingHP[benchIndex - 1];
            const benchEnergy = enemyWaitingEnergy[benchIndex - 1];
            
            // Swap Pokémon
            updatedDroppedCards['y_battle'] = benchPokemon;
            updatedDroppedCards[`enemy_waiting_${benchIndex}`] = battlePokemon;
            
            // Update HP and energy states
            setEnemyBattlePokemonHP(benchHP);
            setEnemyBattlePokemonEnergy(benchEnergy);
            
            // Update bench HP and energy
            const newWaitingHP = [...enemyWaitingHP];
            newWaitingHP[benchIndex - 1] = battleHP;
            setEnemyWaitingHP(newWaitingHP);
            
            const newWaitingEnergy = [...enemyWaitingEnergy];
            newWaitingEnergy[benchIndex - 1] = battleEnergy;
            setEnemyWaitingEnergy(newWaitingEnergy);
        }
        
        // Update the dropped cards state
        setDroppedCards(updatedDroppedCards);
        
        setIsReadyToAttack(false);
        onEndTurn();
    };
        
    return (
        <div className="z-50 flex flex-row w-full justify-between items-center">
            {/* Display scores */}
            <div className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-lg z-50">
                Your Score: {myGameScore}
            </div>
            <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg z-50">
                Enemy Score: {enemyGameScore}
            </div>
            
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
            
            {isReadyToAttack && !gameOver && (
                <div className="absolute w-full h-full flex items-end justify-end is-ready-to-attack-apr" style={{ zIndex: 9999 }}>
                    <img 
                        src={droppedCards[attackingCard || 'my_battle']} 
                        alt=""
                        onClick={() => {
                            setIsReadyToAttack(false);
                        }}
                        className="mb-12 mr-12 w-60  is-ready-to-attack-inf"
                        style={{ position: 'relative', zIndex: 10000 }}
                    />
                    <div className="flex flex-col w-36 mb-24 mr-12  absolute justify-end items-end"
                        style={{ zIndex: 10001 }}
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