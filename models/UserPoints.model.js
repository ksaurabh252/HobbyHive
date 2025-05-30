const mongoose = require("mongoose");

const UserPointsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  badges: [
    {
      name: String,
      dateEarned: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserPoints", UserPointsSchema);
