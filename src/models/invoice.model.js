import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  number:   { type: String, required: true },
  date:     { type: Date, required: true },
  amount:   { type: Number, required: true, min: 0 },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", default: null }
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
