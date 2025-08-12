import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  imagePublicId?: string; // Cloudinary public ID for image management
  productCount: number;
}

const CollectionSchema = new Schema<ICollection>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String }, // Store Cloudinary public ID
  productCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema); 