'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  icon: React.ReactNode;
}

export default function RibbonCarousel() {
  const slides: Slide[] = [
    {
      id: 1,
      title: "Register for Free Expert Guidance",
      description: "Get breast cancer second opinions curated by senior oncologists and clinical AI. 100% free and confidential.",
      ctaText: "Get Guidance",
      ctaLink: "/register",
      gradient: "from-teal-600 via-emerald-600 to-cyan-600",
      icon: <Sparkles className="w-6 h-6 text-emerald-300" />,
    },
    {
      id: 2,
      title: "Support Our Mission — Donate Today",
      description: "Every contribution ensures our patient care guidance portal remains free and accessible worldwide.",
      ctaText: "Make a Donation",
      ctaLink: "#donate",
      gradient: "from-orange-500 via-rose-500 to-red-600",
      icon: <Heart className="w-6 h-6 text-rose-300" fill="currentColor" />,
    },
    {
      id: 3,
      title: "Collaborate With SocialGoodAI & IMS-BHU",
      description: "Oncologists, researchers, and developers partnering to build secure, transparent, and patient-first AI systems.",
      ctaText: "Partner With Us",
      ctaLink: "/about",
      gradient: "from-blue-600 via-indigo-600 to-violet-600",
      icon: <Shield className="w-6 h-6 text-indigo-300" />,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white select-none">
      {/* Ribbon Loop / Border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-pink-500 to-orange-400 z-10" />

      {/* Main Slides */}
      <div className="relative h-[280px] md:h-[220px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 translate-x-0 scale-100 z-20'
                  : 'opacity-0 translate-x-8 scale-95 z-10 pointer-events-none'
              }`}
            >
              {/* Slide Background Gradient with medical ribbon subtle overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-95`} />
              
              {/* Abstract decorative Ribbon/Wave graphic */}
              <div className="absolute inset-y-0 right-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M50 0 C70 30, 80 70, 100 100 L100 0 Z" fill="white" />
                </svg>
              </div>

              {/* Content container */}
              <div className="relative max-w-6xl mx-auto px-8 md:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                      {slide.icon}
                    </div>
                    <span className="text-xs uppercase tracking-widest font-black text-white/80">SocialGoodAI Initiative</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight">{slide.title}</h3>
                  <p className="text-sm text-white/90 font-medium leading-relaxed max-w-2xl">{slide.description}</p>
                </div>

                <div className="flex-shrink-0">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-50 transition-all duration-200 shadow-xl shadow-black/10 hover:scale-105 active:scale-95"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all border border-white/10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all border border-white/10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
