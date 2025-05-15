import React from 'react';
import { useAtomValue } from 'jotai';
import { openingRotateAtom, openingScaleAtom, finalGroundRotateAtom } from '../../atom';

interface GameBoardProps {
    children: React.ReactNode;
}

export const GameBoard: React.FC<GameBoardProps> = ({ children }) => {
    const openingRotate = useAtomValue(openingRotateAtom);
    const openingScale = useAtomValue(openingScaleAtom);
    const finalGroundRotate = useAtomValue(finalGroundRotateAtom);

    // finalGroundRotate 값에 따라 Y축 이동 계산
    const translateY = finalGroundRotate === 0 ? 0 : 
        finalGroundRotate > 0 ? Math.abs(finalGroundRotate) / 1.5 : -Math.abs(finalGroundRotate) / 1.5;

    return (
        <div className={`w-full h-full absolute transition-all ${finalGroundRotate !== 0 ? 'duration-700' : 'duration-1500'}`}
            style={{
                transform: `perspective(1000px) rotateX(${openingRotate}deg) scale(${openingScale}) rotateZ(${finalGroundRotate}deg) translateY(${translateY}%)`,
                transformOrigin: 'center center',
            }}>
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(/ui/pukimon_battle_field.png)' }}>
                {children}
            </div>
        </div>
    )
}