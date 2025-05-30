const express = require("express");
const router = express.Router();
const { shareResource, rateResource } = require("../controllers/resource");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware, shareResource);
router.post("/:resourceId/rate", authMiddleware, rateResource);

module.exports = router;
