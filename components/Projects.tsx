'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/data';

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="project-card group"
    >
      {/* Screenshot preview */}
      <div className="relative h-52 bg-[#0D0D0D] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Placeholder browser mockup */}
          <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#222]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <div className="flex-1 mx-2 h-4 bg-[#222] rounded text-[9px] flex items-center px-2 text-[#555] font-mono">
                {project.url}
              </div>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-2">
              <div className="h-6 bg-[#222] rounded w-3/4" />
              <div className="h-3 bg-[#1A1A1A] rounded w-full" />
              <div className="h-3 bg-[#1A1A1A] rounded w-5/6" />
              <div className="h-3 bg-[#1A1A1A] rounded w-4/6" />
              <div className="mt-2 flex gap-2">
                <div className="h-7 bg-[#F97316]/20 border border-[#F97316]/30 rounded px-3 flex items-center">
                  <span className="text-[9px] text-[#F97316]">View API Docs</span>
                </div>
                <div className="h-7 bg-[#222] rounded px-3 flex items-center">
                  <span className="text-[9px] text-[#555]">Learn More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
          <a href={project.link} className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-[#F97316] transition-colors">
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-white text-lg mb-1">{project.title}</h3>
        <p className="text-[#555] text-sm mb-3">{project.date}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          {project.tags.length > 3 && (
            <span className="tag-pill">+{project.tags.length - 3}</span>
          )}
        </div>

        <p className="text-[#666] text-sm leading-relaxed mb-4">{project.description}</p>

        <a
          href={project.link}
          className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#F97316] transition-colors group/link"
        >
          View Project
          <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
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
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold text-white section-title">Featured Projects</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {PROJECTS.slice(0, 2).map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}

        {/* View All Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden md:flex flex-col items-end justify-center absolute -right-48 top-1/2 -translate-y-1/2"
        >
          <div className="text-right">
            <p className="text-[#555] text-xs uppercase tracking-widest mb-2">VIEW PROJECTS</p>
            <Link href="/work">
              <span className="text-7xl font-bold text-white hover:text-[#F97316] transition-colors cursor-pointer">
                +15
              </span>
            </Link>
            <Link
              href="/work"
              className="flex items-center justify-end gap-2 mt-3 text-[#888] hover:text-[#F97316] text-sm transition-colors"
            >
              Explore All Projects
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Mobile view all */}
      <div className="md:hidden mt-6 text-center">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#F97316] text-[#F97316] text-sm font-semibold hover:bg-[#F97316] hover:text-white transition-all"
        >
          Explore All Projects (+15)
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
