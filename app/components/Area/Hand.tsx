import React from 'react';
import { useAtomValue } from 'jotai';
import { myHandListAtom, enemyHandListAtom, myTurnAtom } from '../../atom';

interface HandProps {
    isMy: boolean;
}

export const Hand: React.FC<HandProps> = ({ isMy }) => {
    const myHandList = useAtomValue(myHandListAtom);
    const enemyHandList = useAtomValue(enemyHandListAtom);
    const myTurn = useAtomValue(myTurnAtom);
    
    const handList = isMy ? myHandList : enemyHandList;

    return (
        <div className={`absolute ${isMy ? 'bottom-0' : 'top-0'} left-0 right-0 flex justify-center p-4`}>
            {handList.map((card, index) => (
                <div key={index} className="mx-2">
                    {/* 카드 렌더링 로직 */}
                    {isMy && myTurn ? (
                        <div className="draggable-card">{card}</div>
                    ) : (
                        <div>{card}</div>
                    )}
                </div>
            ))}
        </div>
    )
}