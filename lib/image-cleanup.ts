import { deleteImage } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";

export async function cleanupProductImages(imagePublicIds: string[]): Promise<void> {
  if (!imagePublicIds || imagePublicIds.length === 0) {
    return;
  }

  try {
    await Promise.all(imagePublicIds.map(publicId => deleteImage(publicId)));
    
    logger.info("Product images cleaned up successfully", {
      metadata: {
        public_ids: imagePublicIds,
        count: imagePublicIds.length,
      },
    });
  } catch (error) {
    logger.error("Failed to cleanup product images", {
      error,
      metadata: {
        public_ids: imagePublicIds,
      },
    });
    // Don't throw error to prevent blocking the main operation
  }
}

export async function cleanupCollectionImage(imagePublicId: string): Promise<void> {
  if (!imagePublicId) {
    return;
  }

  try {
    await deleteImage(imagePublicId);
    
    logger.info("Collection image cleaned up successfully", {
      metadata: {
        public_id: imagePublicId,
      },
    });
  } catch (error) {
    logger.error("Failed to cleanup collection image", {
      error,
      metadata: {
        public_id: imagePublicId,
      },
    });
    // Don't throw error to prevent blocking the main operation
  }
}

export async function cleanupImages(publicIds: string[]): Promise<void> {
  if (!publicIds || publicIds.length === 0) {
    return;
  }

  try {
    await Promise.all(publicIds.map(publicId => deleteImage(publicId)));
    
    logger.info("Images cleaned up successfully", {
      metadata: {
        public_ids: publicIds,
        count: publicIds.length,
      },
    });
  } catch (error) {
    logger.error("Failed to cleanup images", {
      error,
      metadata: {
        public_ids: publicIds,
      },
    });
    // Don't throw error to prevent blocking the main operation
  }
} 