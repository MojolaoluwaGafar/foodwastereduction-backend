const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  itemsTracked: { type: Number, default: 0 },
  foodDonated: { type: Number, default: 0 },
  wasteSaved: { type: Number, default: 0 }, 
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stats: { type: statsSchema, default: () => ({}) },
});

module.exports = mongoose.model("User", userSchema);
