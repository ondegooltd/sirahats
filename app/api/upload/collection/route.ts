import { requireAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  handleApiError,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { uploadMultipleImages } from "@/lib/cloudinary";
import {
  extractFilesFromFormData,
  fileToBuffer,
  validateImageFile,
  validateFileSize,
} from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    // Extract files from FormData
    const files = await extractFilesFromFormData(request);

    if (files.length === 0) {
      return errorResponse("No file provided", 400);
    }

    if (files.length > 1) {
      return errorResponse("Only one image is allowed for collection", 400);
    }

    const file = files[0];

    // Validate file
    if (!validateImageFile(file)) {
      return errorResponse(
        `Invalid file type: ${file.name}. Only images are allowed.`,
        400
      );
    }

    if (!validateFileSize(file)) {
      return errorResponse(
        `File too large: ${file.name}. Maximum size is 5MB.`,
        400
      );
    }

    // Convert file to buffer
    const fileBuffer = await fileToBuffer(file);

    // Upload to Cloudinary
    const uploadResult = await uploadMultipleImages(
      fileBuffer,
      "sirahats/collections",
      {
        width: 600,
        height: 600,
        crop: "fill",
        quality: "auto",
        format: "auto",
      }
    );

    // Prepare response data
    const uploadedImage = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    };

    logger.info("Collection image uploaded successfully", {
      path: "/api/upload/collection",
      metadata: {
        public_id: uploadedImage.public_id,
      },
    });

    return successResponse(
      uploadedImage,
      "Collection image uploaded successfully",
      { statusCode: 201 }
    );
  } catch (error) {
    logger.error("Collection upload error:", {
      path: "/api/upload/collection",
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

    const { publicId } = await request.json();

    if (!publicId) {
      return errorResponse("Public ID is required", 400);
    }

    // Delete image from Cloudinary
    const { deleteImage } = await import("@/lib/cloudinary");
    await deleteImage(publicId);

    logger.info("Collection image deleted successfully", {
      path: "/api/upload/collection",
      metadata: {
        public_id: publicId,
      },
    });

    return successResponse(
      { deleted: publicId },
      "Collection image deleted successfully"
    );
  } catch (error) {
    logger.error("Collection image deletion error:", {
      path: "/api/upload/collection",
      error,
    });
    return handleApiError(error);
  }
}
