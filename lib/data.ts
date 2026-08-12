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
  { name: 'PHP', icon: '/icons/php.svg' },
  { name: 'Laravel', icon: '/icons/laravel.svg' },
  { name: 'Java', icon: '/icons/java.svg' },
  { name: 'React', icon: '/icons/react.svg' },
  { name: 'MySQL', icon: '/icons/mysql.svg' },
  { name: 'Docker', icon: '/icons/docker.svg' },
  { name: 'AWS', icon: '/icons/aws.svg' },
  { name: 'Next.js', icon: '/icons/nextdotjs.svg' },
];

export const STATS = [
  { value: '4.8+', label: 'Years of experience in software development' },
  { value: '25+', label: 'Successful projects delivered' },
  { value: '55k+', label: 'Users impacted through my work' },
];

export const PROJECTS = [
  {
    id: 'proforms',
    title: 'Proforms',
    url: 'proforms.top',
    date: 'July 2025',
    tags: ['PHP', 'MySQL', 'Next.js', 'Redis', 'Docker'],
    description:
      'Proforms is a dynamic form builder and data collection platform designed for rapid deployment. Built to streamline workflows, it enables users to create custom forms and manage submissions seamlessly.',
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
    description:
      'A high-performance shipment and logistics platform based in Nigeria, featuring real-time tracking, role-based dashboards, and pixel-perfect implementation of complex UI designs.',
    image: '/projects/itrust.png',
    category: ['Fullstack', 'Backend'],
    link: '#',
  },
  {
    id: 'ecommerce',
    title: 'ShopNaija',
    url: 'shopnaija.com',
    date: 'October 2025',
    tags: ['Laravel', 'React', 'MySQL', 'Stripe'],
    description:
      'A modern Nigerian e-commerce platform with real-time inventory, payment integration, and multi-vendor support.',
    image: '/projects/ecommerce.png',
    category: ['Fullstack', 'Frontend'],
    link: '#',
  },
  {
    id: 'edutech',
    title: 'EduReach LMS',
    url: 'edureach.ng',
    date: 'January 2026',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    description:
      'A learning management system for African educators with offline-first capability and interactive assessments.',
    image: '/projects/edutech.png',
    category: ['Frontend', 'Fullstack'],
    link: '#',
  },
  {
    id: 'fintech',
    title: 'PayStack Clone',
    url: 'payclone.dev',
    date: 'December 2024',
    tags: ['PHP', 'Laravel', 'Vue.js', 'Redis'],
    description:
      'A fintech payment processing API clone built for learning with full transaction history and webhooks.',
    image: '/projects/fintech.png',
    category: ['Backend'],
    link: '#',
  },
  {
    id: 'realestate',
    title: 'HouseMate NG',
    url: 'housemateng.com',
    date: 'August 2025',
    tags: ['Next.js', 'TypeScript', 'MySQL', 'Google Maps'],
    description:
      'Real estate platform for Nigerian property listings with geolocation search and landlord/tenant dashboards.',
    image: '/projects/realestate.png',
    category: ['Frontend', 'Fullstack'],
    link: '#',
  },
  {
    id: 'wordpress1',
    title: 'Heritage Times',
    url: 'heritagetimes.ng',
    date: 'March 2026',
    tags: ['WordPress', 'SEO', 'PHP'],
    description:
      'Digital news platform built on WordPress with advanced SEO optimization and custom theme development.',
    image: '/projects/heritage.png',
    category: ['WordPress', 'SEO'],
    link: '#',
  },
  {
    id: 'mobile1',
    title: 'FoodRunner App',
    url: 'foodrunner.app',
    date: 'February 2026',
    tags: ['React Native', 'Node.js', 'MongoDB'],
    description:
      'Cross-platform food delivery mobile app with real-time order tracking, push notifications, and driver management.',
    image: '/projects/foodrunner.png',
    category: ['Mobile'],
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
    logo: '/logos/heritage.png',
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
    logo: '/logos/mvpginger.png',
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
    logo: '/logos/gphoneix.png',
    initials: 'GP',
    color: '#6366F1',
    tags: ['Laravel', 'PHP', 'MySQL', 'React', 'AWS'],
    bullets: [
      'Leading full-stack development initiatives using the Laravel ecosystem to deliver high-performance, scalable web solutions.',
      'Building and maintaining robust backend architectures while ensuring seamless frontend integration.',
      'Collaborating with product teams to define technical requirements and deliver features on schedule.',
      'Implementing CI/CD pipelines and containerized deployments using Docker and AWS.',
    ],
  },
];

