import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Phone from "@/models/Phone";
import User from "@/models/User";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

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

    const phones = await Phone.find(filter)
      .populate({ path: "sellerId", model: User, select: "name phone" })
      .sort({ createdAt: -1 })
      .lean();

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
    // Use python AI model to predict price
    let predictedPrice = 0;
    try {
      const scriptPath = path.join(process.cwd(), "ai_model", "predict_api.py");
      
      // We pass the raw request body as json to the python script
      const jsonPayload = JSON.stringify({
        brand,
        phoneModel,
        ram,
        storage,
        daysUsed,
        batteryHealth,
        screenCondition
      });
      
      // Escape quotes for bash argument safety by encoding to base64
      const b64Payload = Buffer.from(jsonPayload).toString("base64");
      
      const { stdout } = await execPromise(`python "${scriptPath}" --b64 "${b64Payload}"`);
      
      const result = JSON.parse(stdout);
      if (result.price) {
        predictedPrice = result.price;
        console.log("AI Predicted Price:", predictedPrice);
      } else if (result.error) {
        console.error("AI Prediction Error internally:", result.error);
        predictedPrice = 0; // Fallback
      }
    } catch (aiError) {
      console.error("Failed to run AI prediction script:", aiError);
      predictedPrice = 0; // Fallback
    }

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
      price: predictedPrice, 
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
