import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "../models/client.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../../data/db.json");

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ shipments: [], clients: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH);
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function listClients(req, res) {
  const db = readDb();
  res.render("clients/index", { clients: db.clients });
}

export function showCreate(req, res) {
  res.render("clients/new");
}

export function createClient(req, res) {
  const db = readDb();
  const client = new Client(req.body);
  db.clients.push(client);
  writeDb(db);
  res.redirect("/clients");
}

export function showEdit(req, res) {
  const db = readDb();
  const client = db.clients.find(c => c.id === req.params.id);
  res.render("clients/edit", { client });
}

export function updateClient(req, res) {
  const db = readDb();
  const idx = db.clients.findIndex(c => c.id === req.params.id);
  db.clients[idx] = { ...db.clients[idx], ...req.body };
  writeDb(db);
  res.redirect("/clients");
}

export function deleteClient(req, res) {
  const db = readDb();
  db.clients = db.clients.filter(c => c.id !== req.params.id);
  writeDb(db);
  res.redirect("/clients");
}
