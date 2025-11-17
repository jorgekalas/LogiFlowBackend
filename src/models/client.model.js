import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dni: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"],
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/.+@.+\..+/, "Email inválido"]
  },
  phone: {
    type: String,
    trim: true
  }
});

const Client = mongoose.model("Client", clientSchema);
export default Client;
