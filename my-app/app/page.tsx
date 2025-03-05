"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    let angle = 0;
    let animationFrameId: number;

    const animate = () => {
      if (container && overlay) {
        // sine와 cosine을 이용해 원형 경로를 따라 회전 (여기서는 ±20도 범위로 설정)
        const rotateY = Math.sin(angle) * 7;
        const rotateX = Math.cos(angle) * 7;
        container.style.transform = `perspective(350px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

        // overlay의 배경 위치도 angle을 기반으로 천천히 변하게 함
        const bgPos = Number(((Math.sin(angle) + 1) * 50).toFixed(2))/2; // 0% ~ 100% 사이
        overlay.style.backgroundPosition = `${bgPos}%`;

        // angle을 천천히 증가 (속도 조절은 이 값으로)
        angle += 0.01;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="h-screen relative">
      {/* Flipped Section */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse items-center gap-4">
        {/* my Hand (Flipped) */}
        <div className="border-amber-300 border-2 w-full h-52 flex justify-center">
          <div className="border-blue-300 border-2 w-36 h-52"></div>
        </div>
        {/* my Waiting (Flipped) */}
        <div className="border-amber-500 border-2 w-full h-52 flex justify-center gap-4">
          <div className="border-blue-300 border-2 w-36 h-52"></div>
          <div className="border-blue-300 border-2 w-36 h-52"></div>
          <div className="border-blue-300 border-2 w-36 h-52"></div>
        </div>
        {/* my Attack (Flipped) */}
        <div className="border-amber-700 border-2 w-full h-78 flex justify-center">
          <div 
            ref={containerRef}
            className="w-55 h-78 relative"
            style={{ transition: "transform 0.1s ease" }}
          >
            <div 
              ref={overlayRef}
              className="
                absolute
                w-[220px]
                h-[310px]
                bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_0%,_rgba(255,219,112,0.6)_10%,_rgba(132,50,255,0.8)_60%,_transparent_100%)]
                bg-[length:200%_200%]
                mix-blend-screen
                filter
                blur-[30px]
                animate-[shine_4s_linear_infinite]
                opacity-60
              "
              style={{ transition: "opacity 0.1s ease" }}
            ></div>
            <img src="./images.jpg" alt="" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
