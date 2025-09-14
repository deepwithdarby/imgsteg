import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { IBM_Plex_Mono as FontMono } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
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
      <body className={cn('min-h-screen bg-background font-mono antialiased', fontMono.variable)}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
