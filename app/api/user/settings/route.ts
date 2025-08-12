import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { requireAuth } from "@/lib/middleware";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const user = await User.findById(session.user.id).select("+settings");
    console.log("Retrieved user from database:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return default settings if none exist
    const settings = user.settings
      ? {
          notifications: {
            orderUpdates: user.settings.notifications?.orderUpdates ?? true,
            promotions: user.settings.notifications?.promotions ?? false,
            newsletter: user.settings.notifications?.newsletter ?? true,
            sms: user.settings.notifications?.sms ?? false,
          },
          preferences: {
            language: user.settings.preferences?.language ?? "en",
            currency: user.settings.preferences?.currency ?? "GHS",
          },
          security: {
            lastPasswordChange:
              user.settings.security?.lastPasswordChange ?? user.updatedAt,
            twoFactorEnabled: user.settings.security?.twoFactorEnabled ?? false,
          },
        }
      : {
          notifications: {
            orderUpdates: true,
            promotions: false,
            newsletter: true,
            sms: false,
          },
          preferences: {
            language: "en",
            currency: "GHS",
          },
          security: {
            lastPasswordChange: user.updatedAt,
            twoFactorEnabled: false,
          },
        };

    console.log("Returning settings:", settings);
    return successResponse(settings, "User settings retrieved successfully");
  } catch (error) {
    logger.error("User Settings GET Error:", {
      path: "/api/user/settings",
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

    const updates = await req.json();
    console.log("Received settings update:", updates);

    // Validate the updates
    const allowedFields = ["notifications", "preferences", "security"];
    const validUpdates: any = {};

    for (const field of allowedFields) {
      if (updates[field]) {
        validUpdates[`settings.${field}`] = updates[field];
      }
    }

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // First, ensure the user exists and get current settings
    let user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize settings if they don't exist
    if (!user.settings) {
      user.settings = {
        notifications: {
          orderUpdates: true,
          promotions: false,
          newsletter: true,
          sms: false,
        },
        preferences: {
          language: "en",
          currency: "GHS",
        },
        security: {
          lastPasswordChange: user.updatedAt,
          twoFactorEnabled: false,
        },
      };
    }

    // Update the settings
    console.log("Current user settings:", user.settings);

    for (const [key, value] of Object.entries(updates)) {
      console.log(`Updating ${key}:`, value);
      if (allowedFields.includes(key)) {
        if (key === "notifications" && user.settings.notifications) {
          user.settings.notifications = {
            ...user.settings.notifications,
            ...(value as any),
          };
        } else if (key === "preferences" && user.settings.preferences) {
          user.settings.preferences = {
            ...user.settings.preferences,
            ...(value as any),
          };
        } else if (key === "security" && user.settings.security) {
          user.settings.security = {
            ...user.settings.security,
            ...(value as any),
          };
        }
      }
    }

    console.log("Updated user settings:", user.settings);

    // Save the updated user
    console.log("About to save user with settings:", user.settings);
    await user.save();
    console.log("User saved successfully");

    logger.info("User settings updated successfully", {
      path: "/api/user/settings",
      metadata: {
        userId: user._id,
        updatedFields: Object.keys(updates),
      },
    });

    return successResponse(user.settings, "Settings updated successfully");
  } catch (error) {
    logger.error("User Settings PATCH Error:", {
      path: "/api/user/settings",
      error,
    });
    return handleApiError(error);
  }
}
