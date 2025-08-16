import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/order";
import {
  handleApiError,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id)
      .populate("user")
      .populate("items.product");
    if (!order) {
      return errorResponse("Order not found", 404);
    }
    return successResponse(order, "Order retrieved successfully");
  } catch (error) {
    logger.error("Order GET Error:", {
      path: `/api/orders/${params.id}`,
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
    await connectToDatabase();
    const data = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, data, { new: true })
      .populate("user")
      .populate("items.product");
    if (!order) {
      return errorResponse("Order not found", 404);
    }
    return successResponse(order, "Order updated successfully");
  } catch (error) {
    logger.error("Order PATCH Error:", {
      path: `/api/orders/${params.id}`,
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
    await connectToDatabase();
    const order = await Order.findByIdAndDelete(params.id);
    if (!order) {
      return errorResponse("Order not found", 404);
    }
    return successResponse({ success: true }, "Order deleted successfully");
  } catch (error) {
    logger.error("Order DELETE Error:", {
      path: `/api/orders/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
}
