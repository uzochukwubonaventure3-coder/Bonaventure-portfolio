import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, unauthorized, slugify, estimateReadTime } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true'; // admin only
  const limit = parseInt(searchParams.get('limit') ?? '50');

  const posts = await prisma.blogPost.findMany({
    where: all ? {} : { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return ok(posts);
}

export async function POST(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const { title, excerpt, content, coverUrl, coverId, category, tags, published, featured } = body;

    if (!title || !content) return err('Title and content are required');

    const slug = slugify(title);
    const readTime = estimateReadTime(content);

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? content.slice(0, 200) + '...',
        content,
        coverUrl: coverUrl ?? null,
        coverId: coverId ?? null,
        category: category ?? 'General',
        tags: tags ?? [],
        readTime,
        published: published ?? false,
        featured: featured ?? false,
      },
    });

    return ok(post, 201);
  } catch (e: any) {
    if (e.code === 'P2002') return err('A post with this title already exists');
    return err('Failed to create blog post', 500);
  }
}
