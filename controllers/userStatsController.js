const User = require("../models/User");

exports.getUserStats = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.stats);
};

exports.updateTracked = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.stats.itemsTracked += 1;
  await user.save();
  res.json({ message: "Item tracked", stats: user.stats });
};

exports.updateDonated = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.stats.foodDonated += 1;
  await user.save();
  res.json({ message: "Donation recorded", stats: user.stats });
};

exports.updateWaste = async (req, res) => {
  const { amount } = req.body; // amount in kg
  const user = await User.findById(req.user.id);
  user.stats.wasteSaved += Number(amount);
  await user.save();
  res.json({ message: "Waste saved recorded", stats: user.stats });
};
