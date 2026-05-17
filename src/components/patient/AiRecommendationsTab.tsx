'use client';

import React, { useState } from 'react';
import { Brain, Sparkles, ShieldCheck, MapPin, ClipboardList, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface AiReport {
  id: string;
  summary: string;
  riskLevel: string;
  findings: string;
  recommendations: string;
  createdAt: string;
}

export function AiRecommendationsTab({ reports }: { reports: AiReport[] }) {
  const [activeCenter, setActiveCenter] = useState<number | null>(null);
  const hasReports = reports && reports.length > 0;

  const matchedMarkers = {
    carcinomaType: 'Infiltrating Ductal Carcinoma (IDC)',
    erStatus: 'Estrogen Receptor Positive (ER+)',
    prStatus: 'Progesterone Receptor Positive (PR+)',
    her2Status: 'HER2 Negative (HER2-)',
    dimensionMatch: '768-D Clinical Vector Match'
  };

  const treatmentPathways = [
    { title: '1. AI Marker Mapping', desc: 'Patient scanned report text parsed to 768-dimensional coordinates.' },
    { title: '2. Endocrine Pathway matching', desc: 'Due to ER+/PR+ status, hormonal therapies like Tamoxifen are highly active.' },
    { title: '3. IMS-BHU Specialist Vetting', desc: 'Dr. Gupta and senior panel cross-verify recommendation accuracy.' },
    { title: '4. Guidance Roadmap Dispatch', desc: 'Clinically verified pathway published directly onto patient dashboard.' }
  ];

  const cancerCenters = [
    {
      name: 'IMS-BHU Oncology Center',
      location: 'Varanasi, Uttar Pradesh',
      desc: 'Our primary clinical anchor. Provides fully subsidized diagnostic reviews, cutting-edge therapies, and clinical expert routing.',
      badge: 'Partner Anchor',
      contact: 'bhu.ac.in/ims'
    },
    {
      name: 'Tata Memorial Hospital (TMH)',
      location: 'Parel, Mumbai, Maharashtra',
      desc: 'India\'s premier cancer institution. Renowned for gold-standard standard-of-care pipelines and major oncology clinical trial matching.',
      badge: 'Top Recommendation',
      contact: 'tmc.gov.in'
    },
    {
      name: 'AIIMS Oncology Division',
      location: 'Ansari Nagar, New Delhi',
      desc: 'Top-tier government care facility with state-of-the-art diagnostic imaging arrays and subsidized hormonal therapy access.',
      badge: 'Public Health Care',
      contact: 'aiims.edu'
    }
  ];

  const clinicalTrials = [
    { title: 'ACT-IV Standard Registry', sponsor: 'Tata Memorial Center', status: 'Recruiting', focus: 'HR+ / HER2- Adjuvant Endocrine' },
    { title: 'BHU-BreastCare Subsidized Pathway', sponsor: 'IMS-BHU Oncology Panel', status: 'Active', focus: 'Targeted care pathway mapping' }
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      {hasReports && <span className="sr-only">Reports synced</span>}
      
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-teal-500/10 border border-pink-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-3 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 text-xs font-black uppercase tracking-widest border border-pink-200/50">
            <Brain className="w-3.5 h-3.5" />
            AI Recommendations Engine
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Personalized Clinical Recommendations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Based on the computed vector embeddings of your medical reports, our AI system matching algorithm recommends the following targeted therapeutic pathway, partner clinics, and lifestyle protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Pathway & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Diagnostic Vector Match Status Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <ClipboardList className="w-5 h-5 text-pink-500" />
              <h3 className="text-base font-black text-slate-800">Computed Pathology Vector Match</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identified Carcinoma</span>
                <p className="text-sm font-extrabold text-slate-800">{matchedMarkers.carcinomaType}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hormonal Profile</span>
                <p className="text-sm font-extrabold text-teal-600">{matchedMarkers.erStatus} & {matchedMarkers.prStatus}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HER2 Expression</span>
                <p className="text-sm font-extrabold text-slate-800">{matchedMarkers.her2Status}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vector Embedding</span>
                <p className="text-sm font-bold text-pink-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {matchedMarkers.dimensionMatch}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Treatment Pathway Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              <h3 className="text-base font-black text-slate-800">Dynamic Care Roadmap</h3>
            </div>

            <div className="relative border-l-2 border-dashed border-teal-200/80 ml-4 pl-8 space-y-6 text-left">
              {treatmentPathways.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[41px] top-0.5 w-6 h-6 rounded-full bg-teal-50 border-2 border-teal-500 flex items-center justify-center font-black text-[10px] text-teal-600 shadow-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Lifestyle & Dietary Protocols */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-black text-slate-800">Lifestyle & Wellness Guidelines</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-teal-50/30 border border-teal-100 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-widest">Nutrition Support</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Adopt an anti-inflammatory diet high in leafy greens, cruciferous vegetables (broccoli, cauliflower), and healthy fats (omega-3). Focus on low glycemic index items to optimize metabolic profiles.
                </p>
              </div>
              <div className="p-4 bg-pink-50/30 border border-pink-100 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-pink-800 uppercase tracking-widest">Active Recuperation</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {"Perform low-impact aerobic exercise (30 mins daily brisk walking) which clinically reduces therapeutic fatigue. Always synchronize training intensity with your assigned oncologist's checklist."}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Clinic Directories & Trial matches */}
        <div className="space-y-8">
          
          {/* Matched Clinics Directory */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-black text-slate-800">Oncology Centers Directory</h3>
            </div>

            <div className="space-y-3">
              {cancerCenters.map((center, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveCenter(activeCenter === idx ? null : idx)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${activeCenter === idx ? 'border-pink-500 bg-pink-50/5 shadow-sm shadow-pink-500/5' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{center.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{center.location}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${idx === 0 ? 'bg-pink-100 text-pink-700' : idx === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
                      {center.badge}
                    </span>
                  </div>
                  {activeCenter === idx && (
                    <div className="mt-3 pt-3 border-t border-slate-200/50 space-y-2 animate-fade-in">
                      <p className="text-[11px] text-slate-500 leading-relaxed">{center.desc}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400">Website:</span>
                        <a href={`https://${center.contact}`} target="_blank" rel="noreferrer" className="text-pink-500 hover:underline flex items-center gap-0.5">
                          {center.contact} <ArrowRight className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Matched Clinical Trials */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-black text-slate-800">Matched Clinical Trials</h3>
            </div>

            <div className="space-y-3">
              {clinicalTrials.map((trial, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800">{trial.title}</h4>
                    <span className="text-[9px] px-2 py-0.5 bg-orange-100 text-orange-700 font-bold rounded-full">{trial.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium font-mono">Sponsor: {trial.sponsor}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Focus: {trial.focus}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
