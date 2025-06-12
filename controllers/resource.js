const Resource = require("../models/Resource.model");
const emitter = require("../utils/eventEmitter");
const { awardPoints } = require("../services/gamification");

// Function to handle sharing a resource
exports.shareResource = async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      postedBy: req.user.id,
    });
    await resource.save();

    // Award points for sharing resource
    await awardPoints(req.user.id, "resource-share");

    emitter.emit("resourceAdded", resource);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Function to handle rating a resource
exports.rateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.resourceId,
      { $push: { ratings: { user: req.user.id, value: req.body.rating } } },
      { new: true }
    );
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
