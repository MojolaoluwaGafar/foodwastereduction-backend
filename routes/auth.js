const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/authController");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/signin", signin);



router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      stats: user.stats, // 👈 This is what frontend needs
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
});
  

module.exports = router;
