import React from 'react';
import { Droppable } from './Droppable';

interface MyWatingProps {
    droppedCards: any;
}

export const MyWating: React.FC<MyWatingProps> = ({ droppedCards }) => {
    return (
        <div className="z-50 flex flex-row gap-3">
            <Droppable id="waiting_1">
                <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                    {droppedCards['waiting_1'] && (
                        <img
                            src="Charizard.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </Droppable>
            <Droppable id="waiting_2">
                <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                    {droppedCards['waiting_2'] && (
                        <img
                            src="Charizard.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </Droppable>
            <Droppable id="waiting_3">
                <div className="w-18 h-25 border-3 rounded-lg bg-yellow-50 flex items-center justify-center">
                    {droppedCards['waiting_3'] && (
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