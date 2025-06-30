const express = require("express");
const router = express.Router();
const { signup, signin, forgotPassword, resetPassword } = require("../controllers/authController");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);




router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      stats: user.stats,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
});
// GET /api/auth/stats
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      itemsTracked: user.stats?.itemsTracked || 0,
      foodDonated: user.stats?.foodDonated || 0,
      wasteSaved: user.stats?.wasteSaved || 0,
    });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

  

module.exports = router;
