require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const checkoutRoutes = require("./routes/checkout");
const clickRoutes = require("./routes/click");

const app = express();

app.use(express.json());

// ini tuh untuk route testing
app.get("/", (req, res) => {
  res.json({ message: "TokoKita backend up & running ✅" });
});

// kalau ini untuk AUTH route
app.use("/auth", authRoutes);

// E-COMMERCE routes
app.use("/api/checkout", checkoutRoutes);
app.use("/click", clickRoutes);

// route yang butuh JWT
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
