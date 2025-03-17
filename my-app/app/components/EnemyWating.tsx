import React from 'react';
import { Droppable } from './Droppable';

interface EnemyWatingProps {
    droppedCards: any;
}

export const EnemyWating: React.FC<EnemyWatingProps> = ({ droppedCards }) => {
    return (
        <div className="z-50 flex flex-row gap-3">
            <Droppable id="enemy_waiting_1">
                <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                    {droppedCards['enemy_waiting_1'] && (
                        <img
                            src="Charizard.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </Droppable>
            <Droppable id="enemy_waiting_2">
                <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                    {droppedCards['enemy_waiting_2'] && (
                        <img
                            src="Charizard.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </Droppable>
            <Droppable id="enemy_waiting_3">
                <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                    {droppedCards['enemy_waiting_3'] && (
                        <img
                            src="Charizard.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </Droppable>
        </div>
    )
}