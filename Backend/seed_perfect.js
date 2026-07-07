const mongoose = require('mongoose');
require('dotenv').config();
const TSRInitiation = require('./models/TSRInitiation');
const TSROtherProvision = require('./models/TSROtherProvision');
const TSRWaitingReport = require('./models/TSRWaitingReport');
const TSRTitleFlow = require('./models/TSRTitleFlow');
const TSRDocumentList = require('./models/TSRDocumentsList');
const TSRTitleEvidence = require('./models/TSRTitleEvidence');

const OTHER_PROVISIONS_1 = [
  { code: "5.1", question: "Whether provisions of urban land ceiling act are applicable?", answer: "No", remarks: "NOC obtained from ULC authority" },
  { code: "5.2", question: "Whether any property/ies intend to be given as security to any minor claim/share?", answer: "No", remarks: "No minor share involved" },
  { code: "5.3", question: "Whether property affected by revenue and tenancy regulations?", answer: "No", remarks: "Clear title, no tenancy claims" },
  { code: "5.4", question: "Whether user land converted into non-agricultural use?", answer: "Yes", remarks: "NA conversion order dated 12/04/2018" },
  { code: "5.5", question: "Whether up to date tax/land revenue has been paid?", answer: "Yes", remarks: "Tax receipt verified up to March 2026" },
  { code: "5.6", question: "Whether all original documents scrutinized?", answer: "Yes", remarks: "All originals verified at PMC office" },
  { code: "5.7", question: "Whether required documents available for creating mortgage?", answer: "Yes", remarks: "Equitable mortgage feasible" },
  { code: "5.8", question: "Whether previous owners had competency to transfer property?", answer: "Yes", remarks: "Power of sale legally valid" },
  { code: "5.9", question: "Whether proposed owners had competency to transfer property?", answer: "Yes", remarks: "Applicant is competent under law" },
  { code: "5.10", question: "What is tenure of land?", answer: "NA", remarks: "Freehold ownership" },
  { code: "5.11", question: "Whether land is Adivasi (Tribal) Land?", answer: "No", remarks: "Not tribal land" },
  { code: "5.12", question: "Whether property is joint family property?", answer: "No", remarks: "Self-acquired property of Madanlal Sharma" },
  { code: "5.13", question: "Whether SARFAESI Act applicable?", answer: "Yes", remarks: "Standard mortgage provisions apply" },
  { code: "5.14", question: "Whether property subject to reservation/acquisition?", answer: "No", remarks: "Zone certificate checked" },
  { code: "5.15", question: "Whether property transferred through POA holder?", answer: "No", remarks: "Direct conveyance by owner" },
  { code: "5.16", question: "Whether POA holder had authority to sell?", answer: "NA", remarks: "Not applicable" },
  { code: "5.17", question: "Whether POA registered?", answer: "NA", remarks: "Not applicable" },
  { code: "5.18", question: "Whether NOC required for mortgage?", answer: "Yes", remarks: "NOC from Society obtained" },
  { code: "5.19", question: "Whether permission required upon invocation of mortgage?", answer: "No", remarks: "Standard foreclosure" },
  { code: "5.20", question: "Whether Search Report obtained?", answer: "Yes", remarks: "30 years search report annexed" },
  { code: "5.21", question: "Whether EC obtained?", answer: "Yes", remarks: "EC from 1996 to 2026 checked" }
];

