const TSRUploadedChecklist = require("../models/TSRUploadedChecklist");
const TSRInitiation = require("../models/TSRInitiation");

// 1. UPLOAD a single file for a Section 1.5 checklist row (no DB save yet)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    return res.json({
      success: true,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. SAVE / UPDATE checklist (upsert by tsrInitiationId) - this is what "Save Progress" calls
const saveChecklist = async (req, res) => {
  try {
    const { tsrInitiationId, documents } = req.body;

    if (!tsrInitiationId) {
      return res.status(400).json({ success: false, message: "tsrInitiationId is required" });
    }

    const parent = await TSRInitiation.findById(tsrInitiationId);
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent TSR Initiation record not found" });
    }

    let checklist = await TSRUploadedChecklist.findOne({ tsrInitiationId });

    if (checklist) {
      checklist.documents = documents || [];
      await checklist.save();
    } else {
      checklist = await TSRUploadedChecklist.create({
        tsrInitiationId,
        documents: documents || [],
      });
    }

    // Link it back on the parent record so populate() works everywhere else
    if (String(parent.uploadedChecklistId) !== String(checklist._id)) {
      parent.uploadedChecklistId = checklist._id;
      await parent.save();
    }

    return res.status(200).json({ success: true, data: checklist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET checklist by parent TSR Initiation id
const getByTSR = async (req, res) => {
  try {
    const data = await TSRUploadedChecklist.findOne({
      tsrInitiationId: req.params.tsrId,
    });
    return res.json({ success: true, data: data || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. DELETE checklist by parent TSR Initiation id (used internally on cascade delete)
const deleteByTSR = async (req, res) => {
  try {
    await TSRUploadedChecklist.deleteOne({ tsrInitiationId: req.params.tsrId });
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadFile,
  saveChecklist,
  getByTSR,
  deleteByTSR,
};
