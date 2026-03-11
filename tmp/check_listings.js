const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://hamroadmin:Hamro123@hamrophone.2zvosye.mongodb.net/hamrophone";

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const PhoneSchema = new mongoose.Schema({
      brand: String,
      phoneModel: String,
      sellerId: mongoose.Schema.Types.ObjectId,
      available: Boolean
    }, { timestamps: true });

    const Phone = mongoose.models.Phone || mongoose.model('Phone', PhoneSchema);

    const UserSchema = new mongoose.Schema({
        name: String,
        email: String
    });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const users = await User.find({}).lean();
    console.log("Users:", JSON.stringify(users, null, 2));

    const phones = await Phone.find({}).lean();
    console.log("Total Phones:", phones.length);
    console.log("Phones with sellerId:", phones.filter(p => p.sellerId).length);
    console.log("Sample Phones:", JSON.stringify(phones.slice(0, 5), null, 2));

    if (users.length > 0) {
        for (const user of users) {
             const userPhones = await Phone.find({ sellerId: user._id }).lean();
             console.log(`User ${user.email} (${user._id}) has ${userPhones.length} listings`);
        }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
