const TSRTitleEvidence = require(
  "../models/TSRTitleEvidence"
);

exports.createTitleEvidence = async (req, res) => {
  try {
    const evidence = await TSRTitleEvidence.create(req.body);

    res.status(201).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTitleEvidenceByTsr = async (req, res) => {
  try {
    const { tsrId } = req.params;

    const evidences = await TSRTitleEvidence.find({
      tsrId,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: evidences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTitleEvidence = async (req, res) => {
  try {
    const evidence =
      await TSRTitleEvidence.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTitleEvidence = async (req, res) => {
  try {
    await TSRTitleEvidence.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};