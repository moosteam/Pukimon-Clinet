import React, { useState, useCallback } from 'react';
import { Draggable } from '../Draggable';
import { useLongPress } from 'use-long-press';


interface MyHandProps {
    myHandList: any;
    playedCards: any;
}

export const MyHand: React.FC<MyHandProps> = ({ myHandList, playedCards }) => {

    const [isCardZoomed, setIsCardZoomed] = useState(false);
    const [zoomedCardSrc, setZoomedCardSrc] = useState("Charizard.jpg");

    const longPressHandler = useLongPress(() => {
        setIsCardZoomed(true);
    });

    const closeZoom = useCallback(() => {
        setIsCardZoomed(false);
    }, []);

    return (
        <div className="z-50 flex flex-row">
            {/* Card zoom overlay */}
            {isCardZoomed && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 transform scale-120"
                    onClick={closeZoom}
                >
                    <div className="relative w-[50%] max-w-[200px]">
                        <img
                            src={zoomedCardSrc}
                            alt="Card Preview"
                            className="w-full rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {myHandList && myHandList.map((card: any, index: any) => {
                const cardId = `card-${index}`;
                // Only show cards that haven't been played yet
                if (!playedCards[cardId]) {
                    return (
                        <Draggable isReversed={false} key={`draggable-${index}`} id={`${cardId}`}>
                            <div className="relative">
                                <img
                                    {...longPressHandler()}
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