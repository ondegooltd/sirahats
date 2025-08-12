import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import {
  handleApiError,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";
import { EmailService } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password, firstName, lastName, phone, address } =
      await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("User with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address,
      role: "user",
    });

    // Send welcome email
    try {
      await EmailService.sendWelcomeEmail(user);
      logger.info("Welcome email sent successfully", {
        path: "/api/auth/register",
        metadata: {
          userId: user._id,
          email: user.email,
        },
      });
    } catch (emailError) {
      logger.error("Failed to send welcome email", {
        path: "/api/auth/register",
        error: emailError,
        metadata: {
          userId: user._id,
          email: user.email,
        },
      });
      // Don't fail registration if email fails
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return successResponse(
      userWithoutPassword,
      "User registered successfully",
      { statusCode: 201 }
    );
  } catch (error) {
    logger.error("Registration Error:", {
      path: "/api/auth/register",
      error,
    });
    return handleApiError(error);
  }
}
