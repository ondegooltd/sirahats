import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export async function uploadImage(
  file: Buffer,
  folder: string = 'sirahats',
  transformation?: any
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
          });
        }
      }
    );

    uploadStream.end(file);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function uploadMultipleImages(
  files: Buffer[],
  folder: string = 'sirahats',
  transformation?: any
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder, transformation));
  return Promise.all(uploadPromises);
}

export function generateImageUrl(publicId: string, transformation?: any): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation,
  });
}

export default cloudinary; 