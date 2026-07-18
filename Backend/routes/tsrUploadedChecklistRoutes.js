const express = require("express");
const router = express.Router();
const controller = require("../controllers/tsrUploadedChecklistController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/save", protect, controller.saveChecklist);
router.post("/upload", protect, upload.single("file"), controller.uploadFile);
router.get("/:tsrId", protect, controller.getByTSR);
router.delete("/:tsrId", protect, controller.deleteByTSR);

module.exports = router;
