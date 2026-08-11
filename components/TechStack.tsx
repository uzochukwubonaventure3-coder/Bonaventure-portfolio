'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TECH_STACK } from '@/lib/data';

const CATEGORY_COLORS: Record<string, string> = {
  FRONTEND: '#3B82F6',
  BACKEND: '#F97316',
  MOBILE: '#22C55E',
  DATABASE: '#A855F7',
  DEVOPS: '#EAB308',
};

export default function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="stack" className="section max-w-7xl mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold text-white section-title mb-3">Tech Stack</h2>
        <p className="text-[#666] mt-4">Tools and technologies I use to build professional projects.</p>
      </motion.div>

      <div className="space-y-6">
        {Object.entries(TECH_STACK).map(([category, techs], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4"
          >
            {/* Category label */}
            <div className="w-28 shrink-0">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: CATEGORY_COLORS[category] }}
              >
                {category}
              </span>
            </div>

            {/* Tech pills */}
            <div className="flex flex-wrap gap-2">
              {techs.map((tech, techIdx) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.35, delay: catIdx * 0.08 + techIdx * 0.05 }}
                  whileHover={{ scale: 1.05, borderColor: CATEGORY_COLORS[category] }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#1E1E1E] rounded-full text-sm text-[#ccc] cursor-default transition-all"
                >
                  <span className="text-base leading-none">{tech.icon}</span>
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
