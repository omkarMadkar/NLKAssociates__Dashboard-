const mongoose = require("mongoose");

// Section 1.5 - Uploaded Documents Checklist
// Saved independently and linked back to the parent TSRInitiation record,
// so User 2 (basic info + document collection) can save progress here
// without needing to touch/complete any of the other TSR sections.
const TSRUploadedChecklistSchema = new mongoose.Schema(
  {
    tsrInitiationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSRInitiation",
      required: true,
      unique: true, // one checklist doc per TSR case
    },

    documents: [
      {
        name: { type: String, default: "" },
        fileName: { type: String, default: "" },
        filePath: { type: String, default: "" },
        remarks: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TSRUploadedChecklist", TSRUploadedChecklistSchema);
