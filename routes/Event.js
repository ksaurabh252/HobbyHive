const express = require("express");
const router = express.Router();
const { createEvent, rsvpEvent } = require("../controllers/event");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware, createEvent);
router.post("/:eventId/rsvp", authMiddleware, rsvpEvent);

module.exports = router;
