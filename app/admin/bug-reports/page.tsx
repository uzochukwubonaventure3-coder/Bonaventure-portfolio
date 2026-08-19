'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Mail, Trash2, CheckCircle, MailOpen, Loader2, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface BugReport {
  id: string; name: string; email: string;
  message: string; read: boolean; createdAt: string; created_at?: string;
}

export default function AdminBugReports() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BugReport | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/contact');
    const d = await r.json();
    const bugs = (d.data ?? []).filter((m: any) => m.budget === 'Bug Report');
    setReports(bugs);
    setLoading(false);
  }

  async function markRead(report: BugReport) {
    if (report.read) return;
    await fetch(`/api/contact/${report.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    setReports(prev => prev.map(r => r.id === report.id ? { ...r, read: true } : r));
  }

  async function del(id: string) {
    if (!confirm('Delete this bug report?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    if (selected?.id === id) setSelected(null);
    load();
  }

  const unread = reports.filter(r => !r.read).length;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Bug Reports</h1>
        <p className="text-[#555] text-sm mt-1">
          {unread > 0
            ? <span className="text-red-400 font-semibold">{unread} unread</span>
            : 'All caught up'} · {reports.length} total
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : reports.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <p className="text-white font-semibold mb-1">No bug reports</p>
          <p className="text-[#444] text-sm">Your portfolio is running perfectly! 🎉</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* List */}
          <div className="lg:w-80 space-y-2 shrink-0">
            {reports.map(report => (
              <motion.button key={report.id} layout
                onClick={() => { setSelected(report); markRead(report); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === report.id
                    ? 'bg-[#F97316]/8 border-[#F97316]/25'
                    : report.read
                    ? 'bg-[#0A0A0A] border-[#161616] hover:border-[#1E1E1E]'
                    : 'bg-[#111] border-[#1E1E1E] hover:border-[#2A2A2A]'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${report.read ? 'bg-transparent' : 'bg-red-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Bug size={11} className="text-red-400 shrink-0" />
                      <p className={`text-sm font-semibold truncate ${report.read ? 'text-[#666]' : 'text-white'}`}>{report.name}</p>
                    </div>
                    <p className="text-xs text-[#444] truncate">{report.email}</p>
                    <p className="text-xs text-[#333] mt-1 line-clamp-2 leading-relaxed">
                      {report.message.replace('[BUG REPORT]\n\n', '')}
                    </p>
                    <p className="text-[10px] text-[#2A2A2A] mt-1.5">
                      {formatDistanceToNow(new Date(report.createdAt || report.created_at!), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-[#111] border border-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Bug size={16} className="text-red-400" />
                    <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                  </div>
                  <a href={`mailto:${selected.email}`} className="text-[#F97316] text-sm hover:underline">{selected.email}</a>
                  <p className="text-[#444] text-xs mt-1">
                    {new Date(selected.createdAt || selected.created_at!).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${selected.email}?subject=Re: Bug Report`}
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
                <p className="text-[#888] text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message.replace('[BUG REPORT]\n\n', '')}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 bg-[#0A0A0A] border border-[#161616] rounded-2xl flex items-center justify-center text-[#222]">
              <div className="text-center">
                <Bug size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Select a report to read</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
