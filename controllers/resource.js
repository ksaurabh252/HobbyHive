const Resource = require("../models/Resource");
const emitter = require("../utils/eventEmitter");

exports.shareResource = async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      postedBy: req.user.id,
    });
    await resource.save();

    // Emit event for new resource
    emitter.emit("resourceAdded", resource);

    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
