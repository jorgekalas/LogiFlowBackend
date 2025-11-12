import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/logiflow";

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const exists = await User.findOne({ username: "admin" });
    if (exists) {
      console.log("⚠️  El usuario admin ya existe");
    } else {
      await User.create({ username: "admin", password: "admin123" });
      console.log("✅ Usuario admin creado correctamente");
    }
  } catch (err) {
    console.error("❌ Error al conectar o crear el usuario:", err);
  } finally {
    process.exit();
  }
})();
