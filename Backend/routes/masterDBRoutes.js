const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadMasterExcel,
  getMasterDB,
  downloadTemplate,
} = require("../controllers/masterDBController");

router.post(
  "/upload",
  upload.single("file"),
  uploadMasterExcel
);

router.get("/template", downloadTemplate);
router.get("/", getMasterDB);

module.exports = router;