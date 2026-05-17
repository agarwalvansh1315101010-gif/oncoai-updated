'use client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, FileText, MessageSquare, Calendar, 
  Brain, LogOut, Heart, User, ChevronRight, Sparkles 
} from 'lucide-react'

const patientNav = [
  { href: '/patient/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/patient/dashboard?tab=documents', label: 'My Documents', icon: FileText },
  { href: '/patient/dashboard?tab=ai-report', label: 'AI Report', icon: Brain },
  { href: '/patient/dashboard?tab=recommendations', label: 'AI Recommendations', icon: Sparkles },
  { href: '/patient/dashboard?tab=chat', label: 'Chat with Doctor', icon: MessageSquare },
  { href: '/patient/dashboard?tab=appointments', label: 'Appointments', icon: Calendar },
]

const doctorNav = [
  { href: '/doctor/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/doctor/dashboard?tab=patients', label: 'My Patients', icon: User },
  { href: '/doctor/dashboard?tab=reports', label: 'AI Reports', icon: Brain },
  { href: '/doctor/dashboard?tab=chat', label: 'Patient Chat', icon: MessageSquare },
  { href: '/doctor/dashboard?tab=schedule', label: 'Schedule', icon: Calendar },
]

interface SidebarProps {
  role: 'patient' | 'doctor'
  firstName: string
  lastName: string
  email: string
  activeTab?: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ role, firstName, lastName, email, activeTab, onTabChange }: SidebarProps) {
  const router = useRouter()
  const nav = role === 'patient' ? patientNav : doctorNav

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar text-white shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-medical-gradient">
          <Heart className="w-5 h-5 text-white" fill="white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">OncoAI</p>
          <p className="text-xs text-slate-400 mt-0.5">Second Opinion Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          {role === 'patient' ? 'Patient Portal' : 'Doctor Portal'}
        </p>
        {nav.map((item) => {
          const tabParam = item.href.split('?tab=')[1] || 'overview'
          const isActive = activeTab === tabParam || (!activeTab && tabParam === 'overview')
          return (
            <button
              key={item.href}
              onClick={() => onTabChange(tabParam)}
              className={cn(
                'sidebar-nav-item w-full text-left group',
                isActive && 'active'
              )}
            >
              <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-white/50" />}
            </button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 shrink-0">
            <span className="text-sm font-semibold text-blue-300">{firstName[0]}{lastName[0]}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{firstName} {lastName}</p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-nav-item w-full text-left text-slate-300 hover:text-red-400"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
