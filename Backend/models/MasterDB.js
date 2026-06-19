const mongoose = require("mongoose");

const masterDBSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: "",
    },

    applicationNo: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    applicant: {
      type: [String],
      default: [],
    },

    coApplicant: {
      type: [String],
      default: [],
    },

    transactionType: {
      type: String,
      default: "",
    },

    propertyDetails: {
      type: String,
      default: "",
    },

    vetAndCTC: {
      type: String,
      enum: ["CTC", "CTC +VET", "CTC only", "VET", ""],
      default: "",
    },
    ctc: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MasterDB", masterDBSchema);
