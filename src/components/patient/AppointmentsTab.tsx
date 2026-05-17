'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Video, MapPin, Clock, Plus } from 'lucide-react'

interface Appointment {
  id: string
  scheduledAt: string
  type: string
  status: string
  notes?: string
  doctor: { firstName: string; lastName: string; specialization: string }
}

interface AppointmentsTabProps {
  appointments: Appointment[]
  doctorId?: string
  onBook: (data: { scheduledAt: string; type: string; notes: string }) => Promise<void>
}

export function AppointmentsTab({ appointments, onBook }: AppointmentsTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ scheduledAt: '', type: 'VIDEO', notes: '' })
  const [booking, setBooking] = useState(false)

  const handleBook = async () => {
    if (!form.scheduledAt) return
    setBooking(true)
    await onBook(form)
    setForm({ scheduledAt: '', type: 'VIDEO', notes: '' })
    setShowForm(false)
    setBooking(false)
  }

  const upcoming = appointments.filter(a => new Date(a.scheduledAt) >= new Date())
  const past = appointments.filter(a => new Date(a.scheduledAt) < new Date())

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Your Appointments</h3>
          <p className="text-sm text-slate-500">{upcoming.length} upcoming · {past.length} past</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4 animate-slide-up">
          <h4 className="text-sm font-semibold text-slate-800">Schedule New Appointment</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Date & Time</label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Appointment Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              >
                <option value="VIDEO">Video Consultation</option>
                <option value="IN_PERSON">In-Person Visit</option>
                <option value="PHONE">Phone Call</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Notes (optional)</label>
            <input
              type="text"
              placeholder="Any specific topics you'd like to discuss..."
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-white bg-white/50">Cancel</button>
            <button
              onClick={handleBook}
              disabled={booking || !form.scheduledAt}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Upcoming</h4>
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-medical-gradient text-white shrink-0">
                  {appt.type === 'VIDEO' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {appt.type === 'VIDEO' ? 'Video Consultation' : appt.type === 'IN_PERSON' ? 'In-Person Visit' : 'Phone Call'} with Dr. {appt.doctor.lastName}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />{format(new Date(appt.scheduledAt), 'MMMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />{format(new Date(appt.scheduledAt), 'h:mm a')}
                    </span>
                  </div>
                  {appt.notes && <p className="text-xs text-slate-400 mt-1 italic">&quot;{appt.notes}&quot;</p>}
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100 shrink-0">
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Past</h4>
          <div className="space-y-2">
            {past.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 opacity-70">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-200 shrink-0">
                  {appt.type === 'VIDEO' ? <Video className="w-4 h-4 text-slate-400" /> : <MapPin className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Dr. {appt.doctor.lastName} · {appt.type}</p>
                  <p className="text-xs text-slate-400">{format(new Date(appt.scheduledAt), 'MMM d, yyyy · h:mm a')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-300" />
          </div>
          <p className="text-slate-600 font-medium">No appointments yet</p>
          <p className="text-sm text-slate-400 mt-1">Book a consultation with your assigned doctor</p>
        </div>
      )}
    </div>
  )
}
