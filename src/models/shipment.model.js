import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    sequence: { type: Number, unique: true }, // número autoincremental
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 }
      }
    ],
    origin: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pendiente", "en tránsito", "entregado"],
      default: "pendiente"
    }
  },
  { timestamps: true }
);

// Middleware para autoincrementar sequence
shipmentSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    const last = await mongoose
      .model("Shipment")
      .findOne()
      .sort({ sequence: -1 });
    this.sequence = last ? last.sequence + 1 : 1;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Shipment", shipmentSchema);
