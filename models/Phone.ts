import mongoose, { Schema, Model } from "mongoose";

// Plain object interface (not extending Document to avoid .model property conflict)
export interface IPhone {
  _id: string;
  brand: string;
  phoneModel: string; // renamed from 'model' to avoid Mongoose Document.model conflict
  ram: string;
  storage: string;
  daysUsed: number;
  batteryHealth: number;
  screenCondition: "Perfect" | "Minor Scratches" | "Cracked";
  description: string;
  price: number;
  photo: string;
  available: boolean;
  sellerId: string;
  createdAt: Date;
}

const PhoneSchema = new Schema(
  {
    brand: { type: String, required: true, trim: true },
    phoneModel: { type: String, required: true, trim: true },
    ram: { type: String, required: true },
    storage: { type: String, required: true },
    daysUsed: { type: Number, required: true, min: 0 },
    batteryHealth: { type: Number, required: true, min: 0, max: 100 },
    screenCondition: {
      type: String,
      enum: ["Perfect", "Minor Scratches", "Cracked"],
      required: true,
    },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    photo: { type: String, default: "" },
    available: { type: Boolean, default: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent model re-compilation in Next.js dev mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Phone: Model<any> =
  mongoose.models.Phone || mongoose.model("Phone", PhoneSchema);

export default Phone;
