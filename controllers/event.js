const Event = require("../models/Event");
const { sendEventReminder } = require("../services/email");
const User = require("../models/User");

exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      host: req.user.id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { $addToSet: { attendees: req.user.id } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Send email notification
    const user = await User.findById(req.user.id);
    await sendEventReminder(user.email, event.title);

    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
