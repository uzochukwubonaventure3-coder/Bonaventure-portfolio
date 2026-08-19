'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="back-top-btn"
          aria-label="Back to top"
        >
          <ArrowUp size={14} />
          <span className="hidden sm:inline">Back to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Don't show custom cursor on touch/mobile devices
    setIsMobile('ontouchstart' in window || window.innerWidth < 768);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => setRing({ x: e.clientX, y: e.clientY }), 80);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Don't render custom cursor on mobile
  if (isMobile) return null;

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          transform: clicking ? 'scale(2)' : 'scale(1)',
        }}
      />
      <div
        className="cursor-ring"
        style={{
          left: ring.x - 16,
          top: ring.y - 16,
          transform: clicking ? 'scale(0.8)' : 'scale(1)',
        }}
      />
    </>
  );
}
