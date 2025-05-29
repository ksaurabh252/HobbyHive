const { updateSuggestions } = require("../services/matchmaking");
const Connection = require("../models/Connection");

// Get match suggestions for a user
exports.getSuggestions = async (req, res) => {
  try {
    const connection = await Connection.findOne({ user: req.user.id })
      .populate("suggestedUsers.userId", "username profilePicture")
      .populate("suggestedUsers.hobbiesInCommon", "name");

    if (!connection) {
      await updateSuggestions(req.user.id);
      return res.json({ suggestions: [] });
    }

    // Sort by match score (descending)
    const sorted = connection.suggestedUsers.sort(
      (a, b) => b.matchScore - a.matchScore
    );
    res.json({ suggestions: sorted.slice(0, 10) }); // Return top 10
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manual trigger to refresh suggestions
exports.refreshSuggestions = async (req, res) => {
  try {
    await updateSuggestions(req.user.id);
    res.json({ message: "Suggestions updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
