'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Send, Bot, User } from 'lucide-react'

interface Query {
  id: string
  subject: string
  encryptedMessage: string
  status: string
  createdAt: string
  responses: Array<{
    id: string
    encryptedMessage: string
    createdAt: string
    doctor: { firstName: string; lastName: string }
  }>
}

interface ChatTabProps {
  queries: Query[]
  onSendMessage: (subject: string, message: string) => Promise<void>
}

export function ChatTab({ queries, onSendMessage }: ChatTabProps) {
  const [selected, setSelected] = useState<Query | null>(queries[0] || null)
  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const handleSend = async () => {
    if (!newMessage.trim()) return
    setSending(true)
    await onSendMessage(newSubject || 'New Question', newMessage)
    setNewMessage('')
    setNewSubject('')
    setShowNew(false)
    setSending(false)
  }

  return (
    <div className="flex h-[calc(100vh-220px)] gap-4 animate-slide-up">
      {/* Conversation List */}
      <div className="w-64 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => setShowNew(true)}
            className="w-full py-2 px-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + New Question
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {queries.map((q) => (
            <button
              key={q.id}
              onClick={() => { setSelected(q); setShowNew(false) }}
              className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selected?.id === q.id ? 'bg-blue-50' : ''}`}
            >
              <p className="text-xs font-semibold text-slate-800 truncate">{q.subject}</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{q.encryptedMessage.substring(0, 50)}...</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                  {q.status}
                </span>
              </div>
            </button>
          ))}
          {queries.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8 px-4">No conversations yet. Start by asking your doctor a question.</p>
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {showNew ? (
          <div className="flex flex-col h-full p-6 gap-4">
            <h3 className="text-sm font-semibold text-slate-800">New Question for Your Doctor</h3>
            <input
              type="text"
              placeholder="Subject (e.g., About my treatment plan)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <textarea
              placeholder="Write your question here in detail..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                Send Securely
              </button>
            </div>
          </div>
        ) : selected ? (
          <>
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{selected.subject}</p>
              <p className="text-xs text-slate-400 mt-0.5">{format(new Date(selected.createdAt), 'MMMM d, yyyy')}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Patient message */}
              <div className="flex justify-end gap-3">
                <div className="flex flex-col items-end gap-1">
                  <div className="chat-bubble-patient">{selected.encryptedMessage}</div>
                  <p className="text-xs text-slate-400">You · {format(new Date(selected.createdAt), 'h:mm a')}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* Doctor responses */}
              {selected.responses.map((r) => (
                <div key={r.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="chat-bubble-doctor">{r.encryptedMessage}</div>
                    <p className="text-xs text-slate-400">Dr. {r.doctor.lastName} · {format(new Date(r.createdAt), 'h:mm a')}</p>
                  </div>
                </div>
              ))}
              {selected.responses.length === 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="chat-bubble-doctor text-slate-400 italic">Your doctor will respond shortly...</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Select a conversation or start a new one</div>
        )}
      </div>
    </div>
  )
}
