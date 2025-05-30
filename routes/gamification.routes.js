const express = require("express");
const router = express.Router();
const { getUserProgress } = require("../services/gamification");
const authMiddleware = require("../middlewares/auth");

router.get("/my-progress", authMiddleware, async (req, res) => {
  try {
    const progress = await getUserProgress(req.user.id);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
