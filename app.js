import express from "express";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectMongo from "./src/config/mongo.js";
import shipmentRoutes from "./src/routes/shipment.routes.js";
import clientRoutes from "./src/routes/client.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import invoiceRoutes from "./src/routes/invoice.routes.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // parse form
app.use(express.json());
app.use(methodOverride("_method"));

// vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "pug");

// rutas
app.get("/", (req, res) => res.render("home"));
app.use("/shipments", shipmentRoutes);
app.use("/clients", clientRoutes);
app.use("/products", productRoutes);
app.use("/invoices", invoiceRoutes);

// middleware de errores (evita que el server caiga)
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);
  res.status(500).send("Ocurrió un error inesperado. Reintentá más tarde.");
});

connectMongo(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`🚚 Server http://localhost:${PORT}`)))
  .catch(err => {
    console.error("❌ No se pudo conectar a Mongo:", err);
    process.exit(1);
  });
