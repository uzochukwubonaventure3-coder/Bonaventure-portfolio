'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Gift, Users, DollarSign, Share2, CheckCircle, Copy, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const steps = [
  {
    number: '01',
    icon: Share2,
    title: 'Refer a Friend or Client',
    desc: 'Know someone who needs a website, web app, or SEO work? Refer them to me with your name as the referral source.',
    color: '#F97316',
  },
  {
    number: '02',
    icon: Users,
    title: 'They Start a Project',
    desc: 'Your referral contacts me, we discuss their needs, and they hire me for a project worth $500 or more.',
    color: '#3B82F6',
  },
  {
    number: '03',
    icon: DollarSign,
    title: 'You Earn 10% Commission',
    desc: 'Once the project is paid and completed, you receive 10% of the total project value — automatically, no follow-up needed.',
    color: '#22C55E',
  },
];

const faqs = [
  { q: 'Is there a limit to how many people I can refer?', a: 'No limit! Refer 10 clients, earn 10 commissions. The more you share, the more you earn.' },
  { q: 'When do I get paid?', a: 'Commission is paid within 7 days of the referred project being fully paid by your referral.' },
  { q: 'What counts as a qualifying project?', a: 'Any project worth $500 USD or more. This includes web development, SEO, consulting, or maintenance packages.' },
  { q: 'How do I track my referrals?', a: 'Simply use your name as the referral source when your contact reaches out. I keep records and will notify you once commission is due.' },
  { q: 'How is commission paid?', a: 'Bank transfer (NGN or USD), PayPal, Flutterwave, or any method we agree on. Your choice.' },
  { q: 'What if my referral doesn\'t hire you immediately?', a: 'Referrals are tracked for 60 days. If your contact hires me within 60 days of first contact, you still earn the commission.' },
];

export default function ReferEarnPage() {
  const [copied, setCopied] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ referrerName: '', referralName: '', referralEmail: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText('https://bonaventurechidalu.com?ref=YOUR_NAME');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.referrerName,
        email: 'referral@portfolio.com',
        message: `[REFERRAL SUBMISSION]\nReferrer: ${form.referrerName}\nReferral Name: ${form.referralName}\nReferral Email: ${form.referralEmail}\n\nMessage: ${form.message}`,
        budget: 'Referral',
      }),
    });
    setSubmitted(true);
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Refer & Earn</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="inline-flex w-20 h-20 rounded-3xl bg-[#F97316]/10 border border-[#F97316]/20 items-center justify-center mb-6">
              <Gift size={36} className="text-[#F97316]" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-5">
                <Zap size={14} /> Earn Real Money
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                Refer & Earn
                <span className="text-[#F97316]"> 10%</span>
              </h1>
              <p className="text-[#666] text-lg max-w-xl mx-auto leading-relaxed">
                Know someone who needs a website or web app? Refer them to me and earn 10% of the project value — no cap, no expiry on active referrals.
              </p>
            </motion.div>

            {/* Big earn example */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-8 inline-flex items-center gap-4 bg-[#0F0F0F] border border-[#F97316]/20 rounded-2xl px-6 py-4">
              <div className="text-center">
                <p className="text-[#555] text-xs mb-1">Project Value</p>
                <p className="text-2xl font-bold text-white font-mono">$2,000</p>
              </div>
              <div className="text-[#F97316] text-2xl font-bold">→</div>
              <div className="text-center">
                <p className="text-[#555] text-xs mb-1">Your Earn</p>
                <p className="text-2xl font-bold text-[#F97316] font-mono">$200</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 ml-2 pl-4 border-l border-[#1A1A1A]">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-green-400 text-xs font-semibold">Paid in 7 days</span>
              </div>
            </motion.div>
          </div>

          {/* How it works */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">How It Works</h2>
            <p className="text-[#555] text-sm text-center mb-10">Simple. Transparent. No fine print.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div key={step.number}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-6 text-center hover:border-[#2A2A2A] transition-all relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-[10px] font-mono font-bold text-[#F97316] bg-[#0F0F0F] border border-[#F97316]/20 px-2 py-0.5 rounded-full">{step.number}</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2" style={{ background: `${step.color}15`, border: `1px solid ${step.color}25` }}>
                      <Icon size={24} style={{ color: step.color }} />
                    </div>
                    <h3 className="font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-[#666] text-xs leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* CTA Box */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-[#F97316]/10 via-transparent to-transparent border border-[#F97316]/20 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Ready to start earning?</h3>
                  <p className="text-[#666] text-sm leading-relaxed mb-5">
                    Two ways to refer: submit your referral details below, or just tell your contact to mention your name when they reach out.
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFormOpen(!formOpen)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
                      <Gift size={15} /> Submit a Referral
                    </button>
                    <button onClick={copyLink}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#F97316]/40 text-[#F97316] text-sm font-semibold hover:bg-[#F97316]/10 transition-all">
                      {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
                <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5">
                  <p className="text-[10px] uppercase tracking-widest text-[#444] mb-3">Earnings Calculator</p>
                  <div className="space-y-2">
                    {[500, 1000, 2000, 5000].map(val => (
                      <div key={val} className="flex items-center justify-between">
                        <span className="text-[#555] text-sm font-mono">${val.toLocaleString()} project</span>
                        <span className="text-[#F97316] text-sm font-bold font-mono">+${(val * 0.1).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Referral form */}
            <AnimatePresence>
              {formOpen && !submitted && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-[#0F0F0F] border border-[#1E1E1E] rounded-2xl p-6">
                  <h4 className="font-bold text-white mb-4 text-sm">Submit Your Referral</h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Your Name</label>
                        <input required value={form.referrerName} onChange={e => setForm({ ...form, referrerName: e.target.value })}
                          placeholder="Your name" className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Referral&apos;s Name</label>
                        <input required value={form.referralName} onChange={e => setForm({ ...form, referralName: e.target.value })}
                          placeholder="Their name" className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Referral&apos;s Email</label>
                      <input type="email" required value={form.referralEmail} onChange={e => setForm({ ...form, referralEmail: e.target.value })}
                        placeholder="their.email@example.com" className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">What do they need? (optional)</label>
                      <textarea rows={2} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="e.g. They need an e-commerce site built in Laravel..."
                        className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none" />
                    </div>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
                      <ArrowRight size={15} /> Submit Referral
                    </button>
                  </form>
                </motion.div>
              )}
              {submitted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                  <CheckCircle size={28} className="text-green-400 mx-auto mb-3" />
                  <p className="text-white font-semibold">Referral submitted! 🎉</p>
                  <p className="text-[#666] text-sm mt-1">I&apos;ll follow up within 24 hours and keep you posted on your commission.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-5">
                  <p className="font-semibold text-white text-sm mb-2">{faq.q}</p>
                  <p className="text-[#666] text-xs leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
