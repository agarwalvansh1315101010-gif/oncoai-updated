'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Shield, Users, Activity, LogOut, ChevronDown, Check } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [assigningPatient, setAssigningPatient] = useState<string | null>(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data')
      if (res.status === 401 || res.status === 403) { router.push('/login'); return }
      setData(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading admin console...</p>
      </div>
    </div>
  )

  const users = data?.users || []
  const patients = data?.patients || []
  const doctors = data?.doctors || []
  const auditLogs = data?.auditLogs || []

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Topbar */}
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="text-lg font-bold leading-none">OncoAI Admin Console</h1>
            <p className="text-xs text-slate-400 mt-1">System Management & Security</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'text-white' : 'text-slate-400 hover:text-white'}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'text-white' : 'text-slate-400 hover:text-white'}>Users & Roles</button>
          <button onClick={() => setActiveTab('assignments')} className={activeTab === 'assignments' ? 'text-white' : 'text-slate-400 hover:text-white'}>Case Assignment</button>
          <button onClick={() => setActiveTab('audit')} className={activeTab === 'audit' ? 'text-white' : 'text-slate-400 hover:text-white'}>Audit Logs</button>
          <div className="w-px h-6 bg-slate-700 mx-2"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">

          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div><div><p className="text-3xl font-bold text-slate-800">{users.length}</p><p className="text-sm font-medium text-slate-500">Total Users</p></div></div></div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center"><Users className="w-6 h-6 text-teal-600" /></div><div><p className="text-3xl font-bold text-slate-800">{patients.length}</p><p className="text-sm font-medium text-slate-500">Patients</p></div></div></div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center"><Users className="w-6 h-6 text-indigo-600" /></div><div><p className="text-3xl font-bold text-slate-800">{doctors.length}</p><p className="text-sm font-medium text-slate-500">Doctors</p></div></div></div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center"><Activity className="w-6 h-6 text-slate-600" /></div><div><p className="text-3xl font-bold text-slate-800">{auditLogs.length}</p><p className="text-sm font-medium text-slate-500">Audit Events</p></div></div></div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-base font-bold text-slate-800">Recent Security Audit Logs</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium"><tr><th className="px-6 py-3">Timestamp</th><th className="px-6 py-3">User Email</th><th className="px-6 py-3">Action</th><th className="px-6 py-3">Resource</th><th className="px-6 py-3">IP Address</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.slice(0, 5).map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-3 text-slate-500">{format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}</td>
                          <td className="px-6 py-3 font-medium text-slate-800">{log.user?.email || 'System'}</td>
                          <td className="px-6 py-3"><span className="inline-flex px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold">{log.action}</span></td>
                          <td className="px-6 py-3 text-slate-600">{log.resourceType} {log.resourceId ? `(${log.resourceId.substring(0,8)}...)` : ''}</td>
                          <td className="px-6 py-3 text-slate-500 font-mono text-xs">{log.ipAddress || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'assignments' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Patient Case Assignments</h3>
                  <p className="text-sm text-slate-500">Assign unassigned patients to doctors for review.</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {patients.map((p: any) => (
                  <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-slate-500">{p.user.email} · Registered: {format(new Date(p.user.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      {p.assignedDoctor ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                            <Check className="w-4 h-4" /> Assigned to Dr. {p.assignedDoctor.lastName}
                          </span>
                          <button onClick={() => setAssigningPatient(p.id)} className="text-xs text-blue-600 hover:underline px-2">Change</button>
                        </div>
                      ) : (
                        <button onClick={() => setAssigningPatient(p.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 text-amber-800 text-sm font-bold hover:bg-amber-200 transition-colors">
                          Needs Assignment
                        </button>
                      )}
                      {assigningPatient === p.id && (
                        <div className="absolute mt-2 right-8 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10">
                          <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">Select Doctor:</div>
                          <div className="max-h-48 overflow-y-auto">
                            {doctors.map((d: any) => (
                              <button key={d.id} onClick={() => assignDoctor(p.id, d.id)} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 border-b border-slate-50 last:border-0">
                                Dr. {d.firstName} {d.lastName} ({d.specialization})
                              </button>
                            ))}
                          </div>
                          <button onClick={() => setAssigningPatient(null)} className="w-full px-4 py-2 text-xs text-center text-slate-500 hover:bg-slate-50 border-t border-slate-100">Cancel</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-base font-bold text-slate-800">All Registered Users</h3></div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200"><tr><th className="px-6 py-3">Email</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Joined</th><th className="px-6 py-3">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-800">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : u.role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">Active</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-base font-bold text-slate-800">Full Audit Trail</h3></div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium"><tr><th className="px-6 py-3">Timestamp</th><th className="px-6 py-3">User</th><th className="px-6 py-3">Action</th><th className="px-6 py-3">Details</th><th className="px-6 py-3">IP Address</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 text-slate-500 whitespace-nowrap">{format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}</td>
                      <td className="px-6 py-3 font-medium text-slate-800">{log.user?.email || 'System'}</td>
                      <td className="px-6 py-3"><span className="inline-flex px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold">{log.action}</span></td>
                      <td className="px-6 py-3 text-slate-600 truncate max-w-xs">{log.details || `${log.resourceType} ${log.resourceId ? `(${log.resourceId.substring(0,8)})` : ''}`}</td>
                      <td className="px-6 py-3 text-slate-500 font-mono text-xs">{log.ipAddress || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
