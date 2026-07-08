/**
 * Cloudinary Configuration and Client-Side Upload Helper
 */

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset && cloudName !== 'your-cloudinary-cloud-name');

/**
 * Upload an image file to Cloudinary from the client-side.
 * @param file The file object from file input or drag & drop.
 * @returns Promise resolving to the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File | Blob): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary belum dikonfigurasi. Silakan isi VITE_CLOUDINARY_CLOUD_NAME dan VITE_CLOUDINARY_UPLOAD_PRESET di berkas .env Anda.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Gagal mengunggah gambar ke Cloudinary (Status: ${response.status})`
    );
  }

  const data = await response.json();
  return data.secure_url;
}
