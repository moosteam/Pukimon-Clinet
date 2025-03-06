export default function App({
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full bg-[#C2DAF6]">
      
      <div className="
      bg-[#C2DAF6] h-full flex justify-between flex-col items-center p-2 z-100
      "
        style={{ transform: "perspective(800px) rotateX(15deg) translate(0, -50px)" }}
      >

        
        <div className="z-100 flex  flex-row">
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
        </div>
        <div className="z-100 flex  flex-row gap-3">
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
        </div>
        <div className="z-100 flex  flex-row w-full justify-between items-center">
          <div>
            <img src="pukimon_card_back.png" alt="" className="w-18" />
            <div className="h-6"></div>
            <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
          </div>
          <div>
            <div className="w-18 h-25 border-3 rounded-lg mt-8 mb-4"></div>
            <div className="h-6"></div>
            <div className="w-18 h-25 border-3 rounded-lg mb-8 mt-4"></div>
          </div>
          <div>
            <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
            <div className="h-6"></div>
            <img src="pukimon_card_back.png" alt="" className="w-18" />
          </div>
        </div>
        <div className="z-100 flex  flex-row gap-3">
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
          <div className="w-18 h-25 border-3 rounded-lg "></div>
        </div>
        <div className="z-100 flex  flex-row">
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
          <img src="Charizard.jpg" alt="" className="w-18" />
        </div>
        <img
          src="pukimon_battle_field.png"
          alt=""
          className="absolute object-cover top-0 left-0 scale-170 translate-y-45"
        />
      </div>
    </div>
  );
}