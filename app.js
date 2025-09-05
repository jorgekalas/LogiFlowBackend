import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import shipmentRouter from "./src/routes/shipment.routes.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => res.redirect("/shipments"));
app.use("/shipments", shipmentRouter);

app.listen(PORT, () => {
  console.log(`🚚 LogiFlow server running on http://localhost:${PORT}`);
});