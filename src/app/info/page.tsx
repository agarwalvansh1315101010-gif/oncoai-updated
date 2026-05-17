'use client';

import React from 'react';
import Header from '@/components/Header';
import SocialMediaStrip from '@/components/SocialMediaStrip';
import RibbonCarousel from '@/components/RibbonCarousel';
import Popups from '@/components/Popups';
import { BookOpen, HelpCircle, Heart, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CancerInfoPage() {
  const cancerTypes = [
    {
      title: "Invasive Ductal Carcinoma (IDC)",
      desc: "The most common form of breast cancer, beginning in the milk ducts and invading nearby breast tissue.",
      symptoms: ["Hard lump in the breast or armpit", "Skin dimpling or swelling", "Nipple retraction"],
    },
    {
      title: "Invasive Lobular Carcinoma (ILC)",
      desc: "Begins in the milk-producing glands (lobules). Often presents as a general thickening rather than a single hard lump.",
      symptoms: ["Area of thickening or fullness", "Changes in breast texture", "Different contour compared to other breast"],
    },
    {
      title: "Ductal Carcinoma In Situ (DCIS)",
      desc: "A non-invasive, pre-cancerous condition where abnormal cells are found inside a breast duct but haven't spread.",
      symptoms: ["Often silent/asymptomatic", "Detected on standard mammograms", "Occasionally a lump or nipple discharge"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col dark:bg-slate-950">
      <Header />
      <RibbonCarousel />
      <SocialMediaStrip />
      <Popups />

      <main className="flex-1">
        {/* Info Hero */}
        <section className="px-8 py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 text-xs font-black border border-pink-100 dark:border-pink-900/30 uppercase tracking-widest">
              Education & SEO Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Understanding Breast Cancer <br />
              <span className="text-pink-500">Types, Symptoms & Guidance</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Knowledge is empowerment. Learn about breast cancer variations, symptoms, and modern therapeutic options to better understand clinical insights.
            </p>
          </div>
        </section>

        {/* Types of Breast Cancer */}
        <section className="px-8 py-20 max-w-5xl mx-auto space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Types of Breast Cancer</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Different types of breast cancer require specialized clinical pathways.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cancerTypes.map((c, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center font-bold text-pink-500 text-sm">
                    {`0${i + 1}`}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{c.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Symptoms to Watch:</h4>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc pl-4 font-medium">
                    {c.symptoms.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Treatment Options Section */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
                <Star className="w-4 h-4 text-pink-400" />
                Modern Treatment Modalities
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">Therapy & Personalized Pathways</h3>
              <p className="text-slate-300 leading-relaxed font-medium">
                Modern oncology treatments are increasingly personalized. Standard approaches include **lumpectomy or mastectomy** (surgery), **radiation therapy**, **chemotherapy**, **hormone therapies** (for ER/PR positive cancers), and **targeted biological agents** (like Herceptin for HER2 positive cases).
              </p>
              <div className="pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-50 transition-all shadow-xl hover:scale-105 active:scale-95 group"
                >
                  Start Your Free Consultation
                  <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
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
