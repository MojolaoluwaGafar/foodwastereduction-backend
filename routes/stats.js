// routes/stats.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  try {
    const stats = await getUserStats(req.user.id); // replace with real data fetching
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats" });
  }
});

module.exports = router;
