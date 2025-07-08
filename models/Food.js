const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Food", foodSchema);
