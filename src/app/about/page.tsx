import NextImage from 'next/image';
import Link from 'next/link';
import { Lock, Code, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">About IMG STEG</div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Mission</h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    At IMG STEG, we believe in the fundamental right to privacy and secure communication. Our mission is to provide an easy-to-use, powerful tool that empowers individuals to protect their sensitive information by hiding it in plain sight.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/tool"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Try the Tool
                  </Link>
                </div>
              </div>
              <NextImage
                src="https://picsum.photos/600/600"
                width={600}
                height={600}
                alt="About Us"
                data-ai-hint="team collaboration"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Technology Behind the Magic</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We combine timeless steganography techniques with modern cryptography to ensure your messages are both hidden and secure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-1 md:grid-cols-3 md:gap-12">
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">LSB Steganography</h3>
                <p className="text-muted-foreground">
                  We use the Least Significant Bit (LSB) technique to subtly alter pixel data, embedding your message without visibly changing the image.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">AES-GCM Encryption</h3>
                <p className="text-muted-foreground">
                  Your message is encrypted with a password using AES-GCM, a robust, authenticated encryption algorithm, before it's hidden.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Web Crypto API</h3>
                <p className="text-muted-foreground">
                  All cryptographic operations happen directly in your browser, ensuring your password and plaintext message never leave your machine.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
