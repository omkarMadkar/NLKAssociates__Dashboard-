const mongoose = require('mongoose');
require('dotenv').config();
const TSRInitiation = require('./models/TSRInitiation');
const TSROtherProvision = require('./models/TSROtherProvision');
const TSRWaitingReport = require('./models/TSRWaitingReport');
const TSRTitleFlow = require('./models/TSRTitleFlow');
const TSRDocumentList = require('./models/TSRDocumentsList');
const TSRTitleEvidence = require('./models/TSRTitleEvidence');

// Common static lists for other provisions answers (21 questions)
const OTHER_PROVISIONS_ANSWERS = [
  { code: "5.1", question: "Whether provisions of urban land ceiling act are applicable?", answer: "No", remarks: "ULC clearance cert verified" },
  { code: "5.2", question: "Whether any property/ies intend to be given as security to any minor claim/share?", answer: "No", remarks: "No minor co-owners or claims found" },
  { code: "5.3", question: "Whether property affected by revenue and tenancy regulations?", answer: "No", remarks: "Clear non-tenancy certificate" },
  { code: "5.4", question: "Whether user land converted into non-agricultural use?", answer: "Yes", remarks: "NA Conversion Order verified" },
  { code: "5.5", question: "Whether up to date tax/land revenue has been paid?", answer: "Yes", remarks: "Property tax paid fully" },
  { code: "5.6", question: "Whether all original documents scrutinized?", answer: "Yes", remarks: "All originals verified physically" },
  { code: "5.7", question: "Whether required documents available for creating mortgage?", answer: "Yes", remarks: "Valid documents in place" },
  { code: "5.8", question: "Whether previous owners had competency to transfer property?", answer: "Yes", remarks: "Owners were major and sane" },
  { code: "5.9", question: "Whether proposed owners had competency to transfer property?", answer: "Yes", remarks: "Applicants are competent under law" },
  { code: "5.10", question: "What is tenure of land?", answer: "NA", remarks: "Freehold ownership" },
  { code: "5.11", question: "Whether land is Adivasi (Tribal) Land?", answer: "No", remarks: "Not tribal land" },
  { code: "5.12", question: "Whether property is joint family property?", answer: "No", remarks: "Self-acquired property" },
  { code: "5.13", question: "Whether SARFAESI Act applicable?", answer: "Yes", remarks: "Applicable as per law" },
  { code: "5.14", question: "Whether property subject to reservation/acquisition?", answer: "No", remarks: "Zone certificate checked" },
  { code: "5.15", question: "Whether property transferred through POA holder?", answer: "No", remarks: "Direct conveyance" },
  { code: "5.16", question: "Whether POA holder had authority to sell?", answer: "NA", remarks: "Not applicable" },
  { code: "5.17", question: "Whether POA registered?", answer: "NA", remarks: "Not applicable" },
  { code: "5.18", question: "Whether NOC required for mortgage?", answer: "No", remarks: "NOC not required" },
  { code: "5.19", question: "Whether permission required upon invocation of mortgage?", answer: "No", remarks: "No permissions needed" },
  { code: "5.20", question: "Whether Search Report obtained?", answer: "Yes", remarks: "30 Years search completed" },
  { code: "5.21", question: "Whether EC obtained?", answer: "Yes", remarks: "EC obtained from SRO" }
];