const OTHER_PROVISIONS_2 = [
  { code: "5.1", question: "Whether provisions of urban land ceiling act are applicable?", answer: "No", remarks: "Freehold NA plot" },
  { code: "5.2", question: "Whether any property/ies intend to be given as security to any minor claim/share?", answer: "No", remarks: "No minor co-owners" },
  { code: "5.3", question: "Whether property affected by revenue and tenancy regulations?", answer: "No", remarks: "Class 1 tenure land" },
  { code: "5.4", question: "Whether user land converted into non-agricultural use?", answer: "Yes", remarks: "NA Order No. PMC/NA/3452/2020" },
  { code: "5.5", question: "Whether up to date tax/land revenue has been paid?", answer: "Yes", remarks: "Property tax paid up to date" },
  { code: "5.6", question: "Whether all original documents scrutinized?", answer: "Yes", remarks: "Original Sale deed dated 14/05/2021 verified" },
  { code: "5.7", question: "Whether required documents available for creating mortgage?", answer: "Yes", remarks: "Yes, original deed and index 2" },
  { code: "5.8", question: "Whether previous owners had competency to transfer property?", answer: "Yes", remarks: "Duly scrutinized" },
  { code: "5.9", question: "Whether proposed owners had competency to transfer property?", answer: "Yes", remarks: "Duly verified" },
  { code: "5.10", question: "What is tenure of land?", answer: "NA", remarks: "Occupant Class 1" },
  { code: "5.11", question: "Whether land is Adivasi (Tribal) Land?", answer: "No", remarks: "Non-tribal, general class" },
  { code: "5.12", question: "Whether property is joint family property?", answer: "No", remarks: "Individual self-acquired" },
  { code: "5.13", question: "Whether SARFAESI Act applicable?", answer: "Yes", remarks: "Governed by SARFAESI" },
  { code: "5.14", question: "Whether property subject to reservation/acquisition?", answer: "No", remarks: "No PMC reservations" },
  { code: "5.15", question: "Whether property transferred through POA holder?", answer: "No", remarks: "Direct transaction" },
  { code: "5.16", question: "Whether POA holder had authority to sell?", answer: "NA", remarks: "Not applicable" },
  { code: "5.17", question: "Whether POA registered?", answer: "NA", remarks: "Not applicable" },
  { code: "5.18", question: "Whether NOC required for mortgage?", answer: "No", remarks: "NOC not required" },
  { code: "5.19", question: "Whether permission required upon invocation of mortgage?", answer: "No", remarks: "No permission needed" },
  { code: "5.20", question: "Whether Search Report obtained?", answer: "Yes", remarks: "Obtained for 30 years" },
  { code: "5.21", question: "Whether EC obtained?", answer: "Yes", remarks: "Obtained and verified" }
];

const WAITING_REPORT_1 = {
  chalanNo: "CH-90812-A",
  date: "2026-06-02",
  reportSrNo: "SR-PUNE-0912",
  documents: [
    { srNo: 1, name: "Sale Deed / Conveyance Deed", available: "Yes", remarks: "Original deed submitted" },
    { srNo: 2, name: "Index II", available: "Yes", remarks: "Duly registered Index II submitted" },
    { srNo: 3, name: "7/12 Extract / Property Card", available: "Yes", remarks: "Updated 7/12 extract dated 01/06/2026" },
    { srNo: 4, name: "Tax Receipt", available: "Yes", remarks: "PMC tax receipt attached" },
    { srNo: 5, name: "Mutation Entry", available: "Yes", remarks: "Mutation No. 4452 verified" }
  ]
};

const WAITING_REPORT_2 = {
  chalanNo: "CH-90835-B",
  date: "2026-06-11",
  reportSrNo: "SR-PUNE-0955",
  documents: [
    { srNo: 1, name: "Sale Deed / Conveyance Deed", available: "Yes", remarks: "Original deed verified" },
    { srNo: 2, name: "Index II", available: "Yes", remarks: "Index II registered at SRO Haveli 4" },
    { srNo: 3, name: "7/12 Extract / Property Card", available: "No", remarks: "Property card copy pending" },
    { srNo: 4, name: "Tax Receipt", available: "Yes", remarks: "Paid receipt annexed" },
    { srNo: 5, name: "Mutation Entry", available: "No", remarks: "Pending mutation entry cert from Tehsil" }
  ]
};

const TITLE_EVENTS_1 = [
  { eventNo: 1, eventType: "Sale Deed", fromParty: "Madanlal Shivprasad Sharma", toParty: "Rajesh Madanlal Sharma", currentOwner: "YES", documentType: "Registered Deed", documentDate: "2015-05-12", registrationNo: "7765/2015", sroName: "SRO Haveli V", propertyDetails: "Plot No. 45, Baner Road, Pune", areaTransferred: "1200 Sq.Ft.", remarks: "Duly stamped and registered", generateParagraph: "YES" }
];

const TITLE_EVENTS_2 = [
  { eventNo: 1, eventType: "Conveyance Deed", fromParty: "Dynamic Developers LLP", toParty: "Amit Vinayak Kulkarni", currentOwner: "YES", documentType: "Registered Sale Deed", documentDate: "2021-05-14", registrationNo: "4321/2021", sroName: "SRO Haveli III", propertyDetails: "Gat No. 78, Kothrud, Pune", areaTransferred: "2100 Sq.Ft.", remarks: "Clear chain document", generateParagraph: "YES" }
];

