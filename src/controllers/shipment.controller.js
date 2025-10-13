import mongoose from "mongoose";
import Shipment from "../models/shipment.model.js";
import Client from "../models/client.model.js";
import Product from "../models/product.model.js";
import Invoice from "../models/invoice.model.js";

// GET /shipments
export const listShipments = async (req, res, next) => {
  try {
    const shipments = await Shipment.find()
      .populate("client")
      .populate("products.product")
      .sort({ createdAt: -1 })
      .lean();

    // para mostrar si tiene factura asociada
    const ids = shipments.map(s => s._id);
    const invoices = await Invoice.find({ shipment: { $in: ids } }).lean();
    const invoiceMap = new Map(invoices.map(i => [String(i.shipment), i]));

    res.render("shipments/index", { shipments, invoiceMap });
  } catch (err) {
    next(err);
  }
};

// GET /shipments/new
export const showCreate = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ name: 1 }).lean();
    const products = await Product.find().sort({ name: 1 }).lean();
    res.render("shipments/new", { clients, products });
  } catch (err) {
    next(err);
  }
};

// helpers
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /shipments
// Lee quantities[productId] = cantidad; descuenta stock solo si qty>0
export const createShipment = async (req, res, next) => {
  try {
    const { client, origin, destination, status = "pendiente" } = req.body;

    if (!isValidId(client)) return res.status(400).send("Cliente inválido");

    const shipment = new Shipment({
      client,
      origin,
      destination,
      status,
      products: [],
    });

    const quantities = req.body.quantities || {}; // objeto { productId: "qty", ... }

    for (const [productId, raw] of Object.entries(quantities)) {
      const qty = Number(raw);
      if (!isValidId(productId)) continue;
      if (!Number.isFinite(qty) || qty <= 0) continue;

      const prod = await Product.findById(productId);
      if (!prod) continue;

      if (prod.stock < qty) {
        return res
          .status(400)
          .send(`Stock insuficiente para ${prod.name}. Stock: ${prod.stock}`);
      }

      prod.stock -= qty;
      await prod.save();

      shipment.products.push({ product: prod._id, quantity: qty });
    }

    await shipment.save();
    res.redirect(`/invoices/new?shipmentId=${shipment._id}`);
  } catch (err) {
    next(err);
  }
};

// GET /shipments/:id/edit
export const showEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send("ID inválido");

    const [shipment, clients, products] = await Promise.all([
      Shipment.findById(id).populate("products.product").lean(),
      Client.find().sort({ name: 1 }).lean(),
      Product.find().sort({ name: 1 }).lean(),
    ]);

    if (!shipment) return res.status(404).send("Envío no encontrado");

    res.render("shipments/edit", { shipment, clients, products });
  } catch (err) {
    next(err);
  }
};

// PUT /shipments/:id
// Revierte stock de lo anterior y vuelve a aplicar lo nuevo
export const updateShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { client, origin, destination, status } = req.body;
    if (!isValidId(id)) return res.status(400).send("ID inválido");
    if (client && !isValidId(client)) return res.status(400).send("Cliente inválido");

    const shp = await Shipment.findById(id).populate("products.product");
    if (!shp) return res.status(404).send("Envío no encontrado");

    // Revertir stock previo
    for (const item of shp.products) {
      if (item.product) {
        item.product.stock += item.quantity;
        await item.product.save();
      }
    }
    shp.products = [];

    // Aplicar nuevos
    const quantities = req.body.quantities || {};
    for (const [productId, raw] of Object.entries(quantities)) {
      const qty = Number(raw);
      if (!isValidId(productId)) continue;
      if (!Number.isFinite(qty) || qty <= 0) continue;

      const prod = await Product.findById(productId);
      if (!prod) continue;

      if (prod.stock < qty) {
        return res
          .status(400)
          .send(`Stock insuficiente para ${prod.name}. Stock: ${prod.stock}`);
      }

      prod.stock -= qty;
      await prod.save();

      shp.products.push({ product: prod._id, quantity: qty });
    }

    shp.client = client || shp.client;
    shp.origin = origin ?? shp.origin;
    shp.destination = destination ?? shp.destination;
    shp.status = status ?? shp.status;

    await shp.save();
    res.redirect("/shipments");
  } catch (err) {
    next(err);
  }
};

// DELETE /shipments/:id
export const deleteShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send("ID inválido");

    // Devolver stock de lo que tenía el envío
    const shp = await Shipment.findById(id).populate("products.product");
    if (shp) {
      for (const item of shp.products) {
        if (item.product) {
          item.product.stock += item.quantity;
          await item.product.save();
        }
      }
      await shp.deleteOne();
    }

    res.redirect("/shipments");
  } catch (err) {
    next(err);
  }
};
