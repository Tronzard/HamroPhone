import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Phone from "@/models/Phone";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("hamrophone_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectDB();

    const sellerObjectId = new mongoose.Types.ObjectId(decoded.id);
    
    // Find listings where sellerId matches the ObjectId OR the plain string
    const listings = await Phone.find({ 
      $or: [
        { sellerId: sellerObjectId },
        { sellerId: decoded.id }
      ]
    }).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Fetch my-listings error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
