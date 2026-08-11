import { MetadataRoute } from 'next';
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bonaventurechidalu.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/work`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  if (!hasSupabaseAdminEnv()) {
    return staticPages;
  }

  const supabase = createAdminClient();

  // Dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('published', true);

    blogPages = (posts ?? []).map((p: { slug: string; updated_at: string }) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticPages, ...blogPages];
}
