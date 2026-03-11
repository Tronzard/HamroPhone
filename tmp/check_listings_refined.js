const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://hamroadmin:Hamro123@hamrophone.2zvosye.mongodb.net/hamrophone";

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const PhoneSchema = new mongoose.Schema({
      brand: String,
      phoneModel: String,
      sellerId: mongoose.Schema.Types.Mixed, // Use Mixed to see what's actually there
      available: Boolean
    }, { timestamps: true });

    const Phone = mongoose.models.Phone || mongoose.model('Phone', PhoneSchema);

    const phones = await Phone.find({}).lean();
    console.log("Total Phones:", phones.length);
    
    phones.forEach((p, i) => {
        if (p.sellerId) {
            console.log(`Phone ${i}: ${p.brand} ${p.phoneModel}, sellerId: ${p.sellerId}, type: ${typeof p.sellerId}, isObjectId: ${p.sellerId instanceof mongoose.Types.ObjectId || (p.sellerId._bsontype === 'ObjectID')}`);
        } else {
            console.log(`Phone ${i}: ${p.brand} ${p.phoneModel}, sellerId: MISSING`);
        }
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
