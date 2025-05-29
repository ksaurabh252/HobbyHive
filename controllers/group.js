const Group = require("../models/Group");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, hobby } = req.body;

    const group = new Group({
      name,
      description,
      hobby,
      admins: [req.user.id], // Creator becomes admin
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add member to group (Admin only)
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
