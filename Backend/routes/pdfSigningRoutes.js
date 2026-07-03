const express = require("express");
const router = express.Router();
const { signPDFReport } = require("../controllers/pdfSigningController");
const { protect } = require("../middleware/authMiddleware");

// Protected route for generating and cryptographically signing PDFs
router.post("/sign-pdf", protect, signPDFReport);

module.exports = router;
