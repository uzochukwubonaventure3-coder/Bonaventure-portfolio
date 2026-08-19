'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Phone, Send, CheckCircle, ChevronRight, X, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

function ConsultForm() {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', message: '', timeSlot: '' });
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
          message: `[CONSULTATION REQUEST]\nWhatsApp: ${form.whatsapp}\nPreferred Time: ${form.timeSlot}\n\n${form.message}`,
          budget: 'Consultation',
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return; }
      setSubmitted(true);
    } catch { setError('Network error. Try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-lg mx-auto px-5">
      <div className="flex items-center gap-2 text-sm text-[#555] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        <ChevronRight size={14} />
        <span className="text-white">Book a Consultation</span>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Request Received!</h2>
            <p className="text-[#666] mb-8">I&apos;ll reach out within a few hours with available time slots.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] transition-all">
              Back to Home
            </Link>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F97316] text-white text-sm font-semibold mb-6">
                <Zap size={14} /> Consultation
                <button className="ml-1 opacity-70 hover:opacity-100 transition-opacity"><X size={12} /></button>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Book a Consultation</h1>
              <p className="text-[#666] text-sm">Have questions? Let&apos;s schedule a quick call to discuss your needs.</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠ {error}</div>
            )}

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
                  <label className="block text-sm text-white mb-2 font-medium">WhatsApp Number</label>
                  <div className="flex items-center gap-3 bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 focus-within:border-[#F97316]/40 transition-colors">
                    <Phone size={15} className="text-[#444] shrink-0" />
                    <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="+234 801 234 5678"
                      className="flex-1 bg-transparent text-white text-sm placeholder-[#333] focus:outline-none" />
                  </div>
                </div>
                {/* Preferred time slot */}
                <div>
                  <label className="block text-sm text-white mb-2 font-medium">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-[#F97316]" /> Preferred Time (WAT)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} type="button" onClick={() => setForm({ ...form, timeSlot: slot })}
                        className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                          form.timeSlot === slot
                            ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]'
                            : 'bg-[#111] border-[#1A1A1A] text-[#555] hover:text-white hover:border-[#222]'
                        }`}>{slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white mb-2 font-medium">Message</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="What would you like to discuss? What questions do you have about your project?"
                    className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none transition-colors" />
                  <p className="text-[10px] text-[#444] mt-1.5">⚡ I typically respond within a few hours with available time slots.</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#F97316] text-white font-bold hover:bg-[#EA6C0A] disabled:opacity-60 transition-all">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ConsultPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none min-h-screen pt-20 pb-24 md:pb-20">
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" /></div>}>
          <ConsultForm />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
