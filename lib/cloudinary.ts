import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export type UploadFolder = 'projects' | 'blog' | 'testimonials' | 'avatar' | 'misc';

export async function uploadImage(
  file: string, // base64 or URL
  folder: UploadFolder,
  publicId?: string
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `bcportfolio/${folder}`,
    public_id: publicId,
    overwrite: true,
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: options.quality ?? 'auto',
    fetch_format: 'auto',
    width: options.width,
    height: options.height,
    crop: options.width && options.height ? 'fill' : undefined,
  });
}
