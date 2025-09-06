"use client";

import { useState, useEffect, useMemo, FC } from 'react';
import { cn } from '@/lib/utils';

interface ShatterTextProps {
  line1: string;
  line2: string;
}

const ShatterLine: FC<{ text: string; as: 'h2' | 'p'; isVisible: boolean }> = ({ text, as, isVisible }) => {
  const Tag = as;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chars = useMemo(() => {
    if (!isMounted) {
      // Return static characters on the server and initial client render
      return text.split('').map((char, index) => (
        <span key={index} className="shatter-char">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }

    return text.split('').map((char, index) => {
      const tx = (Math.random() - 0.5) * 500;
      const ty = (Math.random() - 0.5) * 500;
      const r = (Math.random() - 0.5) * 720;
      const style = {
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        '--r': `${r}deg`,
        animationDelay: `${Math.random() * 0.5}s, ${2 + Math.random() * 0.5}s`,
      } as React.CSSProperties;

      return (
        <span key={index} className="shatter-char" style={style}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  }, [text, isMounted]);

  return (
    <div className={cn('shatter-line', { 'animate': isVisible && isMounted })}>
      <Tag>{chars}</Tag>
    </div>
  );
};


export const ShatterText: FC<ShatterTextProps> = ({ line1, line2 }) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500); // Start animation after 500ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="shatter-container">
      <ShatterLine text={line1} as="h2" isVisible={startAnimation} />
      <ShatterLine text={line2} as="p" isVisible={startAnimation} />
    </div>
  );
};
