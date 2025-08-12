import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { requireAdmin } from "@/lib/middleware";
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
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    await connectToDatabase();
    const user = await User.findById(params.id).select("-password");
    if (!user) return errorResponse("User not found", 404);
    return successResponse(user, "User retrieved successfully");
  } catch (error) {
    logger.error("Admin User GET Error:", {
      path: `/api/admin/users/${params.id}`,
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
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    await connectToDatabase();
    const data = await req.json();

    // Prevent updating protected fields unless explicitly allowed
    delete data.password;
    delete data.emailVerified;

    const user = await User.findByIdAndUpdate(params.id, data, {
      new: true,
    }).select("-password");
    if (!user) return errorResponse("User not found", 404);
    return successResponse(user, "User updated successfully");
  } catch (error) {
    logger.error("Admin User PATCH Error:", {
      path: `/api/admin/users/${params.id}`,
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
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    await connectToDatabase();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) return errorResponse("User not found", 404);
    return successResponse({ success: true }, "User deleted successfully");
  } catch (error) {
    logger.error("Admin User DELETE Error:", {
      path: `/api/admin/users/${params.id}`,
      error,
    });
    return handleApiError(error);
  }
}
