import React from 'react';
import { useAtom } from 'jotai';
import { openingOpacityAtom } from '../../atom';

export const OpeningOverlay: React.FC = () => {
    const [openingOpacity] = useAtom(openingOpacityAtom);
    
    return (
        <div className="absolute w-full h-full bg-white z-999999 transition-all duration-1000 pointer-events-none"
            style={{ opacity: `${openingOpacity}` }}></div>
    )
}