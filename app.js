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
import { notFoundHandler, errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// parsers & method override
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-logiflow-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: true, // habilitar si usás HTTPS
      maxAge: 1000 * 60 * 60 // 1 hora
    }
  })
);

// sesión disponible en todas las vistas Pug
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// views
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "pug");

// servir archivos estáticos (por si luego agregamos CSS propio)
app.use(express.static(path.join(process.cwd(), "public")));

// rutas públicas (login / logout)
app.use(authRoutes);

// todas las rutas siguientes requieren autenticación
app.use(isAuthenticated);

// home
app.get("/", (req, res) => res.render("home"));

// rutas protegidas
app.use("/clients", clientRoutes);
app.use("/products", productRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/invoices", invoiceRoutes);

// 404
app.use(notFoundHandler);

// errores generales
app.use(errorHandler);

// boot
connectMongo(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ No se pudo conectar a Mongo:", err);
    process.exit(1);
  });
