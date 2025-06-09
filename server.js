const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.186.118:5173", // React on same machine via LAN IP
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const statsRoutes = require("./routes/stats");
app.use("/api/stats", statsRoutes);


// Connect DB and Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected to:", process.env.MONGO_URI);


    console.log("🟢 About to start server...");
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err.message);
  }
};
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack || err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.stack || err);
});
startServer();