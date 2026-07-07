const mongoose = require("mongoose");

const TSRInitiationSchema = new mongoose.Schema(
  {
    // Basic Info
    author: { type: String, default: "" },
    appId: { type: String, default: "" },
    refNo: { type: String, default: "" },
    branch: { type: String, default: "Main" },
    initiationDate: { type: String, default: "" },

    // Applicant Details
    applicant: { type: String, default: "" },
    coApplicant: { type: String, default: "" },
    existingOwner: { type: String, default: "" },

    // Transaction Details
    transactionType: { type: String, default: "" },
    bankBranch: { type: String, default: "" },

    // Property Details
    municipalPropertyNo: { type: String, default: "" },
    rccConstructionArea: { type: String, default: "" },
    village: { type: String, default: "" },
    taluka: { type: String, default: "" },
    district: { type: String, default: "" },
    municipalCouncil: { type: String, default: "" },
    landParcels: [
      {
        surveyNo: {
          type: String,
          default: "",
        },

        hissaNo: {
          type: String,
          default: "",
        },

        area: {
          type: String,
          default: "",
        },

        unit: {
          type: String,
          enum: ["", "Sq. Mtr", "Sq. Ft", "Are", "Hectare", "Acre", "Guntha"],
          default: "",
        },

        remarks: {
          type: String,
          default: "",
        },
      },
    ],
    entireLandDescription: { type: String, default: "" },
    subjectPropertyDescription: { type: String, default: "" },

    // Boundaries
    boundaryEast: { type: String, default: "" },
    boundaryWest: { type: String, default: "" },
    boundarySouth: { type: String, default: "" },
    boundaryNorth: { type: String, default: "" },

    // Contact
    executiveMobile: { type: String, default: "" },
    executiveEmail: { type: String, default: "" },

    // Status
    status: {
      type: String,
      enum: ["initiated", "in_progress", "completed", "cancelled"],
      default: "initiated",
    },

    documentList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSRDocumentList",
      default: null,
    },

    titleFlowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSRTitleFlow",
      default: null,
    },

    titleEvidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSRTitleEvidence",
      default: null,
    },

    otherProvisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSROtherProvision",
      default: null,
    },

    waitingReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TSRWaitingReport",
      default: null,
    },

    // Uploaded documents tracking
    uploadedDocuments: [
      {
        originalName: String,
        filePath: String,
        fileSize: Number,
        extractedFields: [String], // which fields were extracted from this doc
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("TSRInitiation", TSRInitiationSchema);
