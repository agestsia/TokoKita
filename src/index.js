require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/auth");
const checkoutRoutes = require("./routes/checkout");
const clickRoutes = require("./routes/click");
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(express.json());

// Route testing
app.get("/", (req, res) => {
  res.json({ message: "TokoKita backend up & running ✅" });
});

// AUTH routes
app.use("/auth", authRoutes);

// E-COMMERCE routes
app.use("/api/checkout", checkoutRoutes);

// Semua endpoint click wajib pakai JWT
app.use("/api/click", authMiddleware, clickRoutes);

// Route yang butuh JWT untuk lihat profil user
app.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Profil user dari token",
    user: req.user,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
