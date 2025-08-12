import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/lib/models/cart";
import { requireAuth } from "@/lib/middleware";
import { handleApiError, successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    return successResponse(cart || { items: [] }, "Cart retrieved successfully");
  } catch (error) {
    logger.error("Cart GET Error:", {
      path: "/api/cart",
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

    const { productId, quantity } = await req.json();
    
    let cart = await Cart.findOne({ user: session.user.id });
    
    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }
    
    await cart.populate({ path: "items.product" });
    
    return successResponse(cart, "Item added to cart successfully", { statusCode: 201 });
  } catch (error) {
    logger.error("Cart POST Error:", {
      path: "/api/cart",
      error,
    });
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { productId, quantity } = await req.json();
    
    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return errorResponse("Cart not found", 404);
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
      } else {
        item.quantity = quantity;
      }
      await cart.save();
    }
    await cart.populate("items.product");
    
    return successResponse(cart, "Cart updated successfully");
  } catch (error) {
    logger.error("Cart PATCH Error:", {
      path: "/api/cart",
      error,
    });
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    await Cart.findOneAndDelete({ user: session.user.id });
    return successResponse({ success: true }, "Cart cleared successfully");
  } catch (error) {
    logger.error("Cart DELETE Error:", {
      path: "/api/cart",
      error,
    });
    return handleApiError(error);
  }
} 