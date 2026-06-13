const TSRInitiation = require('../models/TSRInitiation');
const { extractFromDocument } = require('../utils/pdfExtractor');
const fs = require('fs');

// 1. UPLOAD & EXTRACT (No save to DB yet)
const uploadAndExtract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { path: filePath, originalname } = req.file;

    // Run extraction logic
    const extractionResult = await extractFromDocument(filePath, originalname);

    // Optional: Clean up file after extraction if we don't need to keep it at this exact step,
    // or keep it in the uploads folder and return the path so the frontend can associate it.
    
    if (extractionResult.success) {
      res.json({
        success: true,
        message: extractionResult.message,
        documentType: extractionResult.documentType,
        extractedFields: extractionResult.extractedFields,
        fileInfo: {
          originalName: originalname,
          filePath: filePath,
          fileSize: req.file.size
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: extractionResult.message
      });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. CREATE (Save to DB after user review)
const createTSRInitiation = async (req, res) => {
  try {
    const data = req.body;
    const newRecord = await TSRInitiation.create(data);
    res.status(201).json({ success: true, data: newRecord });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. GET ALL
const getTSRInitiations = async (req, res) => {
  try {
    const records = await TSRInitiation.find()
      .populate('otherProvisionId')
      .populate('waitingReportId')
      .populate('titleFlowId')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. GET BY ID
const getTSRInitiationById = async (req, res) => {
  try {
    const record = await TSRInitiation.findById(req.params.id)
      .populate('otherProvisionId')
      .populate('waitingReportId')
      .populate('titleFlowId');
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. UPDATE
const updateTSRInitiation = async (req, res) => {
  try {
    const updated = await TSRInitiation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. DELETE
const deleteTSRInitiation = async (req, res) => {
  try {
    await TSRInitiation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  uploadAndExtract,
  createTSRInitiation,
  getTSRInitiations,
  getTSRInitiationById,
  updateTSRInitiation,
  deleteTSRInitiation
};
