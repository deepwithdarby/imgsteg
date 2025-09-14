"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const TITLE = 'IMG STEG';

export default function LandingPage() {
  const [typedTitle, setTypedTitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setTypedTitle('');
    const interval = setInterval(() => {
      setTypedTitle((prev) => {
        if (prev.length < TITLE.length) {
          return TITLE.slice(0, prev.length + 1);
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typedTitle === TITLE) {
      // Keep cursor blinking at the end
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [typedTitle]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="max-w-4xl mx-auto text-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-primary h-24">
          <span className={typedTitle === TITLE ? 'blinking-cursor' : ''}>{typedTitle}</span>
        </h1>
        <p className="text-lg md:text-xl text-green-400 mb-8 max-w-2xl mx-auto">
          Hide secret messages inside images using steganography. Your personal vault for digital secrets, wrapped in pixels.
        </p>
        <Link href="/tool">
          <Button size="lg" className="font-bold text-lg">
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
