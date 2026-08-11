'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Download } from 'lucide-react';
import { gsap } from 'gsap';
import Robot from './Robot';
import { STATS, TECH_BADGES } from '@/lib/data';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1,
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#F97316]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/4 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left — Text */}
          <motion.div
            className="flex-1 max-w-xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Available badge */}
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm text-[#888]">Available for remote work</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={item}
              className="text-5xl lg:text-7xl font-bold leading-none tracking-tight mb-6"
            >
              <span className="text-[#F97316]">Bonaventure</span>
              <br />
              <span className="text-[#F97316]">Chidalu</span>
            </motion.h1>

            {/* Bio */}
            <motion.p variants={item} className="text-[#888] text-lg leading-relaxed mb-3">
              Full-stack software engineer with experience in{' '}
              <strong className="text-white font-semibold">backend architecture</strong>,{' '}
              <strong className="text-white font-semibold">web development</strong>, and{' '}
              <strong className="text-white font-semibold">system scalability</strong>.
            </motion.p>

            {/* Location */}
            <motion.div variants={item} className="flex items-center gap-1.5 text-[#666] text-sm mb-8">
              <MapPin size={14} />
              <span>FCT Abuja, Nigeria</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <a
                href="/resume"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold text-sm hover:bg-[#EA6C0A] transition-all duration-200 hover:gap-3"
              >
                <Download size={16} />
                Download Resume
              </a>
              <a
                href="https://wa.me/2349064779856?text=Hi%20Bonaventure%2C%20I%27m%20interested%20in%20starting%20a%20project%20with%20you!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#F97316] text-[#F97316] font-semibold text-sm hover:bg-[#F97316] hover:text-white transition-all duration-200"
              >
                Start a Project
                <ArrowRight size={16} />
              </a>
            </motion.div>

            {/* Tech Badges */}
            <motion.div variants={item} className="flex flex-wrap gap-2">
              {TECH_BADGES.map((tech) => (
                <span key={tech.name} className="tech-badge">
                  <span className="w-4 h-4 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[10px]">●</span>
                  {tech.name}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Robot */}
          <motion.div
            className="flex-shrink-0 relative"
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <Robot className="w-[280px] h-[380px] lg:w-[340px] lg:h-[440px]" />
          </motion.div>
        </div>

        {/* Stats Row */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-[#1A1A1A]"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
