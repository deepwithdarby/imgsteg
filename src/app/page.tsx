"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const TITLE = 'IMG STEG';

export default function LandingPage() {
  const [typedTitle, setTypedTitle] = useState('');
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const type = () => {
      setTypedTitle('');
      let i = 0;
      const interval = setInterval(() => {
        setTypedTitle(TITLE.slice(0, i + 1));
        i++;
        if (i > TITLE.length) {
          clearInterval(interval);
          timeout = setTimeout(type, 2000); // Wait 2 seconds before restarting
        }
      }, 200);

      return () => {
        clearInterval(interval);
        if (timeout) clearTimeout(timeout);
      };
    };
    
    const cleanup = type();
    return cleanup;

  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="max-w-4xl mx-auto text-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-primary h-24">
          <span className="blinking-cursor">{typedTitle}</span>
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
