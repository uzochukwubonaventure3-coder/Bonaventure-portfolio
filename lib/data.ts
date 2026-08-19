export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸', name: 'English' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', name: 'German' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', name: 'French' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', name: 'Dutch' },
  { code: 'es', label: 'Español', flag: '🇪🇸', name: 'Spanish' },
  { code: 'pt', label: 'Português', flag: '🇵🇹', name: 'Portuguese' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', name: 'Japanese' },
  { code: 'zh', label: '中文', flag: '🇨🇳', name: 'Mandarin' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', name: 'Korean' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪', name: 'Swedish' },
];

export const TECH_BADGES = [
  { name: 'PHP',     icon: 'https://cdn.simpleicons.org/php/777BB4' },
  { name: 'Laravel', icon: 'https://cdn.simpleicons.org/laravel/FF2D20' },
  { name: 'Java',    icon: 'https://cdn.simpleicons.org/openjdk/ffffff' },
  { name: 'React',   icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'MySQL',   icon: 'https://cdn.simpleicons.org/mysql/4479A1' },
  { name: 'Docker',  icon: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'AWS',     icon: 'https://cdn.simpleicons.org/amazonwebservices/FF9900' },
  { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
];

export const STATS = [
  { value: '4.8+', label: 'Years of experience in software development' },
  { value: '25+',  label: 'Successful projects delivered' },
  { value: '55k+', label: 'Users impacted through my work' },
];

export const PROJECTS = [
  {
    id: 'proforms',
    title: 'Proforms',
    url: 'proforms.top',
    date: 'July 2025',
    tags: ['PHP', 'MySQL', 'Next.js', 'Redis', 'Docker'],
    description: 'Proforms is a dynamic form builder and data collection platform designed for rapid deployment. Built to streamline workflows, it enables users to create custom forms and manage submissions seamlessly.',
    image: '/projects/proforms.png',
    category: ['Backend', 'Fullstack'],
    link: '#',
  },
  {
    id: 'itrust',
    title: 'iTrust Rapid Logistics',
    url: 'itrustrapidlogistics.com',
    date: 'March 2026',
    tags: ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'AWS'],
    description: 'A high-performance shipment and logistics platform based in Nigeria, featuring real-time tracking, role-based dashboards, and pixel-perfect implementation of complex UI designs.',
    image: '/projects/itrust.png',
    category: ['Fullstack', 'Backend'],
    link: '#',
  },
  {
    id: 'edutech',
    title: 'EduReach LMS',
    url: 'edureach.ng',
    date: 'January 2026',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    description: 'A learning management system for African educators with offline-first capability and interactive assessments.',
    image: '/projects/edutech.png',
    category: ['Frontend', 'Fullstack'],
    link: '#',
  },
  {
    id: 'shopnaija',
    title: 'ShopNaija',
    url: 'shopnaija.com',
    date: 'October 2025',
    tags: ['Laravel', 'React', 'MySQL', 'Stripe'],
    description: 'A modern Nigerian e-commerce platform with real-time inventory, payment integration, and multi-vendor support.',
    image: '/projects/ecommerce.png',
    category: ['Fullstack', 'Frontend'],
    link: '#',
  },
];

export const EXPERIENCE = [
  {
    id: 1,
    title: 'SEO Specialist & WordPress Developer',
    company: 'The Heritage Times',
    type: 'Remote (Part-time Staff)',
    period: 'Mar 2026 – Present',
    badge: 'Current',
    logo: '',
    initials: 'HT',
    color: '#E63946',
    tags: ['SEO', 'WordPress', 'Search Console', 'Analytics', 'Performance'],
    bullets: [
      'Leading SEO strategies and optimization efforts to enhance search visibility and drive organic traffic.',
      'Developing and maintaining the platform\'s digital presence as a WordPress Developer, ensuring a robust and user-friendly experience.',
      'Analyzing performance metrics to refine content strategy and improve technical SEO across the platform.',
      'Implementing best practices for on-page and off-page SEO to ensure high ranking in search engine results.',
    ],
  },
  {
    id: 2,
    title: 'Technical Team Lead & Backend Developer',
    company: 'MVP Ginger',
    type: 'Remote (Full-stack)',
    period: 'Nov 2025 – Present',
    badge: 'Current',
    logo: '',
    initials: 'MG',
    color: '#F97316',
    tags: ['Laravel', 'Team Leadership', 'Mentorship', 'Backend Architecture'],
    bullets: [
      'Serving as Technical Team Lead, orchestrating development efforts and ensuring high-quality Laravel-based backend solutions.',
      'Organizing project workflows and mentoring/training interns to foster a high-performing engineering culture.',
      'Architecting scalable backend systems and overseeing the technical direction for platform features.',
      'Collaborating with cross-functional teams to streamline delivery and maintain architectural integrity.',
    ],
  },
  {
    id: 3,
    title: 'Full Stack Laravel Developer',
    company: 'Gphoneix Technologies',
    type: 'Remote (Part-time)',
    period: 'Jan 2025 – Sep 2025',
    badge: '9 months',
    logo: '',
    initials: 'GP',
    color: '#6366F1',
    tags: ['Laravel', 'PHP', 'MySQL', 'React', 'AWS'],
    bullets: [
      'Led full-stack development initiatives using the Laravel ecosystem to deliver high-performance, scalable web solutions.',
      'Built and maintained robust backend architectures while ensuring seamless frontend integration.',
      'Implemented CI/CD pipelines and containerized deployments using Docker and AWS.',
    ],
  },
];

