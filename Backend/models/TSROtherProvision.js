const mongoose = require("mongoose");

const provisionAnswerSchema = new mongoose.Schema(
{
    code: {
        type: String,
        required: true
    },

    question: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        enum: [
            "Yes",
            "No",
            "NA",
            "Not Known"
        ],
        default: "No"
    },

    remarks: {
        type: String,
        default: ""
    }
},
{
    _id: false
}
);

const tsrOtherProvisionSchema = new mongoose.Schema(
{
    tsrInitiationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TSRInitiation",
        required: true
    },

    answers: [provisionAnswerSchema]
},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    "TSROtherProvision",
    tsrOtherProvisionSchema
);