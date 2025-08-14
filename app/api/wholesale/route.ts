import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { WholesaleApplication } from "@/lib/models/wholesale";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "businessName",
      "contactName",
      "email",
      "phone",
      "businessType",
      "address",
      "taxId",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create wholesale application
    const application = await WholesaleApplication.create({
      businessName: body.businessName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone,
      website: body.website || "",
      businessType: body.businessType,
      address: body.address,
      taxId: body.taxId,
      message: body.message || "",
      status: "pending",
    });

    logger.info("Wholesale application created", {
      metadata: {
        applicationId: application._id.toString(),
        businessName: application.businessName,
        email: application.email,
      },
    });

    return successResponse(
      application,
      "Wholesale application submitted successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    // Get applications with pagination
    const applications = await WholesaleApplication.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await WholesaleApplication.countDocuments(query);

    return successResponse(
      {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Wholesale applications retrieved successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
