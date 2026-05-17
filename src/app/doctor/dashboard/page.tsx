'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { format } from 'date-fns'
import {
  Users, FileText, MessageSquare, Calendar, Brain, Send,
  ChevronRight, AlertTriangle, Clock, Video, MapPin, User, Bot
} from 'lucide-react'

// ... interfaces ... (unchanged)

interface DoctorProfile {
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
}

interface Document {
  id: string;
  fileName: string;
  uploadedAt: string;
}

interface Response {
  id: string;
  encryptedMessage: string;
  createdAt: string;
}

interface Query {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  encryptedMessage: string;
  responses?: Response[];
  patient: Patient;
}

interface Appointment {
  id: string;
  scheduledAt: string;
  type: string;
  status: string;
  notes?: string;
  patient: Patient;
}

interface Report {
  id: string;
  riskLevel: string;
  status: string;
  createdAt: string;
  summary: string;
  findings: string;
  recommendations: string;
  doctorNotes?: string;
  patient: Patient;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  documents?: Document[];
  queries?: Omit<Query, 'patient'>[];
  appointments?: Omit<Appointment, 'patient'>[];
  aiReports?: Omit<Report, 'patient'>[];
}

interface DoctorData {
  doctor: DoctorProfile;
  patients: Patient[];
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [data, setData] = useState<DoctorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [savingNotes, setSavingNotes] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/doctor/patients')
      if (res.status === 401) { router.push('/login'); return }
      setData(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const saveReportNotes = async (reportId: string) => {
    const notes = editingNotes[reportId]
    if (notes === undefined) return
    setSavingNotes(reportId)
    try {
      await fetch('/api/doctor/report/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, doctorNotes: notes })
      })
      await fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setSavingNotes(null)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim() || !selectedQuery) return
    setSending(true)
    await fetch('/api/doctor/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryId: selectedQuery.id, message: replyText })
    })
    setReplyText('')
    setSending(false)
    await fetchData()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading doctor portal...</p>
      </div>
    </div>
  )

  const doctor = data?.doctor
  const patients = data?.patients || []
  const allQueries = patients.flatMap((p: Patient) => (p.queries || []).map((q: Omit<Query, 'patient'>) => ({ ...q, patient: p }))) as Query[]
  const pendingQueries = allQueries.filter((q: Query) => q.status === 'PENDING')
  const allAppointments = patients.flatMap((p: Patient) => (p.appointments || []).map((a: Omit<Appointment, 'patient'>) => ({ ...a, patient: p }))) as Appointment[]
  const upcomingAppts = allAppointments.filter((a: Appointment) => new Date(a.scheduledAt) >= new Date()).sort((a: Appointment, b: Appointment) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
  const allReports = patients.flatMap((p: Patient) => (p.aiReports || []).map((r: Omit<Report, 'patient'>) => ({ ...r, patient: p }))) as Report[]

  const metrics = [
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Queries', value: pendingQueries.length, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'AI Reports', value: allReports.length, icon: Brain, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Upcoming Appts', value: upcomingAppts.length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: `Welcome, Dr. ${doctor?.lastName}`, subtitle: `${doctor?.specialization} · License: ${doctor?.licenseNumber}` },
    patients: { title: 'My Patients', subtitle: 'View and manage assigned patient cases' },
    reports: { title: 'AI Reports Review', subtitle: 'Review AI-generated analysis and add clinical notes' },
    chat: { title: 'Patient Messages', subtitle: 'Respond to patient queries securely' },
    schedule: { title: 'Appointment Schedule', subtitle: 'View upcoming and past consultations' },
  }

  const current = tabTitles[activeTab] || tabTitles.overview

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="doctor"
        firstName={doctor?.firstName || 'Doctor'}
        lastName={doctor?.lastName || ''}
        email="doctor@oncoai.com"
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setSelectedPatient(null); setSelectedQuery(null) }}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Topbar title={current.title} subtitle={current.subtitle} badge={`${patients.length} Patients`} />
        <main className="flex-1 overflow-y-auto p-8">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m) => (
                  <div key={m.label} className="metric-card flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${m.bg} shrink-0`}><m.icon className={`w-5 h-5 ${m.color}`} /></div>
                    <div><p className="text-2xl font-bold text-slate-800">{m.value}</p><p className="text-xs text-slate-500 font-medium">{m.label}</p></div>
                  </div>
                ))}
              </div>
              {/* Pending Queries */}
              {pendingQueries.length > 0 && (
                <div className="medical-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">🔔 Pending Patient Queries</h3>
                    <button onClick={() => setActiveTab('chat')} className="text-xs text-primary font-medium hover:underline">View All →</button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {pendingQueries.slice(0, 5).map((q: Query) => (
                      <div key={q.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer" onClick={() => { setActiveTab('chat'); setSelectedQuery(q) }}>
                        <div><p className="text-sm font-medium text-slate-700">{q.subject}</p><p className="text-xs text-slate-400 mt-0.5">{q.patient.firstName} {q.patient.lastName}</p></div>
                        <span className="status-badge status-pending">PENDING</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Upcoming Appointments */}
              {upcomingAppts.length > 0 && (
                <div className="medical-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Upcoming Appointments</h3></div>
                  <div className="divide-y divide-slate-50">
                    {upcomingAppts.slice(0, 3).map((a: Appointment) => (
                      <div key={a.id} className="px-6 py-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 shrink-0">
                          {a.type === 'VIDEO' ? <Video className="w-4 h-4 text-blue-600" /> : <MapPin className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1"><p className="text-sm font-medium text-slate-700">{a.patient.firstName} {a.patient.lastName}</p><p className="text-xs text-slate-400">{format(new Date(a.scheduledAt), 'MMM d, yyyy · h:mm a')} · {a.type}</p></div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PATIENTS LIST */}
          {activeTab === 'patients' && !selectedPatient && (
            <div className="space-y-4 animate-slide-up">
              {patients.map((p: Patient) => (
                <div key={p.id} onClick={() => setSelectedPatient(p)} className="medical-card p-6 flex items-center gap-5 cursor-pointer hover:border-blue-200 transition-all">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold text-sm shrink-0">{p.firstName[0]}{p.lastName[0]}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">DOB: {format(new Date(p.dateOfBirth), 'MMM d, yyyy')} · {p.documents?.length || 0} docs · {p.queries?.length || 0} queries</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
              {patients.length === 0 && <div className="text-center py-20 text-slate-400 text-sm">No patients assigned yet.</div>}
            </div>
          )}
          {/* Patient Detail */}
          {activeTab === 'patients' && selectedPatient && (
            <div className="space-y-6 animate-slide-up">
              <button onClick={() => setSelectedPatient(null)} className="text-sm text-primary font-medium hover:underline">← Back to patients</button>
              <div className="medical-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-bold text-lg">{selectedPatient.firstName[0]}{selectedPatient.lastName[0]}</div>
                  <div><p className="text-lg font-bold text-slate-800">{selectedPatient.firstName} {selectedPatient.lastName}</p><p className="text-sm text-slate-500">DOB: {format(new Date(selectedPatient.dateOfBirth), 'MMMM d, yyyy')}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xl font-bold text-slate-800">{selectedPatient.documents?.length || 0}</p><p className="text-xs text-slate-500">Documents</p></div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xl font-bold text-slate-800">{selectedPatient.queries?.length || 0}</p><p className="text-xs text-slate-500">Queries</p></div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xl font-bold text-slate-800">{selectedPatient.aiReports?.length || 0}</p><p className="text-xs text-slate-500">AI Reports</p></div>
                </div>
              </div>
              {/* Documents */}
              <div className="medical-card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Uploaded Documents</h3></div>
                <div className="divide-y divide-slate-50">
                  {(selectedPatient.documents || []).map((d: Document) => (
                    <div key={d.id} className="px-6 py-3 flex items-center gap-3"><FileText className="w-4 h-4 text-red-500" /><span className="text-sm text-slate-700">{d.fileName}</span><span className="text-xs text-slate-400 ml-auto">{format(new Date(d.uploadedAt), 'MMM d, yyyy')}</span></div>
                  ))}
                  {(!selectedPatient.documents || selectedPatient.documents.length === 0) && <p className="px-6 py-4 text-sm text-slate-400">No documents uploaded.</p>}
                </div>
              </div>
            </div>
          )}

          {/* AI REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-slide-up">
              {allReports.length > 0 ? allReports.map((r: Report) => (
                <div key={r.id} className="medical-card overflow-hidden">
                  <div className={`p-5 border-b flex items-center justify-between ${r.riskLevel === 'HIGH' ? 'bg-red-50 border-red-100' : r.riskLevel === 'LOW' ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${r.riskLevel === 'HIGH' ? 'text-red-600' : r.riskLevel === 'LOW' ? 'text-green-600' : 'text-amber-600'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{r.patient.firstName} {r.patient.lastName} — {r.riskLevel} Risk</p>
                        <p className="text-xs text-slate-500">{format(new Date(r.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${r.status === 'READY' ? 'status-answered' : 'status-pending'}`}>{r.status}</span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Summary</p><p className="text-sm text-slate-700">{r.summary}</p></div>
                    <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Findings</p><div className="bg-slate-50 rounded-xl p-4"><p className="text-sm text-slate-700 whitespace-pre-line">{r.findings}</p></div></div>
                    <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Recommendations</p><div className="bg-blue-50 rounded-xl p-4 border border-blue-100"><p className="text-sm text-blue-800 whitespace-pre-line">{r.recommendations}</p></div></div>
                    
                    {/* Oncologist Secondary Notes Input */}
                    <div className="pt-4 border-t border-slate-100 space-y-3 text-left">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Oncologist Clinical Vetting & Notes</p>
                      <textarea
                        value={editingNotes[r.id] !== undefined ? editingNotes[r.id] : r.doctorNotes || ''}
                        onChange={(e) => setEditingNotes(prev => ({ ...prev, [r.id]: e.target.value }))}
                        placeholder="Add secondary professional opinion, clinical treatment overrides, or confirmation remarks for the patient..."
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                        rows={3}
                      />
                      <button
                        onClick={() => saveReportNotes(r.id)}
                        disabled={savingNotes === r.id || editingNotes[r.id] === undefined}
                        className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest transition-all"
                      >
                        {savingNotes === r.id ? 'Saving notes...' : 'Save & Publish Notes'}
                      </button>
                    </div>
                  </div>
                </div>
              )) : <div className="text-center py-20 text-slate-400 text-sm">No AI reports available.</div>}
            </div>
          )}

          {/* CHAT */}
          {activeTab === 'chat' && (
            <div className="flex gap-4 h-[calc(100vh-220px)] animate-slide-up">
              {/* Query List */}
              <div className="w-72 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">All Patient Queries</p></div>
                <div className="flex-1 overflow-y-auto">
                  {allQueries.map((q: Query) => (
                    <button key={q.id} onClick={() => setSelectedQuery(q)} className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedQuery?.id === q.id ? 'bg-blue-50' : ''}`}>
                      <p className="text-xs font-bold text-slate-800 truncate">{q.subject}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{q.patient.firstName} {q.patient.lastName}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${q.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>{q.status}</span>
                    </button>
                  ))}
                  {allQueries.length === 0 && <p className="text-xs text-slate-400 text-center py-8">No patient queries.</p>}
                </div>
              </div>
              {/* Chat View */}
              <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                {selectedQuery ? (
                  <>
                    <div className="px-6 py-4 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{selectedQuery.subject}</p>
                      <p className="text-xs text-slate-400">{selectedQuery.patient.firstName} {selectedQuery.patient.lastName} · {format(new Date(selectedQuery.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {/* Patient message */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-white" /></div>
                        <div><div className="chat-bubble-doctor">{selectedQuery.encryptedMessage}</div><p className="text-xs text-slate-400 mt-1">Patient · {format(new Date(selectedQuery.createdAt), 'h:mm a')}</p></div>
                      </div>
                      {/* Responses */}
                      {selectedQuery.responses?.map((r: Response) => (
                        <div key={r.id} className="flex justify-end gap-3">
                          <div className="flex flex-col items-end"><div className="chat-bubble-patient">{r.encryptedMessage}</div><p className="text-xs text-slate-400 mt-1">You · {format(new Date(r.createdAt), 'h:mm a')}</p></div>
                          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                        </div>
                      ))}
                    </div>
                    {/* Reply box */}
                    <div className="p-4 border-t border-slate-100 flex gap-3">
                      <input type="text" placeholder="Type your response..." value={replyText} onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleReply() }}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                      <button onClick={handleReply} disabled={sending || !replyText.trim()} className="px-5 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        Reply
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Select a query to respond</div>
                )}
              </div>
            </div>
          )}

          {/* SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-slide-up">
              {upcomingAppts.length > 0 ? (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Upcoming</h3>
                  <div className="space-y-3">
                    {upcomingAppts.map((a: Appointment) => (
                      <div key={a.id} className="medical-card p-5 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-medical-gradient text-white shrink-0">
                          {a.type === 'VIDEO' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">{a.patient.firstName} {a.patient.lastName}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-slate-500"><Calendar className="w-3 h-3" />{format(new Date(a.scheduledAt), 'MMMM d, yyyy')}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" />{format(new Date(a.scheduledAt), 'h:mm a')}</span>
                          </div>
                          {a.notes && <p className="text-xs text-slate-400 mt-1 italic">&quot;{a.notes}&quot;</p>}
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100 shrink-0">{a.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <div className="text-center py-20 text-slate-400 text-sm">No upcoming appointments.</div>}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
