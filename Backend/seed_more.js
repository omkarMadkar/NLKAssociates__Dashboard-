const mongoose = require('mongoose');
require('dotenv').config();
const TSRInitiation = require('./models/TSRInitiation');
const TSROtherProvision = require('./models/TSROtherProvision');
const TSRWaitingReport = require('./models/TSRWaitingReport');
const TSRTitleFlow = require('./models/TSRTitleFlow');
const TSRDocumentList = require('./models/TSRDocumentsList');
const TSRTitleEvidence = require('./models/TSRTitleEvidence');

const OTHER_PROVISIONS_MORE_1 = [
  { code: "5.1", question: "Whether provisions of urban land ceiling act are applicable?", answer: "No", remarks: "Exempt category" },
  { code: "5.2", question: "Whether any property/ies intend to be given as security to any minor claim/share?", answer: "No", remarks: "All co-owners are majors" },
  { code: "5.3", question: "Whether property affected by revenue and tenancy regulations?", answer: "No", remarks: "NOC from revenue officer obtained" },
  { code: "5.4", question: "Whether user land converted into non-agricultural use?", answer: "Yes", remarks: "NA Order dated 15/09/2020" },
  { code: "5.5", question: "Whether up to date tax/land revenue has been paid?", answer: "Yes", remarks: "Verified up to current financial year" },
  { code: "5.6", question: "Whether all original documents scrutinized?", answer: "Yes", remarks: "Original Title deeds verified" },
  { code: "5.7", question: "Whether required documents available for creating mortgage?", answer: "Yes", remarks: "Valid legal mortgage can be created" },
  { code: "5.8", question: "Whether previous owners had competency to transfer property?", answer: "Yes", remarks: "Fully verified" },
  { code: "5.9", question: "Whether proposed owners had competency to transfer property?", answer: "Yes", remarks: "Yes, verified" },
  { code: "5.10", question: "What is tenure of land?", answer: "NA", remarks: "Freehold NA" },
  { code: "5.11", question: "Whether land is Adivasi (Tribal) Land?", answer: "No", remarks: "General zone land" },
  { code: "5.12", question: "Whether property is joint family property?", answer: "No", remarks: "Individually held by applicant" },
  { code: "5.13", question: "Whether SARFAESI Act applicable?", answer: "Yes", remarks: "Applicable" },
  { code: "5.14", question: "Whether property subject to reservation/acquisition?", answer: "No", remarks: "Zone certificate verified" },
  { code: "5.15", question: "Whether property transferred through POA holder?", answer: "No", remarks: "Direct execution" },
  { code: "5.16", question: "Whether POA holder had authority to sell?", answer: "NA", remarks: "Not applicable" },
  { code: "5.17", question: "Whether POA registered?", answer: "NA", remarks: "Not applicable" },
  { code: "5.18", question: "Whether NOC required for mortgage?", answer: "Yes", remarks: "NOC from society attached" },
  { code: "5.19", question: "Whether permission required upon invocation of mortgage?", answer: "No", remarks: "Standard recovery rules apply" },
  { code: "5.20", question: "Whether Search Report obtained?", answer: "Yes", remarks: "Obtained for 30 years" },
  { code: "5.21", question: "Whether EC obtained?", answer: "Yes", remarks: "Obtained for 30 years" }
];

const OTHER_PROVISIONS_MORE_2 = [
  { code: "5.1", question: "Whether provisions of urban land ceiling act are applicable?", answer: "No", remarks: "Cleared" },
  { code: "5.2", question: "Whether any property/ies intend to be given as security to any minor claim/share?", answer: "No", remarks: "No minor claims" },
  { code: "5.3", question: "Whether property affected by revenue and tenancy regulations?", answer: "No", remarks: "Cleared from revenue dept" },
  { code: "5.4", question: "Whether user land converted into non-agricultural use?", answer: "Yes", remarks: "NA Order No. 8892/2021" },
  { code: "5.5", question: "Whether up to date tax/land revenue has been paid?", answer: "Yes", remarks: "Receipt verified" },
  { code: "5.6", question: "Whether all original documents scrutinized?", answer: "Yes", remarks: "Originals scrutinized" },
  { code: "5.7", question: "Whether required documents available for creating mortgage?", answer: "Yes", remarks: "Available" },
  { code: "5.8", question: "Whether previous owners had competency to transfer property?", answer: "Yes", remarks: "Competency verified" },
  { code: "5.9", question: "Whether proposed owners had competency to transfer property?", answer: "Yes", remarks: "Competency verified" },
  { code: "5.10", question: "What is tenure of land?", answer: "NA", remarks: "Freehold" },
  { code: "5.11", question: "Whether land is Adivasi (Tribal) Land?", answer: "No", remarks: "Not tribal land" },
  { code: "5.12", question: "Whether property is joint family property?", answer: "No", remarks: "Self-acquired" },
  { code: "5.13", question: "Whether SARFAESI Act applicable?", answer: "Yes", remarks: "Yes" },
  { code: "5.14", question: "Whether property subject to reservation/acquisition?", answer: "No", remarks: "Verified" },
  { code: "5.15", question: "Whether property transferred through POA holder?", answer: "No", remarks: "Direct conveyance" },
  { code: "5.16", question: "Whether POA holder had authority to sell?", answer: "NA", remarks: "Not applicable" },
  { code: "5.17", question: "Whether POA registered?", answer: "NA", remarks: "Not applicable" },
  { code: "5.18", question: "Whether NOC required for mortgage?", answer: "No", remarks: "Not required" },
  { code: "5.19", question: "Whether permission required upon invocation of mortgage?", answer: "No", remarks: "Not required" },
  { code: "5.20", question: "Whether Search Report obtained?", answer: "Yes", remarks: "Verified search report" },
  { code: "5.21", question: "Whether EC obtained?", answer: "Yes", remarks: "Verified EC" }
];

