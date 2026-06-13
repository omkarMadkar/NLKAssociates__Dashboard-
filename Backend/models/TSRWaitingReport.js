const mongoose = require("mongoose");

const TSRWaitingReportSchema = new mongoose.Schema(
  {
    tsrInitiationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSRInitiation",
      required: true,
    },
    chalanNo: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    reportSrNo: {
      type: String,
      default: "",
    },
    documents: [
      {
        srNo: { type: Number },
        name: { type: String, default: "" },
        available: { type: String, enum: ["Yes", "No"], default: "No" },
        remarks: { type: String, default: "" },
        fileName: { type: String, default: "" },
        filePath: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TSRWaitingReport", TSRWaitingReportSchema);
