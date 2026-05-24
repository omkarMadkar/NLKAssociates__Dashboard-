const mongoose = require('mongoose');
require('dotenv').config();
const TSRInitiation = require('./models/TSRInitiation');
const Case = require('./models/Case');
const Client = require('./models/Client');
const Property = require('./models/Property');

const tsrInitiationsData = [
  {
    appId: "77000234182",
    author: "Narayan",
    branch: "Main",
    initiationDate: "2026-05-01",
    applicant: "Swapan Mandol",
    coApplicant: "Ritu Mandol",
    transactionType: "Home Loan",
    surveyNoDetails: "Plot No. 45, Baner Road, Pune — 2BHK Flat, 1200 Sq.Ft.",
    executiveMobile: "9812345678",
    executiveEmail: "exec1@nlkassociates.com",
    status: "initiated"
  },
  {
    appId: "77000234199",
    author: "Narayan",
    branch: "Pune",
    initiationDate: "2026-05-05",
    applicant: "Ramesh Patil",
    coApplicant: "",
    transactionType: "Loan Against Property",
    surveyNoDetails: "Gat No. 78, Dindori Road, Nashik — Agricultural Land, 2400 Sq.Ft.",
    executiveMobile: "9876543211",
    executiveEmail: "exec2@nlkassociates.com",
    status: "in_progress"
  },
  {
    appId: "77000234215",
    author: "Narayan",
    branch: "Mumbai",
    initiationDate: "2026-05-10",
    applicant: "Kavita Shetty",
    coApplicant: "Arun Shetty",
    transactionType: "Home Loan",
    surveyNoDetails: "CTS No. 1234, Bandra (W), Mumbai — Row House, 1800 Sq.Ft.",
    executiveMobile: "9765432100",
    executiveEmail: "exec3@nlkassociates.com",
    status: "completed"
  },
  {
    appId: "77000234230",
    author: "Narayan",
    branch: "Main",
    initiationDate: "2026-05-15",
    applicant: "Dilip Waghmare",
    coApplicant: "",
    transactionType: "Commercial Loan",
    surveyNoDetails: "Survey No. 112, Hingna Road, Nagpur — Shop, 600 Sq.Ft.",
    executiveMobile: "9901234567",
    executiveEmail: "exec4@nlkassociates.com",
    status: "initiated"
  },
  {
    appId: "99000555331",
    author: "Advocate Priya",
    branch: "Mumbai",
    initiationDate: "2026-05-15",
    applicant: "Mr. Vikram Singh",
    coApplicant: "Ms. Anjali Singh",
    existingOwner: "Mr. Rajesh Patel",
    transactionType: "LAP",
    bankBranch: "Andheri Branch, Mumbai",
    municipalPropertyNo: "M/W/12/55512000",
    rccConstructionArea: "1200 sq. ft.",
    village: "Andheri",
    taluka: "Andheri",
    district: "Mumbai Suburban",
    municipalCouncil: "BMC",
    surveyNoDetails: "CTS No. 445, admeasuring 150 sq. mtrs.",
    boundaryEast: "Plot No 44",
    boundaryWest: "Public Garden",
    boundarySouth: "Main Road",
    boundaryNorth: "CTS No 446",
    executiveMobile: "9123456780",
    executiveEmail: "andheri.exec@bank.com",
    status: "in_progress"
  }
];

