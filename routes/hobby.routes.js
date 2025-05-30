const express = require("express");
const router = express.Router();
const Hobby = require("../models/Hobby.model");
const authMiddleware = require("../middlewares/auth");

// Create a new hobby (Protected route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, skillLevel } = req.body;

    const hobby = new Hobby({
      name,
      description,
      skillLevel,
      createdBy: req.user.id,
    });

    await hobby.save();
    res.status(201).json(hobby);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all hobbies
router.get("/", async (req, res) => {
  try {
    const hobbies = await Hobby.find().populate("createdBy", "username");
    res.json(hobbies);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single hobby
router.get("/:id", async (req, res) => {
  try {
    const hobby = await Hobby.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    if (!hobby) {
      return res.status(404).json({ error: "Hobby not found" });
    }
    res.json(hobby);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update hobby (Protected route - only creator can update)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const hobby = await Hobby.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!hobby) {
      return res.status(404).json({ error: "Hobby not found or unauthorized" });
    }
    res.json(hobby);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete hobby (Protected route - only creator can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const hobby = await Hobby.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!hobby) {
      return res.status(404).json({ error: "Hobby not found or unauthorized" });
    }
    res.json({ message: "Hobby deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
