const mongoose = require("mongoose");

const foodDonationSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FoodDonation", foodDonationSchema);