const WAITING_REPORT_MORE_1 = {
  chalanNo: "CH-90860-C",
  date: "2026-06-12",
  reportSrNo: "SR-PUNE-0960",
  documents: [
    { srNo: 1, name: "Sale Deed / Conveyance Deed", available: "Yes", remarks: "Original deed submitted", fileName: "1781358392385-545970972.pdf", filePath: "uploads/1781358392385-545970972.pdf" },
    { srNo: 2, name: "Index II", available: "Yes", remarks: "Index II copy submitted", fileName: "1779613972730-299006405.pdf", filePath: "uploads/1779613972730-299006405.pdf" },
    { srNo: 3, name: "7/12 Extract / Property Card", available: "Yes", remarks: "7/12 copy submitted", fileName: "1779615096292-700343046.pdf", filePath: "uploads/1779615096292-700343046.pdf" },
    { srNo: 4, name: "Tax Receipt", available: "Yes", remarks: "Tax receipt copy submitted", fileName: "1781358392385-545970972.pdf", filePath: "uploads/1781358392385-545970972.pdf" },
    { srNo: 5, name: "Mutation Entry", available: "No", remarks: "Pending cert from Tehsil", fileName: "", filePath: "" }
  ]
};

const WAITING_REPORT_MORE_2 = {
  chalanNo: "CH-90870-D",
  date: "2026-06-13",
  reportSrNo: "SR-PUNE-0970",
  documents: [
    { srNo: 1, name: "Sale Deed / Conveyance Deed", available: "Yes", remarks: "Original deed submitted", fileName: "1779615778624-471553305.pdf", filePath: "uploads/1779615778624-471553305.pdf" },
    { srNo: 2, name: "Index II", available: "Yes", remarks: "Index II registered", fileName: "1779613972730-299006405.pdf", filePath: "uploads/1779613972730-299006405.pdf" },
    { srNo: 3, name: "7/12 Extract / Property Card", available: "Yes", remarks: "7/12 certified copy", fileName: "1781358392385-545970972.pdf", filePath: "uploads/1781358392385-545970972.pdf" },
    { srNo: 4, name: "Tax Receipt", available: "Yes", remarks: "Paid tax receipt annexed", fileName: "1779615096292-700343046.pdf", filePath: "uploads/1779615096292-700343046.pdf" },
    { srNo: 5, name: "Mutation Entry", available: "Yes", remarks: "Mutation entry certified copy", fileName: "1779615753988-759736655.pdf", filePath: "uploads/1779615753988-759736655.pdf" }
  ]
};

const TITLE_EVENTS_MORE_1 = [
  { eventNo: 1, eventType: "ORIGINAL_OWNER", fromParty: "Vinod Keshav Kadam", toParty: "Rohan Vinod Kadam", currentOwner: "YES", documentType: "Gift Deed", documentDate: "2018-02-18", registrationNo: "1234/2018", sroName: "SRO Haveli II", propertyDetails: "Flat No. A-402, Green Fields, Pune", areaTransferred: "1150 Sq.Ft.", remarks: "Registered and gift tax cleared", generateParagraph: "YES" }
];

