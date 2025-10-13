import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },     
  dni: { type: String, required: true, trim: true },          
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true }
});

const Client = mongoose.model("Client", clientSchema);
export default Client;
