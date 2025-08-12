import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find admin user by email
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      // Return success even if user doesn't exist for security
      return successResponse(
        {},
        "If an admin account with that email exists, a password reset link has been sent."
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`;

    // Send email using Resend
    try {
      await resend.emails.send({
        from: "Sirahats Admin <admin@sirahats.com>",
        to: [email],
        subject: "Admin Password Reset Request - Sirahats",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #8BC34A; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Sirahats Admin</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Admin Password Reset Request</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hello ${user.firstName || "Admin"},
              </p>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password for the Sirahats admin dashboard. 
                Click the button below to reset your password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #8BC34A; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block; 
                          font-weight: bold;">
                  Reset Admin Password
                </a>
              </div>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request a password reset, please contact the system administrator immediately.
              </p>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                This link will expire in 1 hour for security reasons.
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #8BC34A;">${resetUrl}</a>
              </p>
            </div>
            <div style="background-color: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0; font-size: 12px;">
                © 2024 Sirahats. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });

      logger.info("Admin password reset email sent successfully", {
        path: "/api/auth/admin/forgot-password",
        metadata: {
          email,
          userId: user._id,
        },
      });

      return successResponse(
        {},
        "If an admin account with that email exists, a password reset link has been sent."
      );
    } catch (emailError) {
      logger.error("Failed to send admin password reset email", {
        path: "/api/auth/admin/forgot-password",
        error: emailError,
        metadata: {
          email,
          userId: user._id,
        },
      });

      // Remove the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error("Admin Forgot Password Error:", {
      path: "/api/auth/admin/forgot-password",
      error,
    });
    return handleApiError(error);
  }
}
