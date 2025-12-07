const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer xxx"

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, username, iat, exp }
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res
      .status(401)
      .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
  }
}

module.exports = auth;