const casesData = [
  {
    caseId: "NLK-2026-00001",
    bank: "ICICI Bank",
    status: "approved",
    clientName: "Rajesh Sharma",
    clientPhone: "9876543210",
    clientEmail: "rajesh@gmail.com",
    clientAddress: "Flat 4B, Sai Nagar, Pune",
    propertyAddress: "Plot No. 45, Baner Road, Pune",
    surveyNo: "SRV/2024/1234",
    village: "Baner",
    taluka: "Haveli",
    district: "Pune",
    assignedTo: "Adv. Priya Kulkarni",
    createdBy: "admin"
  },
  {
    caseId: "NLK-2026-00002",
    bank: "ICICI Bank",
    status: "under_review",
    clientName: "Sunita Desai",
    clientPhone: "9812345678",
    clientEmail: "sunita.d@yahoo.com",
    clientAddress: "12, Shivaji Colony, Nashik",
    propertyAddress: "Gat No. 78, Dindori Road, Nashik",
    surveyNo: "SRV/2024/5678",
    village: "Dindori",
    taluka: "Dindori",
    district: "Nashik",
    assignedTo: "Adv. Arun Patil",
    createdBy: "admin"
  },
  {
    caseId: "NLK-2026-00003",
    bank: "Aditya Birla",
    status: "draft_ready",
    clientName: "Vikram Joshi",
    clientPhone: "9765432100",
    clientEmail: "vikramj@hotmail.com",
    clientAddress: "C-17, NIBM Road, Pune",
    propertyAddress: "CTS No. 290/A, Kondhwa, Pune",
    surveyNo: "SRV/2024/9012",
    village: "Kondhwa",
    taluka: "Haveli",
    district: "Pune",
    assignedTo: "Adv. Priya Kulkarni",
    createdBy: "admin"
  },
  {
    caseId: "NLK-2026-00004",
    bank: "Bajaj Finserv",
    status: "in_progress",
    clientName: "Meera Nair",
    clientPhone: "9901234567",
    clientEmail: "meeranair@gmail.com",
    clientAddress: "88, MG Road, Nagpur",
    propertyAddress: "Survey No. 112, Hingna Road, Nagpur",
    surveyNo: "SRV/2025/1122",
    village: "Hingna",
    taluka: "Nagpur",
    district: "Nagpur",
    assignedTo: "Adv. Rohan Sane",
    createdBy: "admin"
  },
  {
    caseId: "NLK-2026-00005",
    bank: "ICICI Bank",
    status: "shared_to_bank",
    clientName: "Anand Kulkarni",
    clientPhone: "9823456781",
    clientEmail: "anand.k@gmail.com",
    clientAddress: "23, Deccan Gymkhana, Pune",
    propertyAddress: "CTS No. 56/B, FC Road, Pune",
    surveyNo: "SRV/2024/3333",
    village: "Shivajinagar",
    taluka: "Haveli",
    district: "Pune",
    assignedTo: "Adv. Priya Kulkarni",
    createdBy: "admin"
  },
  {
    caseId: "NLK-2026-00006",
    bank: "Aditya Birla",
    status: "assigned",
    clientName: "Pradeep Bhosale",
    clientPhone: "9654321098",
    clientEmail: "pradeepb@gmail.com",
    clientAddress: "Flat 7A, Kothrud, Pune",
    propertyAddress: "Plot No. 23, Karve Nagar, Pune",
    surveyNo: "SRV/2025/4444",
    village: "Kothrud",
    taluka: "Haveli",
    district: "Pune",
    assignedTo: "Adv. Arun Patil",
    createdBy: "admin"
  },
  {
    caseId: "NLK-2026-00007",
    bank: "Bajaj Finserv",
    status: "created",
    clientName: "Kavita Reddy",
    clientPhone: "9738291045",
    clientEmail: "kavita.r@outlook.com",
    clientAddress: "45, HSR Layout, Bangalore",
    propertyAddress: "Sy No. 203, Whitefield, Bangalore",
    surveyNo: "SRV/2025/7788",
    village: "Whitefield",
    taluka: "KR Puram",
    district: "Bangalore Urban",
    assignedTo: "",
    createdBy: "admin"
  },
  {
    caseId: "NLK-2026-00008",
    bank: "Aditya Birla",
    status: "approved",
    clientName: "Suresh Mehta",
    clientPhone: "9812098120",
    clientEmail: "suresh.m@gmail.com",
    clientAddress: "1, Marine Drive, Mumbai",
    propertyAddress: "CTS No. 1234, Bandra (W), Mumbai",
    surveyNo: "SRV/2024/8800",
    village: "Bandra",
    taluka: "Andheri",
    district: "Mumbai Suburban",
    assignedTo: "Adv. Rohan Sane",
    createdBy: "admin"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/NLKAssociates');
    console.log('Successfully connected to MongoDB');

    // 1. Seed TSR Initiations
    let tsrAdded = 0;
    for (const item of tsrInitiationsData) {
      const existing = await TSRInitiation.findOne({ appId: item.appId });
      if (!existing) {
        await TSRInitiation.create(item);
        tsrAdded++;
      }
    }
    console.log(`TSR Initiations: added ${tsrAdded} records.`);

    // 2. Seed Cases, Clients, Properties
    let casesAdded = 0;
    for (const item of casesData) {
      const existingCase = await Case.findOne({ caseId: item.caseId });
      if (!existingCase) {
        // Create Client
        const client = await Client.create({
          name: item.clientName,
          phone: item.clientPhone,
          email: item.clientEmail,
          address: item.clientAddress
        });

        // Generate ids for mutually referencing models
        const caseObjId = new mongoose.Types.ObjectId();
        const propertyObjId = new mongoose.Types.ObjectId();

        // Create Case
        await Case.create({
          _id: caseObjId,
          caseId: item.caseId,
          bank: item.bank,
          clientId: client._id,
          propertyId: propertyObjId,
          status: item.status,
          assignedTo: item.assignedTo || undefined,
          createdBy: item.createdBy
        });

        // Create Property
        await Property.create({
          _id: propertyObjId,
          caseId: caseObjId,
          address: item.propertyAddress,
          surveyNo: item.surveyNo,
          village: item.village,
          taluka: item.taluka,
          district: item.district
        });

        casesAdded++;
      }
    }
    console.log(`Cases, Clients & Properties: added ${casesAdded} records.`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB. Seed script finished successfully.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
