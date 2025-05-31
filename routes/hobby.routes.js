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

// Advanced search endpoint
router.get("/search", async (req, res) => {
  try {
    const {
      name,
      skillLevel,
      location,
      startDate,
      endDate,
      limit = 10,
      page = 1,
    } = req.query;

    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (skillLevel) query.skillLevel = skillLevel;

    // Location-based search (using geospatial if coordinates provided)
    if (location) {
      if (location.coordinates) {
        query.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: location.coordinates,
            },
            $maxDistance: location.radius || 6000, // meters
          },
        };
      } else {
        query.locationName = { $regex: location, $options: "i" };
      }
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const results = await Hobby.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("createdBy", "username profilePicture");

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Protected route - only creator can update
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
