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
