'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Trash2, Loader2, ExternalLink, CheckCircle, Tag } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

interface Message {
  id: string; name: string; email: string; budget: string | null;
  message: string; read: boolean; replied: boolean; createdAt: string; created_at?: string;
}

const BUDGET_COLORS: Record<string, string> = {
  'Bug Report': '#EF4444',
  'Referral': '#22C55E',
  'Consultation': '#3B82F6',
  'null': '#555',
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/contact');
    const d = await r.json();
    setMessages(d.data ?? []);
    setLoading(false);
  }

  async function markRead(msg: Message) {
    if (msg.read) return;
    await fetch(`/api/contact/${msg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
  }

  async function markReplied(msg: Message) {
    await fetch(`/api/contact/${msg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true, replied: true }),
    });
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, replied: true, read: true } : m));
    toast.success('Marked as replied');
  }

  async function del(id: string) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    toast.success('Deleted');
    load();
  }

  const filtered = filter === 'all'
    ? messages
    : filter === 'unread'
    ? messages.filter(m => !m.read)
    : messages.filter(m => m.budget === filter);

  const unread = messages.filter(m => !m.read).length;
  const types = [...new Set(messages.map(m => m.budget).filter(Boolean))];

  const ts = (m: Message) => m.createdAt || m.created_at || new Date().toISOString();

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-[#555] text-sm mt-1">{unread > 0 ? <span className="text-red-400 font-semibold">{unread} unread</span> : 'All read'} · {messages.length} total</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
        {[
          { key: 'all', label: `All (${messages.length})` },
          { key: 'unread', label: `Unread (${unread})` },
          ...types.map(t => ({ key: t!, label: `${t} (${messages.filter(m => m.budget === t).length})` })),
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all shrink-0 ${
              filter === tab.key
                ? 'bg-[#F97316]/10 border-[#F97316]/25 text-[#F97316]'
                : 'bg-[#0D0D0D] border-[#161616] text-[#555] hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Message list */}
          <div className="lg:w-80 space-y-1.5 shrink-0">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#333]">
                <Mail size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No messages</p>
              </div>
            )}
            {filtered.map(msg => (
              <motion.button key={msg.id} layout
                onClick={() => { setSelected(msg); markRead(msg); }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selected?.id === msg.id
                    ? 'bg-[#F97316]/8 border-[#F97316]/25'
                    : msg.read
                    ? 'bg-[#090909] border-[#141414] hover:border-[#1A1A1A]'
                    : 'bg-[#111] border-[#1E1E1E] hover:border-[#2A2A2A]'
                }`}>
                <div className="flex items-start gap-2.5">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${msg.read ? 'bg-transparent' : 'bg-[#F97316]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5 gap-2">
                      <p className={`text-sm font-semibold truncate ${msg.read ? 'text-[#666]' : 'text-white'}`}>{msg.name}</p>
                      {msg.budget && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full shrink-0 font-bold"
                          style={{ background: `${BUDGET_COLORS[msg.budget] ?? '#555'}15`, color: BUDGET_COLORS[msg.budget] ?? '#888', border: `1px solid ${BUDGET_COLORS[msg.budget] ?? '#555'}25` }}>
                          {msg.budget}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#444] truncate">{msg.email}</p>
                    <p className="text-[10px] text-[#2A2A2A] mt-1 line-clamp-1">{msg.message?.slice(0, 50)}</p>
                    <p className="text-[9px] text-[#222] mt-1">{formatDistanceToNow(new Date(ts(msg)), { addSuffix: true })}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-[#111] border border-[#1A1A1A] rounded-2xl p-6 min-w-0">
              <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                    {selected.budget && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: `${BUDGET_COLORS[selected.budget] ?? '#555'}15`, color: BUDGET_COLORS[selected.budget] ?? '#888' }}>
                        {selected.budget}
                      </span>
                    )}
                    {selected.replied && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/15">✓ replied</span>
                    )}
                  </div>
                  <a href={`mailto:${selected.email}`} className="text-[#F97316] text-sm hover:underline flex items-center gap-1">
                    {selected.email} <ExternalLink size={11} />
                  </a>
                  <p className="text-[#333] text-xs mt-1">
                    {format(new Date(ts(selected)), 'PPPp')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!selected.replied && (
                    <button onClick={() => markReplied(selected)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
                      <CheckCircle size={12} /> Mark Replied
                    </button>
                  )}
                  <a href={`mailto:${selected.email}?subject=Re: Your message`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs hover:bg-[#F97316]/20 transition-colors">
                    <Mail size={12} /> Reply
                  </a>
                  <button onClick={() => del(selected.id)}
                    className="p-2 rounded-lg bg-[#1A1A1A] text-[#555] hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="bg-[#0D0D0D] rounded-xl p-5">
                <p className="text-[#888] text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 bg-[#090909] border border-[#141414] rounded-2xl flex items-center justify-center text-[#1E1E1E]">
              <div className="text-center">
                <MailOpen size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
