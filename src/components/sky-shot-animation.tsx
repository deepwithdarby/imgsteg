"use client";

import { useEffect, useMemo } from 'react';

const NUM_STARS = 50;

interface SkyShotAnimationProps {
  onAnimationEnd: () => void;
}

export const SkyShotAnimation = ({ onAnimationEnd }: SkyShotAnimationProps) => {
  useEffect(() => {
    const timer = setTimeout(onAnimationEnd, 1500); // Match animation duration
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const stars = useMemo(() => {
    return Array.from({ length: NUM_STARS }).map((_, i) => {
      const angle = (i / NUM_STARS) * 2 * Math.PI;
      const radius = Math.random() * 200 + 100; // Random radius between 100 and 300
      const size = Math.random() * 4 + 2; // Random size between 2 and 6
      const finalX = Math.cos(angle) * radius;
      const finalY = Math.sin(angle) * radius;

      const style = {
        '--final-x': `${finalX}px`,
        '--final-y': `${finalY}px`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${Math.random() * 0.2}s`,
      } as React.CSSProperties;

      return <div key={i} className="star" style={style} />;
    });
  }, []);

  return <div className="sky-shot-container">{stars}</div>;
};
