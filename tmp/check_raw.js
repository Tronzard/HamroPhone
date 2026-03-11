const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://hamroadmin:Hamro123@hamrophone.2zvosye.mongodb.net/hamrophone";

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    // Use a very permissive schema to see all fields
    const Phone = mongoose.connection.db.collection('phones');

    const phones = await Phone.find({}).toArray();
    console.log("Total Phones:", phones.length);
    
    phones.forEach((p, i) => {
        console.log(`Phone ${i}: ${p.brand} ${p.phoneModel}`);
        console.log("Keys:", Object.keys(p));
        if (p.sellerId) {
             console.log("sellerId:", p.sellerId, "Type:", typeof p.sellerId);
        }
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
