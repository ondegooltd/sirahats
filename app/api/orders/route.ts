import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/order";
import { User } from "@/lib/models/user";
import {
  errorResponse,
  handleApiError,
  successResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { EmailService } from "@/lib/email-service";
import { Cart } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
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
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.firstName": { $regex: search, $options: "i" } },
        { "shippingAddress.lastName": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
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
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "firstName lastName email")
        .populate("items.product", "name images")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
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
      { orders, pagination },
      "Orders retrieved successfully"
    );
  } catch (error) {
    logger.error("Orders GET Error:", {
      path: "/api/orders",
      error,
    });
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const user = await User.findById(data.user);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Create order
    const order = await Order.create(data);

    // Send order confirmation email if user exists
    if (user.email) {
      try {
        await EmailService.sendOrderConfirmationEmail(order, user);
        logger.info("Order confirmation email sent successfully", {
          path: "/api/orders",
          metadata: {
            orderId: order._id,
            userId: user._id,
            email: user.email,
          },
        });
      } catch (emailError) {
        logger.error("Failed to send order confirmation email", {
          path: "/api/orders",
          error: emailError,
          metadata: {
            orderId: order._id,
            userId: data.user?._id,
            email: data.user?.email,
          },
        });
        // Don't fail order creation if email fails
      }
    }

    try {
      await Cart.deleteMany();
      logger.info("Cart emptied successfully", {
        path: "/api/orders",
      });
    } catch (error) {
      logger.error("Failed to empty cart", {
        path: "/api/orders",
        error,
      });
    }

    return successResponse(order, "Order created successfully", {
      statusCode: 201,
    });
  } catch (error) {
    logger.error("Orders POST Error:", {
      path: "/api/orders",
      error,
    });
    return handleApiError(error);
  }
}
