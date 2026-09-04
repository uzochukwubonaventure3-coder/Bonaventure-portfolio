import {
  SiDocker,
  SiFigma,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiWordpress,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';
import { Code2 } from 'lucide-react';

const ICONS = {
  'vue.js': SiVuedotjs,
  'tailwind css': SiTailwindcss,
  react: SiReact,
  'react native': SiReact,
  'next.js': SiNextdotjs,
  typescript: SiTypescript,
  'framer motion': SiFramer,
  figma: SiFigma,
  wordpress: SiWordpress,
  laravel: SiLaravel,
  php: SiPhp,
  java: SiOpenjdk,
  'node.js': SiNodedotjs,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  redis: SiRedis,
  mongodb: SiMongodb,
  docker: SiDocker,
  aws: FaAws,
  linux: SiLinux,
  git: SiGit,
  'github actions': SiGithubactions,
} as const;

const COLORS: Record<string, string> = {
  'vue.js': '#4FC08D', 'tailwind css': '#06B6D4', react: '#61DAFB',
  'react native': '#61DAFB', 'next.js': '#FFFFFF', typescript: '#3178C6',
  'framer motion': '#FFFFFF', figma: '#F24E1E', wordpress: '#21759B',
  laravel: '#FF2D20', php: '#777BB4', java: '#E76F00', 'node.js': '#339933',
  postgresql: '#4169E1', mysql: '#4479A1', redis: '#DC382D', mongodb: '#47A248',
  docker: '#2496ED', aws: '#FF9900', linux: '#FCC624', git: '#F05032',
  'github actions': '#2088FF',
};

export default function TechIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  const key = name.trim().toLowerCase();
  const Icon = ICONS[key as keyof typeof ICONS] ?? Code2;
  return <Icon aria-hidden="true" className={className} style={{ color: COLORS[key] ?? '#F97316' }} />;
}