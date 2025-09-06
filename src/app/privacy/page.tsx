
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: July 26, 2024</p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Introduction</h2>
        <p>
          Your privacy is important to us. This Privacy Policy explains how IMG STEG collects, uses, and protects your information. Our tool is designed to be client-side, meaning your data and passwords never leave your machine.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. Information We Do Not Collect</h2>
        <p>
          We do not collect, store, or transmit any personal data you process through our steganography tool. This includes:
        </p>
        <ul>
          <li>The images you upload.</li>
          <li>The messages you encode.</li>
          <li>The passwords you use for encryption.</li>
        </ul>
        <p>
          All encoding, decoding, and cryptographic operations are performed locally in your browser using the Web Crypto API.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Information We Collect</h2>
        <p>
          We may collect anonymous usage data for the sole purpose of improving our Service. This data is non-personal and cannot be used to identify you.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Third-Party Services</h2>
        <p>
          Our website may contain links to other websites. We are not responsible for the privacy practices of these other sites.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  );
}
