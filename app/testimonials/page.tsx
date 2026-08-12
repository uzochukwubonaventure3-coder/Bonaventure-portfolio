'use client';

import { useState } from 'react';
import { FaCircleCheck, FaPaperPlane, FaQuoteLeft } from 'react-icons/fa6';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

export default function TestimonialsPage() {
  const [form, setForm] = useState({ name: '', title: '', quote: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error();
      setStatus('sent');
    } catch { setStatus('error'); }
  }

  return <>
    <CustomCursor /><Navbar />
    <main className="cursor-none min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
        <section className="lg:pt-8">
          <p className="text-[#F97316] text-xs font-semibold uppercase tracking-[0.22em] mb-5">Share your experience</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">Your words help the right teams choose <span className="text-[#F97316]">with confidence.</span></h1>
          <p className="mt-6 text-[#888] leading-relaxed">If we have worked together, a short recommendation about the process, outcome, or collaboration means a great deal. Every submission is reviewed before it is published.</p>
          <div className="mt-8 rounded-2xl border border-[#222] bg-[#111] p-6">
            <FaQuoteLeft className="text-[#F97316] mb-4" size={18} />
            <p className="text-sm leading-relaxed text-[#777]">The most helpful testimonials are specific: the challenge, the work we did together, and the result it created for you or your team.</p>
          </div>
        </section>
        <section className="rounded-2xl border border-[#222] bg-[#111] p-6 md:p-8">
          {status === 'sent' ? <div className="min-h-[380px] flex flex-col items-center justify-center text-center"><FaCircleCheck className="text-[#F97316] mb-5" size={50} /><h2 className="text-2xl font-bold text-white">Thank you for the recommendation.</h2><p className="mt-3 max-w-sm text-[#777]">It has been received and will be reviewed before it appears on the site.</p></div> :
          <form onSubmit={submit} className="space-y-5">
            <div><label className="block mb-2 text-xs uppercase tracking-widest text-[#555]">Your name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" className="w-full rounded-xl border border-[#242424] bg-[#0D0D0D] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#F97316]/50" /></div>
            <div><label className="block mb-2 text-xs uppercase tracking-widest text-[#555]">Role and company</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Founder, Example Company" className="w-full rounded-xl border border-[#242424] bg-[#0D0D0D] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#F97316]/50" /></div>
            <div><label className="block mb-2 text-xs uppercase tracking-widest text-[#555]">Your testimonial</label><textarea required rows={7} value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} placeholder="What was it like working together?" className="w-full resize-none rounded-xl border border-[#242424] bg-[#0D0D0D] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#F97316]/50" /></div>
            {status === 'error' && <p className="text-sm text-red-400">Something went wrong. Please try again or contact me directly.</p>}
            <button disabled={status === 'sending'} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#EA6C0A] disabled:opacity-60"><FaPaperPlane size={14} />{status === 'sending' ? 'Submitting...' : 'Submit testimonial'}</button>
          </form>}
        </section>
      </div>
    </main>
    <Footer /><BackToTop />
  </>;
}
