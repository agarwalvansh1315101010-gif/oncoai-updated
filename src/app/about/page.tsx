'use client';

import React from 'react';
import Header from '@/components/Header';
import SocialMediaStrip from '@/components/SocialMediaStrip';
import RibbonCarousel from '@/components/RibbonCarousel';
import Popups from '@/components/Popups';
import { Shield, Heart, Award, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col dark:bg-slate-950">
      <Header />
      <RibbonCarousel />
      <SocialMediaStrip />
      <Popups />

      <main className="flex-1">
        {/* Mission Hero */}
        <section className="px-8 py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 text-xs font-black border border-pink-100 dark:border-pink-900/30 uppercase tracking-widest">
              Our Mission
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Bringing World-Class Breast Cancer <br />
              <span className="text-pink-500">Second Opinions</span> to India
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Inspired by US platforms like *cancercommons.org*, SocialGoodAI partners directly with **IMS-BHU** (Institute of Medical Sciences, Banaras Hindu University) as our medical anchor to ensure state-of-the-art care guidance is accessible to every patient at zero cost.
            </p>
          </div>
        </section>

        {/* Anchors & Partnerships */}
        <section className="px-8 py-20 max-w-5xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Our Anchor Partner: <span className="text-pink-500">IMS-BHU</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                The Institute of Medical Sciences (IMS-BHU) is a premier government medical institute in Varanasi, India. By serving as our clinical anchor, IMS-BHU ensures that all AI-generated reports are rigorously cross-verified by qualified senior oncologists, bringing unmatched medical credibility to our platform.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">100% Confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Subsidy Funded</span>
                </div>
              </div>
            </div>

            {/* Dr. Gupta Testimonial/Testimony box */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl" />
              <div className="space-y-6">
                <p className="text-lg italic text-slate-300 leading-relaxed font-medium">
                  "Our collaboration with SocialGoodAI represents a massive step forward for cancer treatment accessibility in India. By utilizing secure AI alongside direct clinical oversight, we dramatically shorten the path to accurate treatment plans."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-pink-500 flex items-center justify-center font-black text-pink-500 text-lg">
                    DG
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">Dr. S. K. Gupta</h4>
                    <p className="text-xs text-pink-400 font-bold uppercase tracking-wider">Senior Oncologist & Partner Anchor, IMS-BHU</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars of SocialGoodAI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Expert Clinical Vetting</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                AI extracts markers and outlines guidelines, which are immediately verified by Dr. Gupta and his oncology panel.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Patient-Centric Design</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero confusion. Simple portals allow one-click document uploads and seamless direct messaging.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero-Cost Commitment</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Funded by subsidies and philanthropy to keep professional guidance free for all patients.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-8 py-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-500 to-red-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-black text-slate-800 dark:text-white">SocialGoodAI</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">© 2026 SocialGoodAI Portal. Powered by Google Gemini. All rights reserved.</p>
      </footer>
    </div>
  );
}
