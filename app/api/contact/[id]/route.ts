import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactMessage } from "@/lib/models/contact";
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

    // Validate the message exists
    const existingMessage = await ContactMessage.findById(id);
    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Update the message
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.status === "replied" && { repliedAt: new Date() }),
      },
      { new: true }
    );

    logger.info("Contact message updated", {
      metadata: {
        messageId: id,
        status: body.status,
        email: updatedMessage?.email,
      },
    });

    return successResponse(updatedMessage, "Message updated successfully");
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

    // Validate the message exists
    const existingMessage = await ContactMessage.findById(id);
    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Delete the message
    await ContactMessage.findByIdAndDelete(id);

    logger.info("Contact message deleted", {
      metadata: {
        messageId: id,
        email: existingMessage.email,
      },
    });

    return successResponse({}, "Message deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
