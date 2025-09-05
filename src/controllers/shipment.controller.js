import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Shipment } from "../models/shipment.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../../data/db.json");

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ shipments: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH);
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function listShipments(req, res) {
  const db = readDb();
  res.render("shipments/index", { shipments: db.shipments });
}

export function showCreate(req, res) {
  res.render("shipments/new");
}

export function createShipment(req, res) {
  const db = readDb();
  const shipment = new Shipment(req.body);
  db.shipments.push(shipment);
  writeDb(db);
  res.redirect("/shipments");
}

export function showEdit(req, res) {
  const db = readDb();
  const shipment = db.shipments.find(s => s.id === req.params.id);
  res.render("shipments/edit", { shipment });
}

export function updateShipment(req, res) {
  const db = readDb();
  const idx = db.shipments.findIndex(s => s.id === req.params.id);
  db.shipments[idx] = { ...db.shipments[idx], ...req.body };
  writeDb(db);
  res.redirect("/shipments");
}

export function deleteShipment(req, res) {
  const db = readDb();
  db.shipments = db.shipments.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.redirect("/shipments");
}