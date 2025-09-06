import Link from "next/link";
import { Lock } from "lucide-react";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Lock className="h-6 w-6" />
        <span className="ml-2 font-semibold">IMG STEG</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="/tool" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Tool
        </Link>
        <Link href="/learn-more" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Learn More
        </Link>
        <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          About
        </Link>
        <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Contact
        </Link>
      </nav>
    </header>
  );
}
