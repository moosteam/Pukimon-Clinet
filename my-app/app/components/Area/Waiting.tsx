import React from 'react';
import { Droppable } from '../Droppable';
import { useAtom } from 'jotai';
import { 
    myWaitingPokemonEnergyAtom, 
    enemyWaitingPokemonEnergyAtom,
    myWaitingPokemonHPAtom,
    enemyWaitingPokemonHPAtom 
} from '../../atom';

interface WaitingProps {
    droppedCards: Record<string, string>;
    isMy: boolean;
}
//
export const Waiting: React.FC<WaitingProps> = ({ droppedCards, isMy }) => {
    const ownerPrefix = isMy ? 'my' : 'enemy';
    const waitingZones = [1, 2, 3].map(num => `${ownerPrefix}_waiting_${num}`);
    
    // Get the appropriate energy and HP atoms
    const [myWaitingEnergy] = useAtom(myWaitingPokemonEnergyAtom);
    const [enemyWaitingEnergy] = useAtom(enemyWaitingPokemonEnergyAtom);
    const [myWaitingHP] = useAtom(myWaitingPokemonHPAtom);
    const [enemyWaitingHP] = useAtom(enemyWaitingPokemonHPAtom);
    
    // Use the appropriate energy and HP arrays
    console.log("m:  " + myWaitingEnergy);
    console.log("e:  " + enemyWaitingEnergy);
    const energyArray = isMy ? myWaitingEnergy : enemyWaitingEnergy;
    const hpArray = isMy ? myWaitingHP : enemyWaitingHP;

    return (
        <div className="z-50 flex flex-row gap-3">
            {waitingZones.map((zoneId, index) => (
                <Droppable key={zoneId} id={zoneId}>
                    <div className="w-18 h-25 border-3 rounded-lg flex items-center justify-center">
                        {droppedCards[zoneId] && (
                            <div>
                                {/* Display energy icons */}
                                {Array(energyArray[index] >= 5 ? 1 : energyArray[index]).fill(0).map((_, i) => (
                                    <img 
                                        key={i} 
                                        src="ui/energy.png"
                                        className="absolute h-[1.5rem]"
                                        style={{paddingLeft: `${i*1.7}rem`}}
                                    />
                                ))}
                                {energyArray[index] >= 5 &&
                                    <div
                                        className="absolute h-[1.5rem] pl-[2rem] text-white font-bold"
                                        style={{ 
                                            textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" 
                                        }}
                                    >{energyArray[index]}</div>
                                }
                                
                                {/* Display HP */}
                                <div 
                                    className="bg-green-700 absolute mt-14  p-1 border-4"
                                    style={{ 
                                        textShadow: "1px 1px 0 #000" 
                                    }}
                                >{hpArray[index]}</div>
                                 
                                <img 
                                    src={droppedCards[zoneId]} 
                                    alt={droppedCards[zoneId]}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </Droppable>
            ))}
        </div>
    )
}