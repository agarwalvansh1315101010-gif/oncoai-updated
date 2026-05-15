import { Bell } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  badge?: string
}

export function Topbar({ title, subtitle, badge }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {badge}
          </span>
        )}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  )
}
