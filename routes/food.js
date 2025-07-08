const express = require("express");
const router = express.Router();
const FoodDonation = require("../models/FoodDonation");
const { protect } = require("../middleware/auth");

// Get donations of the logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const donations = await FoodDonation.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(donations);
  } catch (err) {
    console.error("❌ Error fetching donations:", err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});

// Get a single donation by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const donation = await FoodDonation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donation" });
  }
});

// Create a new food donation
router.post("/", protect, async (req, res) => {
  try {
    const donation = await FoodDonation.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: "Failed to create donation" });
  }
});

// Update a donation
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await FoodDonation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Donation not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update donation" });
  }
});

// Delete a donation
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await FoodDonation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleted)
      return res.status(404).json({ message: "Donation not found" });
    res.json({ message: "Donation deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete donation" });
  }
});
router.get("/public", async (req, res) => {
  try {
    const donations = await FoodDonation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error("❌ Error fetching public donations:", err);
    res.status(500).json({ message: "Failed to fetch public donations" });
  }
});

module.exports = router;
