const Group = require("../models/Group.model");
const { awardPoints } = require("../services/gamification");

exports.createGroup = async (req, res) => {
  try {
    const { name, description, hobby } = req.body;
    const group = new Group({
      name,
      description,
      hobby,
      admins: [req.user.id],
    });

    await group.save();

    // Award points for group creation
    await awardPoints(req.user.id, "group-create");

    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.groupId, admins: req.user.id },
      { $addToSet: { members: req.body.userId } },
      { new: true }
    );

    if (!group) throw new Error("Group not found or unauthorized");

    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
