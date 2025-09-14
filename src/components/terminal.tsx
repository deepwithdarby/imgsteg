"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { LSB } from "@/lib/lsb";
import { encrypt, decrypt } from "@/lib/crypto";
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { Keyboard } from './keyboard';
import { useIsMobile } from '@/hooks/use-mobile';

enum Stage {
  Initial,
  AwaitingCommand,
  AwaitingUpload,
  ChooseMode,
  Encode_GetMessage,
  Encode_GetPassword,
  Encoding,
  Encode_Complete,
  Decode_GetPassword,
  Decoding,
  Decode_Complete,
}

type HistoryItem = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
};

export function Terminal() {
  const { toast } = useToast();
  const [stage, setStage] = useState<Stage>(Stage.Initial);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();

  // State for steganography
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [resultData, setResultData] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addHistory = (item: HistoryItem) => {
    setHistory(prev => [...prev, item]);
  };
  
  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);
  useEffect(() => {
    if (stage === Stage.Initial) {
      addHistory({ type: 'system', content: 'Welcome to IMG STEG. Type "start" to begin.' });
      setStage(Stage.AwaitingCommand);
    }
  }, [stage]);

  const handleCommand = useCallback(async (command: string) => {
    addHistory({ type: 'input', content: command });
    setInputValue('');

    switch (stage) {
      case Stage.AwaitingCommand:
        if (command.toLowerCase() === 'start') {
          addHistory({ type: 'output', content: 'Welcome to IMG STEG Terminal. Use "upload" to select an image.' });
        } else if (command.toLowerCase() === 'upload') {
            addHistory({ type: 'system', content: 'Opening file dialog...' });
            fileInputRef.current?.click();
        } else if (command.toLowerCase() === 'download') {
            handleDownload();
        } else if (command.toLowerCase() === 'clear') {
            setHistory([]);
        } else {
            addHistory({ type: 'error', content: `Unknown command: "${command}". Available commands: "start", "upload", "download", "clear".` });
        }
        break;

      case Stage.ChooseMode:
        if (command.toLowerCase() === 'encode') {
          setStage(Stage.Encode_GetMessage);
          addHistory({ type: 'system', content: 'Enter your secret message:' });
        } else if (command.toLowerCase() === 'decode') {
          setStage(Stage.Decode_GetPassword);
          addHistory({ type: 'system', content: 'Enter password (or leave blank if none):' });
        } else {
          addHistory({ type: 'error', content: 'Invalid mode. Type "encode" or "decode".' });
        }
        break;

      case Stage.Encode_GetMessage:
        setSecretMessage(command);
        setStage(Stage.Encode_GetPassword);
        addHistory({ type: 'system', content: 'Enter password to encrypt (or leave blank for no encryption):' });
        break;

      case Stage.Encode_GetPassword:
        setPassword(command);
        setStage(Stage.Encoding);
        await handleEncode(command);
        break;
      
      case Stage.Decode_GetPassword:
        setPassword(command);
        setStage(Stage.Decoding);
        await handleDecode(command);
        break;

      default:
        addHistory({ type: 'error', content: `Invalid command for current stage.` });
        break;
    }
  }, [stage, secretMessage]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImageDataUri(dataUri);
        addHistory({ type: 'system', content: `Image "${file.name}" uploaded successfully.` });
        addHistory({ type: 'output', content: 'Do you want to "encode" or "decode"?' });
        setStage(Stage.ChooseMode);
      };
      reader.readAsDataURL(file);
    } else {
      addHistory({ type: 'error', content: 'Invalid file. Please upload an image.' });
    }
     // Reset file input
    if (e.target) e.target.value = '';
  };
  
  const handleEncode = async (passwordInput: string) => {
    if (!imageDataUri || !secretMessage) return;
    setIsProcessing(true);
    addHistory({ type: 'system', content: 'Encoding... please wait.' });

    try {
      let textToEncode = secretMessage;
      if (passwordInput) {
        textToEncode = await encrypt(secretMessage, passwordInput);
        addHistory({ type: 'system', content: 'Message encrypted.' });
      }

      const lsb = new LSB(imageDataUri);
      const encodedDataUri = await lsb.encode(textToEncode);
      setResultData(encodedDataUri);
      
      addHistory({ type: 'output', content: 'Encoding successful! Use "download" to save the new image.' });
      setStage(Stage.AwaitingCommand);
    } catch (error) {
      addHistory({ type: 'error', content: `Encoding failed: ${(error as Error).message}` });
      resetState();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecode = async (passwordInput: string) => {
    if (!imageDataUri) return;
    setIsProcessing(true);
    addHistory({ type: 'system', content: 'Decoding... please wait.' });
    
    try {
      const lsb = new LSB(imageDataUri);
      const decodedTextFromImage = await lsb.decode();
      
      let finalDecodedText = decodedTextFromImage;

      try {
        if (passwordInput) {
          finalDecodedText = await decrypt(decodedTextFromImage, passwordInput);
          addHistory({ type: 'system', content: 'Message decrypted.' });
        } else {
          // A simple check to see if it looks like our encrypted format
          const parts = decodedTextFromImage.split('.');
          if (parts.length === 3 && parts.every(p => /^[A-Za-z0-9+/=]+$/.test(p))) {
             addHistory({ type: 'system', content: "Warning: Message appears to be encrypted but no password was provided." });
          }
        }
      } catch (e) {
        throw new Error("Decryption failed. Check your password.");
      }

      setDecodedText(finalDecodedText);
      setResultData(finalDecodedText); // Store for download
      addHistory({ type: 'output', content: 'Decoding successful!' });
      addHistory({ type: 'output', content: `Message: ${finalDecodedText}` });
      addHistory({ type: 'output', content: `Use "download" to save the message as a .txt file.` });
      setStage(Stage.AwaitingCommand);
    } catch (error) {
      addHistory({ type: 'error', content: `Decoding failed: ${(error as Error).message}` });
      resetState();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultData) {
      addHistory({ type: 'error', content: 'Nothing to download. Please encode an image or decode a message first.' });
      return;
    }

    const isImage = resultData.startsWith('data:image/png;base64,');
    if (isImage) {
      const a = document.createElement('a');
      a.href = resultData;
      a.download = 'encoded-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addHistory({ type: 'system', content: 'Downloading encoded image...' });
    } else {
      const blob = new Blob([resultData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'decoded-message.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addHistory({ type: 'system', content: 'Downloading decoded message...' });
    }
  };
  
  const resetState = () => {
    setStage(Stage.AwaitingCommand);
    setImageDataUri(null);
    setSecretMessage('');
    setPassword('');
    setResultData(null);
    setDecodedText('');
    addHistory({ type: 'system', content: 'State has been reset. Type "upload" to start over.' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      handleCommand(inputValue.trim());
    }
  };
  
  const handleKeyPress = (key: string) => {
    setInputValue(prev => prev + key);
  };

  const handleBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (inputValue.trim() && !isProcessing) {
      handleCommand(inputValue.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(prev => prev + text);
      addHistory({ type: 'system', content: `Pasted text from clipboard.` });
    } catch (err) {
      addHistory({ type: 'error', content: `Failed to read clipboard: ${(err as Error).message}` });
    }
  };
  
  const getPrompt = () => {
    switch (stage) {
      case Stage.Encode_GetMessage:
        return 'message> ';
      case Stage.Encode_GetPassword:
      case Stage.Decode_GetPassword:
        return 'password> ';
      default:
        return '$ ';
    }
  };

  const websiteUrl = 'https://imgsteg.vercel.app';
  const shareText = 'Check out this cool image steganography tool!';

  const focusInput = useCallback(() => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  return (
    <div
      className="w-full h-full bg-black text-green-400 font-mono flex flex-col"
      onClick={focusInput}
    >
      <header className="bg-[#2d3748] text-green-400 p-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2">&gt;</span>
          <span>IMG STEG CLI</span>
        </div>
        <div className="flex items-center space-x-3">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`} target="_blank" rel="noopener noreferrer">
            <Facebook size={18} className="cursor-pointer hover:text-white" />
          </a>
          <span title="Instagram sharing not supported from web">
            <Instagram size={18} className="cursor-not-allowed opacity-50" />
          </span>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
            <Twitter size={18} className="cursor-pointer hover:text-white" />
          </a>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + websiteUrl)}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} className="cursor-pointer hover:text-white" />
          </a>
        </div>
      </header>
      <div className="flex-1 p-4 overflow-y-auto pb-48">
        <div className="flex flex-col">
          {history.map((item, index) => (
            <div key={index} className={`whitespace-pre-wrap ${item.type === 'error' ? 'text-red-500' : ''} ${item.type === 'input' ? 'text-green-300' : ''}`}>
              {item.type === 'input' && '$ '}{item.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleFormSubmit} className="flex items-center">
          <span className="text-green-400">{getPrompt()}</span>
           <div className="flex-1 ml-2">
            <span>{inputValue}</span>
            {!isProcessing && <span className="blinking-cursor -ml-1 text-2xl font-bold">|</span>}
          </div>
          <input
            ref={inputRef}
            type={stage === Stage.Encode_GetPassword || stage === Stage.Decode_GetPassword ? 'password' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            className="bg-transparent border-none text-green-400 focus:outline-none w-0 h-0 p-0"
            autoFocus={!isMobile}
            onFocus={(e) => {
              if (isMobile) {
                e.target.blur();
              } else {
                 e.target.style.opacity = '0'
              }
            }}
            onBlur={(e) => {
                if (!isMobile) {
                    e.target.style.opacity = '0'
                }
            }}
          />
        </form>
        <div ref={terminalEndRef} />
      </div>
      {isMobile && <Keyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} onEnter={handleEnter} onPaste={handlePaste} />}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
