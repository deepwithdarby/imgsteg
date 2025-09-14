"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowBigUp, CornerDownLeft, Delete } from 'lucide-react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

const keyRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

export function Keyboard({ onKeyPress, onBackspace, onEnter }: KeyboardProps) {
  const handleKeyClick = (key: string) => {
    onKeyPress(key);
  };
  
  const Key = ({
    children,
    onClick,
    className,
    width,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    width?: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'h-10 rounded-md border border-green-800 bg-black text-green-400 flex items-center justify-center font-mono text-sm hover:bg-green-900/50 hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500',
        className
      )}
      style={{ width }}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-black/80 p-2 pb-4 border-t border-green-900">
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1.5 justify-center">
          {keyRows[0].map((key) => (
            <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
              {key}
            </Key>
          ))}
          <Key onClick={onBackspace} className="flex-1">
            <Delete size={16} />
          </Key>
        </div>
        <div className="flex gap-1.5 justify-center">
            <div className="w-8" />
            {keyRows[1].map((key) => (
                <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
                {key}
                </Key>
            ))}
             <div className="w-8" />
        </div>
        <div className="flex gap-1.5 justify-center">
            <div className="w-12" />
            {keyRows[2].map((key) => (
                <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
                {key}
                </Key>
            ))}
            <Key onClick={onEnter} className="w-24">
                <CornerDownLeft size={16} />
            </Key>
        </div>
        <div className="flex gap-1.5 justify-center">
            <Key onClick={() => {}} className="w-24 opacity-50"><ArrowBigUp size={16}/></Key>
            {keyRows[3].map((key) => (
                <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
                {key}
                </Key>
            ))}
            <Key onClick={() => {}} className="w-24 opacity-50"><ArrowBigUp size={16}/></Key>
        </div>
        <div className="flex gap-1.5 justify-center">
          <Key onClick={() => handleKeyClick(' ')} className="w-1/2 min-w-[200px] max-w-[400px]">
            space
          </Key>
        </div>
      </div>
    </div>
  );
}
