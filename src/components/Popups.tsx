'use client';

import React, { useState, useEffect } from 'react';
import { Heart, X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Popups() {
  const [activePopup, setActivePopup] = useState<'donate' | 'register' | 'none'>('none');

  useEffect(() => {
    // Show Donate popup immediately on mount/load
    const hasSeenPopups = sessionStorage.getItem('hasSeenPopups');
    if (!hasSeenPopups) {
      setActivePopup('donate');
    }
  }, []);

  const handleCloseDonate = () => {
    // Transition to Register Popup
    setActivePopup('register');
  };

  const handleCloseRegister = () => {
    setActivePopup('none');
    sessionStorage.setItem('hasSeenPopups', 'true');
  };

  if (activePopup === 'none') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in transition-all duration-300">
      
      {/* 1. Donate Now Popup */}
      {activePopup === 'donate' && (
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-8 overflow-hidden transform transition-all duration-500 scale-100 hover:shadow-3xl">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-red-500" />
          
          <button
            onClick={handleCloseDonate}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mb-6 shadow-sm border border-orange-100 dark:border-orange-900/30">
              <Heart className="w-8 h-8 text-orange-500" fill="currentColor" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Keep This Service Free
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-sm">
              SocialGoodAI operates as a non-profit initiative. Every second opinion, expert consultation, and AI-driven review is fully subsidized by donations. Help us keep advanced cancer guidance accessible to all, free of charge.
            </p>

            <div className="w-full space-y-3 mt-8">
              <a
                href="#donate"
                onClick={handleCloseDonate}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group transition-all duration-200"
              >
                Donate Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={handleCloseDonate}
                className="w-full py-3 text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                Maybe later, show guidance details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Register Popup */}
      {activePopup === 'register' && (
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-8 overflow-hidden transform transition-all duration-500 scale-100 hover:shadow-3xl">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500" />
          
          <button
            onClick={handleCloseRegister}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center mb-6 shadow-sm border border-pink-100 dark:border-pink-900/30">
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Free Cancer Guidance
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-sm">
              Get your free breast cancer second opinion care guidance today. Register now to securely upload your scans and receive clinical report summaries vetted by senior specialists.
            </p>

            <div className="w-full space-y-3 mt-8">
              <Link
                href="/register"
                onClick={handleCloseRegister}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-base shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 group transition-all duration-200"
              >
                Get Free Care Guidance
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleCloseRegister}
                className="w-full py-3 text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                No thanks, just browse
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