// Tech stack with real CDN icon URLs (simpleicons.org)
export const TECH_STACK = {
  FRONTEND: [
    { name: 'Vue.js',         icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
    { name: 'Tailwind CSS',   icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
    { name: 'React',          icon: 'https://cdn.simpleicons.org/react/61DAFB' },
    { name: 'Next.js',        icon: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
    { name: 'TypeScript',     icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
    { name: 'Framer Motion',  icon: 'https://cdn.simpleicons.org/framer/ffffff' },
    { name: 'Figma',          icon: 'https://cdn.simpleicons.org/figma/F24E1E' },
    { name: 'WordPress',      icon: 'https://cdn.simpleicons.org/wordpress/21759B' },
  ],
  BACKEND: [
    { name: 'Laravel', icon: 'https://cdn.simpleicons.org/laravel/FF2D20' },
    { name: 'PHP',     icon: 'https://cdn.simpleicons.org/php/777BB4' },
    { name: 'Java',    icon: 'https://cdn.simpleicons.org/openjdk/ffffff' },
    { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  ],
  MOBILE: [
    { name: 'React Native', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  ],
  DATABASE: [
    { name: 'Redis',      icon: 'https://cdn.simpleicons.org/redis/DC382D' },
    { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
    { name: 'MySQL',      icon: 'https://cdn.simpleicons.org/mysql/4479A1' },
    { name: 'MongoDB',    icon: 'https://cdn.simpleicons.org/mongodb/47A248' },
  ],
  DEVOPS: [
    { name: 'Git',            icon: 'https://cdn.simpleicons.org/git/F05032' },
    { name: 'GitHub Actions', icon: 'https://cdn.simpleicons.org/githubactions/2088FF' },
    { name: 'Docker',         icon: 'https://cdn.simpleicons.org/docker/2496ED' },
    { name: 'AWS',            icon: 'https://cdn.simpleicons.org/amazonwebservices/FF9900' },
    { name: 'Linux',          icon: 'https://cdn.simpleicons.org/linux/FCC624' },
  ],
};

export const TESTIMONIALS = [
  {
    id: 1,
    quote: 'I needed a premium executive portfolio that reflected my 20+ years in the energy sector. Bonaventure delivered beyond expectations — a stunning Next.js website with smooth animations that perfectly captures my professional journey. Truly world-class work.',
    name: 'Dr. Ugo Okafor',
    title: 'Founder & CEO, SunTrust Atlantic Energies',
    avatar: '👨‍💼',
    initials: 'UO',
  },
  {
    id: 2,
    quote: 'Bonaventure built our logistics platform from scratch in record time. The real-time tracking system works flawlessly and our clients love the clean UI. He communicates clearly, hits deadlines, and the code quality is exceptional.',
    name: 'Mrs. Adaeze Nwosu',
    title: 'Operations Director, iTrust Rapid Logistics',
    avatar: '👩‍💼',
    initials: 'AN',
  },
  {
    id: 3,
    quote: 'Working with Bonaventure on our LMS was a game-changer. He understood our vision immediately and turned complex requirements into an intuitive platform. The backend architecture is solid — it has scaled to 10,000+ users without a hitch.',
    name: 'Mr. Seun Adewale',
    title: 'CEO, EduReach Nigeria',
    avatar: '👨‍🏫',
    initials: 'SA',
  },
  {
    id: 4,
    quote: 'The best developer I have worked with. Fast delivery, clean code, perfect communication. Our e-commerce platform has seen a 300% increase in organic traffic thanks to his SEO optimization.',
    name: 'Fatima Al-Hassan',
    title: 'Founder, ShopNaija',
    avatar: '👩‍💻',
    initials: 'FA',
  },
  {
    id: 5,
    quote: 'Bonaventure led our backend team with professionalism and technical excellence. He mentored junior developers while architecting our core systems. Rare to find someone who can do both at such a high level.',
    name: 'James Okonkwo',
    title: 'CTO, MVP Ginger',
    avatar: '👨‍💻',
    initials: 'JO',
  },
];

export const NAV_LINKS = [
  { label: 'Home',  href: '/' },
  { label: 'Work',  href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Blog',  href: '/blog' },
];

export const FOOTER_LINKS = {
  GENERAL:   ['Home', 'About Me', 'Projects', 'Blog', 'Videos'],
  WORK:      ['Products', 'Hosting Guide', 'Hire Me', 'Experience', 'Start a Project', 'Book a Consultation', 'Refer & Earn 10%'],
  COMMUNITY: ['Testimonials', 'Report a Bug', 'GitHub', 'LinkedIn', 'Twitter / X'],
  LEGAL:     ['Privacy Policy', 'Terms of Service', 'Refund Policy'],
};
