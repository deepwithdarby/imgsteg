import { SteganographyTool } from '@/components/steganography-tool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Steganography Tool | IMG STEG',
  description: 'Use our free online steganography tool to encode and decode secret messages in images. Secure your data with optional AES-GCM encryption.',
};

export default function ToolPage() {
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "IMG STEG - Steganography Tool",
    "operatingSystem": "Any (Web-based)",
    "applicationCategory": "SecurityApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "120"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <SteganographyTool />
    </div>
  );
}
