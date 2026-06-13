const TSRWaitingReport = require("../models/TSRWaitingReport");
const TSRInitiation = require("../models/TSRInitiation");

const createWaitingReport = async (req, res) => {
  try {
    const { tsrInitiationId, chalanNo, date, reportSrNo, documents } = req.body;

    const report = await TSRWaitingReport.create({
      tsrInitiationId,
      chalanNo,
      date,
      reportSrNo,
      documents,
    });

    await TSRInitiation.findByIdAndUpdate(tsrInitiationId, {
      waitingReportId: report._id,
    });

    return res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getByTSR = async (req, res) => {
  try {
    const data = await TSRWaitingReport.findOne({
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

const uploadFile = async (req, res) => {
  try {
    console.log("Waiting report file upload request received:", req.file);
    if (!req.file) {
      console.log("No file was found in req.file");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    console.log("File uploaded successfully:", req.file.path);
    return res.json({
      success: true,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });
  } catch (error) {
    console.error("Error in uploadFile controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createWaitingReport,
  getByTSR,
  uploadFile
};
