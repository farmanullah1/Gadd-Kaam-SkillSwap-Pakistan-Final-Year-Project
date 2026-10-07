const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if needed
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // Check if admin exists to avoid duplicates
    const existingAdmin = await User.findOne({ email: "admin@skillswap.com" });
    if (existingAdmin) {
        console.log("⚠️ Admin user already exists.");
        process.exit();
    }

    const adminUser = new User({
      firstName: "Super",
      lastName: "Admin",
      username: "admin",
      email: "admin@skillswap.com",
      phoneNumber: "00000000000",
      dateOfBirth: new Date(),
      cnicNumber: "00000-0000000-0",
      gender: "Male",
      password: "adminpassword123", // The pre-save hook in User.js will hash this
      role: "admin", // ✅ CRITICAL: Sets admin permissions
      isBanned: false
    });

    await adminUser.save();
    console.log("🎉 Admin User Created successfully!");
    console.log("📧 Email: admin@skillswap.com");
    console.log("🔑 Password: adminpassword123");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();