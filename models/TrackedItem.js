const mongoose = require("mongoose");

const TrackedItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  item: { type: String, required: true },
  weight: { type: Number, required: true },
  type: { type: String, enum: ["saved", "donated"], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TrackedItem", TrackedItemSchema);
