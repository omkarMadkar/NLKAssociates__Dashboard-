const express = require("express");
const router = express.Router();
const controller = require("../controllers/tsrWaitingReportController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/create", protect, controller.createWaitingReport);
router.post("/upload", protect, upload.single("file"), controller.uploadFile);
router.get("/:tsrId", protect, controller.getByTSR);

module.exports = router;
