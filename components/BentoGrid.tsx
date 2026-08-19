'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const MARQUEE_TECH = [
  'Next.js','Laravel','React','TypeScript','Tailwind CSS',
  'PHP','MySQL','PostgreSQL','Redis','Docker','AWS','Git',
  'GitHub Actions','Linux','Vue.js','WordPress','Figma','Java',
];

const TOOLS = [
  { name: 'VS Code', icon: '💙' },
  { name: 'Kiro', icon: '🤖' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Postman', icon: '🔶' },
  { name: 'GitHub', icon: '⬛' },
  { name: 'Notion', icon: '📝' },
];

const WHAT_YOU_GET = [
  { icon: '✦', label: 'Pixel-perfect UI' },
  { icon: '⚡', label: 'Fast delivery' },
  { icon: '🔒', label: 'Secure & scalable' },
  { icon: '📈', label: 'SEO optimized' },
];

const CITIES = [
  { name: 'Abuja, NG', flag: '🇳🇬', x: 27, y: 62, active: true },
  { name: 'London', flag: '🇬🇧', x: 44, y: 32 },
  { name: 'New York', flag: '🇺🇸', x: 22, y: 35 },
  { name: 'Dubai', flag: '🇦🇪', x: 63, y: 45 },
];

export default function BentoGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const cv = (delay = 0) => ({
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
  });

  return (
    <section ref={ref} className="section max-w-7xl mx-auto px-6 lg:px-8">
      {/* All cards stack vertically on mobile, 3-col grid on desktop */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4">

        {/* 1 — Let's Build Together */}
        <motion.div variants={cv(0)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card flex flex-col items-center justify-center text-center min-h-[240px]">
          <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-4xl mb-5">🤖</div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-2">Let&apos;s Build Together</p>
          <h3 className="text-lg font-bold text-white leading-tight mb-4">
            Clear communication,<br />fast iterations, no surprises
          </h3>
          <a href="https://wa.me/2349064779856" className="text-[#F97316] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Start a project <ArrowUpRight size={13} />
          </a>
        </motion.div>

        {/* 2 — Tech Stack Marquee */}
        <motion.div variants={cv(0.08)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Tech Stack</p>
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-1">
            The stack behind everything I ship
            <ArrowUpRight size={13} className="text-[#555]" />
          </h3>
          <div className="overflow-hidden space-y-2">
            <div className="flex gap-2 marquee-track animate-marquee">
              {[...MARQUEE_TECH, ...MARQUEE_TECH].map((t, i) => (
                <span key={i} className="shrink-0 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[11px] text-[#888] whitespace-nowrap">{t}</span>
              ))}
            </div>
            <div className="flex gap-2 marquee-track animate-marquee-reverse">
              {[...MARQUEE_TECH.slice(6), ...MARQUEE_TECH.slice(6)].map((t, i) => (
                <span key={i} className="shrink-0 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[11px] text-[#888] whitespace-nowrap">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3 — Tools */}
        <motion.div variants={cv(0.16)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-2xl">{tool.icon}</div>
                <span className="text-[10px] text-[#666]">{tool.name}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1E1E1E] pt-3 mt-2">
            <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Uses</p>
            <Link href="/uses" className="text-sm text-white flex items-center gap-1 hover:text-[#F97316] transition-colors">
              Check out my favorite tools <ArrowUpRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* 4 — What You Get */}
        <motion.div variants={cv(0.08)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card">
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-2">What You Get</p>
          <h3 className="font-bold text-white text-lg leading-tight mb-5">
            Clean code, pixel-perfect UI,<br />deployed &amp; scaling
          </h3>
          <div className="space-y-3 mb-4">
            {WHAT_YOU_GET.map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm text-[#888]">
                <span className="text-base w-5">{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
          <div className="border-t border-[#1E1E1E] pt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-sm">💎</div>
            <div>
              <p className="text-sm font-semibold text-white">Worth Every Dollar</p>
              <p className="text-xs text-[#666]">Senior quality, no agency markup</p>
            </div>
          </div>
        </motion.div>

        {/* 5 — Timezone Map */}
        <motion.div variants={cv(0.16)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card relative overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Flexible with Timezones</p>
          <h3 className="font-bold text-white text-lg mb-4">
            Based in Nigeria,<br />available globally
          </h3>
          <div className="relative h-28 bg-[#0D0D0D] rounded-xl overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
            {CITIES.map((city) => (
              <div key={city.name} className="absolute flex flex-col items-center" style={{ left: `${city.x}%`, top: `${city.y}%` }}>
                <div className={`w-2 h-2 rounded-full ${city.active ? 'bg-[#F97316]' : 'bg-[#555]'}`}>
                  {city.active && <div className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />}
                </div>
                <span className="text-[8px] text-[#666] mt-0.5 whitespace-nowrap">{city.name} {city.flag}</span>
              </div>
            ))}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M27,62 Q35,48 44,32" stroke="#F97316" strokeWidth="0.5" strokeDasharray="2,3" fill="none" opacity="0.4" />
              <path d="M27,62 Q24,49 22,35" stroke="#F97316" strokeWidth="0.5" strokeDasharray="2,3" fill="none" opacity="0.4" />
              <path d="M27,62 Q45,54 63,45" stroke="#F97316" strokeWidth="0.5" strokeDasharray="2,3" fill="none" opacity="0.3" />
            </svg>
          </div>
          <a href="#" className="inline-flex items-center gap-1 text-xs text-[#555] hover:text-[#F97316] mt-3 transition-colors">
            See live location →
          </a>
        </motion.div>

        {/* 6 — Orange CTA */}
        <motion.div variants={cv(0.24)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="cta-card flex flex-col min-h-[240px]">
          <p className="text-[10px] uppercase tracking-widest text-black/50 mb-4">Open to More</p>
          <h3 className="text-3xl font-bold text-black italic leading-tight mb-auto">
            Got a project?<br />Let&apos;s talk.
          </h3>
          <div className="space-y-2 mt-8">
            <a href="https://wa.me/2349064779856"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-black hover:text-[#F97316] transition-all">
              Start a Project <ArrowUpRight size={13} />
            </a>
            <Link href="/resume"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-black/10 text-black text-sm font-semibold hover:bg-black hover:text-white transition-all">
              View Resume
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
