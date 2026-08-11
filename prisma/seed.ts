import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin account
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  await prisma.admin.upsert({
    where: { email: 'bonaventurechidalu@gmail.com' },
    update: {},
    create: {
      email: 'bonaventurechidalu@gmail.com',
      password: hashedPassword,
      name: 'Bonaventure Chidalu',
    },
  });
  console.log('✅ Admin created — email: bonaventurechidalu@gmail.com | password: Admin@123');

  // Sample projects
  await prisma.project.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Proforms',
        slug: 'proforms',
        url: 'proforms.top',
        date: 'July 2025',
        description: 'Proforms is a dynamic form builder and data collection platform designed for rapid deployment. Built to streamline workflows, it enables users to create custom forms and manage submissions seamlessly.',
        tags: ['PHP', 'MySQL', 'Next.js', 'Redis', 'Docker'],
        categories: ['Backend', 'Fullstack'],
        featured: true,
        order: 1,
      },
      {
        title: 'iTrust Rapid Logistics',
        slug: 'itrust-rapid-logistics',
        url: 'itrustrapidlogistics.com',
        date: 'March 2026',
        description: 'A high-performance shipment and logistics platform based in Nigeria, featuring real-time tracking, role-based dashboards, and pixel-perfect implementation of complex UI designs.',
        tags: ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'AWS'],
        categories: ['Fullstack', 'Backend'],
        featured: true,
        order: 2,
      },
    ],
  });

  // Sample experience
  await prisma.experience.createMany({
    skipDuplicates: false,
    data: [
      {
        title: 'SEO Specialist & WordPress Developer',
        company: 'The Heritage Times',
        type: 'Remote (Part-time Staff)',
        period: 'Mar 2026 – Present',
        badge: 'Current',
        initials: 'HT',
        color: '#E63946',
        current: true,
        tags: ['SEO', 'WordPress', 'Search Console', 'Analytics'],
        bullets: [
          'Leading SEO strategies and optimization efforts to enhance search visibility and drive organic traffic.',
          'Developing and maintaining the platform\'s digital presence as a WordPress Developer.',
          'Analyzing performance metrics to refine content strategy and improve technical SEO across the platform.',
        ],
        order: 1,
      },
      {
        title: 'Technical Team Lead & Backend Developer',
        company: 'MVP Ginger',
        type: 'Remote (Full-stack)',
        period: 'Nov 2025 – Present',
        badge: 'Current',
        initials: 'MG',
        color: '#F97316',
        current: true,
        tags: ['Laravel', 'Team Leadership', 'Mentorship', 'Backend Architecture'],
        bullets: [
          'Serving as Technical Team Lead, orchestrating development efforts and ensuring high-quality Laravel-based backend solutions.',
          'Organizing project workflows and mentoring/training interns to foster a high-performing engineering culture.',
          'Architecting scalable backend systems and overseeing the technical direction.',
        ],
        order: 2,
      },
    ],
  });

  // Sample testimonial
  await prisma.testimonial.create({
    data: {
      quote: 'I needed a premium executive portfolio that reflected my 20+ years in the energy sector. Bonaventure delivered beyond expectations — a stunning Next.js website with smooth animations that perfectly captures my professional journey.',
      name: 'Dr. Ugo Okafor',
      title: 'Founder & CEO, SunTrust Atlantic Energies',
      initials: 'UO',
      approved: true,
      featured: true,
      order: 1,
    },
  });

  // Site settings
  const settings = [
    { key: 'hero_name', value: 'Bonaventure Chidalu' },
    { key: 'hero_bio', value: 'Full-stack software engineer with experience in backend architecture, web development, and system scalability.' },
    { key: 'hero_location', value: 'FCT Abuja, Nigeria' },
    { key: 'stat_years', value: '4.8+' },
    { key: 'stat_projects', value: '25+' },
    { key: 'stat_users', value: '55k+' },
    { key: 'whatsapp', value: '2349064779856' },
    { key: 'email', value: 'bonaventurechidalu@gmail.com' },
    { key: 'github', value: 'https://github.com/bonaventurechidalu' },
    { key: 'linkedin', value: 'https://linkedin.com/in/bonaventurechidalu' },
    { key: 'twitter', value: 'https://twitter.com/bonaventurechidalu' },
    { key: 'available_for_work', value: 'true' },
    { key: 'resume_url', value: '' },
  ];

  for (const s of settings) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('🔐 Admin login: bonaventurechidalu@gmail.com / Admin@123');
  console.log('⚠️  Change your password after first login!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
