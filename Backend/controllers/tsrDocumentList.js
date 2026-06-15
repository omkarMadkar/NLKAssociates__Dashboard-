const TSRDocumentList = require("../models/TSRDocumentsList");

exports.createDocument = async (req, res) => {
  try {
    const document = await TSRDocumentList.create(req.body);

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDocumentsByTsr = async (req, res) => {
  try {
    const { tsrId } = req.params;

    const documents = await TSRDocumentList.find({
      tsrId,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await TSRDocumentList.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const document = await TSRDocumentList.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