const DOCUMENTS_1 = [
  { documentType: "Sale Deed", executionDate: "2015-05-12", executedBy: "Madanlal Shivprasad Sharma", executedInFavourOf: "Rajesh Madanlal Sharma", registrationOffice: "SRO Haveli V", registrationNumber: "7765/2015", remarks: "Original registered copy verified" }
];

const EVIDENCE_1 = [
  { documentType: "Mutation Entry 4452", executionDate: "2015-06-10", executedBy: "Tehsildar Haveli", executedInFavourOf: "Rajesh Madanlal Sharma", registrationOffice: "Tehsil Office Haveli", registrationNumber: "ME-4452", remarks: "Certified copy verified" }
];

const DOCUMENTS_2 = [
  { documentType: "Sale Deed", executionDate: "2021-05-14", executedBy: "Dynamic Developers LLP", executedInFavourOf: "Amit Vinayak Kulkarni", registrationOffice: "SRO Haveli III", registrationNumber: "4321/2021", remarks: "Original registered deed" }
];

const EVIDENCE_2 = [
  { documentType: "Index II", executionDate: "2021-05-14", executedBy: "Sub-Registrar Haveli III", executedInFavourOf: "Amit Vinayak Kulkarni", registrationOffice: "SRO Haveli III", registrationNumber: "Reg-4321/2021", remarks: "Duly registered copy verified" }
];

const tsrInitiationsData = [
  {
    appId: "TSR-2026-90812",
    author: "Narayan",
    refNo: "REF/BL/ICICI/890",
    branch: "Main",
    initiationDate: "2026-06-01",
    applicant: "Rajesh Madanlal Sharma",
    coApplicant: "Meera Rajesh Sharma",
    existingOwner: "Madanlal Shivprasad Sharma",
    transactionType: "Mortgage / Purchase of Flat",
    bankBranch: "Hadapsar Branch, Pune",
    municipalPropertyNo: "MNC/2026/A-9",
    rccConstructionArea: "1,550 Sq.Ft.",
    village: "Hadapsar",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of land bearing Gat No. 124, Hissa No. 2/A/1, situated at Village Hadapsar, Taluka Haveli, District Pune, within the jurisdiction of Sub-Registrar Haveli and limits of Pune Municipal Corporation, admeasuring approximately 5.5 Gunthas.",
    subjectPropertyDescription: "All that piece and parcel of residential Flat No. A-9 constructed on the GROUND Floor of the building admeasuring about 1,550 Sq.Ft., bearing Property No. MNC/2026/A-9, and bounded towards East by Adjacent Internal Road, West by Society Boundary Wall, South by Plot No. 125, and North by Plot No. 123.",
    landParcels: [
      {
        surveyNo: "124",
        hissaNo: "2/A/1",
        area: "5.5",
        unit: "Guntha",
        remarks: "Non-agricultural residential plot"
      }
    ],
    boundaryEast: "Adjacent Internal Road",
    boundaryWest: "Society Boundary Wall & Open Space",
    boundarySouth: "Plot No. 125, owned by Mr. Joshi",
    boundaryNorth: "Plot No. 123, owned by Mrs. Ranade",
    executiveMobile: "9823456789",
    executiveEmail: "rajesh.sales@icicibank.com",
    status: "initiated"
  },
  {
    appId: "TSR-2026-90835",
    author: "Narayan",
    refNo: "REF/BL/HDFC/451",
    branch: "Pune",
    initiationDate: "2026-06-10",
    applicant: "Amit Vinayak Kulkarni",
    coApplicant: "Snehal Amit Kulkarni",
    existingOwner: "Amit Vinayak Kulkarni",
    transactionType: "Loan Against Property",
    bankBranch: "Kothrud Branch, Pune",
    municipalPropertyNo: "PMC/KTH/56",
    rccConstructionArea: "2,100 Sq.Ft.",
    village: "Kothrud",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of land situated at Village Kothrud, Taluka Haveli, District Pune, comprising Land Gat No. 88, Hissa No. 1-B, admeasuring 0.08 Hectares.",
    subjectPropertyDescription: "All that piece and parcel of land bearing Gat No. 88/1-B, Kothrud, Pune, admeasuring 0.08 Hectares, along with R.C.C. structure standing thereon admeasuring 2,100 Sq.Ft., bearing Property No. PMC/KTH/56, and bounded towards East by DP Road, West by Survey No. 89 boundary, South by Flat No. C-3, Royal Park, and North by Main entrance gate.",
    landParcels: [
      {
        surveyNo: "88",
        hissaNo: "1-B",
        area: "0.08",
        unit: "Hectare",
        remarks: "Converted to NA Commercial"
      }
    ],
    boundaryEast: "DP Road (80 feet)",
    boundaryWest: "Survey No. 89 boundary",
    boundarySouth: "Flat No. C-3, Royal Park",
    boundaryNorth: "Main entrance gate and walkway",
    executiveMobile: "9876123456",
    executiveEmail: "amit.kulkarni@hdfc.com",
    status: "in_progress"
  }
];

