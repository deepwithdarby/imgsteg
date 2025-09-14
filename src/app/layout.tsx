import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Special_Elite as FontMono } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'IMG STEG',
  description: 'Hide secret messages in your images.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn('h-screen bg-background font-mono antialiased', fontMono.variable)}>
        <main className="h-full">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
