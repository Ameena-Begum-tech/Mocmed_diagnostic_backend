const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleWare");
const { authorize } = require("./middleware/authMiddleWare");
dotenv.config();
connectDB();

const app = express();

// Middlewares


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mocmed-diagnostic-frontend.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Mocmed Backend Running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

app.get("/api/admin-only", protect, authorize("SUPERADMIN"), (req, res) => {
  res.json({
    message: "Welcome Super Admin 👑",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
