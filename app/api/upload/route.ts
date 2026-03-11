import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import * as fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    // Validate if it's an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Clean up filename and add timestamp to prevent collisions
    const filename = file.name.replaceAll(" ", "_");
    const uniqueFilename = `${Date.now()}-${filename}`;
    
    // Define the upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Return the public URL for the image
    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
