const express = require("express");
const router = express.Router();
const {
  getSuggestions,
  refreshSuggestions,
} = require("../controllers/matchmaking");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, getSuggestions);
router.post("/refresh", authMiddleware, refreshSuggestions);

module.exports = router;
