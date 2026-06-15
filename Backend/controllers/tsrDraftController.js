const TSRInitiation = require("../models/TSRInitiation");
const TSRDocumentList = require("../models/TSRDocumentsList");
const TSRTitleFlow = require("../models/TSRTitleFlow");
const TSRTitleEvidence = require("../models/TSRTitleEvidence");
const TSROtherProvision = require("../models/TSROtherProvision");
const TSRWaitingReport = require("../models/TSRWaitingReport");

exports.generateDraft = async (req, res) => {
  try {
    const { tsrId } = req.params;

    const initiation = await TSRInitiation.findById(tsrId);

    if (!initiation) {
      return res.status(404).json({
        success: false,
        message: "TSR not found",
      });
    }

    const documentList = await TSRDocumentList.find({
      tsrId,
    }).sort({ createdAt: 1 });

    const titleFlow = await TSRTitleFlow.find({
      tsrInitiationId: tsrId,
    });

    const titleEvidence = await TSRTitleEvidence.find({
      tsrId,
    });

    const otherProvision = await TSROtherProvision.findOne({
      tsrInitiationId: tsrId,
    });

    const waitingReport = await TSRWaitingReport.findOne({
      tsrInitiationId: tsrId,
    });

    const draftData = {
      ...initiation.toObject(),

      documentList,
      titleFlow,
      titleEvidence,
      otherProvision,
      waitingReport,
    };

    res.status(200).json({
      success: true,
      data: draftData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};