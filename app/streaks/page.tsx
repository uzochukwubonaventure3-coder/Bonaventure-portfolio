'use client';

import { motion } from 'framer-motion';
import { Flame, ChevronRight, TrendingUp, Code2, BookOpen, Dumbbell, BrainCircuit, PenLine, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const streaks = [
  { name: 'Daily Coding', icon: Code2, current: 47, best: 62, color: '#F97316', desc: 'Writing at least 1 commit per day' },
  { name: 'Reading', icon: BookOpen, current: 12, best: 30, color: '#3B82F6', desc: 'Reading at least 10 pages daily' },
  { name: 'Exercise', icon: Dumbbell, current: 8, best: 21, color: '#22C55E', desc: 'Working out or walking every day' },
  { name: 'No Mindless Scrolling', icon: Smartphone, current: 3, best: 14, color: '#A855F7', desc: 'No social media before work' },
  { name: 'Journaling', icon: PenLine, current: 22, best: 22, color: '#EAB308', desc: 'Writing thoughts and goals daily' },
  { name: 'Learning', icon: BrainCircuit, current: 31, best: 45, color: '#F472B6', desc: 'Studying a new concept daily' },
];

export default function StreaksPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none min-h-screen pt-20 pb-28 md:pb-20">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">My Streaks</span>
          </div>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame size={24} className="text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">My Streaks</h1>
                <p className="text-[#555] text-sm">Habits and streaks I actively maintain.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {streaks.map((streak, i) => {
              const Icon = streak.icon;
              const pct = Math.min(100, Math.round((streak.current / streak.best) * 100));
              return (
                <motion.div key={streak.name}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#222] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${streak.color}15`, border: `1px solid ${streak.color}25` }}>
                        <Icon size={18} style={{ color: streak.color }} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{streak.name}</p>
                        <p className="text-[#555] text-xs">{streak.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Flame size={13} style={{ color: streak.color }} />
                        <span className="text-xl font-extrabold font-mono" style={{ color: streak.color }}>{streak.current}</span>
                      </div>
                      <p className="text-[#444] text-[10px]">best: {streak.best}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                      className="h-full rounded-full" style={{ background: streak.color }} />
                  </div>
                  <p className="text-[9px] text-[#333] mt-1.5 text-right font-medium">{pct}% of personal best</p>
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
