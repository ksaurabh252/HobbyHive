const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hobby" }],
    challenges: [
      {
        challenge: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Challenge",
        },
        progress: {
          type: Number,
          default: 0,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        startedAt: {
          type: Date,
          default: Date.now,
        },
        completedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