const TITLE_EVENTS_MORE_2 = [
  { eventNo: 1, eventType: "ORIGINAL_OWNER", fromParty: "Suresh Narayan Deshmukh", toParty: "Gopal Suresh Deshmukh", currentOwner: "NO", documentType: "Inheritance", documentDate: "1998-10-10", registrationNo: "Inheritance Case 92/1998", sroName: "Tehsildar Haveli", propertyDetails: "Survey No. 104, Hissa No. 3, Pune", areaTransferred: "5000 Sq.Ft.", remarks: "Heirship certificate verified", generateParagraph: "YES" },
  { eventNo: 2, eventType: "TRANSFER", fromParty: "Gopal Suresh Deshmukh", toParty: "Sneha Rahul Deshmukh", currentOwner: "YES", documentType: "Registered Sale Deed", documentDate: "2022-07-20", registrationNo: "9876/2022", sroName: "SRO Haveli IX", propertyDetails: "Survey No. 104, Hissa No. 3, Pune", areaTransferred: "5000 Sq.Ft.", remarks: "Duly registered and stamped", generateParagraph: "YES" }
];

const DOCUMENTS_MORE_1 = [
  { documentType: "Gift Deed", executionDate: "2018-02-18", executedBy: "Vinod Keshav Kadam", executedInFavourOf: "Rohan Vinod Kadam", registrationOffice: "SRO Haveli II", registrationNumber: "1234/2018", remarks: "Original registered gift deed verified" }
];

const EVIDENCE_MORE_1 = [
  { documentType: "Index II", executionDate: "2018-02-18", executedBy: "Sub-Registrar Haveli II", executedInFavourOf: "Rohan Vinod Kadam", registrationOffice: "SRO Haveli II", registrationNumber: "Reg-1234/2018", remarks: "Duly registered Index II copy" }
];

const DOCUMENTS_MORE_2 = [
  { documentType: "Sale Deed", executionDate: "2022-07-20", executedBy: "Gopal Suresh Deshmukh", executedInFavourOf: "Sneha Rahul Deshmukh", registrationOffice: "SRO Haveli IX", registrationNumber: "9876/2022", remarks: "Original registered copy verified" }
];

const EVIDENCE_MORE_2 = [
  { documentType: "Inheritance Heirship Certificate", executionDate: "1998-10-10", executedBy: "Tehsildar Haveli", executedInFavourOf: "Gopal Suresh Deshmukh", registrationOffice: "Tehsil Office Haveli", registrationNumber: "Inheritance Case 92/1998", remarks: "Certified inheritance entry verified" }
];

const tsrInitiationsMoreData = [
  {
    appId: "TSR-2026-90860",
    author: "Narayan",
    refNo: "REF/BL/ICICI/895",
    branch: "Pune",
    initiationDate: "2026-06-12",
    applicant: "Rohan Vinod Kadam",
    coApplicant: "Pooja Rohan Kadam",
    existingOwner: "Vinod Keshav Kadam",
    transactionType: "Mortgage Purchase of Flat",
    bankBranch: "Kothrud Branch, Pune",
    municipalPropertyNo: "MNC/2026/B-12",
    rccConstructionArea: "1,150 Sq.Ft.",
    village: "Kothrud",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of land bearing Gat No. 90, Hissa No. 3/A, situated at Village Kothrud, Taluka Haveli, District Pune, within the limits of Pune Municipal Corporation, admeasuring approximately 4.2 Gunthas.",
    subjectPropertyDescription: "All that piece and parcel of Flat No. A-402, admeasuring about 1,150 Sq.Ft., on the 4th Floor of the building known as \"Green Fields\", constructed on land Gat No. 90/3/A, Kothrud, Pune, and bounded towards East by Wing B of Society, West by Internal Road, South by Open garden plot, and North by Adjacent Wing C.",
    landParcels: [
      {
        surveyNo: "90",
        hissaNo: "3/A",
        area: "4.2",
        unit: "Guntha",
        remarks: "Residential flat area portion"
      }
    ],
    boundaryEast: "Wing B of Society",
    boundaryWest: "Internal Road",
    boundarySouth: "Open garden plot",
    boundaryNorth: "Adjacent Wing C",
    executiveMobile: "9890123456",
    executiveEmail: "rohan.kadam@icicibank.com",
    status: "in_progress",
    uploadedDocuments: [
      {
        originalName: "691_26_Hadapsar_Ganesh Sarak_TSR_Signed.pdf",
        filePath: "uploads/1781358392385-545970972.pdf",
        fileSize: 525686,
        extractedFields: ["applicant", "coApplicant", "appId", "transactionType"],
        uploadedAt: new Date()
      }
    ]
  },
  {
    appId: "TSR-2026-90870",
    author: "Narayan",
    refNo: "REF/BL/SBI/782",
    branch: "Main",
    initiationDate: "2026-06-13",
    applicant: "Sneha Rahul Deshmukh",
    coApplicant: "Rahul Gopal Deshmukh",
    existingOwner: "Gopal Suresh Deshmukh",
    transactionType: "Loan Against Property",
    bankBranch: "Hadapsar Branch, Pune",
    municipalPropertyNo: "PMC/HDP/224",
    rccConstructionArea: "1,850 Sq.Ft.",
    village: "Hadapsar",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of land bearing Survey No. 104, Hissa No. 3, situated at Village Hadapsar, Taluka Haveli, District Pune, admeasuring 0.05 Hectares.",
    subjectPropertyDescription: "All that piece and parcel of land bearing Survey No. 104/3, Hadapsar, Pune, admeasuring 0.05 Hectares, along with R.C.C. structure standing thereon admeasuring 1,850 Sq.Ft., bearing Property No. PMC/HDP/224, and bounded towards East by Adjacent Nala/Water Body, West by Gat No. 105 boundary line, South by Main Hadapsar Road (120 feet), and North by Plot No. 104-B residential layout.",
    landParcels: [
      {
        surveyNo: "104",
        hissaNo: "3",
        area: "0.05",
        unit: "Hectare",
        remarks: "Entire NA property"
      }
    ],
    boundaryEast: "Adjacent Nala/Water Body",
    boundaryWest: "Gat No. 105 boundary line",
    boundarySouth: "Main Hadapsar Road (120 feet)",
    boundaryNorth: "Plot No. 104-B residential layout",
    executiveMobile: "9876543210",
    executiveEmail: "sneha.deshmukh@sbi.co.in",
    status: "initiated",
    uploadedDocuments: [
      {
        originalName: "TSR_Deed_Scan_1779615778624.pdf",
        filePath: "uploads/1779615778624-471553305.pdf",
        fileSize: 4091904,
        extractedFields: ["applicant", "existingOwner", "village", "rccConstructionArea"],
        uploadedAt: new Date()
      }
    ]
  }
];

