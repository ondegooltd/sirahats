import mongoose, { Schema, Document } from "mongoose";

export interface IWholesaleApplication extends Document {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  businessType: string;
  address: string;
  taxId: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

const wholesaleApplicationSchema = new Schema<IWholesaleApplication>(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    contactName: {
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
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: [
        "retail-store",
        "online-store",
        "interior-design",
        "gallery",
        "boutique",
        "other",
      ],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    taxId: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
wholesaleApplicationSchema.index({ status: 1, submittedAt: -1 });
wholesaleApplicationSchema.index({ email: 1 });
wholesaleApplicationSchema.index({ businessName: 1 });

export const WholesaleApplication =
  mongoose.models.WholesaleApplication ||
  mongoose.model<IWholesaleApplication>(
    "WholesaleApplication",
    wholesaleApplicationSchema
  );
