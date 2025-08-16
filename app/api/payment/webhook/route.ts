import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/order";
import { User } from "@/lib/models/user";
import { handleApiError, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { EmailService } from "@/lib/email-service";
import crypto from "crypto";
import { Webhook } from "@/lib/models/webhook";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      logger.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    await saveWebhook(event);

    // Handle different webhook events
    switch (event.event) {
      case "charge.success":
        await handlePaymentSuccess(event.data);
        break;
      case "transfer.success":
        await handleTransferSuccess(event.data);
        break;
      case "transfer.failed":
        await handleTransferFailed(event.data);
        break;
      default:
        logger.info(`Unhandled webhook event: ${event.event}`);
    }

    return successResponse({}, "Webhook processed successfully");
  } catch (error) {
    logger.error("Payment Webhook Error:", {
      path: "/api/payment/webhook",
      error,
    });
    return handleApiError(error);
  }
}

async function saveWebhook(event: any) {
  const { data, event: ev } = event;
  const { reference, amount, customer, metadata } = data;
  const orderId = metadata?.order_id;
  const userId = metadata?.user_id;
  try {
    await Webhook.create({
      orderId,
      reference,
      amount,
      metadata,
      event: ev,
      userId,
      customer,
      rawData: event,
    });

    logger.info("Webhook Saved", {
      path: "/api/payment/webhook",
      metadata: {
        orderId,
        userId,
        reference,
      },
    });
  } catch (error) {
    logger.error("Failed to save webhook", {
      path: "/api/payment/webhook",
      error,
      metadata: {
        orderId,
        userId,
        reference,
      },
    });
  }
}

async function handlePaymentSuccess(data: any) {
  try {
    const { reference, amount, customer, metadata } = data;
    const orderId = metadata?.order_id;

    if (!orderId) {
      logger.error("No order ID in payment metadata");
      return;
    }

    // Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "Processing",
        paymentStatus: "Paid",
        paymentReference: reference,
        paymentAmount: amount / 100, // Convert from kobo to GHS
        paidAt: new Date(),
      },
      { new: true }
    ).populate("user");

    if (!order) {
      logger.error(`Order not found: ${orderId}`);
      return;
    }

    // Send payment confirmation email
    try {
      if (order.user) {
        await EmailService.sendPaymentConfirmationEmail(order, order.user);
        logger.info("Payment confirmation email sent successfully", {
          path: "/api/payment/webhook",
          metadata: {
            orderId: (order as any)._id.toString(),
            userId: (order.user as any)._id.toString(),
            email: (order.user as any).email,
          },
        });
      }
    } catch (emailError) {
      logger.error("Failed to send payment confirmation email", {
        path: "/api/payment/webhook",
        error: emailError,
        metadata: {
          orderId: (order as any)._id.toString(),
        },
      });
      // Don't fail payment processing if email fails
    }

    logger.info(`Payment successful for order: ${orderId}`);
  } catch (error) {
    logger.error("Error handling payment success:", {
      path: "/api/payment/webhook",
      error,
    });
  }
}

async function handleTransferSuccess(data: any) {
  logger.info("Transfer successful:", data);
}

async function handleTransferFailed(data: any) {
  logger.error("Transfer failed:", data);
}
