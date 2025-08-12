import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Find user by reset token and check if it's not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info("Password reset successful", {
      path: "/api/auth/reset-password",
      metadata: {
        userId: user._id,
        email: user.email,
      },
    });

    return successResponse(
      {},
      "Password has been reset successfully. You can now log in with your new password."
    );
  } catch (error) {
    logger.error("Reset Password Error:", {
      path: "/api/auth/reset-password",
      error,
    });
    return handleApiError(error);
  }
}
