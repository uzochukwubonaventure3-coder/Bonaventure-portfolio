import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, unauthorized, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return notFound('Project');
  return ok(project);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const project = await prisma.project.update({
      where: { id: params.id },
      data: { ...body, updatedAt: new Date() },
    });
    return ok(project);
  } catch (e: any) {
    if (e.code === 'P2025') return notFound('Project');
    return err('Failed to update project', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) return notFound('Project');

    // Delete image from Cloudinary if exists
    if (project.imageId) {
      await deleteImage(project.imageId).catch(console.error);
    }

    await prisma.project.delete({ where: { id: params.id } });
    return ok({ message: 'Project deleted' });
  } catch (e) {
    return err('Failed to delete project', 500);
  }
}
