'use client';

import React from 'react';

export default function SocialMediaStrip() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-l-2xl border-l border-y border-slate-700/50 shadow-2xl transition-all duration-300 hover:bg-slate-900 hover:translate-x-1 hover:pr-4">
      {/* Instagram SVG */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl text-slate-400 hover:text-pink-500 hover:bg-white/10 transition-all duration-200 hover:scale-110"
        title="Follow us on Instagram"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>

      {/* Facebook SVG */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-white/10 transition-all duration-200 hover:scale-110"
        title="Follow us on Facebook"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </a>

      {/* LinkedIn SVG */}
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-white/10 transition-all duration-200 hover:scale-110"
        title="Connect on LinkedIn"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
    </div>
  );
}
