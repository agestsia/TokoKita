require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(express.json());

// route testing
app.get("/", (req, res) => {
  res.json({ message: "TokoKita backend up & running ✅" });
});

// route auth
app.use("/auth", authRoutes);

// contoh route yang butuh JWT
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
