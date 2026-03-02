const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { protect, authorize } = require("./middleware/authMiddleWare");

dotenv.config();
connectDB();

const app = express();

// ================= MIDDLEWARES =================

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

// ================= ROUTES =================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/documents", require("./routes/documentRoutes")); 
// ⭐ ADDED

// ================= TEST ROUTES =================

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

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
