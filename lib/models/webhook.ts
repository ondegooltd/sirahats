import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IWebhook extends Document {
  orderId: Types.ObjectId; // reference to Order
  userId: Types.ObjectId; // reference to User
  reference: string; // Paystack reference
  amount: number;
  metadata?: Record<string, any>;
  customer?: Record<string, any>;
  event?: string; // e.g. "charge.success"
  rawData?: Record<string, any>; // full webhook payload (optional)
}

const WebhookSchema = new Schema<IWebhook>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reference: { type: String, required: true, unique: true }, // Paystack reference
    amount: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
    customer: { type: Schema.Types.Mixed },
    event: { type: String },
    rawData: { type: Schema.Types.Mixed }, // keep the raw webhook for debugging
  },
  { timestamps: true }
);

export const Webhook: Model<IWebhook> =
  mongoose.models.Webhook || mongoose.model<IWebhook>("Webhook", WebhookSchema);
