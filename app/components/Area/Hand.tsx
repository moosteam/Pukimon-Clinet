import React, { useState, useCallback, useRef } from 'react';
import { Draggable } from '../Draggable';
import { useAtomValue } from 'jotai';
import { myTurnAtom } from '../../atom';
import { myHandListAtom, enemyHandListAtom } from '../../atom';
import { motion, AnimatePresence } from 'framer-motion';

interface HandProps {
    isMy: any;
}

export const Hand: React.FC<HandProps> = ({ isMy }) => {
    const myTurn = useAtomValue(myTurnAtom);

    const [isCardZoomed, setIsCardZoomed] = useState(false);
    const [zoomedCardSrc, setZoomedCardSrc] = useState("");
    const handList = useAtomValue(isMy ? myHandListAtom : enemyHandListAtom);
    
    // 롱 프레스 감지를 위한 타이머 참조
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    // 드래그 시작 여부를 추적
    const isDraggingRef = useRef(false);

    const openZoom = useCallback((cardName: string) => {
        console.log("Opening zoom for card:", cardName);
        setZoomedCardSrc(`card/${cardName}.png`);
        setIsCardZoomed(true);
    }, []);

    const closeZoom = useCallback(() => {
        console.log("Closing zoom");
        setIsCardZoomed(false);
    }, []);
    
    // 롱 프레스 시작 핸들러
    const handleTouchStart = useCallback((card: string, e: React.TouchEvent) => {
        isDraggingRef.current = false;
        
        timerRef.current = setTimeout(() => {
            if (!isDraggingRef.current) {
                openZoom(card);
            }
        }, 500);
    }, [openZoom]);
    
    // 터치 이동 핸들러
    const handleTouchMove = useCallback(() => {
        isDraggingRef.current = true;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    
    // 터치 종료 핸들러
    const handleTouchEnd = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return (
        <div className="z-[999999999999999999999] flex flex-row justify-center items-center ">
            {/* Card zoom overlay with framer-motion */}
            <AnimatePresence>
                {isCardZoomed && (
                    <motion.div
                        className="fixed inset-0 z-[999999999999999999999999999999] flex items-center justify-center"
                        onClick={closeZoom}
                        style={{ 
                            transform: 'none',
                            perspective: 'none'
                        }}
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        exit={{ opacity: 0, }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="relative w-[60%]" 
                            style={{ transform: 'none' }}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ 
                                type: "spring", 
                                damping: 25, 
                                stiffness: 300,
                                duration: 0.4
                            }}
                        >
                            <img
                                src={zoomedCardSrc}
                                alt="Card Preview"
                                className="w-full rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                                style={{ transform: 'none' }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add a CSS class for the container to properly handle the animation */}
            <div className="flex flex-row items-center justify-center">
                {handList && handList.map((card: any, index: any) => {
                    const cardId = `card-${index}`;
                    // Only show cards that haven't been played yet
                    return (
                        <div 
                            key={isMy ? `card-container-${index}` : `enemy-card-container-${index}`} 
                            className="relative"
                            onTouchStart={(e) => handleTouchStart(card, e)}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
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
                            {/* 롱 프레스 대신 더블 클릭으로 확대 기능 활성화 */}
                            <div 
                                className="absolute inset-0 z-10"
                                onDoubleClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openZoom(card);
                                }}
                            />
                        </div>
                    );
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
