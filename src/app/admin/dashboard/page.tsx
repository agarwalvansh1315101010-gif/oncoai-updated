'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Shield, Users, Activity, LogOut, Check, Sparkles, Key, AlertCircle } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  role: string
  createdAt: string
}

interface AdminPatient {
  id: string
  firstName: string
  lastName: string
  user: {
    email: string
    createdAt: string
  }
  assignedDoctor?: {
    id: string
    lastName: string
  }
}

interface AdminDoctor {
  id: string
  firstName: string
  lastName: string
  specialization: string
}

interface AdminAuditLog {
  id: string
  createdAt: string
  action: string
  resourceType: string
  ipAddress: string | null
  details?: string
  user?: {
    email: string
  }
}

interface AdminData {
  users: AdminUser[]
  patients: AdminPatient[]
  doctors: AdminDoctor[]
  auditLogs: AdminAuditLog[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [assigningPatient, setAssigningPatient] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/data')
      if (res.status === 401 || res.status === 403) { router.push('/login'); return }
      setData(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const assignDoctor = async (patientId: string, doctorId: string) => {
    await fetch('/api/admin/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientProfileId: patientId, doctorProfileId: doctorId })
    })
    setAssigningPatient(null)
    await fetchData()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-mono uppercase tracking-widest">Loading cyber console...</p>
      </div>
    </div>
  )

  const users = data?.users || []
  const patients = data?.patients || []
  const doctors = data?.doctors || []
  const auditLogs = data?.auditLogs || []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Background spotlights */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Indigo Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 py-5 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-white uppercase tracking-wider leading-none">OncoAI Admin Console</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Security & System Vetting Platform</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-5 text-xs font-black uppercase tracking-wider">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-3 py-2 rounded-xl transition-all duration-300 ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`px-3 py-2 rounded-xl transition-all duration-300 ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Users & Roles
          </button>
          <button 
            onClick={() => setActiveTab('assignments')} 
            className={`px-3 py-2 rounded-xl transition-all duration-300 ${activeTab === 'assignments' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Case Assignment
          </button>
          <button 
            onClick={() => setActiveTab('audit')} 
            className={`px-3 py-2 rounded-xl transition-all duration-300 ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Audit Trail
          </button>
          <div className="w-px h-5 bg-slate-800 mx-2"></div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Terminal Viewport */}
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">

          {activeTab === 'overview' && (
            <>
              {/* Telemetry Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all shadow-lg shadow-blue-500/2">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{users.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Users</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all shadow-lg shadow-indigo-500/2">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{patients.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Patients</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-teal-500/30 transition-all shadow-lg shadow-teal-500/2">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{doctors.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Doctors</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all shadow-lg shadow-blue-500/2">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 animate-pulse">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{auditLogs.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Audit Events</p>
                  </div>
                </div>

              </div>

              {/* Security Logs Section */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Security Audit Logs</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-widest border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">User Email</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Resource</th>
                        <th className="px-6 py-4">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {auditLogs.slice(0, 8).map((log: AdminAuditLog) => (
                        <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4 text-slate-400 font-mono">{format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                          <td className="px-6 py-4 font-semibold text-slate-200">{log.user?.email || 'System'}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300 font-semibold">{log.resourceType}</td>
                          <td className="px-6 py-4 text-slate-500 font-mono">{log.ipAddress || '127.0.0.1'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'assignments' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Patient Case Assignments</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Assign unassigned patient cases to designated oncology specialists.</p>
              </div>
              <div className="divide-y divide-slate-800/60 text-left">
                {patients.map((p: AdminPatient) => (
                  <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-800/10 transition-colors relative">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{p.firstName} {p.lastName}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">{p.user.email} · Registered: {format(new Date(p.user.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      {p.assignedDoctor ? (
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20">
                            <Check className="w-3.5 h-3.5" /> Assigned to Dr. {p.assignedDoctor.lastName}
                          </span>
                          <button onClick={() => setAssigningPatient(p.id)} className="text-xs text-blue-400 font-bold hover:underline px-2">Reassign</button>
                        </div>
                      ) : (
                        <button onClick={() => setAssigningPatient(p.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                          <AlertCircle className="w-3.5 h-3.5" /> Needs Assignment
                        </button>
                      )}
                      
                      {/* Doctor selection overlay dropdown */}
                      {assigningPatient === p.id && (
                        <div className="absolute right-6 top-16 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-20 animate-fade-in">
                          <div className="p-3.5 bg-slate-950 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Specialist</div>
                          <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/40">
                            {doctors.map((d: AdminDoctor) => (
                              <button 
                                key={d.id} 
                                onClick={() => assignDoctor(p.id, d.id)} 
                                className="w-full text-left px-4 py-3.5 text-xs font-bold text-slate-300 hover:bg-blue-500/10 hover:text-white transition-all flex flex-col"
                              >
                                <span>Dr. {d.firstName} {d.lastName}</span>
                                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{d.specialization}</span>
                              </button>
                            ))}
                          </div>
                          <button onClick={() => setAssigningPatient(null)} className="w-full py-3 text-[10px] text-center text-slate-500 font-bold hover:bg-slate-950 border-t border-slate-800">Cancel</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {patients.length === 0 && (
                  <div className="text-center py-20 text-slate-400 text-sm font-semibold">No registered patient profiles available.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Registered User Registry</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">User Email</th>
                      <th className="px-6 py-4">Assigned Role</th>
                      <th className="px-6 py-4">Creation Date</th>
                      <th className="px-6 py-4">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u: AdminUser) => (
                      <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${u.role === 'ADMIN' ? 'bg-red-500/10 border-red-500/20 text-red-400' : u.role === 'DOCTOR' ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-pink-500/10 border-pink-500/20 text-pink-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono">{format(new Date(u.createdAt), 'yyyy-MM-dd')}</td>
                        <td className="px-6 py-4 text-emerald-400 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Verified
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Full Administrative Security Audit Trail</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Initiator</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Audit Payload Details</th>
                      <th className="px-6 py-4">IP Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {auditLogs.map((log: AdminAuditLog) => (
                      <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-mono">{format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                        <td className="px-6 py-4 font-semibold text-slate-200">{log.user?.email || 'System'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-semibold max-w-sm truncate">{log.details || `${log.resourceType} Access`}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono">{log.ipAddress || '127.0.0.1'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
