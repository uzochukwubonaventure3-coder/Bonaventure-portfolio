import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, unauthorized, slugify } from '@/lib/api';
import { requireAuth as authCheck } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') ?? '100');

    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(featured === 'true' ? { featured: true } : {}),
        ...(category && category !== 'All projects'
          ? { categories: { has: category } }
          : {}),
      },
      orderBy: { order: 'asc' },
      take: limit,
    });

    return ok(projects);
  } catch (e) {
    console.error(e);
    return err('Failed to fetch projects', 500);
  }
}

export async function POST(req: NextRequest) {
  const admin = await authCheck(req);
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const { title, url, date, description, tags, categories, imageUrl, imageId, liveUrl, githubUrl, featured, published, order } = body;

    if (!title || !description) return err('Title and description are required');

    const slug = slugify(title);

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        url: url ?? '',
        date: date ?? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        description,
        tags: tags ?? [],
        categories: categories ?? [],
        imageUrl: imageUrl ?? null,
        imageId: imageId ?? null,
        liveUrl: liveUrl ?? null,
        githubUrl: githubUrl ?? null,
        featured: featured ?? false,
        published: published ?? true,
        order: order ?? 0,
      },
    });

    return ok(project, 201);
  } catch (e: any) {
    if (e.code === 'P2002') return err('A project with this title already exists');
    console.error(e);
    return err('Failed to create project', 500);
  }
}
