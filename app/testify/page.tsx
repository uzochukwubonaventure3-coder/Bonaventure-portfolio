'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

export default function TestifyPage() {
  const [form, setForm] = useState({ name: '', role: '', email: '', quote: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const initials = form.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          title: form.role,
          quote: form.quote,
          initials,
          approved: false,
          featured: false,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed to submit'); return; }
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
            <span className="text-white">Testify</span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Thank you! 🙏</h2>
                <p className="text-[#666] mb-8 max-w-xs mx-auto">
                  Your testimonial has been received and will be reviewed shortly.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] transition-all">
                  Back to Home
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header — matching Image 8 */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-2 mb-5">
                    {[1, 2, 3].map(i => (
                      <Star key={i} size={36} className="text-[#F97316] fill-[#F97316]" />
                    ))}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-3">Share Your<br />Experience</h1>
                  <p className="text-[#666] text-sm leading-relaxed max-w-xs mx-auto">
                    Your feedback means a lot to me. If we&apos;ve worked together or you&apos;ve used my services, I&apos;d love to hear your thoughts!
                  </p>
                </div>

                {error && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    ⚠ {error}
                  </div>
                )}

                <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Star rating */}
                    <div className="flex justify-center gap-2 pb-1">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setForm({ ...form, rating: star })}
                          className="transition-transform hover:scale-110 active:scale-95">
                          <Star size={28} className={`transition-colors ${
                            star <= (hoverRating || form.rating) ? 'text-[#F97316] fill-[#F97316]' : 'text-[#333]'
                          }`} />
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Full Name</label>
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Role / Company</label>
                      <input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                        placeholder="e.g. CEO at Acme Corp"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Email Address (Optional)</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">Your Testimonial</label>
                      <textarea required rows={5} value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })}
                        placeholder="How was your experience working with me?"
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none transition-colors" />
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#F97316] text-white font-bold hover:bg-[#EA6C0A] disabled:opacity-60 transition-all">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      {loading ? 'Submitting...' : 'Submit Testimonial 🙌'}
                    </button>
                  </form>
                </div>

                <p className="text-center text-xs text-[#333] mt-5">
                  Feedback powered and protected by <span className="text-[#F97316] font-semibold">proforms</span>
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
