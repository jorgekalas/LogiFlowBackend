import mongoose from "mongoose";

export default async function connectMongo(uri) {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando a Mongo:", err);
    throw err;
  }
}
