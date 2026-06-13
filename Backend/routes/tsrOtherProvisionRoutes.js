const express = require("express");

const router = express.Router();

const {
  createOtherProvision,
  getByTSR,
} = require("../controllers/tsrOtherProvisionController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createOtherProvision);

router.get("/:tsrId", protect, getByTSR);

module.exports = router;
