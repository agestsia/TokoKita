const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const { encrypt } = require("../utils/encryption");

// POST /api/checkout
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, alamat, no_telepon, total } = req.body;

    if (!items || !alamat || !no_telepon || !total) {
      return res.status(400).json({
        message: "items, alamat, no_telepon, dan total wajib diisi",
      });
    }

    const alamatEnc = encrypt(alamat);
    const phoneEnc = encrypt(no_telepon);

    const result = await db.query(
      `INSERT INTO orders (user_id, items, alamat_encrypted, no_telepon_encrypted, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [userId, JSON.stringify(items), alamatEnc, phoneEnc, total]
    );

    return res.status(201).json({
      message: "Checkout berhasil",
      order_id: result.rows[0].id,
      created_at: result.rows[0].created_at,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;
