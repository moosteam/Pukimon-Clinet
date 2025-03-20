import { Droppable } from "../Droppable";
import { useState } from "react";

import { data } from "../../data/cards";

interface FieldCardsProps {
    onEndTurn: any;
    myTurn: any;
    droppedCards: Record<string, string>; // Update type
}

export const FieldCards: React.FC<FieldCardsProps> = ({
    onEndTurn,
    myTurn,
    droppedCards,
}) => {
    const [isReadyToAttack, setIsReadyToAttack] = useState(false);
    return (
        <div className="z-50 flex flex-row w-full justify-between items-center">
            {isReadyToAttack && (
                <div className="absolute w-full h-full flex items-center"
                    onClick={() => {
                        setIsReadyToAttack(false);
                    }}
                >
                    <img src={droppedCards['my_battle']} alt="" />
                    <div className="flex flex-col w-36 m-4" 
                    >
                        {data[droppedCards['my_battle']].skill.map((skill, index) => (
                            <div key={index} className=" bg-gray-300 text-gray-900 p-3 rounded-lg shadow-lg border-2 border-gray-400">
                                <div className="flex flex-row justify-between ">
                                    <div>{skill.name}</div>
                                    <div>{skill.damage}</div>
                                </div>
                                <div>필요에너지 : {skill.energy}</div>
                            </div>
                        ))}
                    </div> 

                </div>
            )}
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
                <Droppable id="y_battle">
                    <div className="w-32 h-44 border-3 rounded-lg mt-4 bg-yellow-50 flex items-center justify-center"
                          style={{
                            borderWidth: 2,
                            borderColor: !droppedCards["y_battle"] && (!myTurn) ? "blue" : "transparent",
                            boxShadow: !droppedCards["y_battle"] && (!myTurn)
                              ? "0 0 15px 5px rgba(0, 0, 255, 0.6)"
                              : "none",
                            borderRadius: "8px",
                            transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                          }}
                    >
                        {droppedCards['y_battle'] && (
                            <img
                                src={droppedCards['y_battle']}
                                alt={droppedCards['y_battle']}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </Droppable>
                <Droppable id="my_battle">
                    <div className="w-32 h-44 border-3 rounded-lg mb-4 bg-yellow-50 flex items-center justify-center"
                        style={{
                            borderWidth: 2,
                            borderColor: !droppedCards["my_battle"] && myTurn ? "blue" : "transparent",
                            boxShadow: !droppedCards["my_battle"] && myTurn
                              ? "0 0 15px 5px rgba(0, 0, 255, 0.6)"
                              : "none",
                            borderRadius: "8px",
                            transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                          }}
                          onClick={() => {
                            setIsReadyToAttack(true);
                          }}
                    >
                        {droppedCards['my_battle'] && (
                            <img
                                src={droppedCards['my_battle']}
                                alt={droppedCards['my_battle']}
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