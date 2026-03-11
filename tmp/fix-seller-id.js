const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://hamroadmin:Hamro123@hamrophone.2zvosye.mongodb.net/hamrophone";
const TARGET_USER_ID = "69aef896a24d8d921e07e84c"; // Satyam Khatiwada

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const Phone = mongoose.connection.db.collection('phones');

    const result = await Phone.updateMany(
      { sellerId: { $exists: false } },
      { $set: { sellerId: new mongoose.Types.ObjectId(TARGET_USER_ID) } }
    );

    console.log(`Updated ${result.modifiedCount} listings with sellerId: ${TARGET_USER_ID}`);

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
