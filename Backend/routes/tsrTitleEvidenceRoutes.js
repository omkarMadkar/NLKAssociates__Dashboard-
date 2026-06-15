const express = require("express");

const router = express.Router();

const {
  createTitleEvidence,
  getTitleEvidenceByTsr,
  updateTitleEvidence,
  deleteTitleEvidence,
} = require(
  "../controllers/tsrTitleEvidenceController"
);

router.post("/", createTitleEvidence);

router.get("/:tsrId", getTitleEvidenceByTsr);

router.put("/:id", updateTitleEvidence);

router.delete("/:id", deleteTitleEvidence);

module.exports = router;