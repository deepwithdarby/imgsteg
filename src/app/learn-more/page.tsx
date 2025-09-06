import Link from 'next/link';
import { Eye, Shield, Users } from 'lucide-react';

export default function LearnMorePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
        <h1 className="text-4xl font-bold mb-4">Understanding Image Steganography</h1>
        <p className="text-muted-foreground mb-8">
          The art and science of hiding information in plain sight.
        </p>

        <h2 className="text-3xl font-semibold mt-12 mb-4 flex items-center">
          <Eye className="mr-3 h-7 w-7" />
          What is Steganography?
        </h2>
        <p>
          Steganography is the practice of concealing a file, message, image, or video within another file, message, image, or video. The word "steganography" comes from the Greek words "steganos" (meaning "covered" or "concealed") and "graphein" (meaning "writing"). Unlike cryptography, which scrambles a message to make it unreadable, steganography hides the very existence of the message. The goal is for an unintended recipient to not even suspect that a secret message exists.
        </p>
        <p>
          Our tool focuses on <strong>image steganography</strong>, where we embed secret text data directly into the pixels of a digital image.
        </p>

        <h2 className="text-3xl font-semibold mt-12 mb-4 flex items-center">
          How Does It Work? The LSB Method
        </h2>
        <p>
          We use one of the most popular techniques in image steganography: <strong>Least Significant Bit (LSB)</strong> insertion. Here’s a step-by-step breakdown of the process:
        </p>
        <ol>
          <li>
            <strong>Digital Images as Pixels:</strong> Every digital image is made up of thousands or millions of pixels. Each pixel has a color, which is typically represented by a combination of Red, Green, and Blue (RGB) values. In a standard 24-bit color image, each of these three color components has an 8-bit value, ranging from 0 to 255.
          </li>
          <li>
            <strong>Bits and Bytes:</strong> An 8-bit value looks like this in binary: <code>11010101</code>. The rightmost bit (in this case, <code>1</code>) is called the <strong>Least Significant Bit (LSB)</strong> because changing it has the smallest possible impact on the overall value. For a color component, changing the LSB will alter its value by only 1, a change that is completely imperceptible to the human eye.
          </li>
          <li>
            <strong>Embedding the Message:</strong> Our tool converts your secret message into a sequence of binary bits. It then iterates through the pixels of the cover image, one by one, and replaces the LSB of each color component (Red, Green, or Blue) with a bit from your secret message.
          </li>
          <li>
            <strong>Termination Signal:</strong> To know when the message ends during decoding, we append a special, invisible "terminator" sequence of bits at the end of your message. When the decoding process finds this terminator, it stops reading.
          </li>
          <li>
            <strong>Decoding the Message:</strong> The recipient uses our tool to upload the steganographic image. The tool reads the LSB of each color component in the same order, reconstructs the binary sequence, and converts it back into the original text message.
          </li>
        </ol>
        <div className="bg-muted p-4 rounded-lg my-6">
          <p className="font-bold">The Magic of Imperceptibility:</p>
          <p>Because we only modify the least important part of the pixel data, the resulting image looks identical to the original. You could embed a full paragraph of text into a moderately sized photo without anyone knowing it's there.
          </p>
        </div>


        <h2 className="text-3xl font-semibold mt-12 mb-4 flex items-center">
          <Shield className="mr-3 h-7 w-7" />
          Why Is It Useful & Secure?
        </h2>
        <p>
          Steganography offers a unique form of security through obscurity.
        </p>
        <ul>
            <li><strong>Plausible Deniability:</strong> It's difficult to prove that a hidden message even exists within an image, unlike an encrypted file which is obviously scrambled data.</li>
            <li><strong>Enhanced Privacy:</strong> You can share images publicly on social media or through email, knowing that your hidden message is secretly traveling with it.</li>
            <li><strong>Dual-Layer Security:</strong> Our tool combines steganography with robust <strong>AES-GCM encryption</strong>. Before your message is hidden, it's encrypted with a password you provide. This means that even if someone suspects a hidden message and manages to extract it, they still can't read it without the correct password. All this happens in your browser, so your password is never sent to us.</li>
        </ul>

        <h2 className="text-3xl font-semibold mt-12 mb-4 flex items-center">
          <Users className="mr-3 h-7 w-7" />
          What We Collect (and What We Don't)
        </h2>
        <p>
          Your privacy is paramount. Our tool is designed to be entirely client-side. This means:
        </p>
        <ul className="list-disc pl-6">
          <li><strong>We DO NOT collect or store your images.</strong> All image processing happens locally on your computer.</li>
          <li><strong>We DO NOT collect or store your secret messages.</strong></li>
          <li><strong>We DO NOT collect or store your passwords.</strong></li>
        </ul>
        <p>
          The entire process, from uploading an image to encoding a message and downloading the result, occurs within your web browser. Nothing is ever sent to our servers. For more detailed information, please review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
