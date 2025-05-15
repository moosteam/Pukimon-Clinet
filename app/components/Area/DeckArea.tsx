import React from 'react';
import { Draggable } from '../Draggable';
import { useAtom } from 'jotai';
import { myTurnAtom } from '../../atom';

interface DeckAreaProps {
    isMyDeck: boolean;
    onEndTurn: () => void;
}

export const DeckArea: React.FC<DeckAreaProps> = ({ isMyDeck, onEndTurn }) => {
    const [myTurn] = useAtom(myTurnAtom);
    
    return (
        <div className="flex flex-col items-center">
            {/* 에너지 카드 */}
            {((isMyDeck && myTurn) || (!isMyDeck && !myTurn)) && (
                <Draggable id="energy" imgLink="/ui/energy.png">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4 cursor-grab">
                        <img src="/ui/energy.png" alt="Energy" className="w-full h-full" />
                    </div>
                </Draggable>
            )}
            
            {/* 덱 */}
            <div className="w-24 h-32 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">덱</span>
            </div>
            
            {/* 턴 종료 버튼 */}
            {((isMyDeck && myTurn) || (!isMyDeck && !myTurn)) && (
                <button 
                    onClick={onEndTurn}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    턴 종료
                </button>
            )}
        </div>
    );
};