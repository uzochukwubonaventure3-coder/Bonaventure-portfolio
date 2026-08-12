'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaChevronLeft as ChevronLeft, FaChevronRight as ChevronRight } from 'react-icons/fa6';
import { TESTIMONIALS } from '@/lib/data';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout>();

  const go = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  };

  const prev = () => go((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, -1);
  const next = () => go((current + 1) % TESTIMONIALS.length, 1);

  // Auto-play
  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d < 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
  };

  const t = TESTIMONIALS[current];

  return (
    <section id="testimonials" className="section max-w-7xl mx-auto px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white section-title mb-3">Recommendations</h2>
        <p className="text-[#666] mt-4">Trusted by builders across the globe.</p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Prev/Next */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full bg-[#111] border border-[#222] text-[#888] hover:text-white hover:border-[#F97316] transition-all hidden md:flex items-center justify-center"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full bg-[#111] border border-[#222] text-[#888] hover:text-white hover:border-[#F97316] transition-all hidden md:flex items-center justify-center"
        >
          <ChevronRight size={18} />
        </button>

        {/* Card */}
        <div className="overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="testimonial-card"
            >
              <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#F97316]/30 flex items-center justify-center text-xl">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-sm text-[#666]">{t.title}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              className={`transition-all rounded-full ${
                i === current
                  ? 'w-8 h-2 bg-[#F97316]'
                  : 'w-2 h-2 bg-[#333] hover:bg-[#555]'
              }`}
            />
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-center gap-3 mt-4">
          <button onClick={prev} className="w-9 h-9 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#888]">
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} className="w-9 h-9 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#888]">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1E1E1E] bg-[#111] text-sm text-[#888] hover:text-[#F97316] hover:border-[#F97316]/30 transition-all"
          >
            Worked with me? <span className="text-[#F97316] font-semibold">Drop a testimonial</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
