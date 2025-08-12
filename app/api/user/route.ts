import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { requireAuth } from "@/lib/middleware";
import { handleApiError, successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const user = await User.findById(session.user.id).select("-password");
    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user, "User profile retrieved successfully");
  } catch (error) {
    logger.error("User GET Error:", {
      path: "/api/user",
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

    const data = await req.json();
    
    // If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      data,
      { new: true }
    ).select("-password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user, "User profile updated successfully");
  } catch (error) {
    logger.error("User PATCH Error:", {
      path: "/api/user",
      error,
    });
    return handleApiError(error);
  }
} 