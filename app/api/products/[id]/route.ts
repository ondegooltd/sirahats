import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/product";
import {
  handleApiError,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { cleanupProductImages } from "@/lib/image-cleanup";
import { requireAuth } from "@/lib/middleware";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id);
    if (!product) {
      return errorResponse("Product not found", 404);
    }
    return successResponse(product, "Product retrieved successfully");
  } catch (error) {
    logger.error("Product GET Error:", {
      path: `/api/products/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    await connectToDatabase();
    const data = await req.json();

    // Validate required fields if they are being updated
    const requiredFields = [
      "name",
      "slug",
      "price",
      "description",
      "category",
      "collectionId",
      "inStock",
      "materials",
      "dimensions",
      "origin",
    ];
    for (const field of requiredFields) {
      if (
        data[field] !== undefined &&
        (!data[field] ||
          (Array.isArray(data[field]) && data[field].length === 0))
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists (only if slug is being updated)
    if (data.slug) {
      const existingProduct = await Product.findOne({
        slug: data.slug,
        _id: { $ne: params.id },
      });
      if (existingProduct) {
        return NextResponse.json(
          { error: "A product with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const product = await Product.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!product) {
      return errorResponse("Product not found", 404);
    }
    return successResponse(product, "Product updated successfully");
  } catch (error) {
    logger.error("Product PATCH Error:", {
      path: `/api/products/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    await connectToDatabase();
    const product = await Product.findById(params.id);
    if (!product) {
      return errorResponse("Product not found", 404);
    }

    // Clean up images from Cloudinary before deleting the product
    if (product.imagePublicIds && product.imagePublicIds.length > 0) {
      await cleanupProductImages(product.imagePublicIds);
    }

    // Delete the product
    await Product.findByIdAndDelete(params.id);

    return successResponse({ success: true }, "Product deleted successfully");
  } catch (error) {
    logger.error("Product DELETE Error:", {
      path: `/api/products/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
}
