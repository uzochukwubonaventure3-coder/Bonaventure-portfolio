'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/data';

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="project-card group"
    >
      {/* Screenshot */}
      <div className="relative h-52 bg-[#0D0D0D] overflow-hidden">
        <div className="absolute inset-0 flex flex-col">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#1A1A1A] shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-2 h-4 bg-[#1A1A1A] rounded text-[9px] flex items-center px-2 text-[#555] font-mono">
              {project.url}
            </div>
          </div>
          {/* Mock content */}
          <div className="flex-1 p-3 flex flex-col gap-2">
            <div className="h-5 bg-[#1A1A1A] rounded w-3/4" />
            <div className="h-3 bg-[#161616] rounded w-full" />
            <div className="h-3 bg-[#161616] rounded w-5/6" />
            <div className="h-3 bg-[#161616] rounded w-4/6" />
            <div className="flex-1 bg-[#141414] rounded-lg mt-1" />
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-[#F97316] transition-colors cursor-pointer">
            <ExternalLink size={13} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-white text-lg mb-1">{project.title}</h3>
        <p className="text-[#555] text-sm mb-3">{project.date}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          {project.tags.length > 3 && <span className="tag-pill">+{project.tags.length - 3}</span>}
        </div>
        <p className="text-[#666] text-sm leading-relaxed mb-4">{project.description}</p>
        <a href={project.link}
          className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#F97316] transition-colors group/link">
          View Project →
        </a>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="projects" className="section max-w-7xl mx-auto px-6 lg:px-8">
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }} className="mb-10">
        <h2 className="text-3xl font-bold text-white section-title">Featured Projects</h2>
      </motion.div>

      {/* ── DESKTOP: 2 cards + +15 panel on right ── */}
      <div className="hidden md:block">
        <div className="flex items-stretch gap-6">
          {/* Two cards */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {PROJECTS.slice(0, 2).map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* +15 panel — right side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center w-40 shrink-0 text-center"
          >
            <p className="text-[#555] text-[10px] uppercase tracking-widest mb-2">VIEW PROJECTS</p>
            <Link href="/work">
              <span className="text-6xl font-bold text-white hover:text-[#F97316] transition-colors cursor-pointer block leading-none">
                +15
              </span>
            </Link>
            <Link href="/work"
              className="flex items-center justify-center gap-1.5 mt-4 text-[#888] hover:text-[#F97316] text-sm transition-colors">
              Explore All<br />Projects
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE: single column cards + full-width +15 section ── */}
      <div className="md:hidden space-y-5">
        {PROJECTS.slice(0, 2).map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}

        {/* +15 card — full width on mobile (like Image 5) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-10 text-center"
        >
          <p className="text-[#555] text-xs uppercase tracking-widest mb-3">VIEW PROJECTS</p>
          <Link href="/work">
            <p className="text-6xl font-bold text-white hover:text-[#F97316] transition-colors">+15</p>
          </Link>
          <Link href="/work"
            className="inline-flex items-center gap-2 mt-4 text-[#888] hover:text-[#F97316] text-sm transition-colors">
            Explore All Projects <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
