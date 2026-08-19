'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { EXPERIENCE } from '@/lib/data';

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="experience" className="section max-w-7xl mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-white section-title mb-3">Work Experience</h2>
        <p className="text-[#666] mt-4">My professional journey and the impact I&apos;ve made at various companies.</p>
      </motion.div>

      <div className="relative">
        {/* Desktop center vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
          <div className="h-full bg-gradient-to-b from-transparent via-[#F97316]/30 to-transparent" />
        </div>
        {/* Mobile left vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px md:hidden">
          <div className="h-full bg-gradient-to-b from-transparent via-[#F97316]/30 to-transparent" />
        </div>

        <div className="space-y-8 md:space-y-12">
          {EXPERIENCE.map((exp, i) => {
            const isLeft = i % 2 === 0;
            const isOpen = expanded === i;

            return (
              <motion.div key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* ── MOBILE layout: dot on left, content on right ── */}
                <div className="flex gap-4 md:hidden">
                  {/* Left side: dot + date */}
                  <div className="flex flex-col items-center shrink-0 w-10">
                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 relative"
                      style={{ borderColor: exp.color, background: `${exp.color}20`, color: exp.color }}>
                      {exp.initials}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-white text-[10px] font-semibold leading-tight whitespace-nowrap">{exp.period.split(' – ')[0]}</p>
                      <p className="text-[#F97316] text-[9px]">— {exp.period.split(' – ')[1] ?? 'Present'}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] text-[8px] border border-[#F97316]/15">
                        {exp.badge}
                      </span>
                    </div>
                  </div>

                  {/* Right side: card */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                      <button className="w-full flex items-start justify-between p-4 text-left"
                        onClick={() => setExpanded(isOpen ? null : i)}>
                        <div>
                          <h3 className="text-base font-bold text-white mb-0.5 leading-tight">{exp.title}</h3>
                          <p className="text-[#666] text-xs">{exp.company} – {exp.type}</p>
                        </div>
                        {isOpen
                          ? <ChevronUp size={16} className="text-[#555] mt-0.5 shrink-0" />
                          : <ChevronDown size={16} className="text-[#555] mt-0.5 shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                            <div className="px-4 pb-4 border-t border-[#1E1E1E] pt-3">
                              <ul className="space-y-2 mb-4">
                                {exp.bullets.map((b, j) => (
                                  <li key={j} className="flex items-start gap-2 text-xs text-[#888] leading-relaxed">
                                    <span className="text-[#F97316] mt-0.5 shrink-0">•</span>{b}
                                  </li>
                                ))}
                              </ul>
                              <div className="flex flex-wrap gap-1.5">
                                {exp.tags.map(tag => (
                                  <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* ── DESKTOP layout: alternating left/right ── */}
                <div className={`hidden md:flex items-start gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content side */}
                  <div className="flex-1">
                    <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                      <button className="w-full flex items-start justify-between p-6 text-left"
                        onClick={() => setExpanded(isOpen ? null : i)}>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                          <p className="text-[#666] text-sm">{exp.company} – {exp.type}</p>
                        </div>
                        {isOpen
                          ? <ChevronUp size={18} className="text-[#555] mt-1 shrink-0" />
                          : <ChevronDown size={18} className="text-[#555] mt-1 shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                            <div className="px-6 pb-6 border-t border-[#1E1E1E] pt-4">
                              <ul className="space-y-2 mb-5">
                                {exp.bullets.map((b, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm text-[#888] leading-relaxed">
                                    <span className="text-[#F97316] mt-0.5 shrink-0">•</span>{b}
                                  </li>
                                ))}
                              </ul>
                              <div className="flex flex-wrap gap-2">
                                {exp.tags.map(tag => (
                                  <span key={tag} className="tag-pill">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Center timeline node */}
                  <div className="hidden md:flex flex-col items-center gap-1 shrink-0 relative z-10">
                    <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                      style={{ borderColor: exp.color, background: `${exp.color}20`, color: exp.color }}>
                      {exp.initials}
                    </div>
                  </div>

                  {/* Date side */}
                  <div className={`flex-1 hidden md:flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
                    <div className={isLeft ? 'text-left' : 'text-right'}>
                      <p className="font-semibold text-white text-sm">{exp.period}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs">
                        {exp.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
