const express = require("express");
const router = express.Router();
const { createGroup, addMember } = require("../controllers/group");
const authMiddleware = require("../middlewares/auth");

// Protected routes
router.post("/", authMiddleware, createGroup);
router.post("/:groupId/members", authMiddleware, addMember);

module.exports = router;
