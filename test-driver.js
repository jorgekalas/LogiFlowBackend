import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Conectado a Atlas con el driver oficial");
    const db = client.db("LogiFlow");
    console.log("📂 Bases disponibles:", await db.admin().listDatabases());
  } catch (err) {
    console.error("❌ Error driver oficial:", err);
  } finally {
    await client.close();
  }
}

run();
