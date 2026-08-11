import { createAdminClient } from './server';
import type { Post, PostSearchParams, PaginatedResponse, Project, Experience, Testimonial } from '@/types';

// ─── CACHE HELPERS ─────────────────────────────────────────
const CACHE_REVALIDATE = 60; // 60s for public pages
const CACHE_REVALIDATE_ADMIN = 0; // no cache for admin

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─── POSTS ─────────────────────────────────────────────────

export async function getPosts(params: PostSearchParams = {}): Promise<PaginatedResponse<Post>> {
  const supabase = createAdminClient();
  const { query, section, tag, featured, page = 1, limit = 12, platform } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (query) q = q.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
  if (section && section !== 'all') q = q.eq('section', section);
  if (tag) q = q.contains('tags', [tag]);
  if (featured !== undefined) q = q.eq('featured', featured);
  if (platform) q = q.eq('platform', platform);

  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw new Error(`Failed to fetch posts: ${error.message}`);

  return {
    data: data as Post[],
    meta: { page, limit, total: count ?? 0, hasMore: (count ?? 0) > to + 1 },
  };
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return data as Post;
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('posts').select('*').eq('id', id).single();
  return data as Post | null;
}

export async function getAllTags(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('posts').select('tags').eq('published', true);
  if (!data) return [];
  const all = data.flatMap((r: { tags: string[] }) => r.tags);
  return [...new Set(all)].sort();
}

export async function incrementViews(id: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.rpc('increment_post_views', { post_id: id });
}

export async function createPost(payload: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'views'>): Promise<Post> {
  const supabase = createAdminClient();
  const reading_time = calcReadingTime(payload.content);
  const { data, error } = await supabase
    .from('posts')
    .insert({ ...payload, reading_time, views: 0 })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Post;
}

export async function updatePost(id: string, payload: Partial<Post>): Promise<Post> {
  const supabase = createAdminClient();
  if (payload.content) payload.reading_time = calcReadingTime(payload.content);
  const { data, error } = await supabase
    .from('posts')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Post;
}

export async function deletePost(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Post[];
}

// ─── PROJECTS ──────────────────────────────────────────────

export async function getProjects(featuredOnly = false): Promise<Project[]> {
  const supabase = createAdminClient();
  let q = supabase.from('projects').select('*').eq('published', true).order('order', { ascending: true });
  if (featuredOnly) q = q.eq('featured', true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data as Project[];
}

// ─── EXPERIENCE ────────────────────────────────────────────

export async function getExperience(): Promise<Experience[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('experience').select('*').order('order', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Experience[];
}

// ─── TESTIMONIALS ──────────────────────────────────────────

export async function getTestimonials(approvedOnly = true): Promise<Testimonial[]> {
  const supabase = createAdminClient();
  let q = supabase.from('testimonials').select('*').order('order', { ascending: true });
  if (approvedOnly) q = q.eq('approved', true).eq('featured', true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data as Testimonial[];
}

// ─── SETTINGS ──────────────────────────────────────────────

export async function getSettings(): Promise<Record<string, string>> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('site_settings').select('key, value');
  if (!data) return {};
  return data.reduce((acc: Record<string, string>, row: { key: string; value: string }) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function upsertSettings(updates: Record<string, string>): Promise<void> {
  const supabase = createAdminClient();
  const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (error) throw new Error(error.message);
}
