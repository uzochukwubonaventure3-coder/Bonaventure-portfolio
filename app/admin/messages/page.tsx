'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface Message { id: string; name: string; email: string; budget: string | null; message: string; read: boolean; replied: boolean; createdAt: string; }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

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
    await fetch(`/api/contact/${msg.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) });
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete message?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    toast.success('Deleted'); load();
  }

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-[#555] text-sm mt-1">{unread} unread · {messages.length} total</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* List */}
          <div className="lg:w-80 space-y-2 shrink-0">
            {messages.length === 0 && (
              <div className="text-center py-16 text-[#444]">
                <Mail size={40} className="mx-auto mb-3 opacity-30" />
                <p>No messages yet</p>
              </div>
            )}
            {messages.map(m => (
              <motion.button key={m.id} layout
                onClick={() => { setSelected(m); markRead(m); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === m.id
                    ? 'bg-[#F97316]/10 border-[#F97316]/30'
                    : m.read ? 'bg-[#0D0D0D] border-[#1A1A1A] hover:border-[#222]' : 'bg-[#111] border-[#1E1E1E] hover:border-[#2A2A2A]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${m.read ? 'bg-transparent' : 'bg-[#F97316]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${m.read ? 'text-[#888]' : 'text-white'}`}>{m.name}</p>
                    <p className="text-xs text-[#555] truncate">{m.email}</p>
                    <p className="text-xs text-[#444] mt-1 line-clamp-2">{m.message}</p>
                    <p className="text-[10px] text-[#333] mt-1">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-[#F97316] text-sm hover:underline flex items-center gap-1">
                    {selected.email} <ExternalLink size={12} />
                  </a>
                  {selected.budget && <p className="text-[#555] text-xs mt-1">Budget: {selected.budget}</p>}
                  <p className="text-[#444] text-xs mt-1">{new Date(selected.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex gap-2">
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
                <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl flex items-center justify-center text-[#333]">
              <div className="text-center">
                <MailOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
