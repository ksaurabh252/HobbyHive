const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    suggestedUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        hobbiesInCommon: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hobby",
          },
        ],
        matchScore: Number,
        lastSuggested: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Connection", ConnectionSchema);
