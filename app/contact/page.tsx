'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Zap, Package, ChevronRight, CheckCircle, Loader2, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const ACTIONS = [
  { label: 'Start a Project', icon: '🚀', href: '#form', color: '#F97316' },
  { label: 'Book Consultation', icon: '⚡', href: '/contact/consult', color: '#3B82F6' },
  { label: 'Browse Products', icon: '🛍️', href: '/work', color: '#A855F7' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to send'); return; }
      setSent(true);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none min-h-screen pt-20 pb-24 md:pb-20">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#555] mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Contact</span>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Message sent! 🎉</h2>
                <p className="text-[#666] mb-8">I&apos;ll get back to you within 24 hours.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] transition-all">
                  Back to Home
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header — matching Image 6 */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mx-auto mb-5">
                    <MessageCircle size={28} className="text-[#F97316]" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-3">Let&apos;s talk?</h1>
                  <p className="text-[#666] text-sm leading-relaxed max-w-sm mx-auto">
                    Have a project in mind or just want to chat? I&apos;d love to hear from you! Send me a message and I&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {/* Action pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {ACTIONS.map(action => (
                    <Link key={action.label} href={action.href}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] border border-[#1E1E1E] text-sm text-[#888] hover:text-white hover:border-[#2A2A2A] transition-all">
                      <span>{action.icon}</span> {action.label}
                    </Link>
                  ))}
                </div>

                {/* WhatsApp CTA — green button matching Image 6 */}
                <div className="flex justify-center mb-8">
                  <a href="https://wa.me/2349064779856?text=Hi%20Bonaventure%2C%20I%27m%20interested%20in%20working%20with%20you!"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1ebe5a] transition-all shadow-lg shadow-[#25D366]/20">
                    <MessageCircle size={18} /> Chat on WhatsApp
                  </a>
                </div>

                {/* Form */}
                <div id="form" className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-6">
                  {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      ⚠ {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs text-[#555] mb-2 font-medium uppercase tracking-wider">Name</label>
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#555] mb-2 font-medium uppercase tracking-wider">Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#555] mb-2 font-medium uppercase tracking-wider">Budget Range</label>
                      <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F97316]/40 transition-colors">
                        <option value="">Select budget range</option>
                        <option>$500 – $1,000</option>
                        <option>$1,000 – $5,000</option>
                        <option>$5,000 – $15,000</option>
                        <option>$15,000+</option>
                        <option>Let&apos;s discuss</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#555] mb-2 font-medium uppercase tracking-wider">Message</label>
                      <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell me about your project..."
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none transition-colors" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#F97316] text-white font-bold hover:bg-[#EA6C0A] disabled:opacity-60 transition-all">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>

                {/* Contact info */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a href="mailto:bonaventurechidalu@gmail.com"
                    className="flex items-center gap-3 bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-4 hover:border-[#222] transition-colors">
                    <Mail size={16} className="text-[#F97316] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#444] uppercase tracking-wider">Email</p>
                      <p className="text-white text-xs font-semibold truncate">bonaventurechidalu@gmail.com</p>
                    </div>
                  </a>
                  <a href="https://wa.me/2349064779856" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-4 hover:border-[#222] transition-colors">
                    <Phone size={16} className="text-[#25D366] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#444] uppercase tracking-wider">WhatsApp</p>
                      <p className="text-white text-xs font-semibold">+234 906 477 9856</p>
                    </div>
                  </a>
                </div>
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
