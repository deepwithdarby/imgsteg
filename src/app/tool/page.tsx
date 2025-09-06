import { SteganographyTool } from '@/components/steganography-tool';

export default function ToolPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <SteganographyTool />
    </main>
  );
}
