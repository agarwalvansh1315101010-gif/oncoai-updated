'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Sparkles, Shield, User, Bot } from 'lucide-react'

type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('PATIENT')
  const [email, setEmail] = useState('patient@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle switching roles and pre-populating standard demo accounts
  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'PATIENT') {
      setEmail('patient@example.com');
      setPassword('password123');
    } else if (selectedRole === 'DOCTOR') {
      setEmail('doctor@oncoai.com'); // Match database seeds
      setPassword('doctor123');
    } else {
      setEmail('admin@oncoai.com'); // Match database seeds
      setPassword('admin123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      router.push(`/${data.role.toLowerCase()}/dashboard`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Set visual accents based on role
  const accentClasses = {
    PATIENT: {
      accent: 'text-pink-500 border-pink-500/20 focus:ring-pink-500/30 focus:border-pink-500',
      glow: 'shadow-pink-500/10',
      bgGlow: 'bg-pink-500/5',
      btn: 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/20',
      tag: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
    },
    DOCTOR: {
      accent: 'text-teal-400 border-teal-500/20 focus:ring-teal-500/30 focus:border-teal-400',
      glow: 'shadow-teal-500/10',
      bgGlow: 'bg-teal-500/5',
      btn: 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20',
      tag: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    },
    ADMIN: {
      accent: 'text-blue-400 border-blue-500/20 focus:ring-blue-500/30 focus:border-blue-400',
      glow: 'shadow-blue-500/10',
      bgGlow: 'bg-blue-500/5',
      btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
      tag: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    }
  }[role];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Dynamic Background Spotlights */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${accentClasses.bgGlow} rounded-full blur-[160px] pointer-events-none transition-all duration-700`} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-8 relative z-10">
        
        {/* Portal Branding */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-teal-500 shadow-lg shadow-pink-500/20">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none text-center">OncoAI</h1>
            <p className="text-sm text-slate-400 mt-2 text-center font-medium">Zero-Cost Clinical Second Opinion Portal</p>
          </div>
        </div>

        {/* Dynamic Holographic Glass Card */}
        <div className={`bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl ${accentClasses.glow} transition-all duration-500`}>
          
          {/* Animated Tab Role Selector */}
          <div className="flex p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl mb-8 relative">
            <button 
              type="button" 
              onClick={() => handleRoleChange('PATIENT')} 
              className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 ${role === 'PATIENT' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <User className="w-3.5 h-3.5" />
              Patient
            </button>
            <button 
              type="button" 
              onClick={() => handleRoleChange('DOCTOR')} 
              className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 ${role === 'DOCTOR' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Bot className="w-3.5 h-3.5" />
              Doctor
            </button>
            <button 
              type="button" 
              onClick={() => handleRoleChange('ADMIN')} 
              className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 ${role === 'ADMIN' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Active Role Indicator Tag */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${accentClasses.tag}`}>
              <Sparkles className="w-3 h-3" />
              Active Role: {role} Mode
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-bold leading-relaxed text-left animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portal Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold ${accentClasses.accent}`}
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold ${accentClasses.accent}`}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 ${accentClasses.btn}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/60 flex justify-center">
            <p className="text-xs text-slate-500 font-medium">
              Don&apos;t have a patient account yet?{' '}
              <Link href="/register" className="font-bold text-pink-500 hover:text-pink-400 transition-colors">
                Register Now
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
