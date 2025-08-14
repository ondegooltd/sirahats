import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/product";
import { User } from "@/lib/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get user's wishlist to understand their preferences
    const user = await User.findById(session.user.id).populate("wishlist");
    const wishlistItems = user?.wishlist || [];

    // Extract categories and product IDs from wishlist
    const wishlistCategories = wishlistItems
      .map((item: any) => item.category)
      .filter(Boolean);
    const wishlistProductIds = wishlistItems.map((item: any) =>
      item._id.toString()
    );

    // Build recommendation query
    let recommendationQuery: any = {
      _id: { $nin: wishlistProductIds }, // Exclude items already in wishlist
      inStock: true, // Only recommend in-stock items
    };

    // If user has wishlist items, recommend similar products
    if (wishlistCategories.length > 0) {
      recommendationQuery.category = { $in: wishlistCategories };
    }

    // Get recommended products
    const recommendedProducts = await Product.find(recommendationQuery)
      .populate("collectionId", "name slug")
      .sort({ createdAt: -1 }) // Show newest products first
      .limit(8); // Limit to 8 recommendations

    // If we don't have enough recommendations based on wishlist,
    // add some popular products from other categories
    if (recommendedProducts.length < 4) {
      const additionalProducts = await Product.find({
        _id: {
          $nin: [
            ...wishlistProductIds,
            ...recommendedProducts.map((p: any) => p._id.toString()),
          ],
        },
        inStock: true,
      })
        .populate("collectionId", "name slug")
        .sort({ createdAt: -1 })
        .limit(8 - recommendedProducts.length);

      recommendedProducts.push(...additionalProducts);
    }

    // Format the response
    const formattedProducts = recommendedProducts.map((product: any) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      slug: product.slug,
      category: product.category,
      inStock: product.inStock,
      collectionId: product.collectionId,
      createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return successResponse(
      formattedProducts,
      "Recommendations retrieved successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
