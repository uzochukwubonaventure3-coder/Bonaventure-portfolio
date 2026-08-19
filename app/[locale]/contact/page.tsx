'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '', budget: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left */}
            <div>
              <p className="text-[#F97316] text-sm font-semibold uppercase tracking-widest mb-4">Contact</p>
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Let&apos;s build<br />
                <span className="text-[#F97316]">something great.</span>
              </h1>
              <p className="text-[#666] text-lg leading-relaxed mb-10">
                Have a project in mind? Looking for a reliable full-stack developer? Let&apos;s talk.
                I typically respond within 24 hours.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                    <MapPin size={16} className="text-[#F97316]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-[#666] text-sm">FCT Abuja, Nigeria (Remote Available)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                    <Mail size={16} className="text-[#F97316]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a href="mailto:abonaventure@gmail.com" className="text-[#F97316] text-sm hover:underline">abonaventure@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                    <MessageCircle size={16} className="text-[#F97316]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">WhatsApp</p>
                    <a
                      href="https://wa.me/2349049269679"
                      className="text-[#F97316] text-sm hover:underline"
                    >
                      +234 9049269679
                    </a>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mt-10 p-5 bg-[#111] border border-[#1E1E1E] rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-white font-semibold text-sm">Currently Available</span>
                </div>
                <p className="text-[#666] text-sm">
                  Open to freelance projects, part-time remote roles, and full-time remote opportunities.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-10 bg-[#111] border border-[#1E1E1E] rounded-2xl"
                >
                  <span className="text-6xl mb-4">🎉</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-[#666]">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 bg-[#111] border border-[#1E1E1E] rounded-2xl p-8"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#555] mb-2 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#555] mb-2 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#555] mb-2 uppercase tracking-wider">Budget Range</label>
                    <select
                      value={form.budget}
                      onChange={e => setForm({ ...form, budget: e.target.value })}
                      className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F97316]/40 transition-colors"
                    >
                      <option value="" className="text-[#333]">Select budget range</option>
                      <option>$500 – $1,000</option>
                      <option>$1,000 – $5,000</option>
                      <option>$5,000 – $15,000</option>
                      <option>$15,000+</option>
                      <option>Let&apos;s discuss</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#555] mb-2 uppercase tracking-wider">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] transition-all"
                  >
                    <Send size={16} />
                    Send Message
                  </button>

                  <p className="text-center text-xs text-[#444]">
                    Or reach me directly on{' '}
                    <a href="https://wa.me/2349049269679" className="text-[#F97316] hover:underline">WhatsApp</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
