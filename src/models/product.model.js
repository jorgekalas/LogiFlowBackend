import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  description:{ type: String, default: "" },
  stock:      { type: Number, required: true, min: 0 },
  price:      { type: Number, required: true, min: 0 }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
