import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Phone from "@/models/Phone";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("hamrophone_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const { id } = await params;

    await connectDB();
    const phone = await Phone.findById(id);

    if (!phone) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Verify ownership
    if (phone.sellerId.toString() !== decoded.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this listing" }, { status: 403 });
    }

    await Phone.findByIdAndDelete(id);

    return NextResponse.json({ message: "Listing deleted successfully." });
  } catch (error) {
    console.error("Delete listing error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
