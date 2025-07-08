const express = require("express");
const router = express.Router();
const { signup, signin, forgotPassword, resetPassword, googleAuth } = require("../controllers/authController");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
// const jwt = require("jsonwebtoken");
// const axios = require("axios");


router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google", googleAuth); 



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

// router.post("/google", async (req, res) => {
//   const { token } = req.body;

//   try {
//     // Get user info from Google
//     const response = await axios.get(
//       "https://www.googleapis.com/oauth2/v3/userinfo",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const { email, name, email_verified } = response.data;

//     if (!email_verified) {
//       return res.status(400).json({ message: "Email not verified" });
//     }

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = new User({
//         email,
//         fullName: name,
//         // password: "",
//         googleId,
//       });
//       await user.save();
//     }

//     const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "15m",
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token: jwtToken,
//       user: {
//         id: user._id,
//         email: user.email,
//         fullName: user.fullName,
//       },
//     });
//   } catch (error) {
//     console.error("Google sign-in error:", error.message);
//     res.status(500).json({ message: "Google login failed" });
//   }
// });


module.exports = router;
