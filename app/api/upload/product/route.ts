import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";
import { handleApiError, successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { uploadMultipleImages } from "@/lib/cloudinary";
import { extractFilesFromFormData, fileToBuffer, validateImageFile, validateFileSize } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    // Extract files from FormData
    const files = await extractFilesFromFormData(request);
    
    if (files.length === 0) {
      return errorResponse("No files provided", 400);
    }

    // Validate files
    for (const file of files) {
      if (!validateImageFile(file)) {
        return errorResponse(`Invalid file type: ${file.name}. Only images are allowed.`, 400);
      }
      
      if (!validateFileSize(file)) {
        return errorResponse(`File too large: ${file.name}. Maximum size is 5MB.`, 400);
      }
    }

    // Convert files to buffers
    const fileBuffers = await Promise.all(files.map(file => fileToBuffer(file)));

    // Upload to Cloudinary
    const uploadResults = await uploadMultipleImages(
      fileBuffers,
      'sirahats/products',
      {
        width: 800,
        height: 800,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
      }
    );

    // Prepare response data
    const uploadedImages = uploadResults.map(result => ({
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    }));

    logger.info("Product images uploaded successfully", {
      path: "/api/upload/product",
      metadata: {
        count: uploadedImages.length,
        public_ids: uploadedImages.map(img => img.public_id),
      },
    });

    return successResponse(
      uploadedImages,
      `${uploadedImages.length} image(s) uploaded successfully`,
      { statusCode: 201 }
    );

  } catch (error) {
    logger.error("Product upload error:", {
      path: "/api/upload/product",
      error,
    });
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { publicIds } = await request.json();
    
    if (!publicIds || !Array.isArray(publicIds)) {
      return errorResponse("Invalid public IDs provided", 400);
    }

    // Delete images from Cloudinary
    const { deleteImage } = await import("@/lib/cloudinary");
    await Promise.all(publicIds.map(publicId => deleteImage(publicId)));

    logger.info("Product images deleted successfully", {
      path: "/api/upload/product",
      metadata: {
        public_ids: publicIds,
      },
    });

    return successResponse(
      { deleted: publicIds },
      `${publicIds.length} image(s) deleted successfully`
    );

  } catch (error) {
    logger.error("Product image deletion error:", {
      path: "/api/upload/product",
      error,
    });
    return handleApiError(error);
  }
} 