async function seedMore() {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/NLKAssociates';
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB successfully for seedMore');

    for (const item of tsrInitiationsMoreData) {
      const existing = await TSRInitiation.findOne({ appId: item.appId });
      if (existing) {
        console.log(`Removing old seed record: ${item.appId}`);
        if (existing.otherProvisionId) await TSROtherProvision.findByIdAndDelete(existing.otherProvisionId);
        if (existing.waitingReportId) await TSRWaitingReport.findByIdAndDelete(existing.waitingReportId);
        if (existing.titleFlowId) await TSRTitleFlow.findByIdAndDelete(existing.titleFlowId);
        await TSRDocumentList.deleteMany({ tsrId: existing._id });
        await TSRTitleEvidence.deleteMany({ tsrId: existing._id });
        await TSRInitiation.findByIdAndDelete(existing._id);
      }
    }

    // Seed Record 1
    const tsr1 = new TSRInitiation(tsrInitiationsMoreData[0]);
    const op1 = new TSROtherProvision({
      tsrInitiationId: tsr1._id,
      answers: OTHER_PROVISIONS_MORE_1
    });
    const wr1 = new TSRWaitingReport({
      tsrInitiationId: tsr1._id,
      ...WAITING_REPORT_MORE_1
    });
    const tf1 = new TSRTitleFlow({
      tsrInitiationId: tsr1._id,
      events: TITLE_EVENTS_MORE_1
    });

    await op1.save();
    await wr1.save();
    await tf1.save();
    await Promise.all(DOCUMENTS_MORE_1.map(d => TSRDocumentList.create({ tsrId: tsr1._id, ...d })));
    await Promise.all(EVIDENCE_MORE_1.map(e => TSRTitleEvidence.create({ tsrId: tsr1._id, ...e })));

    tsr1.otherProvisionId = op1._id;
    tsr1.waitingReportId = wr1._id;
    tsr1.titleFlowId = tf1._id;
    await tsr1.save();
    console.log('Seeded record 1 successfully:', tsr1.appId);

    // Seed Record 2
    const tsr2 = new TSRInitiation(tsrInitiationsMoreData[1]);
    const op2 = new TSROtherProvision({
      tsrInitiationId: tsr2._id,
      answers: OTHER_PROVISIONS_MORE_2
    });
    const wr2 = new TSRWaitingReport({
      tsrInitiationId: tsr2._id,
      ...WAITING_REPORT_MORE_2
    });
    const tf2 = new TSRTitleFlow({
      tsrInitiationId: tsr2._id,
      events: TITLE_EVENTS_MORE_2
    });

    await op2.save();
    await wr2.save();
    await tf2.save();
    await Promise.all(DOCUMENTS_MORE_2.map(d => TSRDocumentList.create({ tsrId: tsr2._id, ...d })));
    await Promise.all(EVIDENCE_MORE_2.map(e => TSRTitleEvidence.create({ tsrId: tsr2._id, ...e })));

    tsr2.otherProvisionId = op2._id;
    tsr2.waitingReportId = wr2._id;
    tsr2.titleFlowId = tf2._id;
    await tsr2.save();
    console.log('Seeded record 2 successfully:', tsr2.appId);

    await mongoose.disconnect();
    console.log('Completed seeding additional records!');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedMore();
