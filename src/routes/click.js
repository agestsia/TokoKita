const express = require("express");
const router = express.Router();
const db = require("../config/db"); // PERHATIKAN: .. (bukan ./)

// authMiddleware TIDAK perlu di-import di sini
// karena sudah dipasang di index.js pada app.use("/api/click", authMiddleware, clickRoutes);

router.post("/", async (req, res) => {
  try {
    const { page, element, product_id } = req.body;

    if (!page || !element) {
      return res.status(400).json({
        message: "page dan element wajib diisi",
      });
    }

    // Kalau request lewat JWT, req.user harusnya ada
    const userId = req.user?.userId || null; // boleh null kalau di DB user_id boleh null

    const result = await db.query(
      `INSERT INTO click_events (page, element, product_id, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [page, element, product_id || null, userId]
    );

    res.status(201).json({
      message: "Click event tersimpan",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error("Click error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;
