const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  updateTracked,
  updateDonated,
  updateWaste,
  getUserStats,
} = require("../controllers/userStatsController");

router.get("/me/stats", protect, getUserStats);
router.post("/me/stats/track", protect, updateTracked);
router.post("/me/stats/donate", protect, updateDonated);
router.post("/me/stats/waste", protect, updateWaste);

module.exports = router;
