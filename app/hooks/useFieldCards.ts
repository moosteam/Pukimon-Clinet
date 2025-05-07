import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { data } from "../data/cards";
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
} from "../atom";

interface UseFieldCardsProps {
    myTurn: boolean;
    droppedCards: Record<string, string>;
    setDroppedCards: (cards: Record<string, string>) => void;
    onEndTurn: () => void;
}

export const useFieldCards = ({
    myTurn,
    droppedCards,
    setDroppedCards,
    onEndTurn
}: UseFieldCardsProps) => {
    const [myBattlePokemonEnergy, setMyBattlePokemonEnergy] = useAtom(myBattlePokemonEnergyAtom);
    const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(myBattlePokemonHPAtom);
    const [enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy] = useAtom(enemyBattlePokemonEnergyAtom);
    const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(enemyBattlePokemonHPAtom);
    
    const [myWaitingEnergy, setMyWaitingEnergy] = useAtom(myWaitingPokemonEnergyAtom);
    const [myWaitingHP, setMyWaitingHP] = useAtom(myWaitingPokemonHPAtom);
    const [enemyWaitingEnergy, setEnemyWaitingEnergy] = useAtom(enemyWaitingPokemonEnergyAtom);
    const [enemyWaitingHP, setEnemyWaitingHP] = useAtom(enemyWaitingPokemonHPAtom);
    
    const [myGameScore, setMyGameScore] = useAtom(myGameScoreAtom);
    const [enemyGameScore, setEnemyGameScore] = useAtom(enemyGameScoreAtom);
    
    const [isReadyToAttack, setIsReadyToAttack] = useState(false);
    const [attackingCard, setAttackingCard] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [isMyAttack, setIsMyAttack] = useState(false);
    const [isEnemyAttack, setIsEnemyAttack] = useState(false);

    useEffect(() => {
        if (myGameScore >= 3) {
            setGameOver(true);
            alert("You win! You've defeated 3 Pokémon!");
        } else if (enemyGameScore >= 3) {
            setGameOver(true);
            alert("You lose! Your opponent has defeated 3 of your Pokémon!");
        }
    }, [myGameScore, enemyGameScore]);

    const findFirstBenchPokemon = (prefix: string): number | null => {
        for (let i = 1; i <= 3; i++) {
            if (droppedCards[`${prefix}_waiting_${i}`]) {
                return i;
            }
        }
        return null;
    };

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

    const handleAttack = (skill: any) => {
        const currentEnergy = attackingCard === 'my_battle' 
            ? myBattlePokemonEnergy 
            : enemyBattlePokemonEnergy;
        
        if (currentEnergy < skill.energy) {
            alert("Not enough energy to use this skill!");
            setIsReadyToAttack(false);
            return;
        }
        
        setIsReadyToAttack(false);
        setIsMyAttack(myTurn);
        setIsEnemyAttack(!myTurn);
        
        setTimeout(() => {
            processAttackLogic(skill);
        }, 3000);
    };

    const processAttackLogic = (skill: any) => {
        if (attackingCard === 'my_battle') {
            const newEnemyHP = enemyBattlePokemonHP - skill.damage;
            setEnemyBattlePokemonHP(newEnemyHP);
            
            if (newEnemyHP <= 0) {
                setMyGameScore(prev => prev + 1);
                const benchIndex = findFirstBenchPokemon('enemy');
                
                if (benchIndex !== null) {
                    const updatedDroppedCards = {...droppedCards};
                    const benchPokemon = updatedDroppedCards[`enemy_waiting_${benchIndex}`];
                    const benchHP = enemyWaitingHP[benchIndex - 1];
                    const benchEnergy = enemyWaitingEnergy[benchIndex - 1];
                    
                    updatedDroppedCards['y_battle'] = benchPokemon;
                    delete updatedDroppedCards[`enemy_waiting_${benchIndex}`];
                    
                    const finalCards = shiftBenchPokemon(updatedDroppedCards, 'enemy', benchIndex);
                    setDroppedCards(finalCards);
                    
                    setEnemyBattlePokemonHP(benchHP);
                    setEnemyBattlePokemonEnergy(benchEnergy);
                    
                    const newWaitingHP = [...enemyWaitingHP];
                    const newWaitingEnergy = [...enemyWaitingEnergy];
                    
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
                    delete droppedCards['y_battle'];
                    setDroppedCards({...droppedCards});
                    
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
            const newMyHP = myBattlePokemonHP - skill.damage;
            setMyBattlePokemonHP(newMyHP);
            
            if (newMyHP <= 0) {
                setEnemyGameScore(prev => prev + 1);
                const benchIndex = findFirstBenchPokemon('my');
                
                if (benchIndex !== null) {
                    const updatedDroppedCards = {...droppedCards};
                    const benchPokemon = updatedDroppedCards[`my_waiting_${benchIndex}`];
                    const benchHP = myWaitingHP[benchIndex - 1];
                    const benchEnergy = myWaitingEnergy[benchIndex - 1];
                    
                    updatedDroppedCards['my_battle'] = benchPokemon;
                    delete updatedDroppedCards[`my_waiting_${benchIndex}`];
                    
                    const finalCards = shiftBenchPokemon(updatedDroppedCards, 'my', benchIndex);
                    setDroppedCards(finalCards);
                    
                    setMyBattlePokemonHP(benchHP);
                    setMyBattlePokemonEnergy(benchEnergy);
                    
                    const newWaitingHP = [...myWaitingHP];
                    const newWaitingEnergy = [...myWaitingEnergy];
                    
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
                    delete droppedCards['my_battle'];
                    setDroppedCards({...droppedCards});
                    
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
        
        setIsMyAttack(false);
        setIsEnemyAttack(false);
        setAttackingCard(null);
        onEndTurn();
    };

    const handleRetreat = () => {
        const currentEnergy = attackingCard === 'my_battle' 
            ? myBattlePokemonEnergy 
            : enemyBattlePokemonEnergy;
        
        if (currentEnergy < 1) {
            alert("Not enough energy to retreat! You need at least 1 energy.");
            setIsReadyToAttack(false);
            return;
        }
        
        const prefix = attackingCard === 'my_battle' ? 'my' : 'enemy';
        const benchIndex = findFirstBenchPokemon(prefix);
        
        if (benchIndex === null) {
            alert("No Pokémon on bench to swap with!");
            setIsReadyToAttack(false);
            return;
        }
        
        const updatedDroppedCards = {...droppedCards};
        
        if (attackingCard === 'my_battle') {
            const battlePokemon = updatedDroppedCards['my_battle'];
            const battleHP = myBattlePokemonHP;
            const battleEnergy = myBattlePokemonEnergy - 1;
            
            const benchPokemon = updatedDroppedCards[`my_waiting_${benchIndex}`];
            const benchHP = myWaitingHP[benchIndex - 1];
            const benchEnergy = myWaitingEnergy[benchIndex - 1];
            
            updatedDroppedCards['my_battle'] = benchPokemon;
            updatedDroppedCards[`my_waiting_${benchIndex}`] = battlePokemon;
            
            setMyBattlePokemonHP(benchHP);
            setMyBattlePokemonEnergy(benchEnergy);
            
            const newWaitingHP = [...myWaitingHP];
            newWaitingHP[benchIndex - 1] = battleHP;
            setMyWaitingHP(newWaitingHP);
            
            const newWaitingEnergy = [...myWaitingEnergy];
            newWaitingEnergy[benchIndex - 1] = battleEnergy;
            setMyWaitingEnergy(newWaitingEnergy);
        } else {
            const battlePokemon = updatedDroppedCards['y_battle'];
            const battleHP = enemyBattlePokemonHP;
            const battleEnergy = enemyBattlePokemonEnergy - 1;
            
            const benchPokemon = updatedDroppedCards[`enemy_waiting_${benchIndex}`];
            const benchHP = enemyWaitingHP[benchIndex - 1];
            const benchEnergy = enemyWaitingEnergy[benchIndex - 1];
            
            updatedDroppedCards['y_battle'] = benchPokemon;
            updatedDroppedCards[`enemy_waiting_${benchIndex}`] = battlePokemon;
            
            setEnemyBattlePokemonHP(benchHP);
            setEnemyBattlePokemonEnergy(benchEnergy);
            
            const newWaitingHP = [...enemyWaitingHP];
            newWaitingHP[benchIndex - 1] = battleHP;
            setEnemyWaitingHP(newWaitingHP);
            
            const newWaitingEnergy = [...enemyWaitingEnergy];
            newWaitingEnergy[benchIndex - 1] = battleEnergy;
            setEnemyWaitingEnergy(newWaitingEnergy);
        }
        
        setDroppedCards(updatedDroppedCards);
        setIsReadyToAttack(false);
        onEndTurn();
    };

    return {
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
    };
}; 