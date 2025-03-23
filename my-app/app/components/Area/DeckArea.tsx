import React from "react";
import { EnergyCard } from "../Card/EnergyCard";

interface DeckAreaProps {
    isMyDeck: boolean;
    myTurn: boolean;
    onEndTurn: () => void;
}

export const DeckArea: React.FC<DeckAreaProps> = ({
    isMyDeck,
    myTurn,
    onEndTurn
}) => {
    const showButton = isMyDeck ? myTurn : !myTurn;
    const buttonStyle = isMyDeck
        ? { visibility: myTurn ? "visible" : "hidden" }
        : { visibility: !myTurn ? "visible" : "hidden", transform: 'scale(-1, -1)' } ;
    
    return (
        <div className={`${isMyDeck ? "flex items-center flex-col" : ""}`}>
            {!isMyDeck && <EnergyCard isReversed={true} isVisible={!myTurn} />}
            
            <img src="ui/pukimon_card_back.png" alt="Card Back" className="w-18" />

            <div>
                <button
                    onClick={onEndTurn}
                    className="bg-white text-black hover:bg-blue-100 text-sm mt-4 mb-4 font-bold py-2 px-2 rounded-full shadow-lg transition-all duration-300"
                    style={buttonStyle as React.CSSProperties}
                >
                    턴 종료하기
                </button>
                
                {!isMyDeck && (
                    <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
                )}
            </div>
            
            {isMyDeck && (
                <>
                    <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
                    <EnergyCard isReversed={false} isVisible={myTurn} />
                </>
            )}
        </div>
    );
};