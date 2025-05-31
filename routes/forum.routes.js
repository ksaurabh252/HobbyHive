const router = require("express").Router();
const Forum = require("../models/Forum.model");
const Thread = require("../models/Thread.model");
const { authMiddleware } = require("../middlewares/auth");

// Create forum for a hobby
router.post("/", authMiddleware, async (req, res) => {
  try {
    const forum = new Forum({
      ...req.body,
      createdBy: req.user.id,
    });
    await forum.save();
    res.status(201).json(forum);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get forums for a hobby
router.get("/hobby/:hobbyId", async (req, res) => {
  try {
    const forums = await Forum.find({ hobby: req.params.hobbyId }).populate(
      "createdBy",
      "username profilePicture"
    );
    res.json(forums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thread operations
router.post("/:forumId/threads", authMiddleware, async (req, res) => {
  try {
    const thread = new Thread({
      ...req.body,
      forum: req.params.forumId,
      createdBy: req.user.id,
    });
    await thread.save();

    // Add thread to forum
    await Forum.findByIdAndUpdate(req.params.forumId, {
      $push: { threads: thread._id },
    });

    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
