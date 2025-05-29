const User = require("../models/User");
const Hobby = require("../models/Hobby");
const Connection = require("../models/Connection");

// Calculate match score between two users
const calculateMatchScore = (user1Hobbies, user2Hobbies) => {
  const commonHobbies = user1Hobbies.filter((hobby) =>
    user2Hobbies.includes(hobby.toString())
  );
  return commonHobbies.length * 10; // Score weight
};

// Update suggestions for a user
exports.updateSuggestions = async (userId) => {
  try {
    const currentUser = await User.findById(userId).populate("hobbies");
    if (!currentUser) throw new Error("User not found");

    // Find users with at least one common hobby (excluding self)
    const potentialMatches = await User.find({
      _id: { $ne: userId },
      hobbies: { $in: currentUser.hobbies.map((h) => h._id) },
    }).populate("hobbies");

    // Calculate scores and prepare suggestions
    const suggestions = potentialMatches
      .map((match) => ({
        userId: match._id,
        hobbiesInCommon: currentUser.hobbies
          .filter((hobby) =>
            match.hobbies.some((mh) => mh._id.equals(hobby._id))
          )
          .map((h) => h._id),
        matchScore: calculateMatchScore(
          currentUser.hobbies.map((h) => h._id),
          match.hobbies.map((h) => h._id)
        ),
      }))
      .filter((s) => s.matchScore > 0); // Only keep matches with score > 0

    // Update or create connection document
    await Connection.findOneAndUpdate(
      { user: userId },
      { $set: { suggestedUsers: suggestions } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Matchmaking error:", err);
    throw err;
  }
};
