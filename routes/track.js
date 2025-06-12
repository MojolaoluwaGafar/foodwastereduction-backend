const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const TrackedItem = require("../models/TrackedItem");
const User = require("../models/User");

router.post("/", verifyToken, async (req, res) => {
  const { item, weight, type } = req.body;

  if (!item || !weight || !["saved", "donated"].includes(type)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const newItem = await TrackedItem.create({
      user: req.user.id,
      item,
      weight,
      type,
    });

    const update = {
      $inc: {
        "stats.itemsTracked": 1,
        "stats.wasteSaved": type === "saved" ? weight : 0,
        "stats.foodDonated": type === "donated" ? 1 : 0,
      },
    };

    await User.findByIdAndUpdate(req.user.id, update);

    res.status(201).json({ message: "Food item tracked", item: newItem });
  } catch (err) {
    console.error("Track error:", err.message);
    res.status(500).json({ message: "Error tracking item" });
  }
});

module.exports = router;
