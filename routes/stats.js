
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const getUserStats = require("../services/statsService");

router.get("/", verifyToken, async (req, res) => {
  try {
    const stats = await getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats" });
  }
});

module.exports = router;
