import Image from "next/image";
export default function Home() {
  return (
    // container  
    <div className="h-screen relative">
      {/* Original Section */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center">
        {/* my Hand */}
        <div className="bg-red-100 w-24 h-24">
        </div>
        {/* my Waiting */}
        <div className="bg-red-300 w-24 h-24">
        </div>
        {/* my Attack */}
        <div className="bg-red-500 w-24 h-24">
        </div>
      </div>

      {/* Flipped Section */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse items-center">
        {/* my Hand (Flipped) */}
        <div className="bg-red-100 w-24 h-24">
        </div>
        {/* my Waiting (Flipped) */}
        <div className="bg-red-300 w-24 h-24">
        </div>
        {/* my Attack (Flipped) */}
        <div className="bg-red-500 w-24 h-24">
        </div>
      </div>
    </div>
  );
}