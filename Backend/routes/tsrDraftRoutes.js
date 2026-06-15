const express = require("express");

const router = express.Router();

const {
  generateDraft,
} = require("../controllers/tsrDraftController");

router.get("/generate/:tsrId", generateDraft);

module.exports = router;