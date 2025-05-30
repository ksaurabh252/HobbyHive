const express = require("express");
const router = express.Router();
const SkillExchange = require("../models/SkillExchange.model");
const User = require("../models/User.model");
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

// Input validation middleware
const validateExchange = [
  check("offer").trim().notEmpty().withMessage("Offer is required").escape(),
  check("request")
    .trim()
    .notEmpty()
    .withMessage("Request is required")
    .escape(),
  check("description").optional().trim().escape(),
];

// Create new skill exchange
router.post("/", auth, validateExchange, async (req, res) => {
  try {
    const exchange = new SkillExchange({
      user: req.user.id,
      offer: req.body.offer,
      request: req.body.request,
      description: req.body.description,
    });

    await exchange.save();

    // Populate user data in response
    const populatedExchange = await SkillExchange.populate(exchange, {
      path: "user",
      select: "name profileImage",
    });

    res.status(201).json({
      success: true,
      data: populatedExchange,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// Get all open exchanges with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [exchanges, total] = await Promise.all([
      SkillExchange.find({ status: "open" })
        .populate("user", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SkillExchange.countDocuments({ status: "open" }),
    ]);

    res.json({
      success: true,
      data: exchanges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// Match with an exchange
router.post("/:id/match", auth, async (req, res) => {
  try {
    // Validate exchange ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid exchange ID",
      });
    }

    const [exchangeToMatch, myExchange] = await Promise.all([
      SkillExchange.findById(req.params.id),
      SkillExchange.findOne({
        user: req.user.id,
        status: "open",
      }),
    ]);

    if (!exchangeToMatch || exchangeToMatch.status !== "open") {
      return res.status(404).json({
        success: false,
        error: "Exchange not found or already matched",
      });
    }

    if (!myExchange) {
      return res.status(400).json({
        success: false,
        error: "You need an open exchange to match",
      });
    }

    // Prevent self-matching
    if (exchangeToMatch.user.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "Cannot match with your own exchange",
      });
    }

    // Update both exchanges in a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      exchangeToMatch.status = "pending";
      exchangeToMatch.matchedWith = myExchange._id;
      myExchange.status = "pending";
      myExchange.matchedWith = exchangeToMatch._id;

      await Promise.all([
        exchangeToMatch.save({ session }),
        myExchange.save({ session }),
      ]);

      await session.commitTransaction();

      // Notify both users via Socket.io
      if (req.io) {
        req.io.to(`user_${exchangeToMatch.user}`).emit("exchangeMatched", {
          exchangeId: exchangeToMatch._id,
          matchedWith: myExchange._id,
        });
        req.io.to(`user_${myExchange.user}`).emit("exchangeMatched", {
          exchangeId: myExchange._id,
          matchedWith: exchangeToMatch._id,
        });
      }

      res.json({
        success: true,
        data: {
          matchedExchange: exchangeToMatch,
          myExchange,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// Get user's exchanges
router.get("/my-exchanges", auth, async (req, res) => {
  try {
    const exchanges = await SkillExchange.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exchanges,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
