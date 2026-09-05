import { ArrowLeft, ArrowRight, ExternalLink, Rocket } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import { hasDatabaseEnv, prisma } from '@/lib/prisma';
import { PROJECTS } from '@/lib/data';

type Project = typeof PROJECTS[number] & { slug: string };

async function getProject(slug: string): Promise<Project | null> {
  if (hasDatabaseEnv()) {
    try {
      const project = await prisma.project.findFirst({ where: { published: true, OR: [{ slug }, { id: slug }] } });
      if (project) {
        return {
          id: project.id,
          slug: project.slug,
          title: project.title,
          url: project.url || '',
          date: project.date || '',
          tags: project.tags,
          description: project.description,
          image: project.imageUrl || '',
          category: project.categories,
          link: project.liveUrl || project.githubUrl || '#',
        };
      }
    } catch (error) {
      console.warn('Project lookup unavailable; using fallback project data.', error instanceof Error ? error.message : error);
    }
  }

  const fallback = PROJECTS.find(project => project.id === slug);
  return fallback ? { ...fallback, slug: fallback.id } : null;
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const visitUrl = project.link !== '#' ? project.link : project.url ? `https://${project.url}` : null;

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-[#777] hover:text-[#F97316] transition-colors mb-8">
            <ArrowLeft size={15} /> Back to work
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_306px] gap-8 items-start">
            <article>
              <div className="relative aspect-video bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden mb-10">
                {project.image ? (
                  <img src={project.image} alt={`${project.title} project screenshot`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#555]">No project image available</div>
                )}
              </div>

              <p className="text-[#F97316] text-xs font-bold uppercase tracking-[0.2em] mb-3">Case Study</p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-3">{project.title}</h1>
              <p className="text-[#666] text-sm mb-8">{project.date}</p>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-white mb-4">Case Study: {project.title} Architecture</h2>
                <p className="text-[#777] leading-relaxed text-base mb-6">{project.description}</p>
                <p className="text-[#777] leading-relaxed text-base">
                  This project was designed and implemented as a focused production experience, balancing a clear user journey with maintainable engineering foundations and room to scale.
                </p>
              </div>
            </article>

            <aside className="lg:sticky lg:top-28 bg-[#111] border border-[#242424] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-1">{project.title}</h2>
              <p className="text-[#666] text-sm mb-7">{project.date}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.category.map(category => <span key={category} className="tag-pill">{category}</span>)}
              </div>

              <h3 className="text-sm font-semibold text-white mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2 mb-10">
                {project.tags.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
              </div>

              {visitUrl ? (
                <a href={visitUrl} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-4 py-3 text-sm font-bold text-black hover:bg-[#FB923C] transition-colors">
                  <ExternalLink size={16} /> Visit Project <ArrowRight size={15} />
                </a>
              ) : (
                <span className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A2A2A] px-4 py-3 text-sm font-bold text-[#777]">
                  <Rocket size={16} /> Project link unavailable
                </span>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
