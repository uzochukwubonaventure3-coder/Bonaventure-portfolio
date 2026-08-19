'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Mail, Trash2, CheckCircle, Loader2, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

interface Referral {
  id: string; name: string; email: string;
  message: string; read: boolean; replied: boolean;
  createdAt: string; created_at?: string;
}

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Referral | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/contact');
    const d = await r.json();
    const refs = (d.data ?? []).filter((m: any) => m.budget === 'Referral');
    setReferrals(refs);
    setLoading(false);
  }

  async function markReplied(ref: Referral) {
    await fetch(`/api/contact/${ref.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true, replied: true }),
    });
    toast.success('Marked as replied');
    setReferrals(prev => prev.map(r => r.id === ref.id ? { ...r, replied: true, read: true } : r));
  }

  async function del(id: string) {
    if (!confirm('Delete this referral?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    if (selected?.id === id) setSelected(null);
    load();
  }

  function parseReferral(msg: string) {
    const lines = msg.replace('[REFERRAL SUBMISSION]\n', '').split('\n').filter(Boolean);
    const data: Record<string, string> = {};
    lines.forEach(line => {
      const [key, ...val] = line.split(': ');
      if (key && val.length) data[key.trim()] = val.join(': ').trim();
    });
    return data;
  }

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => !r.replied).length,
    replied: referrals.filter(r => r.replied).length,
  };

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Referrals</h1>
        <p className="text-[#555] text-sm mt-1">{stats.total} total · {stats.pending} pending · {stats.replied} replied</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Referrals', value: stats.total, icon: Users, color: '#F97316' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: '#EAB308' },
          { label: 'Replied', value: stats.replied, icon: CheckCircle, color: '#22C55E' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <span className="text-[10px] text-[#555] uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : referrals.length === 0 ? (
        <div className="text-center py-24 bg-[#0D0D0D] border border-[#161616] rounded-2xl">
          <Users size={40} className="mx-auto mb-3 text-[#222]" />
          <p className="text-white font-semibold mb-1">No referrals yet</p>
          <p className="text-[#444] text-sm">Share your <a href="/refer-earn" className="text-[#F97316] hover:underline">referral page</a> to start earning commissions</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* List */}
          <div className="lg:w-80 space-y-2 shrink-0">
            {referrals.map(ref => {
              const parsed = parseReferral(ref.message);
              return (
                <motion.button key={ref.id} layout
                  onClick={() => setSelected(ref)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === ref.id
                      ? 'bg-[#F97316]/8 border-[#F97316]/25'
                      : 'bg-[#0A0A0A] border-[#161616] hover:border-[#1E1E1E]'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F97316] shrink-0">
                      {ref.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold text-white truncate">{ref.name}</p>
                        {ref.replied
                          ? <span className="text-[9px] text-green-400 shrink-0">✓ replied</span>
                          : <span className="text-[9px] text-yellow-400 shrink-0">pending</span>}
                      </div>
                      <p className="text-xs text-[#444] truncate">
                        Referred: {parsed['Referral Name'] ?? '—'}
                      </p>
                      <p className="text-[10px] text-[#2A2A2A] mt-1">
                        {formatDistanceToNow(new Date(ref.createdAt || ref.created_at!), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Detail */}
          {selected ? (() => {
            const parsed = parseReferral(selected.message);
            return (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="flex-1 bg-[#111] border border-[#1A1A1A] rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Referral from {selected.name}</h2>
                    <p className="text-[#555] text-sm">{selected.email}</p>
                    <p className="text-[#333] text-xs mt-1">
                      {format(new Date(selected.createdAt || selected.created_at!), 'PPPp')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!selected.replied && (
                      <button onClick={() => markReplied(selected)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
                        <CheckCircle size={12} /> Mark Replied
                      </button>
                    )}
                    <a href={`mailto:${selected.email}?subject=Re: Your Referral`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs hover:bg-[#F97316]/20 transition-colors">
                      <Mail size={12} /> Reply
                    </a>
                    <button onClick={() => del(selected.id)}
                      className="p-2 rounded-lg bg-[#1A1A1A] text-[#555] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Referral details */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Referrer', value: parsed['Referrer'] ?? selected.name },
                    { label: "Referral's Name", value: parsed['Referral Name'] ?? '—' },
                    { label: "Referral's Email", value: parsed['Referral Email'] ?? '—' },
                    { label: 'Status', value: selected.replied ? '✅ Replied' : '⏳ Pending' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#0D0D0D] rounded-xl p-3">
                      <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-white text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>

                {parsed['Message'] && (
                  <div className="bg-[#0D0D0D] rounded-xl p-4">
                    <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Additional Notes</p>
                    <p className="text-[#888] text-sm leading-relaxed">{parsed['Message']}</p>
                  </div>
                )}

                {/* Commission reminder */}
                <div className="mt-5 bg-[#F97316]/5 border border-[#F97316]/15 rounded-xl p-4 flex items-start gap-3">
                  <DollarSign size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#888] leading-relaxed">
                    Remember: If the referral hires you for a <strong className="text-white">$500+ project</strong>, pay out <strong className="text-[#F97316]">10% commission</strong> to <strong className="text-white">{selected.name}</strong> within 7 days of project payment.
                  </p>
                </div>
              </motion.div>
            );
          })() : (
            <div className="flex-1 bg-[#0A0A0A] border border-[#161616] rounded-2xl flex items-center justify-center text-[#222]">
              <div className="text-center">
                <Users size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Select a referral</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
