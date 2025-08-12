import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/product";
import { Collection } from "@/lib/models";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { requireAuth } from "@/lib/middleware";

// Helper function to get filter options
async function getFilterOptions() {
  const [categories, collections] = await Promise.all([
    Product.distinct("category"),
    Collection.find({}, "name slug _id").lean(),
  ]);

  return { categories, collections };
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check if this is a request for filter options
    const { searchParams } = new URL(req.url);
    if (searchParams.get("filters") === "true") {
      const filterOptions = await getFilterOptions();
      return successResponse(
        filterOptions,
        "Filter options retrieved successfully"
      );
    }

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const collectionId = searchParams.get("collectionId") || "";
    const inStock = searchParams.get("inStock") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (collectionId) {
      filter.collectionId = collectionId;
    }

    if (inStock !== "") {
      filter.inStock = inStock === "true";
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("collectionId", "name slug")
        .lean(),
      Product.countDocuments(filter),
    ]);

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
      prevPage: hasPrevPage ? page - 1 : null,
    };

    return successResponse(
      { products, pagination },
      "Products retrieved successfully"
    );
  } catch (error) {
    logger.error("Products GET Error:", {
      path: "/api/products",
      error,
    });
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectToDatabase();
    const data = await req.json();

    // Validate required fields
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
        !data[field] ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: data.slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    const product = await Product.create(data);
    return successResponse(product, "Product created successfully", {
      statusCode: 201,
    });
  } catch (error) {
    logger.error("Products POST Error:", {
      path: "/api/products",
      error,
    });
    return handleApiError(error);
  }
}
