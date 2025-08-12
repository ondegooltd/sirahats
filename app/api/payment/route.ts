import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/order";
import {
  handleApiError,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { amount, email, reference, callback_url } = await req.json();

    if (!amount || !email || !reference) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Paystack transaction
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to kobo (smallest currency unit)
          email,
          reference,
          callback_url,
          currency: "GHS",
          channels: ["card", "mobile_money", "bank"],
          metadata: {
            user_id: session.user.id,
            custom_fields: [
              {
                display_name: "User ID",
                variable_name: "user_id",
                value: session.user.id,
              },
            ],
          },
        }),
      }
    );

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      logger.error("Paystack initialization error:", errorData);
      throw new Error("Failed to initialize payment");
    }

    const paystackData = await paystackResponse.json();

    return successResponse(
      {
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
      "Payment initialized successfully"
    );
  } catch (error) {
    logger.error("Payment POST Error:", {
      path: "/api/payment",
      error,
    });
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    // Verify Paystack transaction
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      logger.error("Paystack verification error:", errorData);
      throw new Error("Failed to verify payment");
    }

    const paystackData = await paystackResponse.json();

    return successResponse(
      {
        status: paystackData.data.status,
        amount: paystackData.data.amount / 100, // Convert from kobo to GHS
        reference: paystackData.data.reference,
        gateway_response: paystackData.data.gateway_response,
        customer: paystackData.data.customer,
        metadata: paystackData.data.metadata,
      },
      "Payment verified successfully"
    );
  } catch (error) {
    logger.error("Payment GET Error:", {
      path: "/api/payment",
      error,
    });
    return handleApiError(error);
  }
}
