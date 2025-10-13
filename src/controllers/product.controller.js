import Product from "../models/product.model.js";

export const listProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ name: 1 }).lean();
    res.render("products/index", { products });
  } catch (err) { next(err); }
};

export const showCreate = (req, res) => {
  res.render("products/new");
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, stock, price } = req.body;
    await Product.create({ name, description, stock, price });
    res.redirect("/products");
  } catch (err) { next(err); }
};

export const showEdit = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("products/edit", { product });
  } catch (err) { next(err); }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, stock, price } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, description, stock, price }, { runValidators: true });
    res.redirect("/products");
  } catch (err) { next(err); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  } catch (err) { next(err); }
};
