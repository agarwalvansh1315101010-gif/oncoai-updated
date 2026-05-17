'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Activity, Heart, RefreshCw } from 'lucide-react';

export default function ThreeDMedicalScan() {
  const [rotate, setRotate] = useState({ x: 12, y: -15 });
  const [activeLayer, setActiveLayer] = useState(0);
  const [scanBeamY, setScanBeamY] = useState(0);
  const [diagnostics, setDiagnostics] = useState({
    density: 64.2,
    malignancyRisk: 0.12,
    calcification: 'None detected',
    volume: '24.5 cm³',
  });

  // Handle subtle mouse move parallax over the 3D grid
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Limit rotation values for premium feel
    const factorX = -y / (box.height / 35);
    const factorY = x / (box.width / 35);
    
    setRotate({ x: factorX, y: factorY });
  };

  const handleMouseLeave = () => {
    // Return to gentle default angle
    setRotate({ x: 12, y: -15 });
  };

  // Animate scanning beam and diagnostic telemetry values
  useEffect(() => {
    const beamInterval = setInterval(() => {
      setScanBeamY((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 35);

    const telemetryInterval = setInterval(() => {
      setDiagnostics((prev) => ({
        ...prev,
        density: +(prev.density + (Math.random() * 0.4 - 0.2)).toFixed(1),
        malignancyRisk: +(prev.malignancyRisk + (Math.random() * 0.002 - 0.001)).toFixed(4),
      }));
    }, 1500);

    return () => {
      clearInterval(beamInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl mx-auto py-12 px-6">
      
      {/* 3D Holographic Stage */}
      <div 
        className="relative w-full max-w-[450px] aspect-square rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center cursor-pointer overflow-hidden group [perspective:1000px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Futuristic Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Holographic glowing spotlights */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

        {/* 3D Rotating Stack */}
        <div 
          className="relative w-72 h-72 transition-transform duration-300 ease-out [transform-style:preserve-3d]"
          style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
        >
          {/* Layer 0: Neon Bottom Grid Plate */}
          <div className="absolute inset-0 rounded-full border border-teal-500/10 bg-teal-950/5 flex items-center justify-center [transform:translateZ(-60px)_rotateZ(0deg)] animate-[spin_60s_linear_infinite]">
            <div className="w-60 h-60 rounded-full border-2 border-dashed border-teal-500/20" />
            <div className="w-40 h-40 rounded-full border border-teal-500/30 flex items-center justify-center">
              <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Depth Base</span>
            </div>
          </div>

          {/* Layer 1: Anatomy Slice (Hologram Overlay) */}
          <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 flex items-center justify-center [transform:translateZ(0px)] ${activeLayer === 1 ? 'opacity-100' : 'opacity-60'}`}>
            {/* SVG Breast Carcinoma Ingestion Hologram */}
            <svg className="w-56 h-56 text-pink-500/30" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
              {/* Healthy tissues contour */}
              <path d="M 60,100 C 60,60 140,60 140,100 C 140,140 60,140 60,100 Z" stroke="currentColor" strokeWidth="1.5" />
              {/* Tumor region highlighted */}
              <circle cx="115" cy="95" r="16" className="text-red-500 animate-pulse" stroke="currentColor" strokeWidth="2" fill="rgba(239, 68, 68, 0.1)" />
              <line x1="115" y1="95" x2="160" y2="50" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="160" cy="50" r="3" fill="#f43f5e" />
            </svg>
          </div>

          {/* Layer 2: Scanning Laser Beam Plate */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_15px_rgba(236,72,153,0.8)] [transform:translateZ(30px)] pointer-events-none"
            style={{ top: `${scanBeamY}%` }}
          />

          {/* Layer 3: HUD Overlay (Top holographic elements) */}
          <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(80px)] pointer-events-none">
            <div className="w-full h-full border border-pink-500/20 rounded-3xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl">
                  <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">Diagnostic HUD</p>
                  <p className="text-xs text-pink-400 font-black">SocialGoodAI v2.0</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
              </div>
              
              <div className="flex justify-between items-end">
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl space-y-1 font-mono text-[9px] text-slate-400">
                  <p>SCAN VOL: <span className="text-slate-200">{diagnostics.volume}</span></p>
                  <p>SYS MAL: <span className="text-red-400">{(diagnostics.malignancyRisk * 100).toFixed(2)}%</span></p>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl font-mono text-[9px] text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span className="text-teal-400">LIVE FEED</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Diagonal Scan Line overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 border border-slate-800 rounded-xl flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveLayer((prev) => (prev === 0 ? 1 : 0)); }}
            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 font-mono">TOGLE SLICE VIEW</span>
        </div>
      </div>

      {/* Futuristic Telemetry Details */}
      <div className="flex-1 space-y-6 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-xs font-black border border-pink-500/20 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Futuristic Tomography
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Holographic <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">3D Tumor Slice</span> Mapping
        </h2>

        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          Just like elite hardware models, OncoAI constructs high-fidelity multi-slice coordinate projections. When patient files upload, our engine constructs automated vector coordinates mapping spatial tumor density at zero cost.
        </p>

        {/* Telemetry Matrix Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spatial Density</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{diagnostics.density}%</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-1.5 transition-all duration-300" style={{ width: `${diagnostics.density}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Malignancy Risk Coordinate</p>
            <p className="text-2xl font-black text-red-500">{diagnostics.malignancyRisk}</p>
            <div className="flex items-center gap-1 text-[10px] text-red-500 font-extrabold uppercase">
              <Shield className="w-3 h-3" />
              Pre-Vetting V2
            </div>
          </div>
        </div>

        {/* Apple-style animated interactive highlights */}
        <div className="flex flex-wrap gap-3 pt-2">
          <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold font-mono tracking-wider border border-slate-800">
            IDC MATCHED
          </span>
          <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold font-mono tracking-wider border border-slate-800">
            768-D VECTOR
          </span>
          <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold font-mono tracking-wider border border-slate-800">
            IMS-BHU ANCHOR
          </span>
        </div>
      </div>

    </div>
  );
}