const tsrInitiationsData = [
  // Record 1
  {
    appId: "TSR-2026-00101",
    author: "Narayan",
    refNo: "REF/BL/ICICI/101",
    branch: "Pune",
    initiationDate: "2026-06-10",
    applicant: "Amit Vinayak Kulkarni",
    coApplicant: "Snehal Amit Kulkarni",
    existingOwner: "Madanlal Shivprasad Sharma",
    transactionType: "Purchase of Apartment",
    bankBranch: "Kothrud Branch, Pune",
    municipalPropertyNo: "PMC/KTH/56",
    rccConstructionArea: "1,550 Sq.Ft.",
    village: "Kothrud",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of land bearing Gat No. 88, Hissa No. 1-B situated at Village Kothrud, Taluka Haveli, District Pune, admeasuring 0.08 Hectares.",
    subjectPropertyDescription: "Residential Flat No. A-9 admeasuring 1,550 Sq.Ft. on the GROUND floor of the building bearing Property No. PMC/KTH/56.",
    landParcels: [{ surveyNo: "88", hissaNo: "1-B", area: "0.08", unit: "Hectare", remarks: "Converted to NA Commercial" }],
    boundaryEast: "DP Road (80 feet)",
    boundaryWest: "Survey No. 89 boundary",
    boundarySouth: "Flat No. C-3, Royal Park",
    boundaryNorth: "Main entrance gate and walkway",
    executiveMobile: "9876123456",
    executiveEmail: "amit.kulkarni@icicibank.com",
    status: "in_progress",
    uploadedChecklist: [
      { name: "Conveyance Deed 2021", fileName: "Conveyance_Deed_Amit.pdf", filePath: "uploads/Conveyance_Deed_Amit.pdf", remarks: "Duly registered copy" },
      { name: "Index II 2021", fileName: "Index_II_Amit.pdf", filePath: "uploads/Index_II_Amit.pdf", remarks: "Verified online on Mahabhulekh" },
      { name: "Tax Receipt 2026", fileName: "Tax_Receipt_2026.pdf", filePath: "uploads/Tax_Receipt_2026.pdf", remarks: "Paid up to March 2026" },
      { name: "7/12 Extract Copy", fileName: "7_12_Extract_Amit.pdf", filePath: "uploads/7_12_Extract_Amit.pdf", remarks: "Latest extract copy" },
      { name: "Mutation Certificate", fileName: "Mutation_Cert.pdf", filePath: "uploads/Mutation_Cert.pdf", remarks: "Mutation entry certified copy" }
    ]
  },
  // Record 2
  {
    appId: "TSR-2026-00102",
    author: "Narayan",
    refNo: "REF/BL/HDFC/102",
    branch: "Main",
    initiationDate: "2026-06-01",
    applicant: "Rajesh Madanlal Sharma",
    coApplicant: "Meera Rajesh Sharma",
    existingOwner: "Madanlal Shivprasad Sharma",
    transactionType: "Mortgage of Flat",
    bankBranch: "Hadapsar Branch, Pune",
    municipalPropertyNo: "MNC/2026/A-9",
    rccConstructionArea: "1,550 Sq.Ft.",
    village: "Hadapsar",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of land bearing Gat No. 124, Hissa No. 2/A/1, situated at Village Hadapsar, Taluka Haveli, District Pune, admeasuring 5.5 Gunthas.",
    subjectPropertyDescription: "Flat No. A-9 on the GROUND Floor of the building admeasuring about 1,550 Sq.Ft., bearing Property No. MNC/2026/A-9.",
    landParcels: [{ surveyNo: "124", hissaNo: "2/A/1", area: "5.5", unit: "Guntha", remarks: "Non-agricultural residential plot" }],
    boundaryEast: "Adjacent Internal Road",
    boundaryWest: "Society Boundary Wall & Open Space",
    boundarySouth: "Plot No. 125, Mr. Joshi",
    boundaryNorth: "Plot No. 123, Mrs. Ranade",
    executiveMobile: "9823456789",
    executiveEmail: "rajesh.sales@hdfc.com",
    status: "initiated",
    uploadedChecklist: [
      { name: "Sale Deed 2015", fileName: "Sale_Deed_Sharma.pdf", filePath: "uploads/Sale_Deed_Sharma.pdf", remarks: "Original scanned copy" },
      { name: "Index II 2015", fileName: "Index_II_Sharma.pdf", filePath: "uploads/Index_II_Sharma.pdf", remarks: "Registered copy" },
      { name: "Mutation Entry 4452", fileName: "Mutation_Sharma.pdf", filePath: "uploads/Mutation_Sharma.pdf", remarks: "Approved mutation copy" },
      { name: "Tax Receipt 2025", fileName: "Tax_Sharma.pdf", filePath: "uploads/Tax_Sharma.pdf", remarks: "Paid up to 2025" },
      { name: "NA Conversion Order", fileName: "NA_Order_Sharma.pdf", filePath: "uploads/NA_Order_Sharma.pdf", remarks: "NA conversion certified copy" }
    ]
  },
  // Record 3
  {
    appId: "TSR-2026-00103",
    author: "Narayan",
    refNo: "REF/BL/SBI/103",
    branch: "Main",
    initiationDate: "2026-06-13",
    applicant: "Sneha Rahul Deshmukh",
    coApplicant: "Rahul Gopal Deshmukh",
    existingOwner: "Subhash Ganpat Sarak",
    transactionType: "Home Loan / Flat Purchase",
    bankBranch: "Deccan Branch, Pune",
    municipalPropertyNo: "PMC/DEC/42",
    rccConstructionArea: "1,200 Sq.Ft.",
    village: "Deccan Gymkhana",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of residential land Gat No. 34, situated at Deccan Gymkhana, Taluka Haveli, District Pune, admeasuring 0.05 Hectares.",
    subjectPropertyDescription: "Apartment No. 402 admeasuring 1,200 Sq.Ft. on the FOURTH Floor of building admeasuring PMC/DEC/42.",
    landParcels: [{ surveyNo: "34", hissaNo: "1", area: "0.05", unit: "Hectare", remarks: "Clear NA title" }],
    boundaryEast: "Society Main Entrance Road",
    boundaryWest: "Common Walkway & Park",
    boundarySouth: "Flat No 401 boundary",
    boundaryNorth: "Flat No 403 boundary",
    executiveMobile: "9422019283",
    executiveEmail: "sneha.deshmukh@sbi.co.in",
    status: "initiated",
    uploadedChecklist: [
      { name: "Agreement for Sale 2018", fileName: "Agreement_Sale_Sneha.pdf", filePath: "uploads/Agreement_Sale_Sneha.pdf", remarks: "Registered agreement" },
      { name: "Property Card Copy", fileName: "Property_Card_Sneha.pdf", filePath: "uploads/Property_Card_Sneha.pdf", remarks: "PMC property card verified" },
      { name: "No Objection Certificate", fileName: "NOC_Society_Sneha.pdf", filePath: "uploads/NOC_Society_Sneha.pdf", remarks: "Society NOC for mortgage" },
      { name: "Tax Paid Receipt", fileName: "Tax_Receipt_Sneha.pdf", filePath: "uploads/Tax_Receipt_Sneha.pdf", remarks: "PMC municipal tax receipt" },
      { name: "Index II 2018", fileName: "Index_II_Sneha.pdf", filePath: "uploads/Index_II_Sneha.pdf", remarks: "Scanned index 2 copy" }
    ]
  },
  // Record 4
  {
    appId: "TSR-2026-00104",
    author: "Narayan",
    refNo: "REF/BL/AXIS/104",
    branch: "Pune",
    initiationDate: "2026-06-12",
    applicant: "Rohan Vinod Kadam",
    coApplicant: "Pooja Rohan Kadam",
    existingOwner: "Rohan Vinod Kadam",
    transactionType: "Loan Against Commercial Property",
    bankBranch: "Baner Branch, Pune",
    municipalPropertyNo: "PMC/BNR/900",
    rccConstructionArea: "2,450 Sq.Ft.",
    village: "Baner",
    taluka: "Haveli",
    district: "Pune",
    municipalCouncil: "Pune Municipal Corporation",
    entireLandDescription: "All that piece and parcel of commercial plot bearing Survey No. 110, situated at Village Baner, Taluka Haveli, District Pune, admeasuring 0.12 Hectares.",
    subjectPropertyDescription: "Commercial Unit No. 1 admeasuring 2,450 Sq.Ft. on the FIRST floor of commercial building bearing Property No. PMC/BNR/900.",
    landParcels: [{ surveyNo: "110", hissaNo: "1-A", area: "0.12", unit: "Hectare", remarks: "NA Commercial plot with NOC" }],
    boundaryEast: "Baner Main High Street",
    boundaryWest: "Neighboring Commercial Plot 109",
    boundarySouth: "Commercial Unit No. 2",
    boundaryNorth: "Adjacent lane & parking area",
    executiveMobile: "9890123456",
    executiveEmail: "rohan.kadam@axisbank.com",
    status: "completed",
    uploadedChecklist: [
      { name: "Sale Deed 2022", fileName: "Sale_Deed_Kadam.pdf", filePath: "uploads/Sale_Deed_Kadam.pdf", remarks: "Original registered deed" },
      { name: "Index II 2022", fileName: "Index_II_Kadam.pdf", filePath: "uploads/Index_II_Kadam.pdf", remarks: "Sub-registrar certified copy" },
      { name: "Search Report 30 Years", fileName: "Search_Report_30_Yrs.pdf", filePath: "uploads/Search_Report_30_Yrs.pdf", remarks: "Obtained from advocate searcher" },
      { name: "Encumbrance Certificate", fileName: "EC_1996_2026.pdf", filePath: "uploads/EC_1996_2026.pdf", remarks: "Clean EC for 30 years" },
      { name: "Society Share Certificate", fileName: "Share_Cert_Kadam.pdf", filePath: "uploads/Share_Cert_Kadam.pdf", remarks: "Duly transferred share certificate" }
    ]
  }
];

