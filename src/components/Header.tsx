'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl h-20 items-center justify-between px-6 md:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-red-500 shadow-md group-hover:scale-105 transition-transform duration-200">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">
              SocialGood<span className="text-pink-500">AI</span>
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-0.5">
              OncoAI Portal
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/info"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            Cancer Info
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/register"
            className="text-sm font-bold text-pink-500 hover:text-pink-600 dark:text-pink-400 transition-colors flex items-center gap-1 group"
          >
            Register
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          <Link
            href="#donate"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-extrabold hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 hover:scale-[1.02]"
          >
            Donate Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-slate-500 md:hidden hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 space-y-4 animate-fade-in">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500"
          >
            About Us
          </Link>
          <Link
            href="/info"
            onClick={() => setIsOpen(false)}
            className="block text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500"
          >
            Cancer Info
          </Link>
          <Link
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="block text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500"
          >
            Contact Us
          </Link>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-2xl border border-pink-500/20 text-center text-pink-500 font-bold hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-all"
            >
              Register
            </Link>
            <Link
              href="#donate"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-center shadow-lg"
            >
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
