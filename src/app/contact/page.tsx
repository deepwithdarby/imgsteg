import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
    title: 'Contact Us | IMG STEG',
    description: 'Get in touch with the IMG STEG team. We are here to answer your questions about our steganography tool.',
  };

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex items-center justify-center p-4">
        <ContactForm />
      </main>
    </div>
  );
}
