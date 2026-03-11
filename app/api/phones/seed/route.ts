import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Phone from "@/models/Phone";

const SEED_PHONES = [
  {
    brand: "Apple",
    phoneModel: "iPhone 14 Pro",
    ram: "6GB",
    storage: "256GB",
    daysUsed: 180,
    batteryHealth: 92,
    screenCondition: "Perfect",
    description: "Used for 6 months, always kept in a case. No scratches. Comes with original box and charger.",
    price: 95000,
    photo: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600",
    available: true,
  },
  {
    brand: "Samsung",
    phoneModel: "Galaxy S23 Ultra",
    ram: "12GB",
    storage: "512GB",
    daysUsed: 300,
    batteryHealth: 87,
    screenCondition: "Minor Scratches",
    description: "Excellent camera, great battery life. Minor scratches on the screen but barely noticeable.",
    price: 88000,
    photo: "https://images.unsplash.com/photo-1677533273785-5cefde54e0ee?w=600",
    available: true,
  },
  {
    brand: "Google",
    phoneModel: "Pixel 7 Pro",
    ram: "12GB",
    storage: "128GB",
    daysUsed: 200,
    batteryHealth: 95,
    screenCondition: "Perfect",
    description: "Best camera phone experience. Running latest Android 14 update. Always screen protector used.",
    price: 72000,
    photo: "https://images.unsplash.com/photo-1666159544939-9f3e7a5e1c25?w=600",
    available: true,
  },
  {
    brand: "OnePlus",
    phoneModel: "11R 5G",
    ram: "16GB",
    storage: "256GB",
    daysUsed: 150,
    batteryHealth: 97,
    screenCondition: "Perfect",
    description: "Blazing fast with 150W charging. Gaming beast, barely used. Like new condition.",
    price: 55000,
    photo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
    available: true,
  },
  {
    brand: "Samsung",
    phoneModel: "Galaxy A54",
    ram: "8GB",
    storage: "128GB",
    daysUsed: 90,
    batteryHealth: 99,
    screenCondition: "Perfect",
    description: "Almost new condition. Bought in error, barely used. IP67 water resistant.",
    price: 38000,
    photo: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
    available: true,
  },
  {
    brand: "Xiaomi",
    phoneModel: "13 Pro",
    ram: "12GB",
    storage: "256GB",
    daysUsed: 365,
    batteryHealth: 84,
    screenCondition: "Minor Scratches",
    description: "Leica camera system, amazing display. Used for a year. Some micro-scratches on the back.",
    price: 68000,
    photo: "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600",
    available: true,
  },
  {
    brand: "Apple",
    phoneModel: "iPhone 13",
    ram: "4GB",
    storage: "128GB",
    daysUsed: 500,
    batteryHealth: 80,
    screenCondition: "Minor Scratches",
    description: "Reliable iPhone 13 at a great price. Battery still decent. Great camera and performance.",
    price: 70000,
    photo: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600",
    available: true,
  },
  {
    brand: "Oppo",
    phoneModel: "Find X6 Pro",
    ram: "12GB",
    storage: "256GB",
    daysUsed: 210,
    batteryHealth: 91,
    screenCondition: "Perfect",
    description: "Premium build quality, Hasselblad camera. Screen is pristine. Comes with 80W charger.",
    price: 62000,
    photo: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600",
    available: true,
  },
  {
    brand: "Motorola",
    phoneModel: "Edge 40 Pro",
    ram: "12GB",
    storage: "256GB",
    daysUsed: 60,
    batteryHealth: 98,
    screenCondition: "Perfect",
    description: "Barely used for 2 months. Stock Android, 125W TurboPower charging. Excellent condition.",
    price: 48000,
    photo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
    available: true,
  },
  {
    brand: "Apple",
    phoneModel: "iPhone 15",
    ram: "6GB",
    storage: "256GB",
    daysUsed: 45,
    batteryHealth: 99,
    screenCondition: "Perfect",
    description: "Latest iPhone, switching to Android. Barely used, like new. Original accessories included.",
    price: 115000,
    photo: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
    available: true,
  },
  {
    brand: "Samsung",
    phoneModel: "Galaxy Z Fold 5",
    ram: "12GB",
    storage: "512GB",
    daysUsed: 120,
    batteryHealth: 94,
    screenCondition: "Minor Scratches",
    description: "Foldable flagship. Hinge crease barely visible. Minor blemishes on outer screen.",
    price: 165000,
    photo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
    available: true,
  },
  {
    brand: "Google",
    phoneModel: "Pixel 6a",
    ram: "6GB",
    storage: "128GB",
    daysUsed: 400,
    batteryHealth: 82,
    screenCondition: "Minor Scratches",
    description: "Budget-friendly Pixel. Still a great camera. Shows some wear but fully functional.",
    price: 35000,
    photo: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600",
    available: true,
  },
];

export async function GET() {
  try {
    await connectDB();

    // Only seed if the collection is empty
    const exists = await Phone.countDocuments();
    if (exists > 0) {
      return NextResponse.json({ message: `Database already has ${exists} phones. Skipped seeding.` });
    }

    await Phone.insertMany(SEED_PHONES);
    return NextResponse.json({ message: `Successfully seeded ${SEED_PHONES.length} phones.` });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database." }, { status: 500 });
  }
}
