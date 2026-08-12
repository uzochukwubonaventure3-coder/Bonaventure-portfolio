'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaArrowUpRightFromSquare as ArrowUpRight, FaBolt, FaCode, FaGem, FaLocationDot, FaLock, FaRobot, FaWandMagicSparkles } from 'react-icons/fa6';
import { FaFigma, FaGithub } from 'react-icons/fa';
import { SiNotion, SiPostman } from 'react-icons/si';
import Link from 'next/link';

const MARQUEE_TECH = [
  'Next.js', 'Laravel', 'React', 'TypeScript', 'Tailwind CSS',
  'PHP', 'MySQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Git',
  'GitHub Actions', 'Linux', 'Vue.js', 'WordPress', 'Figma', 'Java',
];

const TOOLS = [
  { name: 'VS Code', icon: FaCode, color: '#007ACC' },
  { name: 'Kiro', icon: FaRobot, color: '#F97316' },
  { name: 'Figma', icon: FaFigma, color: '#F24E1E' },
  { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
  { name: 'GitHub', icon: FaGithub, color: '#fff' },
  { name: 'Notion', icon: SiNotion, color: '#fff' },
];

const WHAT_YOU_GET = [
  { icon: FaWandMagicSparkles, label: 'Pixel-perfect UI' },
  { icon: FaBolt, label: 'Fast delivery' },
  { icon: FaLock, label: 'Secure & scalable' },
  { icon: ArrowUpRight, label: 'SEO optimized' },
];

const CITIES = [
  { name: 'Abuja, NG', x: 25, y: 68, active: true },
  { name: 'London', x: 44, y: 32 },
  { name: 'New York', x: 22, y: 35 },
  { name: 'Dubai', x: 63, y: 45 },
  { name: 'Toronto', x: 18, y: 30 },
];

export default function BentoGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const cardVariant = (delay = 0) => ({
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  });

  return (
    <section ref={ref} className="section max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* 1 — Let's Build Together */}
        <motion.div
          variants={cardVariant(0)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="bento-card flex flex-col items-center justify-center text-center min-h-[280px]"
        >
          {/* Robot mini avatar */}
          <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-6">
            <FaRobot size={42} className="text-[#F97316]" aria-label="Developer assistant" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#555] mb-3">Let&apos;s Build Together</p>
          <h3 className="text-xl font-bold text-white leading-tight mb-4">
            Clear communication,<br />
            fast iterations, no surprises
          </h3>
          <a
            href="https://wa.me/2349049269679"
            className="text-[#F97316] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Start a project <ArrowUpRight size={14} />
          </a>
        </motion.div>

        {/* 2 — Tech Stack (Marquee) */}
        <motion.div
          variants={cardVariant(0.1)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="bento-card overflow-hidden"
        >
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Tech Stack</p>
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-1">
            The stack behind everything I ship
            <ArrowUpRight size={14} className="text-[#555]" />
          </h3>
          <div className="overflow-hidden space-y-2">
            <div className="flex gap-2 marquee-track animate-marquee">
              {[...MARQUEE_TECH, ...MARQUEE_TECH].map((t, i) => (
                <span key={i} className="shrink-0 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[11px] text-[#888] whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-2 marquee-track animate-marquee-reverse">
              {[...MARQUEE_TECH.slice(6), ...MARQUEE_TECH.slice(6)].map((t, i) => (
                <span key={i} className="shrink-0 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[11px] text-[#888] whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3 — Tools */}
        <motion.div
          variants={cardVariant(0.2)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="bento-card"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            {TOOLS.map((tool) => {
              const ToolIcon = tool.icon;
              return (
              <div key={tool.name} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                  <ToolIcon size={22} style={{ color: tool.color }} aria-label={tool.name} />
                </div>
                <span className="text-[10px] text-[#666]">{tool.name}</span>
              </div>
              );
            })}
          </div>
          <div className="border-t border-[#1E1E1E] pt-3 mt-2">
            <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Uses</p>
            <Link href="/about" className="text-sm text-white flex items-center gap-1 hover:text-[#F97316] transition-colors">
              Check out my favorite tools <ArrowUpRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* 4 — What You Get */}
        <motion.div
          variants={cardVariant(0.1)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="bento-card"
        >
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-2">What You Get</p>
          <h3 className="font-bold text-white text-xl leading-tight mb-6">
            Clean code, pixel-perfect UI,<br />
            deployed & scaling
          </h3>
          <div className="space-y-3 mb-4">
            {WHAT_YOU_GET.map((item) => {
              const ItemIcon = item.icon;
              return (
              <div key={item.label} className="flex items-center gap-3 text-sm text-[#888]">
                <ItemIcon className="w-5 text-[#F97316]" size={14} aria-hidden="true" />
                {item.label}
              </div>
              );
            })}
          </div>
          <div className="border-t border-[#1E1E1E] pt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
              <FaGem size={13} className="text-[#F97316]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Worth Every Dollar</p>
              <p className="text-xs text-[#666]">Senior quality, no agency markup</p>
            </div>
          </div>
        </motion.div>

        {/* 5 — Timezone Map */}
        <motion.div
          variants={cardVariant(0.2)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="bento-card relative overflow-hidden"
        >
          <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Flexible with Timezones</p>
          <h3 className="font-bold text-white text-lg mb-4">
            Based in Nigeria,<br />
            available globally
          </h3>

          {/* Simple world map dots */}
          <div className="relative h-32 bg-[#0D0D0D] rounded-xl overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }} />

            {/* Cities */}
            {CITIES.map((city) => (
              <div
                key={city.name}
                className="absolute flex flex-col items-center"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                <div className={`w-2 h-2 rounded-full ${city.active ? 'bg-[#F97316]' : 'bg-[#555]'}`}>
                  {city.active && (
                    <div className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
                  )}
                </div>
                <span className="text-[8px] text-[#666] mt-0.5 whitespace-nowrap flex items-center gap-0.5"><FaLocationDot size={7} aria-hidden="true" />{city.name}</span>
              </div>
            ))}

            {/* Dashed connection lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={`M25,68 Q35,50 44,32`} stroke="#F97316" strokeWidth="0.5" strokeDasharray="2,3" fill="none" opacity="0.4" />
              <path d={`M25,68 Q23,51 22,35`} stroke="#F97316" strokeWidth="0.5" strokeDasharray="2,3" fill="none" opacity="0.4" />
              <path d={`M25,68 Q44,56 63,45`} stroke="#F97316" strokeWidth="0.5" strokeDasharray="2,3" fill="none" opacity="0.3" />
            </svg>
          </div>

          <a href="#" className="inline-flex items-center gap-1 text-xs text-[#555] hover:text-[#F97316] mt-3 transition-colors">
            See live location →
          </a>
        </motion.div>

        {/* 6 — CTA Orange Card */}
        <motion.div
          variants={cardVariant(0.3)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="cta-card flex flex-col"
        >
          <p className="text-[10px] uppercase tracking-widest text-black/50 mb-4">Open to More</p>
          <h3 className="text-3xl font-bold text-black italic leading-tight mb-auto">
            Got a project?<br />
            Let&apos;s talk.
          </h3>
          <div className="space-y-2 mt-8">
            <a
              href="https://wa.me/2349049269679"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-black hover:text-[#F97316] transition-all"
            >
              Start a Project <ArrowUpRight size={14} />
            </a>
            <Link
              href="/resume"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-black/10 text-black text-sm font-semibold hover:bg-black hover:text-white transition-all"
            >
              View Resume
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
