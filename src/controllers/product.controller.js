import Product from "../models/product.model.js";
import { parseValidationError, parseDuplicateKeyError } from "../utils/parseValidationError.js";

// GET /products
export const listProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ name: 1 }).lean();
    res.render("products/index", { products });
  } catch (err) {
    next(err);
  }
};

// GET /products/new
export const showCreate = (req, res) => {
  res.render("products/new", { formData: {} });
};

// POST /products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, stock, price } = req.body;
    await Product.create({ name, description, stock, price });
    res.redirect("/products");
  } catch (err) {
    const validationMsg = parseValidationError(err) || parseDuplicateKeyError(err);
    if (validationMsg) {
      return res.status(400).render("products/new", {
        error: validationMsg,
        formData: req.body
      });
    }
    next(err);
  }
};

// GET /products/:id/edit
export const showEdit = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("products/edit", { product });
  } catch (err) {
    next(err);
  }
};

// PUT /products/:id  (versión web usa POST)
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, stock, price } = req.body;

    await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, stock, price },
      { runValidators: true }
    );

    res.redirect("/products");
  } catch (err) {
    const validationMsg = parseValidationError(err) || parseDuplicateKeyError(err);
    if (validationMsg) {
      const product = { _id: req.params.id, ...req.body };
      return res.status(400).render("products/edit", {
        error: validationMsg,
        product
      });
    }
    next(err);
  }
};

// DELETE /products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
};
