require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const checkoutRoutes = require("./routes/checkout");
const clickRoutes = require("./routes/click");
const authMiddleware = require("./middleware/auth");

const app = express();

// --- CORS: izinkan akses dari frontend React ---
app.use(
  cors({
    origin: "http://localhost:5173", // alamat frontend-mu
  })
);
// -----------------------------------------------

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TokoKita backend up & running ✅" });
});

app.use("/auth", authRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/click", authMiddleware, clickRoutes);

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
