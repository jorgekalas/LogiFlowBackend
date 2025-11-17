import Client from "../models/client.model.js";
import { parseValidationError, parseDuplicateKeyError } from "../utils/parseValidationError.js";

// GET /clients
export const listClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ lastName: 1 }).lean();
    res.render("clients/index", { clients });
  } catch (err) {
    next(err);
  }
};

// GET /clients/new
export const showCreate = (req, res) => {
  res.render("clients/new", { formData: {} });
};

// POST /clients
export const createClient = async (req, res, next) => {
  try {
    const { name, lastName, dni, email, phone } = req.body;
    const client = new Client({ name, lastName, dni, email, phone });
    await client.save();
    res.redirect("/clients");
  } catch (err) {
    const validationMsg = parseValidationError(err) || parseDuplicateKeyError(err);
    if (validationMsg) {
      return res.status(400).render("clients/new", {
        error: validationMsg,
        formData: req.body
      });
    }
    next(err);
  }
};

// GET /clients/:id/edit
export const showEdit = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).lean();
    if (!client) return res.status(404).send("Cliente no encontrado");
    res.render("clients/edit", { client });
  } catch (err) {
    next(err);
  }
};

// PUT /clients/:id
export const updateClient = async (req, res, next) => {
  try {
    const { name, lastName, dni, email, phone } = req.body;

    await Client.findByIdAndUpdate(
      req.params.id,
      { name, lastName, dni, email, phone },
      { runValidators: true }
    );

    res.redirect("/clients");
  } catch (err) {
    const validationMsg = parseValidationError(err) || parseDuplicateKeyError(err);
    if (validationMsg) {
      const client = { _id: req.params.id, ...req.body };
      return res.status(400).render("clients/edit", {
        error: validationMsg,
        client
      });
    }
    next(err);
  }
};

// DELETE /clients/:id
export const deleteClient = async (req, res, next) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.redirect("/clients");
  } catch (err) {
    next(err);
  }
};
