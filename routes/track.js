const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");

// GET: Fetch tracked items
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ items: user.trackedItems || [] });
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ message: "Failed to fetch tracked items" });
  }
});

// POST: Add a tracked item
router.post("/", verifyToken, async (req, res) => {
  const { item, weight, type } = req.body;

  const parsedWeight = parseFloat(weight);
  if (
    !item ||
    !parsedWeight ||
    parsedWeight <= 0 ||
    !["saved", "donated"].includes(type)
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTrackedItem = {
      item,
      weight: parsedWeight,
      type,
      createdAt: new Date(),
    };

    user.trackedItems.unshift(newTrackedItem);

    // Update stats
    user.stats.itemsTracked += 1;
    if (type === "saved") user.stats.wasteSaved += parsedWeight;
    if (type === "donated") user.stats.foodDonated += 1;

    await user.save();

    res.status(201).json({
      message: "Item tracked successfully",
      item: newTrackedItem,
      stats: user.stats,
    });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: "Failed to add tracked item" });
  }
});

// DELETE: Remove a tracked item by createdAt
router.delete("/", verifyToken, async (req, res) => {
  const { createdAt } = req.body;
  if (!createdAt)
    return res
      .status(400)
      .json({ message: "createdAt is required for deletion" });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const originalLength = user.trackedItems.length;

    user.trackedItems = user.trackedItems.filter(
      (item) =>
        new Date(item.createdAt).toISOString() !==
        new Date(createdAt).toISOString()
    );

    if (user.trackedItems.length === originalLength) {
      return res.status(404).json({ message: "Item not found for deletion" });
    }

    await user.save();
    res.json({ message: "Item removed", items: user.trackedItems });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: "Failed to delete tracked item" });
  }
});

module.exports = router;
