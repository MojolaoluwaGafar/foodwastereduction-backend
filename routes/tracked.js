const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

// GET: Fetch tracked items (with optional pagination and date filtering)
router.get("/", verifyToken, async (req, res) => {
  const { page = 1, limit = 10, date } = req.query;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let items = user.trackedItems;

    // Filter by date
    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);

      items = items.filter(
        (item) =>
          new Date(item.createdAt) >= targetDate &&
          new Date(item.createdAt) < nextDate
      );
    }

    // Pagination
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + Number(limit));

    res.json({
      total: items.length,
      page: Number(page),
      limit: Number(limit),
      items: paginatedItems,
    });
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
      _id: uuidv4(),
      item,
      weight: parsedWeight,
      type,
      createdAt: new Date(),
    };

    user.trackedItems.unshift(newTrackedItem);

    user.stats.itemsTracked += 1;
    if (type === "saved") user.stats.wasteSaved += parsedWeight;
    if (type === "donated") user.stats.foodDonated += 1;

    await user.save();

    res
      .status(201)
      .json({
        message: "Item tracked",
        item: newTrackedItem,
        stats: user.stats,
      });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: "Failed to track item" });
  }
});

// PUT: Edit tracked item
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { item, weight, type } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const trackedItem = user.trackedItems.find((i) => i._id === id);
    if (!trackedItem)
      return res.status(404).json({ message: "Item not found" });

    // Revert stats for the old item
    if (trackedItem.type === "saved")
      user.stats.wasteSaved -= trackedItem.weight;
    if (trackedItem.type === "donated") user.stats.foodDonated -= 1;

    // Update fields
    if (item) trackedItem.item = item;
    if (weight) trackedItem.weight = parseFloat(weight);
    if (type) trackedItem.type = type;
    trackedItem.createdAt = new Date(); // optional: reset date on update

    // Apply new stats
    if (type === "saved") user.stats.wasteSaved += trackedItem.weight;
    if (type === "donated") user.stats.foodDonated += 1;

    await user.save();
    res.json({ message: "Item updated", item: trackedItem, stats: user.stats });
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ message: "Failed to update item" });
  }
});

// DELETE: Remove by _id
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.trackedItems.findIndex((item) => item._id === id);
    if (index === -1)
      return res.status(404).json({ message: "Item not found" });

    const deleted = user.trackedItems[index];

    // Revert stats
    user.stats.itemsTracked -= 1;
    if (deleted.type === "saved") user.stats.wasteSaved -= deleted.weight;
    if (deleted.type === "donated") user.stats.foodDonated -= 1;

    user.trackedItems.splice(index, 1);
    await user.save();

    res.json({ message: "Item deleted", stats: user.stats });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: "Failed to delete tracked item" });
  }
});

module.exports = router;
