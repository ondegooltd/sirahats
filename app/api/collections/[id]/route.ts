import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Collection } from "@/lib/models/collection";
import { handleApiError, successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { cleanupCollectionImage } from "@/lib/image-cleanup";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const collection = await Collection.findById(params.id);
    if (!collection) {
      return errorResponse("Collection not found", 404);
    }
    return successResponse(collection, "Collection retrieved successfully");
  } catch (error) {
    logger.error("Collection GET Error:", {
      path: `/api/collections/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const collection = await Collection.findByIdAndUpdate(params.id, data, { new: true });
    if (!collection) {
      return errorResponse("Collection not found", 404);
    }
    return successResponse(collection, "Collection updated successfully");
  } catch (error) {
    logger.error("Collection PATCH Error:", {
      path: `/api/collections/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const collection = await Collection.findById(params.id);
    if (!collection) {
      return errorResponse("Collection not found", 404);
    }

    // Clean up image from Cloudinary before deleting the collection
    if (collection.imagePublicId) {
      await cleanupCollectionImage(collection.imagePublicId);
    }

    // Delete the collection
    await Collection.findByIdAndDelete(params.id);
    
    return successResponse({ success: true }, "Collection deleted successfully");
  } catch (error) {
    logger.error("Collection DELETE Error:", {
      path: `/api/collections/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
} 