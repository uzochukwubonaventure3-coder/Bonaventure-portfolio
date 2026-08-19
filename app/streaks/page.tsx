'use client';

import { ChevronRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const streaks = [
  { name: 'Daily Coding', emoji: '💻', current: 47, best: 62, color: '#F97316', desc: 'Writing at least 1 commit per day' },
  { name: 'Reading', emoji: '📚', current: 12, best: 30, color: '#60A5FA', desc: 'Reading at least 10 pages daily' },
  { name: 'Exercise', emoji: '🏋️', current: 8, best: 21, color: '#34D399', desc: 'Working out or walking every day' },
  { name: 'No Social Scrolling', emoji: '📵', current: 3, best: 14, color: '#C084FC', desc: 'No mindless scrolling before work' },
  { name: 'Journaling', emoji: '✍️', current: 22, best: 22, color: '#FBBF24', desc: 'Writing thoughts and goals daily' },
  { name: 'Learning Something New', emoji: '🧠', current: 31, best: 45, color: '#F472B6', desc: 'Studying a new concept or tutorial' },
];

export default function StreaksPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">My Streaks</span>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Flame size={32} className="text-orange-400" />
              <h1 className="text-3xl font-bold text-white">My Streaks 🔥</h1>
            </div>
            <p className="text-[#555]">Habits and streaks I actively maintain. Accountability in public.</p>
          </div>

          <div className="space-y-4">
            {streaks.map((streak, i) => {
              const pct = Math.min(100, Math.round((streak.current / streak.best) * 100));
              return (
                <motion.div key={streak.name}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#222] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{streak.emoji}</span>
                      <div>
                        <p className="font-bold text-white text-sm">{streak.name}</p>
                        <p className="text-[#555] text-xs">{streak.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Flame size={14} style={{ color: streak.color }} />
                        <span className="text-xl font-bold font-mono" style={{ color: streak.color }}>{streak.current}</span>
                      </div>
                      <p className="text-[#444] text-[10px]">best: {streak.best}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                      className="h-full rounded-full" style={{ background: streak.color }} />
                  </div>
                  <p className="text-[10px] text-[#333] mt-1.5 text-right">{pct}% of best</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
