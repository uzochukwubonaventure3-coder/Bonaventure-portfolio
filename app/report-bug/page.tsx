'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Send, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

export default function ReportBugPage() {
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `[BUG REPORT]\n\n${form.description}`,
          budget: 'Bug Report',
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return; }
      setSubmitted(true);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none min-h-screen pt-20 pb-24 md:pb-20">
        <div className="max-w-lg mx-auto px-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#555] mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Report a Bug</span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Bug Reported! 🐛</h2>
                <p className="text-[#666] mb-8">Thanks — I&apos;ll look into it and fix it ASAP.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] transition-all">
                  Back to Home
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header — matching Image 7 */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mx-auto mb-5">
                    <Bug size={28} className="text-[#F97316]" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-3">Found a Bug?</h1>
                  <p className="text-[#666] text-sm leading-relaxed max-w-sm mx-auto">
                    I&apos;m not perfect, and occasionally things break! If you notice an issue, typo, or weird behavior, please let me know so I can fix it immediately.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    ⚠ {error}
                  </div>
                )}

                {/* Form — matching Image 7 style */}
                <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Name</label>
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Describe the Issue</label>
                      <textarea required rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Where did it happen? What did you expect to happen?"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none transition-colors" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#F97316] text-white font-bold hover:bg-[#EA6C0A] disabled:opacity-60 transition-all">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Bug size={16} />}
                      {loading ? 'Submitting...' : 'Submit Bug Report ⚙️'}
                    </button>
                  </form>
                </div>

                <p className="text-center text-xs text-[#333] mt-5">
                  Form powered and protected by <span className="text-[#F97316] font-semibold">proforms</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
