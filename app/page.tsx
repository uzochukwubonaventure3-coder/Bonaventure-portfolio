import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import BentoGrid from '@/components/BentoGrid';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import { prisma, hasDatabaseEnv } from '@/lib/prisma';
import { PROJECTS, EXPERIENCE, TECH_STACK, TESTIMONIALS, STATS, TECH_BADGES } from '@/lib/data';

export const dynamic = 'force-dynamic';

async function getHomepageData() {
  if (!hasDatabaseEnv()) return { projects: PROJECTS, experience: EXPERIENCE, techStack: TECH_STACK, testimonials: TESTIMONIALS, stats: STATS, techBadges: TECH_BADGES };

  try {
    const [projects, experience, techSkills, testimonials, settings] = await Promise.all([
      prisma.project.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.techSkill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }),
      prisma.testimonial.findMany({ where: { approved: true, featured: true }, orderBy: { order: 'asc' } }),
      prisma.siteSettings.findMany(),
    ]);

    const settingsMap = Object.fromEntries(settings.map(setting => [setting.key, setting.value]));
    const techStack = { FRONTEND: [], BACKEND: [], MOBILE: [], DATABASE: [], DEVOPS: [] } as typeof TECH_STACK;
    techSkills.forEach(skill => {
      const category = skill.category.toUpperCase() as keyof typeof techStack;
      if (category in techStack) techStack[category].push({ name: skill.name, icon: skill.icon });
    });

    return {
      projects: projects.length ? projects.map(project => ({
        id: project.id,
        title: project.title,
        url: project.url || '',
        date: project.date || '',
        tags: project.tags,
        description: project.description,
        image: project.imageUrl || '',
        category: project.categories,
        link: project.liveUrl || project.githubUrl || '#',
      })) : PROJECTS,
      experience: experience.length ? experience.map((item, index) => ({
        id: index,
        title: item.title,
        company: item.company,
        type: item.type,
        period: item.period,
        badge: item.badge || (item.current ? 'Current' : ''),
        logo: '',
        initials: item.initials,
        color: item.color,
        tags: item.tags,
        bullets: item.bullets,
      })) : EXPERIENCE,
      techStack,
      testimonials: testimonials.length ? testimonials.map((testimonial, index) => ({
        id: index,
        quote: testimonial.quote,
        name: testimonial.name,
        title: testimonial.title,
        avatar: testimonial.avatarUrl || '',
        initials: testimonial.initials,
      })) : TESTIMONIALS,
      stats: [
        { value: settingsMap.stat_experience || STATS[0].value, label: STATS[0].label },
        { value: settingsMap.stat_projects || STATS[1].value, label: STATS[1].label },
        { value: settingsMap.stat_users || STATS[2].value, label: STATS[2].label },
      ],
      techBadges: techSkills.slice(0, 8).map(skill => ({ name: skill.name, icon: '' })),
    };
  } catch (error) {
    console.error('Failed to load homepage data:', error);
    return { projects: PROJECTS, experience: EXPERIENCE, techStack: TECH_STACK, testimonials: TESTIMONIALS, stats: STATS, techBadges: TECH_BADGES };
  }
}

export default async function Home() {
  const data = await getHomepageData();

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none">
        <Hero stats={data.stats} techBadges={data.techBadges} />
        <Projects projects={data.projects} />
        <BentoGrid />
        <Experience experience={data.experience} />
        <TechStack techStack={data.techStack} />
        <Testimonials testimonials={data.testimonials} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
