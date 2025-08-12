import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Collection } from "@/lib/models/collection";
import { Product } from "@/lib/models/product";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Execute queries
    const [collections, total] = await Promise.all([
      Collection.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Collection.countDocuments(filter)
    ]);
    
    // Update product counts for each collection
    const collectionsWithCounts = await Promise.all(
      collections.map(async (collection) => {
        const count = await Product.countDocuments({ collectionId: collection._id.toString() });
        return {
          ...collection,
          productCount: count
        };
      })
    );
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    };
    
    return successResponse(
      { collections: collectionsWithCounts, pagination },
      "Collections retrieved successfully"
    );
  } catch (error) {
    logger.error("Collections GET Error:", {
      path: "/api/collections",
      error,
    });
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const collection = await Collection.create(data);
    return successResponse(collection, "Collection created successfully", { statusCode: 201 });
  } catch (error) {
    logger.error("Collections POST Error:", {
      path: "/api/collections",
      error,
    });
    return handleApiError(error);
  }
} 