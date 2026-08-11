// ─── POST / JOURNAL ────────────────────────────────────────
export type PostSection =
  | 'Latest Thoughts'
  | 'Building In Public'
  | 'Engineering Notes'
  | 'AI Experiments'
  | "What I'm Learning";

export type PostPlatform =
  | 'self'
  | 'twitter'
  | 'linkedin'
  | 'hashnode'
  | 'devto'
  | 'medium'
  | 'github';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  cover_image_id: string | null;
  tags: string[];
  section: PostSection;
  platform: PostPlatform;
  external_url: string | null;
  reading_time: number; // minutes
  ai_summary: string | null;
  featured: boolean;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export type PostInsert = Omit<Post, 'id' | 'created_at' | 'updated_at' | 'views'>;
export type PostUpdate = Partial<PostInsert>;

// ─── PROJECT ───────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  slug: string;
  url: string | null;
  date: string;
  description: string;
  tags: string[];
  categories: string[];
  image_url: string | null;
  image_id: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// ─── EXPERIENCE ────────────────────────────────────────────
export interface Experience {
  id: string;
  title: string;
  company: string;
  type: string;
  period: string;
  badge: string | null;
  initials: string;
  color: string;
  tags: string[];
  bullets: string[];
  order: number;
  current: boolean;
}

// ─── TESTIMONIAL ───────────────────────────────────────────
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  avatar_url: string | null;
  avatar_id: string | null;
  initials: string;
  featured: boolean;
  approved: boolean;
  order: number;
  created_at: string;
}

// ─── CONTACT MESSAGE ───────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  budget: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

// ─── SITE SETTINGS ─────────────────────────────────────────
export type SiteSettings = Record<string, string>;

// ─── API RESPONSE ──────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// ─── PAGINATION ────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── SEARCH PARAMS ─────────────────────────────────────────
export interface PostSearchParams {
  query?: string;
  section?: PostSection | 'all';
  tag?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  platform?: PostPlatform;
}
