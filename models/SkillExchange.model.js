const mongoose = require("mongoose");

const skillExchangeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    request: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["open", "pending", "completed"],
      default: "open",
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillExchange",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("SkillExchange", skillExchangeSchema);
