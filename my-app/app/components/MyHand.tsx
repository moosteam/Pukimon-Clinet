import React from 'react';
import { Draggable } from './Draggable';

interface MyHandProps {
    myHandList: any;
    playedCards: any;
}

export const MyHand: React.FC<MyHandProps> = ({ myHandList, playedCards }) => {
    return (
        <div className="z-50 flex flex-row">
            {myHandList && myHandList.map((card: any, index: any) => {
                const cardId = `card-${index}`;
                // Only show cards that haven't been played yet
                if (!playedCards[cardId]) {
                    return (
                        <Draggable isReversed={false} key={`draggable-${index}`} id={`${cardId}`}>
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
            {myHandList.length === 0 &&
                <img
                    src="Charizard.jpg"
                    alt=""
                    className="w-18 transition-all duration-1500 invisible"
                />
            }
        </div>
    )
}