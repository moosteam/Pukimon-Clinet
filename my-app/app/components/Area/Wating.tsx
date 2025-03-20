import React from 'react';
import { Droppable } from '../Droppable';

interface WatingProps {
    droppedCards: Record<string, string>; // More specific type
    isMy: boolean;
}

export const Wating: React.FC<WatingProps> = ({ droppedCards, isMy }) => {
    const ownerPrefix = isMy ? 'my' : 'enemy';
    const waitingZones = [1, 2, 3].map(num => `${ownerPrefix}_waiting_${num}`);

    return (
        <div className="z-50 flex flex-row gap-3">
            {waitingZones.map((zoneId) => (
                <Droppable key={zoneId} id={zoneId}>
                    <div className="w-18 h-25 border-3 rounded-lg flex items-center justify-center">
                        {droppedCards[zoneId] && (
                            <img
                                src={droppedCards[zoneId]} // Use full path
                                alt={droppedCards[zoneId]}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </Droppable>
            ))}
        </div>
    )
}