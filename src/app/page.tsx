'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import RibbonCarousel from '@/components/RibbonCarousel';
import SocialMediaStrip from '@/components/SocialMediaStrip';
import Popups from '@/components/Popups';
import ThreeDMedicalScan from '@/components/ThreeDMedicalScan';
import { ArrowRight, ShieldCheck, Activity, Brain, Users, Award, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Header />
      <RibbonCarousel />
      <SocialMediaStrip />
      <Popups />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Abstract light decorative element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 dark:bg-pink-500/3 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 text-xs font-black border border-pink-100 dark:border-pink-900/30 uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5" />
              Breast Cancer Initiative
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
              Advanced AI-Powered <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">Second Opinion</span> Portal
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              SocialGoodAI brings US-style *cancercommons.org* guidance to India. Partnered with **IMS-BHU** as our clinical anchor, we provide patients with free, secure, and expert-reviewed cancer care treatment guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold text-lg hover:from-pink-600 hover:to-rose-700 hover:shadow-xl hover:shadow-pink-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                Learn Our Mission
              </Link>
            </div>
          </div>
        </section>

        {/* The Portal (Tech & Flow) Section */}
        <section className="px-6 py-24 max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 text-xs font-black border border-teal-100 dark:border-teal-900/30 uppercase tracking-widest">
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">The Guidance Portal</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed text-sm font-medium">Simple, secure, and expert-reviewed at every step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">1. Patient Login</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Register in seconds and securely upload your medical reports, scan files, or treatment history.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-teal-600">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">2. AI Analysis</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Our advanced clinical AI models instantly scan your reports to extract key clinical markers and treatments.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/20 flex items-center justify-center text-pink-500">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">3. Medical Vetting</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Senior oncologists from IMS-BHU review the AI outputs to confirm accuracy and personalized guidance.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">4. Expert Insights</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Log back in to view your verified treatment insights and schedule follow-ups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Scanning Visuals Section */}
        <section className="bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800/80">
          <ThreeDMedicalScan />
        </section>

        {/* Doctor Testimonial / Trust Section */}
        <section className="bg-slate-900 text-white px-6 py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-pink-300 text-xs font-bold border border-slate-700/50">
              <Heart className="w-3.5 h-3.5 text-pink-500" fill="currentColor" />
              Clinical Vetting Anchor
            </div>

            <blockquote className="text-xl md:text-3xl font-medium italic text-slate-200 leading-relaxed">
              "We have engineered SocialGoodAI to ensure no cancer patient is left in confusion. By using advanced technology alongside a rigorous review by our oncology specialists at IMS-BHU, we build absolute trust."
            </blockquote>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-pink-500 flex items-center justify-center font-black text-pink-400 text-xl shadow-lg">
                DG
              </div>
              <h4 className="text-lg font-bold text-white leading-none mt-2">Dr. S. K. Gupta</h4>
              <p className="text-xs text-pink-400 font-bold uppercase tracking-widest">Senior Clinical Partner, IMS-BHU Oncology Panel</p>
            </div>
          </div>
        </section>

        {/* Security Trust Section */}
        <section className="px-6 py-24 max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Medical Privacy is Protected</h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            All files and direct messaging conversations are protected with enterprise-grade AES-256 end-to-end encryption. Only authorized oncologists have the key to access your clinical scans.
          </p>
        </section>

      </main>

      {/* Sleek Footer */}
      <footer className="px-8 py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-red-500 flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-black text-slate-800 dark:text-white text-base">SocialGoodAI</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-pink-500">Home</Link>
            <Link href="/about" className="hover:text-pink-500">About Us</Link>
            <Link href="/info" className="hover:text-pink-500">Cancer Info</Link>
            <Link href="/register" className="hover:text-pink-500">Register</Link>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 SocialGoodAI Portal. All rights reserved. Vetted by IMS-BHU.
          </p>

        </div>
      </footer>
    </div>
  );
}
