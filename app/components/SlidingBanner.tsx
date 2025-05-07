import React from 'react';

interface SlidingBannerProps {
  title: string;
  subtitle?: string;
  bgColor?: string;       // Tailwind color class, e.g. 'bg-green-500'
  textColor?: string;     // Tailwind text color class, e.g. 'text-white'
  tiltAngle?: string;     // CSS angle, e.g. '-10deg'
  bottomOffset?: string;  // Tailwind bottom offset, e.g. 'bottom-8'
}

const SlidingBanner: React.FC<SlidingBannerProps> = ({
  title,
  subtitle,
  bgColor = 'bg-black',
  textColor = 'text-white',
  tiltAngle = '-8deg',
  bottomOffset = 'bottom-10'
}) => {
  return (
    <div className={`absolute left-0 bottom-33 w-[500px] overflow-hidden ${bottomOffset} pointer-events-none z-100000000`}> 
      <div
        className={`inline-block ${textColor} font-bold text-3xl transform banner-slide w-[500px]`}
        style={{ '--tilt-angle': tiltAngle } as React.CSSProperties}
      >
        <span className="inline-block transform w-[500px]   [skew-x:var(--tilt-angle)]">
          {title}
        </span>
        {subtitle && (
          <span className="block text-xl mt-1 transform w-[500px] bg-gray-700 [skew-x:var(--tilt-angle)]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default SlidingBanner;
