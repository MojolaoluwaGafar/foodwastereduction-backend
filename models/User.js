const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  itemsTracked: { type: Number, default: 0 },
  foodDonated: { type: Number, default: 0 },
  wasteSaved: { type: Number, default: 0 },
});

const trackedItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  weight: { type: Number, required: true },
  type: { type: String, enum: ["saved", "donated"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    default: null,
  },
  stats: { type: statsSchema, default: () => ({}) },
  trackedItems: { type: [trackedItemSchema], default: [] },

  resetToken: String,
  resetTokenExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
