'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Code2, Monitor, Zap, Globe, Shield, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

const MARQUEE_TECH = [
  'Next.js','Laravel','React','TypeScript','Tailwind CSS',
  'PHP','MySQL','PostgreSQL','Redis','Docker','AWS','Git',
  'GitHub Actions','Linux','Vue.js','WordPress','Figma','Java',
];

const TOOLS = [
  { name: 'VS Code',  icon: 'https://cdn.simpleicons.org/visualstudiocode/007ACC' },
  { name: 'Kiro',     icon: 'https://cdn.simpleicons.org/amazonaws/FF9900' },
  { name: 'Figma',    icon: 'https://cdn.simpleicons.org/figma/F24E1E' },
  { name: 'Postman',  icon: 'https://cdn.simpleicons.org/postman/FF6C37' },
  { name: 'GitHub',   icon: 'https://cdn.simpleicons.org/github/ffffff' },
  { name: 'Notion',   icon: 'https://cdn.simpleicons.org/notion/ffffff' },
];

const WHAT_YOU_GET = [
  { icon: Monitor,  label: 'Pixel-perfect UI' },
  { icon: Zap,      label: 'Fast delivery' },
  { icon: Shield,   label: 'Secure & scalable' },
  { icon: Globe,    label: 'SEO optimized' },
];

const CITIES = [
  { name: 'Abuja, NG', x: 27, y: 62, active: true },
  { name: 'London',    x: 44, y: 32 },
  { name: 'New York',  x: 22, y: 35 },
  { name: 'Dubai',     x: 63, y: 45 },
];

export default function BentoGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const cv = (delay = 0) => ({
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
  });

  return (
    <section ref={ref} className="section max-w-7xl mx-auto px-5 lg:px-8">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4">

        {/* 1 — Let's Build Together */}
        <motion.div variants={cv(0)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card flex flex-col items-center justify-center text-center min-h-[240px]">
          <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-5">
            <Code2 size={28} className="text-[#F97316]" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-2 font-semibold">Let&apos;s Build Together</p>
          <h3 className="text-xl font-bold text-white leading-tight mb-4">
            Clear communication,<br />fast iterations, no surprises
          </h3>
          <a href="https://wa.me/2349064779856"
            className="inline-flex items-center gap-1.5 text-[#F97316] text-sm font-semibold hover:gap-3 transition-all">
            Start a project <ArrowUpRight size={14} />
          </a>
        </motion.div>

        {/* 2 — Tech Stack Marquee */}
        <motion.div variants={cv(0.08)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1 font-semibold">Tech Stack</p>
          <h3 className="font-bold text-white text-lg mb-5 flex items-center gap-1.5">
            The stack behind everything I ship <ArrowUpRight size={13} className="text-[#555]" />
          </h3>
          <div className="space-y-2.5 overflow-hidden">
            <div className="flex gap-2 animate-marquee">
              {[...MARQUEE_TECH, ...MARQUEE_TECH].map((t, i) => (
                <span key={i} className="shrink-0 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[11px] text-[#888] whitespace-nowrap font-medium">{t}</span>
              ))}
            </div>
            <div className="flex gap-2 animate-marquee-reverse">
              {[...MARQUEE_TECH.slice(6), ...MARQUEE_TECH.slice(6)].map((t, i) => (
                <span key={i} className="shrink-0 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[11px] text-[#888] whitespace-nowrap font-medium">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3 — Tools */}
        <motion.div variants={cv(0.16)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {TOOLS.map(tool => (
              <div key={tool.name} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                  <img src={tool.icon} alt={tool.name} width={22} height={22} className="w-5 h-5 object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <span className="text-[10px] text-[#666] font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1E1E1E] pt-3">
            <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1 font-semibold">Uses</p>
            <Link href="/uses" className="text-sm text-white flex items-center gap-1.5 hover:text-[#F97316] transition-colors font-semibold">
              Check out my favorite tools <ArrowUpRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* 4 — What You Get */}
        <motion.div variants={cv(0.08)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card">
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-2 font-semibold">What You Get</p>
          <h3 className="font-bold text-white text-xl leading-tight mb-6">
            Clean code, pixel-perfect UI,<br />deployed &amp; scaling
          </h3>
          <div className="space-y-3.5 mb-5">
            {WHAT_YOU_GET.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-[#888]">
                <Icon size={15} className="text-[#F97316] shrink-0" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1E1E1E] pt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
              <Star size={14} className="text-[#F97316]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Worth Every Dollar</p>
              <p className="text-xs text-[#666]">Senior quality, no agency markup</p>
            </div>
          </div>
        </motion.div>

        {/* 5 — Timezone Map */}
        <motion.div variants={cv(0.16)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="bento-card relative overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1 font-semibold">Flexible with Timezones</p>
          <h3 className="font-bold text-white text-xl mb-4 leading-tight">
            Based in Nigeria,<br />available globally
          </h3>
          <div className="relative h-28 bg-[#0D0D0D] rounded-xl overflow-hidden">
            <div className="absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
            {CITIES.map(city => (
              <div key={city.name} className="absolute flex flex-col items-center"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}>
                <div className="relative">
                  {city.active && <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#F97316] animate-ping" />}
                  <div className={`w-2 h-2 rounded-full relative ${city.active ? 'bg-[#F97316]' : 'bg-[#444]'}`} />
                </div>
                <span className="text-[7px] text-[#555] mt-0.5 whitespace-nowrap">{city.name}</span>
              </div>
            ))}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M27,62 Q35,48 44,32" stroke="#F97316" strokeWidth="0.4" strokeDasharray="2,3" fill="none" opacity="0.4" />
              <path d="M27,62 Q24,49 22,35" stroke="#F97316" strokeWidth="0.4" strokeDasharray="2,3" fill="none" opacity="0.4" />
              <path d="M27,62 Q45,54 63,45" stroke="#F97316" strokeWidth="0.4" strokeDasharray="2,3" fill="none" opacity="0.3" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <MapPin size={11} className="text-[#F97316]" />
            <span className="text-xs text-[#555] font-medium">FCT Abuja, NG — Remote worldwide</span>
          </div>
        </motion.div>

        {/* 6 — Orange CTA */}
        <motion.div variants={cv(0.24)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="cta-card flex flex-col min-h-[240px]">
          <p className="text-[10px] uppercase tracking-widest text-black/50 mb-4 font-bold">Open to Work</p>
          <h3 className="text-3xl font-extrabold text-black italic leading-tight mb-auto">
            Got a project?<br />Let&apos;s talk.
          </h3>
          <div className="space-y-2.5 mt-8">
            <a href="https://wa.me/2349049269679"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-black hover:text-[#F97316] transition-all">
              Start a Project <ArrowUpRight size={14} />
            </a>
            <Link href="/resume"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-black/10 text-black text-sm font-bold hover:bg-black hover:text-white transition-all">
              View Resume
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
