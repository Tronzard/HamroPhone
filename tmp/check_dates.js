const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://hamroadmin:Hamro123@hamrophone.2zvosye.mongodb.net/hamrophone";

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const Phone = mongoose.connection.db.collection('phones');

    const phones = await Phone.find({}).toArray();
    
    phones.forEach((p, i) => {
        console.log(`Phone ${i}: ${p.brand} ${p.phoneModel}, createdAt: ${p.createdAt}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
