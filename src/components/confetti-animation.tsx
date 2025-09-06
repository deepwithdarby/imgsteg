"use client";

import { useEffect, useMemo } from 'react';

const NUM_CONFETTI = 100;

interface ConfettiAnimationProps {
  onAnimationEnd: () => void;
}

export const ConfettiAnimation = ({ onAnimationEnd }: ConfettiAnimationProps) => {
  useEffect(() => {
    const timer = setTimeout(onAnimationEnd, 5000); // Animation duration
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const confetti = useMemo(() => {
    return Array.from({ length: NUM_CONFETTI }).map((_, i) => {
      const style = {
        '--x-start': `${Math.random() * 100}vw`,
        '--x-end': `${Math.random() * 100}vw`,
        '--y-end': `110vh`,
        '--bg-color': `hsl(${Math.random() * 360}, 70%, 60%)`,
        '--rotation-start': `${Math.random() * 360}deg`,
        '--rotation-end': `${Math.random() * 1080 + 360}deg`,
        'animationDelay': `${Math.random() * 2}s`,
        'animationDuration': `${Math.random() * 2 + 3}s`, // 3 to 5 seconds duration
      } as React.CSSProperties;

      return <div key={i} className="confetti" style={style} />;
    });
  }, []);

  return <div className="confetti-container">{confetti}</div>;
};
