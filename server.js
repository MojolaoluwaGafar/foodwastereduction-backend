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
  "https://foodwastereduction.vercel.app",
 
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


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const statsRoutes = require("./routes/stats");
app.use("/api/stats", statsRoutes);
const trackRoute = require("./routes/track");
app.use("/api/track", trackRoute);
const trackedRoute = require("./routes/tracked")
app.use("/api/tracked", trackedRoute);
const foodRoutes = require("./routes/food.js");
app.use("/api/food", foodRoutes);



const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log("MongoDB connected to:", process.env.MONGO_URI);


    console.log("About to start server...");
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