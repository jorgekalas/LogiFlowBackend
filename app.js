import express from "express";
import methodOverride from "method-override";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import connectMongo from "./src/config/mongo.js";
import shipmentRoutes from "./src/routes/shipment.routes.js";
import clientRoutes from "./src/routes/client.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import invoiceRoutes from "./src/routes/invoice.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import { isAuthenticated } from "./src/middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// parsers & method override
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// sessions
app.use(
  session({
    secret: "logiflow-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// session disponible en todas las vistas Pug
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// views
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "pug");

// rutas públicas
app.use(authRoutes);

// rutas protegidas
app.use(isAuthenticated);
app.use("/clients", clientRoutes);
app.use("/products", productRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/invoices", invoiceRoutes);

// home
app.get("/", (req, res) => res.render("home"));

// errores
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);
  res.status(500).send("Ocurrió un error inesperado. Reintentá más tarde.");
});

// boot
connectMongo(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ No se pudo conectar a Mongo:", err);
    process.exit(1);
  });
