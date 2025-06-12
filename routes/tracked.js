const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const TrackedItem = require("../models/TrackedItem");

router.get("/", verifyToken, async (req, res) => {
  try {
    const items = await TrackedItem.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    console.log("User ID:", req.user.id);
    console.log("Items found:", items);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tracked items" });
  }
});

module.exports = router;
