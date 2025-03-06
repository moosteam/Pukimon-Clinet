export default function App({
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="
      bg-[#C2DAF6] w-full h-full flex justify-between flex-col items-center p-2 
      "
    >
      <div className="z-100 flex  flex-row">
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
      </div>
      <div className="z-100 flex  flex-row">
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
      </div>
      <div className="z-100">
        <img src="Charizard.jpg" alt="" className="w-28"/>
        <div className="h-6"></div>
        <img src="Charizard.jpg" alt="" className="w-28"/>
      </div>
      <div className="z-100 flex  flex-row">
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
      </div>
      <div className="z-100 flex  flex-row">
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
        <img src="Charizard.jpg" alt="" className="w-18"/>
      </div>
      

      {/* absolute */}
      <img 
        src="pukimon_battle_field.png" 
        alt="" 
        className="absolute w-screen h-screen object-cover top-0 left-0 z-10"
      />
    </div>
  );
}