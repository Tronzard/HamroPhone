const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://hamroadmin:Hamro123@hamrophone.2zvosye.mongodb.net/hamrophone";

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const Phone = mongoose.connection.db.collection('phones');

    const phonesWithSeller = await Phone.find({ sellerId: { $exists: true } }).toArray();
    console.log("Phones with sellerId:", phonesWithSeller.length);
    
    if (phonesWithSeller.length > 0) {
        console.log("Sample Phone with sellerId:", JSON.stringify(phonesWithSeller[0], null, 2));
    }

    const allPhones = await Phone.find({}).toArray();
    console.log("Checking all phones for sellerId property directly...");
    allPhones.forEach((p, i) => {
        if (p.sellerId !== undefined) {
             console.log(`Phone ${i} has sellerId:`, p.sellerId);
        }
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
