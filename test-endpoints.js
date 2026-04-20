const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo");

  const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  
  // Find a technical manager
  const techManager = await User.findOne({ role: "technical_manager" });
  if (!techManager) {
    console.log("No tech manager found");
    process.exit(0);
  }

  const token = jwt.sign(
    { id: techManager._id, role: techManager.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log("Token:", token);

  try {
    const res = await fetch("http://localhost:5000/api/technical-dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("Tech Dashboard Status:", res.status);
    if (!res.ok) console.error("Tech Dashboard Error Data:", data);
  } catch (err) {
    console.error("Tech Dashboard Request Failed:", err.message);
  }

  try {
    const res = await fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("Notifications Status:", res.status);
    if (!res.ok) console.error("Notifications Error Data:", data);
  } catch (err) {
    console.error("Notifications Request Failed:", err.message);
  }

  process.exit(0);
}

run();
