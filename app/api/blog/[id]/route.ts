import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, unauthorized, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) return notFound('Blog post');
  // Increment views
  await prisma.blogPost.update({ where: { id: params.id }, data: { views: { increment: 1 } } });
  return ok(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: { ...body, updatedAt: new Date() },
    });
    return ok(post);
  } catch (e: any) {
    if (e.code === 'P2025') return notFound('Blog post');
    return err('Failed to update blog post', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return notFound('Blog post');
    if (post.coverId) await deleteImage(post.coverId).catch(console.error);
    await prisma.blogPost.delete({ where: { id: params.id } });
    return ok({ message: 'Post deleted' });
  } catch {
    return err('Failed to delete blog post', 500);
  }
}
