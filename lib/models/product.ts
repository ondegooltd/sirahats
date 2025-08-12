import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  images: string[];
  imagePublicIds?: string[]; // Cloudinary public IDs for image management
  description: string;
  category: string;
  collectionId: string;
  isNewProduct: boolean;
  inStock: boolean;
  materials: string[];
  dimensions: string;
  origin: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  imagePublicIds: [{ type: String }], // Store Cloudinary public IDs
  description: { type: String, required: true },
  category: { type: String, required: true },
  collectionId: { type: String, required: true },
  isNewProduct: { type: Boolean, default: false },
  inStock: { type: Boolean, required: true },
  materials: [{ type: String, required: true }],
  dimensions: { type: String, required: true },
  origin: { type: String, required: true },
}, { timestamps: true });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema); 