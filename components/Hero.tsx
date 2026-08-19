'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Download } from 'lucide-react';
import { gsap } from 'gsap';
import Robot from './Robot';
import { STATS, TECH_BADGES } from '@/lib/data';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 1 });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#F97316]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/4 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 w-full pt-20 pb-8 md:pt-28 md:pb-16">

        {/* ── MOBILE: robot top, text bottom ── */}
        <div className="flex flex-col md:hidden items-start w-full">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center mb-2">
            <Robot className="w-[220px] h-[270px]" />
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="show" className="w-full">
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm text-[#888]">Available for remote work</span>
            </motion.div>

            <motion.h1 variants={item} className="text-[2.6rem] font-bold leading-none tracking-tight mb-4">
              <span className="text-[#F97316]">Bonaventure</span><br />
              <span className="text-[#F97316]">Chidalu</span>
            </motion.h1>

            <motion.p variants={item} className="text-[#888] text-[0.95rem] leading-relaxed mb-2">
              Full-stack software engineer with experience in{' '}
              <strong className="text-white font-semibold">backend architecture</strong>,{' '}
              <strong className="text-white font-semibold">web development</strong>, and{' '}
              <strong className="text-white font-semibold">system scalability</strong>.
            </motion.p>

            <motion.div variants={item} className="flex items-center gap-1.5 text-[#666] text-sm mb-6">
              <MapPin size={13} /><span>FCT Abuja, Nigeria</span>
            </motion.div>

            {/* Buttons — side by side, matching screenshot 2 */}
            <motion.div variants={item} className="flex gap-3 mb-7 flex-wrap">
              <a href="/resume"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#F97316] text-white font-semibold text-sm hover:bg-[#EA6C0A] transition-all active:scale-95">
                <Download size={15} />Download Resume <ArrowRight size={13} />
              </a>
              <a href="https://wa.me/2349064779856" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#F97316] text-[#F97316] font-semibold text-sm hover:bg-[#F97316] hover:text-white transition-all active:scale-95">
                Start a Project <ArrowRight size={13} />
              </a>
            </motion.div>

            {/* Tech badges — 3 per row matching screenshot */}
            <motion.div variants={item} className="grid grid-cols-3 gap-2 w-full">
              {TECH_BADGES.map((tech) => (
                <div key={tech.name}
                  className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1E1E1E] rounded-full text-xs text-[#ccc]">
                  <img src={tech.icon} alt={tech.name} width={14} height={14}
                    className="w-3.5 h-3.5 object-contain shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="truncate">{tech.name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── DESKTOP: text left, robot right ── */}
        <div className="hidden md:flex items-center justify-between gap-8">
          <motion.div className="flex-1 max-w-xl" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm text-[#888]">Available for remote work</span>
            </motion.div>
            <motion.h1 variants={item} className="text-5xl lg:text-7xl font-bold leading-none tracking-tight mb-6">
              <span className="text-[#F97316]">Bonaventure</span><br /><span className="text-[#F97316]">Chidalu</span>
            </motion.h1>
            <motion.p variants={item} className="text-[#888] text-lg leading-relaxed mb-3">
              Full-stack software engineer with experience in{' '}
              <strong className="text-white font-semibold">backend architecture</strong>,{' '}
              <strong className="text-white font-semibold">web development</strong>, and{' '}
              <strong className="text-white font-semibold">system scalability</strong>.
            </motion.p>
            <motion.div variants={item} className="flex items-center gap-1.5 text-[#666] text-sm mb-8">
              <MapPin size={14} /><span>FCT Abuja, Nigeria</span>
            </motion.div>
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <a href="/resume"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold text-sm hover:bg-[#EA6C0A] transition-all">
                <Download size={16} />Download Resume
              </a>
              <a href="https://wa.me/2349064779856" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#F97316] text-[#F97316] font-semibold text-sm hover:bg-[#F97316] hover:text-white transition-all">
                Start a Project <ArrowRight size={16} />
              </a>
            </motion.div>
            <motion.div variants={item} className="flex flex-wrap gap-2">
              {TECH_BADGES.map((tech) => (
                <span key={tech.name} className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#1E1E1E] rounded-full text-sm text-[#ccc]">
                  <img src={tech.icon} alt={tech.name} width={16} height={16} className="w-4 h-4 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  {tech.name}
                </span>
              ))}
            </motion.div>
          </motion.div>
          <motion.div className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>
            <Robot className="w-[300px] h-[400px] lg:w-[340px] lg:h-[440px]" />
          </motion.div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-10 pt-8 border-t border-[#1A1A1A]">
          <div className="flex flex-col items-center gap-8 md:hidden">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label mt-2 text-center mx-auto">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="hidden md:grid grid-cols-3 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
