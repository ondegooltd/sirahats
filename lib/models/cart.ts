import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId; // reference to Product
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId; // reference to User
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
