"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CornerDownLeft, Delete, ClipboardPaste } from 'lucide-react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onPaste: () => void;
}

const letterRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const symbolRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['`', '-', '=', '[', ']', '\\', ';', "'", ',', '.'],
  ['/', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
];

export function Keyboard({ onKeyPress, onBackspace, onEnter, onPaste }: KeyboardProps) {
  const [mode, setMode] = useState<'letters' | 'symbols'>('letters');

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
        'h-11 rounded-md border border-green-800 bg-black text-green-400 flex items-center justify-center font-mono text-lg hover:bg-green-900/50 hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500',
        className
      )}
      style={{ width }}
    >
      {children}
    </button>
  );

  const renderKeys = (rows: string[][]) => {
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-1.5 justify-center">
        {row.map((key) => (
          <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
            {key}
          </Key>
        ))}
      </div>
    ));
  };

  return (
    <div className="bg-black/80 p-2 pb-4 border-t border-green-900">
      <div className="flex flex-col gap-1.5">
        {mode === 'letters' ? (
          <>
            <div className="flex gap-1.5 justify-center">
              {letterRows[0].map(key => (
                  <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
                    {key}
                  </Key>
                ))}
            </div>
            <div className="flex gap-1.5 justify-center px-4">
              {letterRows[1].map(key => (
                  <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
                    {key}
                  </Key>
                ))}
            </div>
            <div className="flex gap-1.5 justify-center">
              <Key onClick={() => setMode('symbols')} className="w-12 text-sm">?123</Key>
              {letterRows[2].map(key => (
                <Key key={key} onClick={() => handleKeyClick(key)} className="flex-1">
                  {key}
                </Key>
              ))}
              <Key onClick={onBackspace} className="w-12">
                <Delete size={20} />
              </Key>
            </div>
          </>
        ) : (
          <>
            {renderKeys(symbolRows)}
             <div className="flex gap-1.5 justify-center">
                <Key onClick={() => setMode('letters')} className="w-16 text-sm">ABC</Key>
                <Key onClick={onBackspace} className="flex-1">
                    <Delete size={20} />
                </Key>
             </div>
          </>
        )}
        <div className="flex gap-1.5 justify-center">
          <Key onClick={onPaste} className="w-16">
            <ClipboardPaste size={20} />
          </Key>
          <Key onClick={() => handleKeyClick(' ')} className="flex-1 min-w-[150px] max-w-[300px]">
            space
          </Key>
           <Key onClick={onEnter} className="w-16">
                <CornerDownLeft size={20} />
            </Key>
        </div>
      </div>
    </div>
  );
}
