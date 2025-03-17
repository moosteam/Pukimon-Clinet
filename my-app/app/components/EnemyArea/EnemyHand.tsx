import React from 'react';
import { Draggable } from '../Draggable';

interface EnemyHandProps {
    enemyHandList: any;
    playedCards: any;
}

export const EnemyHand: React.FC<EnemyHandProps> = ({ enemyHandList, playedCards }) => {
    return (
        <div className="z-50 flex flex-row">
            {enemyHandList && enemyHandList.map((card: any, index: any) => {
                const cardId = `enemy-card-${index}`;
                // Only show cards that haven't been played yet
                if (!playedCards[cardId]) {
                    return (
                        <Draggable isReversed={true} key={`enemy-draggable-${index}`} id={`${cardId}`}>
                            <div className="relative">
                                <img
                                    src="Charizard.jpg"
                                    alt=""
                                    className="w-18 transition-all duration-500 cursor-grab hover:scale-110"
                                />
                            </div>
                        </Draggable>
                    );
                }
                return null;
            })}
            {enemyHandList.length === 0 &&
                <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-18 transition-all duration-1500 invisible"
                />
            }
        </div>
    )
}