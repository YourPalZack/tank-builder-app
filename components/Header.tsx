import Link from 'next/link';
import { Fish, User, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-ocean-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Fish className="h-8 w-8 text-teal-400 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-teal-400/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight text-white">
            AquaBuilder
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="#" className="hover:text-teal-400 transition-colors">My Builds</Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">Browse Parts</Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">Guides</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="User Profile">
            <User className="h-5 w-5 text-gray-300" />
          </button>
          <button className="md:hidden p-2 hover:bg-white/10 rounded-full" aria-label="Menu">
            <Menu className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
