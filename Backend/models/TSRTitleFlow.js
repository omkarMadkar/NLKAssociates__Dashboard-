const mongoose = require("mongoose");

const titleEventSchema = new mongoose.Schema(
{
    eventNo: {
        type: Number,
        required: true
    },

    eventType: {
        type: String,
        required: true
    },

    fromParty: {
        type: String,
        default: ""
    },

    toParty: {
        type: String,
        default: ""
    },

    currentOwner: {
        type: String,
        enum: ["YES", "NO"],
        default: "NO"
    },

    documentType: {
        type: String,
        default: ""
    },

    documentDate: {
        type: String,
        default: ""
    },

    registrationNo: {
        type: String,
        default: ""
    },

    sroName: {
        type: String,
        default: ""
    },

    propertyDetails: {
        type: String,
        default: ""
    },

    areaTransferred: {
        type: String,
        default: ""
    },

    remarks: {
        type: String,
        default: ""
    },

    generateParagraph: {
        type: String,
        enum: ["YES", "NO"],
        default: "YES"
    }
},
{
    _id: false
}
);

const tsrTitleFlowSchema = new mongoose.Schema(
{
    tsrInitiationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TSRInitiation",
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    events: [titleEventSchema]
},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    "TSRTitleFlow",
    tsrTitleFlowSchema
);