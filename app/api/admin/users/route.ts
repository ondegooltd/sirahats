import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { Order } from "@/lib/models/order";
import { requireAdmin } from "@/lib/middleware";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Get additional user statistics (orders and total spent)
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [orderCount, totalSpent] = await Promise.all([
          Order.countDocuments({ user: user._id }),
          Order.aggregate([
            { $match: { user: user._id } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ]),
        ]);

        return {
          ...user,
          orders: orderCount,
          totalSpent: totalSpent[0]?.total || 0,
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
      prevPage: hasPrevPage ? page - 1 : null,
    };

    return successResponse(
      { users: usersWithStats, pagination },
      "Users retrieved successfully"
    );
  } catch (error) {
    logger.error("Admin Users GET Error:", {
      path: "/api/admin/users",
      error,
    });
    return handleApiError(error);
  }
}
