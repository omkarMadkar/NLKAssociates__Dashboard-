const mongoose = require("mongoose");

const TSRTitleEvidenceSchema = new mongoose.Schema(
  {
    tsrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSR",
      required: true,
    },

    documentType: {
      type: String,
      required: true,
      trim: true,
    },

    executionDate: {
      type: Date,
      required: true,
    },

    executedBy: {
      type: String,
      required: true,
      trim: true,
    },

    executedInFavourOf: {
      type: String,
      required: true,
      trim: true,
    },

    registrationOffice: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TSRTitleEvidence",
  TSRTitleEvidenceSchema
);