import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Phone from "@/models/Phone";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const screenCondition = searchParams.get("screenCondition");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minBattery = searchParams.get("minBattery");

    // Build filter object dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { available: true };

    if (brand && brand !== "All") filter.brand = brand;
    if (screenCondition && screenCondition !== "All") filter.screenCondition = screenCondition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minBattery) filter.batteryHealth = { $gte: Number(minBattery) };

    const phones = await Phone.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ phones }, { status: 200 });
  } catch (error) {
    console.error("Error fetching phones:", error);
    return NextResponse.json({ error: "Failed to fetch phones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("hamrophone_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
      return NextResponse.json({ error: "Invalid session. Please login again." }, { status: 401 });
    }

    const body = await req.json();
    const {
      brand,
      phoneModel,
      ram,
      storage,
      daysUsed,
      batteryHealth,
      screenCondition,
      description,
      photo,
    } = body;

    // Basic validation
    if (!brand || !phoneModel || !ram || !storage || daysUsed === undefined || batteryHealth === undefined || !screenCondition) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    await connectDB();

    console.log("Creating listing for user:", decoded.id);
    
    const newPhone = await Phone.create({
      brand,
      phoneModel,
      ram,
      storage,
      daysUsed: Number(daysUsed),
      batteryHealth: Number(batteryHealth),
      screenCondition,
      description: description || "",
      photo: photo || "",
      price: 0, 
      sellerId: new mongoose.Types.ObjectId(decoded.id),
      available: true,
    });

    console.log("Listing created successfully. Phone ID:", newPhone._id, "Seller ID:", newPhone.sellerId);

    return NextResponse.json({ message: "Listing created successfully!", phone: newPhone }, { status: 201 });
  } catch (error) {
    console.error("Error creating phone listing:", error);
    return NextResponse.json({ error: "Failed to create listing. Please try again." }, { status: 500 });
  }
}
