import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { Product } from "@/lib/models/product";
import { requireAuth } from "@/lib/middleware";
import {
  handleApiError,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const user = await User.findById(session.user.id);

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Ensure user has a wishlist field
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
    }

    // Populate the wishlist with product details
    await user.populate({
      path: "wishlist",
      select: "name description price images slug category inStock",
    });

    return successResponse(
      user.wishlist || [],
      "Wishlist retrieved successfully"
    );
  } catch (error) {
    logger.error("Wishlist GET Error:", {
      path: "/api/user/wishlist",
      error,
    });
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { productId } = await req.json();

    if (!productId) {
      return errorResponse("Product ID is required", 400);
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse("Product not found", 404);
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Ensure user has a wishlist field
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
    }

    // Check if product is already in wishlist
    if (user.wishlist.some((id) => id.toString() === productId)) {
      return errorResponse("Product already in wishlist", 400);
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Populate the wishlist with product details
    await user.populate({
      path: "wishlist",
      select: "name description price images slug category inStock",
    });

    return successResponse(
      user.wishlist,
      "Product added to wishlist successfully"
    );
  } catch (error) {
    logger.error("Wishlist POST Error:", {
      path: "/api/user/wishlist",
      error,
    });
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { productId } = await req.json();

    if (!productId) {
      return errorResponse("Product ID is required", 400);
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Ensure user has a wishlist field
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    // Populate the wishlist with product details
    await user.populate({
      path: "wishlist",
      select: "name description price images slug category inStock",
    });

    return successResponse(
      user.wishlist,
      "Product removed from wishlist successfully"
    );
  } catch (error) {
    logger.error("Wishlist DELETE Error:", {
      path: "/api/user/wishlist",
      error,
    });
    return handleApiError(error);
  }
}
