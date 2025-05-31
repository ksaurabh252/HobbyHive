const SkillExchange = require("../models/SkillExchange");
const User = require("../models/User.model");

exports.createExchange = async (req, res) => {
  try {
    const { offer, request, description } = req.body;

    const exchange = new SkillExchange({
      user: req.user.id,
      offer,
      request,
      description,
    });

    await exchange.save();

    res.status(201).json({
      success: true,
      data: exchange,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getAllExchanges = async (req, res) => {
  try {
    const exchanges = await SkillExchange.find({ status: "open" })
      .populate("user", "name email profileImage")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: exchanges.length,
      data: exchanges,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.matchExchange = async (req, res) => {
  try {
    const exchangeToMatch = await SkillExchange.findById(req.params.id);
    const myExchange = await SkillExchange.findOne({
      user: req.user.id,
      status: "open",
    });

    if (!exchangeToMatch || exchangeToMatch.status !== "open") {
      return res.status(404).json({
        success: false,
        error: "Exchange not found or already matched",
      });
    }

    if (!myExchange) {
      return res.status(400).json({
        success: false,
        error: "You need an open exchange to match",
      });
    }

    // Update both exchanges
    exchangeToMatch.status = "pending";
    exchangeToMatch.matchedWith = myExchange._id;
    myExchange.status = "pending";
    myExchange.matchedWith = exchangeToMatch._id;

    await Promise.all([exchangeToMatch.save(), myExchange.save()]);

    // Emit socket event
    req.io.emit("skillExchangeMatched", {
      exchangeId: exchangeToMatch._id,
      matchedWithId: myExchange._id,
    });

    res.status(200).json({
      success: true,
      data: {
        matchedExchange: exchangeToMatch,
        myExchange,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
