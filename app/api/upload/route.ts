import { NextRequest } from 'next/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { uploadImage, deleteImage, UploadFolder } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as UploadFolder) ?? 'misc';
    const oldPublicId = formData.get('oldPublicId') as string | null;

    if (!file) return err('No file provided');

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return err('Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG');
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return err('File too large. Maximum size is 10MB');
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Delete old image if replacing
    if (oldPublicId) {
      await deleteImage(oldPublicId).catch(console.error);
    }

    const result = await uploadImage(base64, folder);

    return ok({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    });
  } catch (e) {
    console.error('Upload error:', e);
    return err('Failed to upload image', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const { publicId } = await req.json();
    if (!publicId) return err('publicId is required');
    await deleteImage(publicId);
    return ok({ message: 'Image deleted' });
  } catch {
    return err('Failed to delete image', 500);
  }
}
