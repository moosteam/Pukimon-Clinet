import React from 'react';
import { useAtomValue } from 'jotai';
import { secondaryMyCardRotateAtom, secondaryMyCardPositionAtom } from '../../atom';

interface PlayerCardsProps {
    myImageSrc: string;
    emenyImageSrc: string;
}

export const PlayerCards: React.FC<PlayerCardsProps> = ({ myImageSrc, emenyImageSrc }) => {
    const secondaryMyCardRotate = useAtomValue(secondaryMyCardRotateAtom);
    const secondaryMyCardPosition = useAtomValue(secondaryMyCardPositionAtom);

    return (
        <>
            {/* 내 플레이어 카드 */}
            <div className="absolute bottom-0 left-0 z-50 w-[20%] max-w-[150px] min-w-[100px] transition-all duration-1000"
                style={{ transform: `translateY(${secondaryMyCardPosition}%) rotate(${secondaryMyCardRotate}deg)` }}>
                <img src={myImageSrc} alt="My Player" className="w-full" />
            </div>
            {/* 적 플레이어 카드 */}
            <div className="absolute top-0 right-0 z-50 w-[20%] max-w-[150px] min-w-[100px] transition-all duration-1000"
                style={{ transform: `translateY(${secondaryMyCardPosition * -1}%) rotate(${secondaryMyCardRotate * -1}deg)` }}>
                <img src={emenyImageSrc} alt="Enemy Player" className="w-full" />
            </div>
        </>
    )
}


