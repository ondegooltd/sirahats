import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
  wishlist: Types.ObjectId[]; // Array of product IDs
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  settings?: {
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
      sms: boolean;
    };
    preferences: {
      language: string;
      currency: string;
    };
    security: {
      lastPasswordChange: Date;
      twoFactorEnabled: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: {
      type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    settings: {
      notifications: {
        orderUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        newsletter: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      preferences: {
        language: { type: String, default: "en" },
        currency: { type: String, default: "GHS" },
      },
      security: {
        lastPasswordChange: { type: Date, default: Date.now },
        twoFactorEnabled: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

// Pre-save middleware to ensure wishlist and settings are always initialized
UserSchema.pre("save", function (next) {
  if (!this.wishlist) {
    this.wishlist = [];
  }

  // Ensure settings are properly initialized
  if (!this.settings) {
    this.settings = {
      notifications: {
        orderUpdates: true,
        promotions: false,
        newsletter: true,
        sms: false,
      },
      preferences: {
        language: "en",
        currency: "GHS",
      },
      security: {
        lastPasswordChange: this.updatedAt || new Date(),
        twoFactorEnabled: false,
      },
    };
  }

  console.log("Pre-save middleware - settings:", this.settings);
  next();
});

// Static method to fix existing users without wishlist field
UserSchema.statics.fixWishlistField = async function () {
  try {
    const result = await this.updateMany(
      {
        $or: [
          { wishlist: { $exists: false } },
          { wishlist: null },
          { wishlist: undefined },
        ],
      },
      { $set: { wishlist: [] } }
    );
    return result.modifiedCount;
  } catch (error) {
    console.error("Error fixing wishlist field:", error);
    throw error;
  }
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
