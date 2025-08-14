import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  category:
    | "general"
    | "product_inquiry"
    | "shipping"
    | "custom_order"
    | "returns"
    | "wholesale";
  createdAt: Date;
  repliedAt?: Date;
  repliedBy?: string;
  replyMessage?: string;
  priority: "low" | "medium" | "high";
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    category: {
      type: String,
      enum: [
        "general",
        "product_inquiry",
        "shipping",
        "custom_order",
        "returns",
        "wholesale",
      ],
      default: "general",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    repliedAt: {
      type: Date,
    },
    repliedBy: {
      type: String,
      trim: true,
    },
    replyMessage: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ category: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ priority: 1, createdAt: -1 });

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);
