'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, Rocket } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import { PROJECTS } from '@/lib/data';

const CATEGORIES = [
  { label: 'All projects', count: 17 },
  { label: 'Frontend', count: 9 },
  { label: 'Backend', count: 3 },
  { label: 'Fullstack', count: 12 },
  { label: 'SEO', count: 2 },
  { label: 'WordPress', count: 1 },
  { label: 'Mobile', count: 1 },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="project-card group"
    >
      <Link href={`/work/${project.id}`} className="relative block h-52 bg-[#0D0D0D] overflow-hidden">
        {project.image ? (
          <img src={project.image} alt={`${project.title} project preview`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#444]">No preview available</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white">
            <ExternalLink size={13} />
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/work/${project.id}`} className="font-bold text-white text-lg mb-0.5 hover:text-[#F97316] transition-colors block">{project.title}</Link>
        <p className="text-[#555] text-sm mb-3">{project.date}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          {project.tags.length > 3 && <span className="tag-pill">+{project.tags.length - 3}</span>}
        </div>
        <p className="text-[#666] text-sm leading-relaxed mb-4">{project.description}</p>
        <Link href={`/work/${project.id}`} className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#F97316] transition-colors group/btn">
          View Project
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState('All projects');
  const [projects, setProjects] = useState<typeof PROJECTS>(PROJECTS);

  useEffect(() => {
    fetch('/api/projects?limit=100')
      .then(r => r.json())
      .then(d => {
        if (!Array.isArray(d.data)) return;
        setProjects(d.data.map((project: any) => ({
          id: project.id,
          title: project.title,
          url: project.url || '',
          date: project.date || '',
          tags: project.tags || [],
          description: project.description || '',
          image: project.imageUrl || '',
          category: project.categories || [],
          link: project.liveUrl || project.githubUrl || '#',
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = activeCategory === 'All projects'
    ? projects
    : projects.filter(p => p.category.includes(activeCategory));

  const categories = [
    { label: 'All projects', count: projects.length },
    ...Array.from(new Set(projects.flatMap(project => project.category))).map(label => ({
      label,
      count: projects.filter(project => project.category.includes(label)).length,
    })),
  ];

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-52 shrink-0">
              <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-4 sticky top-28">
                <p className="text-[10px] uppercase tracking-widest text-[#444] mb-3 px-2">Categories</p>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => setActiveCategory(cat.label)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                        activeCategory === cat.label
                          ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20'
                          : 'text-[#666] hover:text-white hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                        activeCategory === cat.label ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-[#1A1A1A] text-[#555]'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Have a new idea? */}
                <div className="mt-6 pt-4 border-t border-[#1A1A1A]">
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket size={16} className="text-[#F97316]" />
                    <p className="text-sm font-semibold text-white">Have a new idea?</p>
                  </div>
                  <p className="text-xs text-[#555] leading-relaxed mb-3">
                    I&apos;m always open to new projects. Let&apos;s build something amazing together.
                  </p>
                  <a
                    href="https://wa.me/2349049269679"
                    className="flex items-center gap-1 text-xs text-[#F97316] font-semibold hover:gap-2 transition-all"
                  >
                    Start a project <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </aside>

            {/* Projects Grid */}
            <div className="flex-1">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-[#444]">
                  <p className="text-5xl mb-4">🛸</p>
                  <p>No projects in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
