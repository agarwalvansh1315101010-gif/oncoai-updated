'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { DocumentsTab } from '@/components/patient/DocumentsTab'
import { AiReportTab } from '@/components/patient/AiReportTab'
import { AiRecommendationsTab } from '@/components/patient/AiRecommendationsTab'
import { ChatTab } from '@/components/patient/ChatTab'
import { AppointmentsTab } from '@/components/patient/AppointmentsTab'
import { FileText, MessageSquare, Calendar, Brain, Shield } from 'lucide-react'

interface PatientProfile {
  firstName: string;
  lastName: string;
  consentRecord?: { id: string };
  documents?: any[];
  aiReports?: any[];
  queries?: any[];
  appointments?: any[];
  assignedDoctor?: { lastName: string };
  assignedDoctorId?: string;
  latestInsight?: string;
}

export default function PatientDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [consentAgreed, setConsentAgreed] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/patient/profile')
      if (res.status === 401) { router.push('/login'); return }
      setProfile(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const submitConsent = async () => {
    if (!consentAgreed) return
    setLoading(true)
    await fetch('/api/patient/consent', { method: 'POST' })
    await fetchProfile()
  }

  const handleUpload = async (file: File) => {
    await fetch('/api/patient/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size })
    })
    await fetchProfile()
  }

  const handleSendMessage = async (subject: string, message: string) => {
    await fetch('/api/patient/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message })
    })
    await fetchProfile()
  }

  const handleBookAppointment = async (data: { scheduledAt: string; type: string; notes: string }) => {
    await fetch('/api/patient/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    await fetchProfile()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading your portal...</p>
      </div>
    </div>
  )

  // Consent Flow
  if (profile && !profile.consentRecord) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-medical border border-slate-100 overflow-hidden animate-fade-in">
          <div className="bg-medical-gradient p-8 text-white text-center">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl font-bold">Legal Disclaimer & Consent</h1>
            <p className="text-sm text-blue-100 mt-2">Please review and accept our terms before continuing</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 text-sm text-slate-600 h-56 overflow-y-auto space-y-3 leading-relaxed border border-slate-100">
              <p className="font-bold text-slate-800">OncoAI Portal — Patient Consent for Second Opinion Services</p>
              <p><strong>1. Nature of Service:</strong> The OncoAI Portal provides a platform for patients to seek second medical opinions based on the records they provide. This service is NOT a substitute for primary care or emergency medical services.</p>
              <p><strong>2. AI Assistance:</strong> You understand that the platform may use Artificial Intelligence to help organize and preliminarily analyze your data for the reviewing doctor. AI does not make medical diagnoses.</p>
              <p><strong>3. Data Privacy:</strong> Your medical records will be encrypted using AES-256 encryption and shared only with assigned medical professionals. We comply with standard healthcare data protection protocols.</p>
              <p><strong>4. Limitations:</strong> The second opinion provided is based solely on the information you share and is not a replacement for a complete clinical evaluation.</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={consentAgreed} onChange={(e) => setConsentAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30" />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">I have read, understood, and agree to the terms, conditions, and data usage policy outlined above.</span>
            </label>
            <button
              onClick={submitConsent}
              disabled={!consentAgreed}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Accept and Continue to Portal
            </button>
          </div>
        </div>
      </div>
    )
  }

  const metrics = [
    { label: 'Documents', value: profile?.documents?.length || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'AI Reports', value: profile?.aiReports?.length || 0, icon: Brain, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Queries', value: profile?.queries?.length || 0, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Appointments', value: profile?.appointments?.length || 0, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: `Welcome back, ${profile?.firstName}`, subtitle: 'Here\'s your health overview' },
    documents: { title: 'My Medical Documents', subtitle: 'Upload and manage your medical records securely' },
    'ai-report': { title: 'AI Analysis Report', subtitle: 'AI-powered preliminary analysis of your records' },
    recommendations: { title: 'AI Clinical Recommendations', subtitle: 'Clinical pathways, diet, and clinic matches mapped by vectors' },
    chat: { title: 'Chat with Your Doctor', subtitle: 'Communicate securely with your assigned physician' },
    appointments: { title: 'My Appointments', subtitle: 'Schedule and manage consultations' },
  }

  const current = tabTitles[activeTab] || tabTitles.overview

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="patient"
        firstName={profile?.firstName || 'Patient'}
        lastName={profile?.lastName || ''}
        email="patient@example.com"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Topbar title={current.title} subtitle={current.subtitle} badge={profile?.assignedDoctor ? `Dr. ${profile.assignedDoctor.lastName}` : undefined} />
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* AI Patient Insight Banner */}
              {profile?.latestInsight && (
                <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 border border-pink-500/20 rounded-3xl p-6 relative overflow-hidden animate-slide-up flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black">
                      <Brain className="w-3.5 h-3.5 animate-pulse" />
                      AI PERSONALIZED INSIGHT
                    </div>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {profile.latestInsight}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('ai-report')}
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-black transition-all hover:scale-[1.02] shadow-sm shadow-pink-500/10"
                  >
                    View AI Report
                  </button>
                </div>
              )}

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m) => (
                  <div key={m.label} className="metric-card flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${m.bg} shrink-0`}>
                      <m.icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{m.value}</p>
                      <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('documents')} className="medical-card p-6 text-left hover:border-blue-200 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-800">Upload Medical Records</h3>
                  </div>
                  <p className="text-xs text-slate-500">Upload pathology reports, imaging, lab results, or treatment records for your second opinion review.</p>
                </button>
                <button onClick={() => setActiveTab('ai-report')} className="medical-card p-6 text-left hover:border-teal-200 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-5 h-5 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-800">View AI Analysis</h3>
                  </div>
                  <p className="text-xs text-slate-500">See AI-generated preliminary insights based on your uploaded documents to help your doctor.</p>
                </button>
                <button onClick={() => setActiveTab('chat')} className="medical-card p-6 text-left hover:border-purple-200 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-bold text-slate-800">Ask Your Doctor</h3>
                  </div>
                  <p className="text-xs text-slate-500">Send encrypted, secure messages to your assigned oncologist and receive professional responses.</p>
                </button>
                <button onClick={() => setActiveTab('appointments')} className="medical-card p-6 text-left hover:border-amber-200 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-800">Book Appointment</h3>
                  </div>
                  <p className="text-xs text-slate-500">Schedule a video or in-person follow-up consultation with your assigned specialist.</p>
                </button>
              </div>

              {/* Recent Activity */}
              {(profile?.queries?.length ?? 0) > 0 && (
                <div className="medical-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Recent Questions</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {profile?.queries?.slice(0, 3).map((q: { id: string; subject: string; encryptedMessage: string; status: string }) => (
                      <div key={q.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setActiveTab('chat')}>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{q.subject}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">{q.encryptedMessage}</p>
                        </div>
                        <span className={`status-badge ${q.status === 'PENDING' ? 'status-pending' : q.status === 'ANSWERED' ? 'status-answered' : 'status-closed'}`}>
                          {q.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'documents' && <DocumentsTab documents={profile?.documents || []} onUpload={handleUpload} uploading={false} />}
          {activeTab === 'ai-report' && <AiReportTab reports={profile?.aiReports || []} />}
          {activeTab === 'recommendations' && <AiRecommendationsTab reports={profile?.aiReports || []} />}
          {activeTab === 'chat' && <ChatTab queries={profile?.queries || []} onSendMessage={handleSendMessage} />}
          {activeTab === 'appointments' && <AppointmentsTab appointments={profile?.appointments || []} doctorId={profile?.assignedDoctorId} onBook={handleBookAppointment} />}
        </main>
      </div>
    </div>
  )
}