export const TECH_STACK = {
  FRONTEND: [
    { name: 'Vue.js', icon: '🟢' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'React', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'Framer Motion', icon: '🎞' },
    { name: 'Figma', icon: '🎯' },
    { name: 'WordPress', icon: '🔵' },
  ],
  BACKEND: [
    { name: 'Laravel', icon: '🔴' },
    { name: 'PHP', icon: '🐘' },
    { name: 'Java', icon: '☕' },
    { name: 'Node.js', icon: '🟩' },
  ],
  MOBILE: [
    { name: 'React Native', icon: '📱' },
  ],
  DATABASE: [
    { name: 'Redis', icon: '🔴' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'MySQL', icon: '🐬' },
    { name: 'MongoDB', icon: '🍃' },
  ],
  DEVOPS: [
    { name: 'Git', icon: '🌿' },
    { name: 'GitHub Actions', icon: '⚙️' },
    { name: 'Docker', icon: '🐳' },
    { name: 'AWS', icon: '☁️' },
    { name: 'Linux Technologies', icon: '🐧' },
  ],
};

export const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'I needed a premium executive portfolio that reflected my 20+ years in the energy sector. Bonaventure delivered beyond expectations — a stunning Next.js website with smooth animations that perfectly captures my professional journey. He captured the essence of my brand beautifully. Several high-profile partners have commented on how impressive the site is. Truly world-class work.',
    name: 'Dr. Ugo Okafor',
    title: 'Founder & CEO, SunTrust Atlantic Energies',
    avatar: '👨‍💼',
    initials: 'UO',
  },
  {
    id: 2,
    quote:
      'Bonaventure built our logistics platform from scratch in record time. The real-time tracking system he implemented works flawlessly and our clients love the clean UI. He communicates clearly, hits deadlines, and the code quality is exceptional. We will definitely be hiring him again.',
    name: 'Mrs. Adaeze Nwosu',
    title: 'Operations Director, iTrust Rapid Logistics',
    avatar: '👩‍💼',
    initials: 'AN',
  },
  {
    id: 3,
    quote:
      'Working with Bonaventure on our LMS was a game-changer. He understood our vision immediately and turned complex requirements into an intuitive platform our students love. His backend architecture is solid and the platform has scaled to 10,000+ users without a hitch.',
    name: 'Mr. Seun Adewale',
    title: 'CEO, EduReach Nigeria',
    avatar: '👨‍🏫',
    initials: 'SA',
  },
  {
    id: 4,
    quote:
      'The best developer I have worked with. Period. Fast delivery, clean code, perfect communication, and he always brings extra ideas that improve the project. Our e-commerce platform has seen a 300% increase in organic traffic thanks to his SEO optimization.',
    name: 'Fatima Al-Hassan',
    title: 'Founder, ShopNaija',
    avatar: '👩‍💻',
    initials: 'FA',
  },
  {
    id: 5,
    quote:
      'Bonaventure led our backend team with professionalism and technical excellence. He mentored junior developers while simultaneously architecting our core systems. Rare to find someone who can do both at such a high level.',
    name: 'James Okonkwo',
    title: 'CTO, MVP Ginger',
    avatar: '👨‍💻',
    initials: 'JO',
  },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export const FOOTER_LINKS = {
  GENERAL: [
    { label: 'Home', href: '/' }, { label: 'About Me', href: '/about' }, { label: 'Projects', href: '/work' },
    { label: 'Blog', href: '/blog' }, { label: 'Videos', href: '/videos' },
  ],
  WORK: [
    { label: 'Products', href: '/products' }, { label: 'Hosting Guide', href: '/hosting-guide' }, { label: 'Hire Me', href: '/hire-me' },
    { label: 'Experience', href: '/about#experience' }, { label: 'Start a Project', href: '/contact' },
    { label: 'Book a Consultation', href: '/consultation' }, { label: 'Refer & Earn 10%', href: '/refer' },
  ],
  COMMUNITY: [
    { label: 'Testimonials', href: '/testimonials' }, { label: 'Report a Bug', href: '/report-a-bug' },
    { label: 'GitHub', href: 'https://github.com/bonaventurechidalu' }, { label: 'LinkedIn', href: 'https://linkedin.com/in/bonaventure-chidalu-b58221350' },
    { label: 'Twitter / X', href: 'https://twitter.com/bonaventurechidalu' },
  ],
  LEGAL: [
    { label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Terms of Service', href: '/terms' }, { label: 'Refund Policy', href: '/refund-policy' },
  ],
};
