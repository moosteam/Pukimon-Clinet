import React from 'react';
import { PlayerCard } from './PlayerCard';

interface PlayerCardProps {
  secondaryMyCardRotate: number;
  secondaryMyCardPosition: number;
  myImageSrc: string;
  emenyImageSrc: string;
}

export const PlayerCards: React.FC<PlayerCardProps> = ({ secondaryMyCardRotate, secondaryMyCardPosition, myImageSrc, emenyImageSrc }) => {
  return (
    <>
      {/* 플레이어 카드 1 */}
      <PlayerCard
          imageSrc={myImageSrc}
          rotate={secondaryMyCardRotate}
          position={secondaryMyCardPosition}
          translateY={4}
        />
        {/* 플레이어 카드 2 */}
        <PlayerCard
          imageSrc={emenyImageSrc}
          rotate={-secondaryMyCardRotate}
          position={-secondaryMyCardPosition}
          translateY={26}
        />
    </>
  );
};


