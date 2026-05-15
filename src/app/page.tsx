import Link from 'next/link'
import { Heart, Shield, Brain, ArrowRight, Activity, Users, MessageSquare } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-medical-gradient shadow-medical">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-none">OncoAI</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/register" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
            Sign up
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-8 py-20 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 uppercase tracking-wide">
              <Activity className="w-4 h-4" />
              Advanced Breast Cancer Care
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Secure AI-Powered <br />
              <span className="text-primary">Second Opinion</span> Portal
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Empowering patients and oncologists with advanced AI analysis and seamless collaboration for breast cancer diagnosis and treatment planning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-medical group">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 border border-slate-200 font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Sign In to Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="px-8 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Choose Your Path</h2>
            <p className="text-slate-500 mt-2">Access tailored workflows for patients and medical professionals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Patient Path */}
            <div className="medical-card p-10 flex flex-col items-center text-center group hover:border-blue-400 transition-all duration-300">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Patients</h3>
              <ul className="text-slate-500 space-y-3 mb-8 text-sm">
                <li className="flex items-center justify-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Secure Document Upload</li>
                <li className="flex items-center justify-center gap-2"><Brain className="w-4 h-4 text-blue-500" /> AI-Powered 2nd Opinion</li>
                <li className="flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Chat with Specialists</li>
              </ul>
              <Link href="/login" className="mt-auto w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
                Patient Login
              </Link>
            </div>

            {/* Doctor Path */}
            <div className="medical-card p-10 flex flex-col items-center text-center group hover:border-teal-400 transition-all duration-300">
              <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Oncologists</h3>
              <ul className="text-slate-500 space-y-3 mb-8 text-sm">
                <li className="flex items-center justify-center gap-2"><Users className="w-4 h-4 text-teal-500" /> Patient Case Management</li>
                <li className="flex items-center justify-center gap-2"><Brain className="w-4 h-4 text-blue-500" /> Clinical AI Insights</li>
                <li className="flex items-center justify-center gap-2"><Shield className="w-4 h-4 text-teal-600" /> HIPPA-Ready Security</li>
              </ul>
              <Link href="/login" className="mt-auto w-full py-4 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors">
                Physician Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-slate-900 text-white px-8 py-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold">End-to-End Encryption</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your medical data is protected with AES-256 encryption at rest and in transit, ensuring complete patient confidentiality.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-teal-400" />
              </div>
              <h4 className="text-xl font-bold">Intelligent Insights</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Advanced machine learning models analyze pathology and imaging to provide clinicians with preliminary clinical markers.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold">Seamless Collaboration</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Direct communication channels between patients and experts to ensure treatment plans are clear and understood.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-8 py-12 bg-white border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-medical-gradient flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-bold text-slate-800">OncoAI Portal</span>
        </div>
        <p className="text-xs text-slate-400">© 2024 OncoAI Secure Healthcare Solutions. All rights reserved.</p>
      </footer>
    </div>
  )
}
