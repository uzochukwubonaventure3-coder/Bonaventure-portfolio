'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Download } from 'lucide-react';
import TechIcon from './TechIcon';
import { gsap } from 'gsap';
import Robot from './Robot';
import { STATS, TECH_BADGES } from '@/lib/data';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ stats = STATS, techBadges = TECH_BADGES }: { stats?: typeof STATS; techBadges?: typeof TECH_BADGES }) {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.8 });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#F97316]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/4 rounded-full blur-[100px] pointer-events-none" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 w-full pt-16 pb-8 md:pt-28 md:pb-16">

        {/* ── MOBILE layout: NO robot, text only ── */}
        <div className="flex flex-col md:hidden items-start w-full">
          <motion.div variants={container} initial="hidden" animate="show" className="w-full">
            {/* Available badge */}
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm text-[#888] font-medium">Available for remote work</span>
            </motion.div>

            {/* Name — very large bold on mobile */}
            <motion.h1 variants={item} className="text-[3rem] sm:text-[3.5rem] font-extrabold leading-[0.95] tracking-tight mb-5">
              <span className="text-[#F97316] block">Bonaventure</span>
              <span className="text-[#F97316] block">Chidalu</span>
            </motion.h1>

            {/* Bio */}
            <motion.p variants={item} className="text-[#888] text-base leading-relaxed mb-2 max-w-sm">
              Full-stack software engineer with experience in{' '}
              <strong className="text-white font-bold">backend architecture</strong>,{' '}
              <strong className="text-white font-bold">web development</strong>, and{' '}
              <strong className="text-white font-bold">system scalability</strong>.
            </motion.p>

            {/* Location */}
            <motion.div variants={item} className="flex items-center gap-1.5 text-[#666] text-sm mb-7">
              <MapPin size={13} /><span>FCT Abuja, Nigeria</span>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={item} className="flex gap-3 mb-8 flex-wrap">
              <a href="/resume"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#F97316] text-white font-bold text-sm hover:bg-[#EA6C0A] transition-all active:scale-95 shadow-lg shadow-[#F97316]/20">
                <Download size={15} /> Download Resume <ArrowRight size={13} />
              </a>
              <a href="https://wa.me/2349049269679" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#F97316] text-[#F97316] font-bold text-sm hover:bg-[#F97316] hover:text-white transition-all active:scale-95">
                Start a Project <ArrowRight size={13} />
              </a>
            </motion.div>

            {/* Tech badges — 3 per row with real icons */}
            <motion.div variants={item} className="grid grid-cols-3 gap-2 w-full">
              {techBadges.map(tech => (
                <div key={tech.name}
                  className="flex items-center gap-2 px-3 py-2.5 bg-[#111] border border-[#1E1E1E] rounded-full text-xs text-[#ccc] font-medium">
                  <TechIcon name={tech.name} className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tech.name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── DESKTOP layout: text left, robot right ── */}
        <div className="hidden md:flex items-center justify-between gap-12">
          <motion.div className="flex-1 max-w-2xl" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm text-[#888] font-medium">Available for remote work</span>
            </motion.div>

            <motion.h1 variants={item} className="text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[0.9] tracking-tight mb-6">
              <span className="text-[#F97316] block">Bonaventure</span>
              <span className="text-[#F97316] block">Chidalu</span>
            </motion.h1>

            <motion.p variants={item} className="text-[#888] text-lg leading-relaxed mb-3 max-w-lg">
              Full-stack software engineer with experience in{' '}
              <strong className="text-white font-bold">backend architecture</strong>,{' '}
              <strong className="text-white font-bold">web development</strong>, and{' '}
              <strong className="text-white font-bold">system scalability</strong>.
            </motion.p>

            <motion.div variants={item} className="flex items-center gap-1.5 text-[#666] text-sm mb-9">
              <MapPin size={14} /><span>FCT Abuja, Nigeria</span>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <a href="/resume"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F97316] text-white font-bold hover:bg-[#EA6C0A] transition-all shadow-lg shadow-[#F97316]/20">
                <Download size={16} /> Download Resume
              </a>
              <a href="https://wa.me/2349049269679" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-[#F97316] text-[#F97316] font-bold hover:bg-[#F97316] hover:text-white transition-all">
                Start a Project <ArrowRight size={16} />
              </a>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-2">
              {techBadges.map(tech => (
                <span key={tech.name}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#111] border border-[#1E1E1E] rounded-full text-sm text-[#ccc] font-semibold hover:border-[#2A2A2A] hover:text-white transition-all">
                  <TechIcon name={tech.name} className="w-4 h-4 shrink-0" />
                  {tech.name}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Robot — desktop only */}
          <motion.div className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>
            <Robot className="w-[300px] h-[400px] lg:w-[360px] lg:h-[460px]" />
          </motion.div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-12 pt-8 border-t border-[#1A1A1A]">
          {/* Mobile: vertical centered */}
          <div className="flex flex-col items-center gap-10 md:hidden">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="text-5xl font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="text-[#666] text-sm mt-2 max-w-[200px] text-center mx-auto leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
          {/* Desktop: horizontal */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="text-[#666] text-sm mt-2 leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
