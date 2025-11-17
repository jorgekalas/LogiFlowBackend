import mongoose from "mongoose";
import Shipment from "../models/shipment.model.js";
import Client from "../models/client.model.js";
import Product from "../models/product.model.js";
import Invoice from "../models/invoice.model.js";
import { parseValidationError, parseDuplicateKeyError } from "../utils/parseValidationError.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /shipments
export const listShipments = async (req, res, next) => {
  try {
    const shipments = await Shipment.find()
      .populate("client")
      .populate("products.product")
      .sort({ createdAt: -1 })
      .lean();

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

    res.render("shipments/new", {
      clients,
      products,
      formData: { quantities: {} }
    });
  } catch (err) {
    next(err);
  }
};

// POST /shipments
export const createShipment = async (req, res, next) => {
  try {
    const { client, origin, destination, status = "pendiente" } = req.body;
    const quantities = req.body.quantities || {};

    if (!isValidId(client)) {
      return res.status(400).render("shipments/new", {
        error: "Cliente inválido",
        clients: await Client.find().lean(),
        products: await Product.find().lean(),
        formData: req.body
      });
    }

    const shipment = new Shipment({
      client,
      origin,
      destination,
      status,
      products: []
    });

    // Procesar productos
    for (const [productId, rawQty] of Object.entries(quantities)) {
      const qty = Number(rawQty);
      if (!isValidId(productId)) continue;
      if (!Number.isFinite(qty) || qty <= 0) continue;

      const prod = await Product.findById(productId);
      if (!prod) continue;

      if (prod.stock < qty) {
        return res.status(400).render("shipments/new", {
          error: `Stock insuficiente para ${prod.name}. Disponible: ${prod.stock}`,
          clients: await Client.find().lean(),
          products: await Product.find().lean(),
          formData: req.body
        });
      }

      prod.stock -= qty;
      await prod.save();

      shipment.products.push({ product: prod._id, quantity: qty });
    }

    await shipment.save();
    res.redirect(`/invoices/new?shipmentId=${shipment._id}`);

  } catch (err) {
    const validationMsg = parseValidationError(err) || parseDuplicateKeyError(err);
    if (validationMsg) {
      return res.status(400).render("shipments/new", {
        error: validationMsg,
        clients: await Client.find().lean(),
        products: await Product.find().lean(),
        formData: req.body
      });
    }
    next(err);
  }
};

// GET /shipments/:id/edit
export const showEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send("ID inválido");

    const shipment = await Shipment.findById(id).populate("products.product").lean();
    const clients = await Client.find().sort({ name: 1 }).lean();
    const products = await Product.find().sort({ name: 1 }).lean();

    if (!shipment) return res.status(404).send("Envío no encontrado");

    res.render("shipments/edit", { shipment, clients, products });
  } catch (err) {
    next(err);
  }
};

// PUT /shipments/:id
export const updateShipment = async (req, res, next) => {
  try {
    const { client, origin, destination, status } = req.body;
    const quantities = req.body.quantities || {};
    const { id } = req.params;

    if (!isValidId(id)) return res.status(400).send("ID inválido");

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

    // Aplicar nuevos productos
    for (const [productId, rawQty] of Object.entries(quantities)) {
      const qty = Number(rawQty);
      if (!isValidId(productId)) continue;
      if (!Number.isFinite(qty) || qty <= 0) continue;

      const prod = await Product.findById(productId);
      if (!prod) continue;

      if (prod.stock < qty) {
        const clients = await Client.find().lean();
        const products = await Product.find().lean();

        return res.status(400).render("shipments/edit", {
          error: `Stock insuficiente para ${prod.name}. Disponible: ${prod.stock}`,
          shipment: { _id: id, ...req.body }, // mantener datos cargados
          clients,
          products
        });
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
    const validationMsg = parseValidationError(err);
    if (validationMsg) {
      return res.status(400).render("shipments/edit", {
        error: validationMsg,
        shipment: { _id: req.params.id, ...req.body },
        clients: await Client.find().lean(),
        products: await Product.find().lean()
      });
    }
    next(err);
  }
};

// DELETE /shipments/:id
export const deleteShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send("ID inválido");

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
