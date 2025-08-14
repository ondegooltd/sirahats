import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { WholesaleApplication } from "@/lib/models/wholesale";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { id } = params;

    // Validate the application exists
    const existingApplication = await WholesaleApplication.findById(id);
    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update the application
    const updatedApplication = await WholesaleApplication.findByIdAndUpdate(
      id,
      {
        ...body,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    logger.info("Wholesale application updated", {
      metadata: {
        applicationId: id,
        status: body.status,
        businessName: updatedApplication?.businessName,
      },
    });

    return successResponse(
      updatedApplication,
      "Application updated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    // Validate the application exists
    const existingApplication = await WholesaleApplication.findById(id);
    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Delete the application
    await WholesaleApplication.findByIdAndDelete(id);

    logger.info("Wholesale application deleted", {
      metadata: {
        applicationId: id,
        businessName: existingApplication.businessName,
      },
    });

    return successResponse({}, "Application deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
