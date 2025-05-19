import React, { useState, useCallback } from 'react';
import { Draggable } from '../Draggable';
import { useAtomValue } from 'jotai';
import { myTurnAtom } from '../../atom';
import { myHandListAtom, enemyHandListAtom } from '../../atom';

interface HandProps {
    isMy: any;
}

export const Hand: React.FC<HandProps> = ({ isMy }) => {
    const myTurn = useAtomValue(myTurnAtom);

    const [isCardZoomed, setIsCardZoomed] = useState(false);
    const [zoomedCardSrc,] = useState("Charizard.jpg");
    const handList = useAtomValue(isMy ? myHandListAtom : enemyHandListAtom);

    const closeZoom = useCallback(() => {
        setIsCardZoomed(false);
    }, []);

    return (
        <div className="z-10 flex flex-row">
            {/* Card zoom overlay */}
            {isCardZoomed && (
                <div
                    className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 transform scale-120"
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

            {/* Add a CSS class for the container to properly handle the animation */}
            <div className="flex flex-row items-center justify-center">
                {handList && handList.map((card: any, index: any) => {
                    const cardId = `card-${index}`;
                    // Only show cards that haven't been played yet
                    if (true) {
                        return (
                            <Draggable
                                isReversed={!isMy}
                                key={isMy ? `draggable-${card}-${index}` : `enemy-draggable-${card}-${index}`}
                                id={isMy ? `${cardId}` : `enemy${cardId}`}
                                imgLink={`card/${card}.png`}
                            >
                                <div
                                    className={`relative card-entry-animation${isMy ? "" : "-reverse"}`}
                                >
                                    <img
                                        // {...longPressHandler()}
                                        src={`card/${card}.png`}
                                        alt=""
                                        className="w-18 transition-all duration-500 cursor-grab hover:scale-110"
                                        style={{
                                            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                            transform: myTurn ? "scale(1)" : "scale(-1, -1)",
                                            transformOrigin: "center center",
                                            perspective: "1000px"
                                        }}
                                    />
                                </div>
                            </Draggable>
                        );
                    }
                })}
                {handList.length === 0 &&
                    <img
                        src="card/리자몽ex.png"
                        alt=""
                        className="w-18 transition-all duration-1500 invisible"
                    />
                }
            </div>
        </div>
    )
}