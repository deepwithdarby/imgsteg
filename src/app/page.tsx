import { Terminal } from '@/components/terminal';

export default function ToolPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <h1 className="mb-4 text-4xl font-bold text-primary">IMG STEG</h1>
      <p className="mb-8 text-lg text-muted-foreground">Hide secret messages in your images.</p>
      <Terminal />
    </div>
  );
}
