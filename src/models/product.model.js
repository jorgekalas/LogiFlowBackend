import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "El stock no puede ser negativo"]
    },
    price: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
