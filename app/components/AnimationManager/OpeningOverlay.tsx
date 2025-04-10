import React from 'react';

interface OpeningOverlayProps {
    openingOpacity: number;
}

export const OpeningOverlay: React.FC<OpeningOverlayProps> = ({ openingOpacity }) => {
    return (
        <div className="absolute w-full h-full bg-white z-999999 transition-all duration-1000 pointer-events-none"
            style={{ opacity: `${openingOpacity}` }}></div>
    )
}