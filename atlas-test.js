import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    console.log("🔗 URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Conexión exitosa a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
  