import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Eye } from 'lucide-react';
import NextImage from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Lock className="h-6 w-6" />
          <span className="sr-only">IMG STEG</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/tool" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Tool
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Hide Your Secrets in Plain Sight
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    IMG STEG is a modern steganography tool that allows you to securely embed and encrypt secret messages within images. Simple, secure, and anonymous.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/tool"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <NextImage
                src="https://picsum.photos/600/400"
                width={600}
                height={400}
                alt="Hero"
                data-ai-hint="security abstract"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our tool uses the Least Significant Bit (LSB) steganography technique to hide your data. For an added layer of security, you can encrypt your message with a password before encoding.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">1. Encode</h3>
                <p className="text-muted-foreground">
                  Upload an image, type your secret message, and optionally set a password for encryption. Click 'Encode' to generate a new image with the hidden message.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">2. Share</h3>
                <p className="text-muted-foreground">
                  Download the new image and share it. To the naked eye, it will look just like the original, but your secret is hidden within.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">3. Decode</h3>
                <p className="text-muted-foreground">
                  The recipient can use our tool to upload the image, enter the password (if one was set), and reveal the hidden message.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 IMG STEG. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
