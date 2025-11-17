import mongoose from "mongoose";
import Invoice from "../models/invoice.model.js";
import Shipment from "../models/shipment.model.js";
import { parseValidationError, parseDuplicateKeyError } from "../utils/parseValidationError.js";

// GET /invoices
export const listInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "shipment",
        populate: { path: "client" }
      })
      .sort({ createdAt: -1 })
      .lean();

    res.render("invoices/index", { invoices });
  } catch (err) {
    next(err);
  }
};

// GET /invoices/new
export const showCreate = async (req, res, next) => {
  try {
    const shipments = await Shipment.find()
      .populate("client")
      .sort({ sequence: 1 })
      .lean();

    let preselectedShipment = null;
    if (req.query.shipmentId && mongoose.Types.ObjectId.isValid(req.query.shipmentId)) {
      preselectedShipment = await Shipment.findById(req.query.shipmentId)
        .populate("client")
        .lean();
    }

    res.render("invoices/new", { shipments, preselectedShipment, formData: {} });
  } catch (err) {
    next(err);
  }
};

// POST /invoices
export const createInvoice = async (req, res, next) => {
  try {
    const { number, date, amount, shipment } = req.body;

    const invoice = new Invoice({
      number,
      date,
      amount,
      shipment: shipment || null
    });

    await invoice.save();
    res.redirect("/invoices");
  } catch (err) {
    const shipments = await Shipment.find().populate("client").sort({ sequence: 1 }).lean();
    const validationMsg = parseValidationError(err) || parseDuplicateKeyError(err);

    if (validationMsg) {
      return res.status(400).render("invoices/new", {
        error: validationMsg,
        shipments,
        formData: req.body
      });
    }
    next(err);
  }
};

// GET /invoices/:id/edit
export const showEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("ID inválido.");

    const invoice = await Invoice.findById(id)
      .populate({
        path: "shipment",
        populate: { path: "client" }
      })
      .lean();

    const shipments = await Shipment.find()
      .populate("client")
      .sort({ sequence: 1 })
      .lean();

    if (!invoice) return res.status(404).send("Factura no encontrada.");

    res.render("invoices/edit", { invoice, shipments });
  } catch (err) {
    next(err);
  }
};

// PUT /invoices/:id
export const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { number, date, amount, shipment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("ID inválido.");

    await Invoice.findByIdAndUpdate(
      id,
      { number, date, amount, shipment: shipment || null },
      { runValidators: true }
    );

    res.redirect("/invoices");
  } catch (err) {
    const shipments = await Shipment.find().populate("client").sort({ sequence: 1 }).lean();
    const validationMsg = parseValidationError(err) || parseDuplicateKeyError(err);

    if (validationMsg) {
      const invoice = { _id: req.params.id, ...req.body };
      return res.status(400).render("invoices/edit", {
        error: validationMsg,
        invoice,
        shipments
      });
    }

    next(err);
  }
};

// DELETE /invoices/:id
export const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("ID inválido.");

    await Invoice.findByIdAndDelete(id);
    res.redirect("/invoices");
  } catch (err) {
    next(err);
  }
};
