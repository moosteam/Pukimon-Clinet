import { DragEndEvent } from '@dnd-kit/core';
import { data } from '../data/cards';
import { useAtom, useAtomValue } from 'jotai';
import { 
  myTurnAtom, 
  myHandListAtom, 
  enemyHandListAtom,
  myBattlePokemonEnergyAtom,
  myBattlePokemonHPAtom,
  enemyBattlePokemonEnergyAtom,
  enemyBattlePokemonHPAtom,
  myWaitingHPAtom,
  myWaitingEnergyAtom,
  enemyWaitingHPAtom,
  enemyWaitingEnergyAtom,
  isNowTurnGiveEnergyAtom,
  droppedCardsAtom,
} from '../atom';

export function useDragHandlers() {
  const myTurn = useAtomValue(myTurnAtom);
  
  // useGameState 대신 jotai의 atom 사용
  const [myHandList, setMyHandList] = useAtom(myHandListAtom);
  const [enemyHandList, setEnemyHandList] = useAtom(enemyHandListAtom);
  const [myBattlePokemonEnergy, setMyBattlePokemonEnergy] = useAtom(myBattlePokemonEnergyAtom);
  const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(myBattlePokemonHPAtom);
  const [enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy] = useAtom(enemyBattlePokemonEnergyAtom);
  const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(enemyBattlePokemonHPAtom);
  const [myWaitingHP, setMyWaitingHP] = useAtom(myWaitingHPAtom);
  const [myWaitingEnergy, setMyWaitingEnergy] = useAtom(myWaitingEnergyAtom);
  const [enemyWaitingHP, setEnemyWaitingHP] = useAtom(enemyWaitingHPAtom);
  const [enemyWaitingEnergy, setEnemyWaitingEnergy] = useAtom(enemyWaitingEnergyAtom);
  const [isNowTurnGiveEnergy, setIsNowTurnGiveEnergy] = useAtom(isNowTurnGiveEnergyAtom);
  const [droppedCards, setDroppedCards] = useAtom(droppedCardsAtom);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const cardName = active.data.current?.imgLink as string;
    const dropzoneId = over.id as string;
    const isMyCard = cardId.startsWith('card-');
    const isEnemyCard = cardId.startsWith('enemycard-');

    if (cardId === "energy") {
      setIsNowTurnGiveEnergy(true);
      if (dropzoneId === 'my_battle') {
        setMyBattlePokemonEnergy(prev => prev + 1);
      }
      else if (dropzoneId === 'y_battle') {
        setEnemyBattlePokemonEnergy(prev => prev + 1);
      }
      // Handle energy for waiting/bench Pokémon
      // Check enemy first to avoid matching "my" in "enemy"
      else if (dropzoneId.includes('enemy_waiting_')) {
        // Extract the waiting position number (1, 2, or 3)
        const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
        
        // Make sure there's a Pokémon in this position
        if (droppedCards[dropzoneId]) {
          // Update energy for the specific waiting position
          const newEnergy = [...enemyWaitingEnergy];
          newEnergy[waitingPosition] = newEnergy[waitingPosition] + 1;
          setEnemyWaitingEnergy(newEnergy);
        }
      }
      else if (dropzoneId.includes('my_waiting_')) {
        // Extract the waiting position number (1, 2, or 3)
        const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
        
        // Make sure there's a Pokémon in this position
        if (droppedCards[dropzoneId]) {
          // Update energy for the specific waiting position
          const newEnergy = [...myWaitingEnergy];
          newEnergy[waitingPosition] = newEnergy[waitingPosition] + 1;
          setMyWaitingEnergy(newEnergy);
        }
      }
      return;
    }

    // Validate turn and ownership
    if ((myTurn && !isMyCard) || (!myTurn && !isEnemyCard)) return;

    // Get card index from ID
    const index = parseInt(cardId.split('-')[1]);

    // 이미 카드가 드롭되있으면 
    if (droppedCards[dropzoneId]) {
      console.log("이미 카드가 드롭됨 : " + droppedCards[dropzoneId]);
      // 진화체여야 낼 수 있음
      if (droppedCards[dropzoneId] !== data[cardName]?.beforeEvo) {
        console.log("진화체가 아님");
        return;
      }
    }
    // 카드가 없다면
    else {
      // 진화체가 없는 카드만 낼 수 있음
      if (data[cardName]?.beforeEvo !== "") {
        return;
      }
    }

    // Battle area handling
    if (dropzoneId === 'my_battle' || dropzoneId === 'y_battle') {
      setDroppedCards(({...droppedCards, [dropzoneId]: cardName }));
      if (myTurn) {
        setMyBattlePokemonHP(data[cardName].hp);
        setMyHandList(prev => prev.filter((_, i) => i !== index));
      } else {
        setEnemyBattlePokemonHP(data[cardName].hp);
        setEnemyHandList(prev => prev.filter((_, i) => i !== index));
      }
    }
    // Waiting area handling - Requires battle area card
    else if (dropzoneId.includes('waiting_')) {
      // Check if corresponding battle area has a card
      const battleArea = dropzoneId.startsWith('enemy_') ? 'y_battle' : 'my_battle';
      if (droppedCards[battleArea]) {
        setDroppedCards({ ...droppedCards, [dropzoneId]: cardName });
        
        // Extract the waiting position number (1, 2, or 3)
        const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
        
        // Check enemy first to avoid matching "my" in "enemy"
        if (dropzoneId.startsWith('enemy_')) {
          // Update enemy waiting Pokémon HP atom
          const newHP = [...enemyWaitingHP];
          newHP[waitingPosition] = data[cardName].hp;
          setEnemyWaitingHP(newHP);
          
          // Update enemy waiting Pokémon energy atom
          const newEnergy = [...enemyWaitingEnergy];
          newEnergy[waitingPosition] = 0; // Start with 0 energy
          setEnemyWaitingEnergy(newEnergy);
          
          setEnemyHandList(prev => prev.filter((_, i) => i !== index));
        } else {
          // Update my waiting Pokémon HP atom
          const newHP = [...myWaitingHP];
          newHP[waitingPosition] = data[cardName].hp;
          setMyWaitingHP(newHP);
          
          // Update my waiting Pokémon energy atom
          const newEnergy = [...myWaitingEnergy];
          newEnergy[waitingPosition] = 0; // Start with 0 energy
          setMyWaitingEnergy(newEnergy);
          
          setMyHandList(prev => prev.filter((_, i) => i !== index));
        }
      }
    }
  }

  return { handleDragEnd };
}