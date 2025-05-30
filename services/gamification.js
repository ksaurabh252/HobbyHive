const UserPoints = require("../models/UserPoints.model");
const BADGES = {
  NOVICE: { name: "Novice", threshold: 50 },
  CONTRIBUTOR: { name: "Contributor", threshold: 200 },
  EXPERT: { name: "Expert", threshold: 500 },
  MASTER: { name: "Master", threshold: 1000 },
};

exports.awardPoints = async (userId, action) => {
  const pointsMap = {
    "resource-share": 10,
    "event-rsvp": 5,
    "group-create": 15,
    "skill-exchange": 20,
    "daily-login": 2,
  };

  const pointsToAdd = pointsMap[action] || 0;
  if (pointsToAdd === 0) return;

  const userPoints = await UserPoints.findOneAndUpdate(
    { user: userId },
    { $inc: { points: pointsToAdd }, $set: { lastUpdated: new Date() } },
    { upsert: true, new: true }
  );

  await checkForBadges(userPoints);
};

const checkForBadges = async (userPoints) => {
  const badgesToAdd = [];

  Object.values(BADGES).forEach((badge) => {
    if (
      userPoints.points >= badge.threshold &&
      !userPoints.badges.some((b) => b.name === badge.name)
    ) {
      badgesToAdd.push(badge.name);
    }
  });

  if (badgesToAdd.length > 0) {
    await UserPoints.findByIdAndUpdate(userPoints._id, {
      $push: {
        badges: {
          $each: badgesToAdd.map((name) => ({ name })),
        },
      },
    });
  }
};

exports.getUserProgress = async (userId) => {
  return (
    (await UserPoints.findOne({ user: userId })) || {
      points: 0,
      badges: [],
    }
  );
};
