import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Terminal } from '@/components/terminal';

export default function ToolPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
       <Card className="mb-8 w-full max-w-4xl border-primary bg-transparent text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary">IMG STEG</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Hide secret messages in your images.</CardDescription>
        </CardHeader>
      </Card>
      <Terminal />
    </div>
  );
}
