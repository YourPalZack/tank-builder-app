'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fish, User, Menu } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Fish className="h-8 w-8 text-teal-600 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-teal-400/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight text-slate-900">
            AquaBuilder
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link 
            href="/" 
            className={`hover:text-teal-600 transition-colors ${pathname === '/' ? 'text-teal-600' : ''}`}
          >
            Builder
          </Link>
          <Link 
            href="/my-builds" 
            className={`hover:text-teal-600 transition-colors ${pathname === '/my-builds' ? 'text-teal-600' : ''}`}
          >
            My Builds
          </Link>
          <Link href="#" className="hover:text-teal-600 transition-colors">Guides</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="User Profile">
            <User className="h-5 w-5 text-slate-600" />
          </button>
          <button className="md:hidden p-2 hover:bg-slate-100 rounded-full" aria-label="Menu">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