async function seed() {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/NLKAssociates';
    await mongoose.connect(connStr);
    console.log('Successfully connected to MongoDB');

    // Clean up any existing seed records with these appIds to avoid duplicates
    for (const item of tsrInitiationsData) {
      const existing = await TSRInitiation.findOne({ appId: item.appId });
      if (existing) {
        console.log(`Removing old seed record: ${item.appId}`);
        // Remove linked subdocs if any
        if (existing.otherProvisionId) await TSROtherProvision.findByIdAndDelete(existing.otherProvisionId);
        if (existing.waitingReportId) await TSRWaitingReport.findByIdAndDelete(existing.waitingReportId);
        if (existing.titleFlowId) await TSRTitleFlow.findByIdAndDelete(existing.titleFlowId);
        await TSRDocumentList.deleteMany({ tsrId: existing._id });
        await TSRTitleEvidence.deleteMany({ tsrId: existing._id });
        await TSRInitiation.findByIdAndDelete(existing._id);
      }
    }

    // Insert new seeded records
    // Record 1
    const tsr1 = new TSRInitiation(tsrInitiationsData[0]);
    const op1 = new TSROtherProvision({
      tsrInitiationId: tsr1._id,
      answers: OTHER_PROVISIONS_1
    });
    const wr1 = new TSRWaitingReport({
      tsrInitiationId: tsr1._id,
      ...WAITING_REPORT_1
    });
    const tf1 = new TSRTitleFlow({
      tsrInitiationId: tsr1._id,
      events: TITLE_EVENTS_1
    });

    await op1.save();
    await wr1.save();
    await tf1.save();
    await Promise.all(DOCUMENTS_1.map(d => TSRDocumentList.create({ tsrId: tsr1._id, ...d })));
    await Promise.all(EVIDENCE_1.map(e => TSRTitleEvidence.create({ tsrId: tsr1._id, ...e })));

    tsr1.otherProvisionId = op1._id;
    tsr1.waitingReportId = wr1._id;
    tsr1.titleFlowId = tf1._id;
    await tsr1.save();

    console.log('Inserted perfect TSR Record 1:', tsr1.appId);

    // Record 2
    const tsr2 = new TSRInitiation(tsrInitiationsData[1]);
    const op2 = new TSROtherProvision({
      tsrInitiationId: tsr2._id,
      answers: OTHER_PROVISIONS_2
    });
    const wr2 = new TSRWaitingReport({
      tsrInitiationId: tsr2._id,
      ...WAITING_REPORT_2
    });
    const tf2 = new TSRTitleFlow({
      tsrInitiationId: tsr2._id,
      events: TITLE_EVENTS_2
    });

    await op2.save();
    await wr2.save();
    await tf2.save();
    await Promise.all(DOCUMENTS_2.map(d => TSRDocumentList.create({ tsrId: tsr2._id, ...d })));
    await Promise.all(EVIDENCE_2.map(e => TSRTitleEvidence.create({ tsrId: tsr2._id, ...e })));

    tsr2.otherProvisionId = op2._id;
    tsr2.waitingReportId = wr2._id;
    tsr2.titleFlowId = tf2._id;
    await tsr2.save();

    console.log('Inserted perfect TSR Record 2:', tsr2.appId);

    await mongoose.disconnect();
    console.log('Successfully completed seeding 2 perfect records!');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