const WR_DOCUMENTS = [
  { srNo: 1, name: "Sale Deed / Conveyance Deed", available: "Yes", remarks: "Original document verified" },
  { srNo: 2, name: "Index II", available: "Yes", remarks: "SRO registered index 2 verified" },
  { srNo: 3, name: "7/12 Extract / Property Card", available: "Yes", remarks: "Latest extract copy submitted" },
  { srNo: 4, name: "Tax Receipt", available: "Yes", remarks: "Tax receipt verified up to date" },
  { srNo: 5, name: "Mutation Entry", available: "Yes", remarks: "Mutation entry certified copy verified" }
];

async function seed() {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/NLKAssociates';
    await mongoose.connect(connStr);
    console.log('Successfully connected to MongoDB');

    // Wipe out the entire database of initiation records and child logs
    console.log('Wiping out all existing TSR data from the database...');
    await TSRInitiation.deleteMany({});
    await TSROtherProvision.deleteMany({});
    await TSRWaitingReport.deleteMany({});
    await TSRTitleFlow.deleteMany({});
    await TSRDocumentList.deleteMany({});
    await TSRTitleEvidence.deleteMany({});
    console.log('Database wipe complete.');

    // Seed the exactly 4 high-fidelity records
    for (let i = 0; i < tsrInitiationsData.length; i++) {
      const data = tsrInitiationsData[i];
      const tsr = new TSRInitiation(data);

      // Create TSROtherProvision
      const op = new TSROtherProvision({
        tsrInitiationId: tsr._id,
        answers: OTHER_PROVISIONS_ANSWERS
      });
      await op.save();
      tsr.otherProvisionId = op._id;

      // Create TSRWaitingReport
      const wr = new TSRWaitingReport({
        tsrInitiationId: tsr._id,
        chalanNo: `CH-2026-${100 + i}`,
        date: data.initiationDate,
        reportSrNo: `SR-PUNE-${900 + i}`,
        documents: WR_DOCUMENTS
      });
      await wr.save();
      tsr.waitingReportId = wr._id;

      // Create TSRTitleFlow
      const tf = new TSRTitleFlow({
        tsrInitiationId: tsr._id,
        description: `Chronology trace of title transfers for case ${data.appId}. Starting from the prime conversion order up to current ownership transfer.`,
        events: [
          {
            eventNo: 1,
            eventType: "Conveyance Deed",
            fromParty: data.existingOwner,
            toParty: data.applicant,
            currentOwner: "YES",
            documentType: "Registered Deed",
            documentDate: data.initiationDate,
            registrationNo: `Reg-${1000 + i}/2026`,
            sroName: "SRO Haveli III",
            propertyDetails: data.municipalPropertyNo,
            areaTransferred: data.rccConstructionArea,
            remarks: "Duly registered, stamped, and original verified",
            generateParagraph: "YES"
          }
        ]
      });
      await tf.save();
      tsr.titleFlowId = tf._id;

      // Create TSRDocumentList
      const doc = new TSRDocumentList({
        tsrId: tsr._id,
        documentType: "Registered Sale Deed",
        executionDate: new Date(data.initiationDate),
        executedBy: data.existingOwner,
        executedInFavourOf: data.applicant,
        registrationOffice: "SRO Haveli III",
        registrationNumber: `Reg-${1000 + i}/2026`,
        remarks: "Scrutinized original copy successfully."
      });
      await doc.save();
      tsr.documentList = doc._id;

      // Create TSRTitleEvidence
      const ev = new TSRTitleEvidence({
        tsrId: tsr._id,
        documentType: "Index II Summary Certificate",
        executionDate: new Date(data.initiationDate),
        executedBy: "Sub Registrar Officer",
        executedInFavourOf: data.applicant,
        registrationOffice: "SRO Haveli III",
        registrationNumber: `IDX-II-2026-${i}`,
        remarks: "Index II verification completed online"
      });
      await ev.save();
      tsr.titleEvidenceId = ev._id;

      // Save TSR record with linked model IDs
      await tsr.save();
      console.log(`Successfully seeded Case ${i + 1}/4: ${tsr.appId} (${tsr.applicant})`);
    }

    await mongoose.disconnect();
    console.log('Database successfully seeded with 4 perfect, fully-completed records!');
  } catch (err) {
    console.error('Seeding failure:', err);
    process.exit(1);
  }
}

seed();
