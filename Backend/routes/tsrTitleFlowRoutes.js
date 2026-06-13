const express = require("express");

const router = express.Router();

const {
  createTitleFlow,
  getByTSR,
  parseTitleFlowExcel,
  uploadAndSaveTitleFlow,
} = require("../controllers/tsrTitleFlowController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

router.post("/create", protect, createTitleFlow);

router.get("/:tsrId", protect, getByTSR);

router.post(
  "/upload-excel",
  protect,
  upload.single("file"),
  parseTitleFlowExcel,
);

router.post(
  "/upload-and-save",
  protect,
  upload.single("file"),
  uploadAndSaveTitleFlow,
);
module.exports = router;
