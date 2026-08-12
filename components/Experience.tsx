'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaChevronUp as ChevronUp, FaChevronDown as ChevronDown } from 'react-icons/fa6';
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
        {/* Center vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
          <div className="h-full bg-gradient-to-b from-transparent via-[#F97316]/30 to-transparent" />
        </div>

        <div className="space-y-12">
          {EXPERIENCE.map((exp, i) => {
            const isLeft = i % 2 === 0;
            const isOpen = expanded === i;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-start gap-0 md:gap-8 ${isLeft ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'} relative`}
              >
                {/* Content */}
                <div className="flex-1 w-full">
                  <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                    {/* Header */}
                    <button
                      className="w-full flex items-start justify-between p-6 text-left"
                      onClick={() => setExpanded(isOpen ? null : i)}
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                        <p className="text-[#666] text-sm">
                          {exp.company} – {exp.type}
                        </p>
                      </div>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-[#555] mt-1 shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-[#555] mt-1 shrink-0" />
                      )}
                    </button>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="px-6 pb-6 border-t border-[#1E1E1E] pt-4">
                            <ul className="space-y-2 mb-5">
                              {exp.bullets.map((b, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-[#888] leading-relaxed">
                                  <span className="text-[#F97316] mt-0.5 shrink-0">•</span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                            <div className="flex flex-wrap gap-2">
                              {exp.tags.map((tag) => (
                                <span key={tag} className="tag-pill">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="hidden md:flex flex-col items-center gap-1 shrink-0 relative z-10">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                    style={{ borderColor: exp.color, background: `${exp.color}20`, color: exp.color }}
                  >
                    {exp.initials}
                  </div>
                </div>

                {/* Date */}
                <div className={`flex-1 hidden md:flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
                  <div className={`${isLeft ? 'text-left' : 'text-right'}`}>
                    <p className="font-semibold text-white text-sm">{exp.period}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs">
                      {exp.badge}
                    </span>
                  </div>
                </div>

                {/* Mobile date */}
                <div className="md:hidden px-6 pt-1 pb-2">
                  <p className="text-xs text-[#555]">{exp.period}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
