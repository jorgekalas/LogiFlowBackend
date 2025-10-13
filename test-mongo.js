// test-mongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("🔗 Probando conexión con URI:", uri);

async function run() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Conectado correctamente a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
