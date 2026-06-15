const express = require("express");

const router = express.Router();

const {
  createDocument,
  getDocumentsByTsr,
  updateDocument,
  deleteDocument,
} = require("../controllers/tsrDocumentList");

router.post("/", createDocument);

router.get("/:tsrId", getDocumentsByTsr);

router.put("/:id", updateDocument);

router.delete("/:id", deleteDocument);

module.exports = router;