'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface RobotProps {
  className?: string;
}

export default function Robot({ className = '' }: RobotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [headAngle, setHeadAngle] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 300;
      const factor = Math.min(dist, maxDist) / maxDist;
      setEyeOffset({
        x: (dx / Math.max(dist, 1)) * factor * 5,
        y: (dy / Math.max(dist, 1)) * factor * 4,
      });
      setHeadAngle(Math.max(-18, Math.min(18, dx / 30)));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto blink
  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
      setTimeout(blink, 2000 + Math.random() * 3000);
    };
    const t = setTimeout(blink, 2000);
    return () => clearTimeout(t);
  }, []);

  // Wave on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setWaving(true);
      setTimeout(() => setWaving(false), 2000);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      {/* Glow rings */}
      <div className="absolute inset-0 rounded-full bg-[#F97316]/8 blur-3xl animate-pulse-slow" />
      <div className="absolute w-[280px] h-[280px] rounded-full border border-[#F97316]/10 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute w-[320px] h-[320px] rounded-full border border-[#F97316]/5" />

      <motion.svg
        width="280"
        height="360"
        viewBox="0 0 280 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Head group — rotates with mouse */}
        <motion.g
          animate={{ rotate: headAngle }}
          style={{ originX: '140px', originY: '180px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {/* Antenna pole */}
          <rect x="137" y="28" width="6" height="38" rx="3" fill="#2A2A2A" />
          {/* Antenna tip */}
          <motion.circle cx="140" cy="22" r="9" fill="#F97316"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <circle cx="140" cy="22" r="5" fill="#FFB347" />

          {/* Head */}
          <rect x="68" y="66" width="144" height="116" rx="22" fill="#1A1A1A" stroke="#2E2E2E" strokeWidth="1.5" />
          <rect x="76" y="72" width="128" height="4" rx="2" fill="#2A2A2A" opacity="0.6" />

          {/* Screen panel */}
          <rect x="80" y="82" width="120" height="84" rx="14" fill="#0D0D0D" stroke="#222" strokeWidth="1" />

          {/* Eye sockets */}
          <circle cx="112" cy="124" r="22" fill="#111" />
          <circle cx="168" cy="124" r="22" fill="#111" />
          <circle cx="112" cy="124" r="16" fill="#1E1E1E" />
          <circle cx="168" cy="124" r="16" fill="#1E1E1E" />

          {/* Eyes — blink or track */}
          {blinking ? (
            <>
              <rect x="99" y="122" width="26" height="4" rx="2" fill="#F97316" />
              <rect x="155" y="122" width="26" height="4" rx="2" fill="#F97316" />
            </>
          ) : (
            <>
              <circle cx={112 + eyeOffset.x} cy={124 + eyeOffset.y} r="8" fill="#F97316" />
              <circle cx={168 + eyeOffset.x} cy={124 + eyeOffset.y} r="8" fill="#F97316" />
              <circle cx={114 + eyeOffset.x} cy={122 + eyeOffset.y} r="3" fill="#FFD580" opacity="0.8" />
              <circle cx={170 + eyeOffset.x} cy={122 + eyeOffset.y} r="3" fill="#FFD580" opacity="0.8" />
            </>
          )}

          {/* Smile */}
          <path d="M118 152 Q140 164 162 152" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Ear bolts */}
          <circle cx="68" cy="120" r="8" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5" />
          <circle cx="68" cy="120" r="4" fill="#F97316" opacity="0.6" />
          <circle cx="212" cy="120" r="8" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5" />
          <circle cx="212" cy="120" r="4" fill="#F97316" opacity="0.6" />

          {/* Status dots */}
          <circle cx="90" cy="89" r="3" fill="#22C55E" />
          <circle cx="100" cy="89" r="3" fill="#F97316" />
          <circle cx="110" cy="89" r="3" fill="#EF4444" />
        </motion.g>

        {/* Body */}
        <rect x="80" y="192" width="120" height="110" rx="18" fill="#161616" stroke="#222" strokeWidth="1.5" />
        <rect x="80" y="200" width="120" height="2" rx="1" fill="#F97316" opacity="0.3" />
        <rect x="100" y="210" width="80" height="50" rx="10" fill="#0D0D0D" stroke="#1E1E1E" strokeWidth="1" />

        {/* Chest LEDs */}
        <motion.circle cx="120" cy="228" r="5" fill="#F97316"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.circle cx="140" cy="228" r="5" fill="#22C55E"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle cx="160" cy="228" r="5" fill="#3B82F6"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
        />

        {/* Chest progress bar */}
        <rect x="108" y="244" width="64" height="6" rx="3" fill="#1A1A1A" />
        <motion.rect x="108" y="244" height="6" rx="3" fill="#F97316"
          animate={{ width: [20, 60, 35, 64, 40] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Left arm — waves on mount */}
        <motion.g
          animate={waving ? { rotate: [-20, 30, -20, 30, -10, 0] } : { rotate: 0 }}
          style={{ originX: '60px', originY: '210px' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <rect x="44" y="196" width="32" height="80" rx="14" fill="#161616" stroke="#222" strokeWidth="1.5" />
          <circle cx="60" cy="288" r="14" fill="#1A1A1A" stroke="#222" strokeWidth="1.5" />
          <circle cx="54" cy="282" r="4" fill="#2A2A2A" />
          <circle cx="66" cy="282" r="4" fill="#2A2A2A" />
          <circle cx="60" cy="292" r="4" fill="#2A2A2A" />
        </motion.g>

        {/* Right arm */}
        <rect x="204" y="196" width="32" height="80" rx="14" fill="#161616" stroke="#222" strokeWidth="1.5" />
        <circle cx="220" cy="288" r="14" fill="#1A1A1A" stroke="#222" strokeWidth="1.5" />
        <circle cx="214" cy="282" r="4" fill="#2A2A2A" />
        <circle cx="226" cy="282" r="4" fill="#2A2A2A" />
        <circle cx="220" cy="292" r="4" fill="#2A2A2A" />

        {/* Legs */}
        <rect x="100" y="308" width="32" height="44" rx="14" fill="#161616" stroke="#222" strokeWidth="1.5" />
        <rect x="148" y="308" width="32" height="44" rx="14" fill="#161616" stroke="#222" strokeWidth="1.5" />

        {/* Feet */}
        <rect x="92" y="346" width="48" height="14" rx="7" fill="#1A1A1A" stroke="#222" strokeWidth="1.5" />
        <rect x="140" y="346" width="48" height="14" rx="7" fill="#1A1A1A" stroke="#222" strokeWidth="1.5" />
      </motion.svg>

      {/* Floating code badges */}
      <motion.div
        className="absolute -right-2 top-12 text-[10px] font-mono text-[#F97316]/60 bg-[#111]/80 border border-[#F97316]/10 rounded-lg px-2 py-1"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {'</>'}
      </motion.div>
      <motion.div
        className="absolute -left-4 bottom-20 text-[10px] font-mono text-[#22C55E]/60 bg-[#111]/80 border border-[#22C55E]/10 rounded-lg px-2 py-1"
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {'{ }'}
      </motion.div>
      <motion.div
        className="absolute -right-6 bottom-24 text-[9px] font-mono text-[#3B82F6]/60 bg-[#111]/80 border border-[#3B82F6]/10 rounded-lg px-2 py-1"
        animate={{ y: [-3, 5, -3] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        npm run dev
      </motion.div>
    </div>
  );
}
