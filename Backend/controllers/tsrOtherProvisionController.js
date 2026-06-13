const TSROtherProvision = require("../models/TSROtherProvision");

const TSRInitiation = require("../models/TSRInitiation");

exports.createOtherProvision = async (req, res) => {
  try {
    const { tsrInitiationId, answers } = req.body;

    const provision = await TSROtherProvision.create({
      tsrInitiationId,
      answers,
    });

    await TSRInitiation.findByIdAndUpdate(tsrInitiationId, {
      otherProvisionId: provision._id,
    });

    return res.status(201).json({
      success: true,
      data: provision,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getByTSR = async (req, res) => {
  try {
    const data = await TSROtherProvision.findOne({
      tsrInitiationId: req.params.tsrId,
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
