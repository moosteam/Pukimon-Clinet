import { Droppable } from "../Droppable";

interface FieldCardsProps {
    onEndTurn: any;
    myTurn: any;
    droppedCards: any;
}

export const FieldCards: React.FC<FieldCardsProps> = ({
    onEndTurn,
    myTurn,
    droppedCards,
}) => {
    return (
        <div className="z-50 flex flex-row w-full justify-between items-center">
            {/* 적의 효과칸과 덱 */}
            <div>
                <img src="pukimon_card_back.png" alt="" className="w-18" />

                <div>
                    <button
                        onClick={onEndTurn}
                        className="bg-white text-black hover:bg-blue-100 text-sm mt-4 mb-4 font-bold py-2 px-2 rounded-full shadow-lg transition-all duration-300"
                        style={{ visibility: !myTurn ? "visible" : "hidden", transform: 'scale(-1, -1)' }}
                    >
                        턴 종료하기
                    </button>
                    <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>

                </div>
            </div>
            {/* 배틀 필드 */}
            <div>
                <Droppable id="my_battle">
                    <div className="w-32 h-44 border-3 rounded-lg mt-4 bg-yellow-50 flex items-center justify-center">
                        {droppedCards['my_battle'] && (
                            <img
                                src="Charizard.jpg"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </Droppable>
                <Droppable id="y_battle">
                    <div className="w-32 h-44 border-3 rounded-lg mb-4 bg-yellow-50 flex items-center justify-center">
                        {droppedCards['y_battle'] && (
                            <img
                                src="Charizard.jpg"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </Droppable>
            </div>
            {/* 나의 효과칸과 덱 */}
            <div className="flex items-center flex-col">
                <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
                <div>
                    <button
                        onClick={onEndTurn}
                        className="bg-white text-black hover:bg-blue-100 text-sm mt-4 mb-4 font-bold py-2 px-2 rounded-full shadow-lg transition-all duration-300"
                        style={{ visibility: myTurn ? "visible" : "hidden" }}
                    >
                        턴 종료하기
                    </button>
                </div>
                <img src="pukimon_card_back.png" alt="" className="w-18" />
            </div>
        </div>
    )
}