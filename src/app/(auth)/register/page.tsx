'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import SocialMediaStrip from '@/components/SocialMediaStrip';
import Popups from '@/components/Popups';
import { Heart, ShieldCheck, Sparkles, Activity, KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PATIENT',
  });
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      if (data.verificationRequired) {
        setStep('OTP');
      } else {
        router.push(`/${data.role.toLowerCase()}/dashboard`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired verification code');
      }

      router.push(`/${data.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden transition-all duration-500">
      
      {/* Absolute Neon Glow Backdrops */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />
      <SocialMediaStrip />
      <Popups />

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-6 py-12 gap-12 items-center justify-center relative z-10">
        
        {/* Left Side Info Panel */}
        <div className="hidden lg:flex flex-col space-y-8 max-w-md text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 text-xs font-black border border-pink-100 dark:border-pink-900/30 uppercase tracking-widest w-fit">
            <Activity className="w-3.5 h-3.5" />
            100% Free Consultation
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Register to Get Your <span className="text-pink-500">Free Care Guidance</span> Today
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Our platform provides patients with high-quality clinical summaries of their medical scans, double-checked by senior specialists from IMS-BHU.
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center flex-shrink-0 text-teal-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">HIPAA-Ready Security</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your files are encrypted using standard AES-256 protocols.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/20 flex items-center justify-center flex-shrink-0 text-pink-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">Gemini AI Insights</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Advanced large language model extracts metadata and creates preliminary summaries.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Card Panel */}
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500">
          
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500" />
          
          {step === 'FORM' ? (
            <>
              <div className="text-center space-y-2 mb-8 animate-fade-in">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Your Account</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Join the SocialGoodAI Portal today</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5 animate-fade-in">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-950/50">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane.doe@example.com"
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="role">Account Type</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="PATIENT">Patient (Upload scan & get second opinions)</option>
                    <option value="DOCTOR">Doctor / Oncologist (Provide guidance)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-sm hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-center animate-fade-in">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-pink-500 hover:text-pink-600">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* OTP CODE VIEWPORT */}
              <div className="text-center space-y-3 mb-8 animate-slide-up">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/5">
                  <KeyRound className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Security Check</h3>
                  <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mt-1">Verification Required</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                    We sent a 6-digit verification code to <span className="text-slate-700 dark:text-slate-200 font-extrabold">{formData.email}</span>.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-slide-up">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-950/50">
                    {error}
                  </div>
                )}

                <div className="space-y-2 text-left">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block text-center" htmlFor="otp">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]*"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000 000"
                    className="w-full px-4 py-4 text-center tracking-[0.6em] text-2xl font-black bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-300 focus:outline-none focus:border-pink-500 transition-all font-mono"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-semibold flex gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Developer Mode:</strong> To simulate the email dispatch at 0-cost, check your <strong>server terminal outputs</strong> for the generated 6-digit OTP code!
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-sm hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('FORM');
                    setError('');
                    setOtp('');
                  }}
                  className="w-full py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Signup
                </button>
              </form>
            </>
          )}

        </div>

      </div>

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
