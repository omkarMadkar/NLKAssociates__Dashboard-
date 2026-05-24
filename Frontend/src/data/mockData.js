// ============================================================
// DEMO MODE - Mock Data for Vercel Deployment (No Backend)
// All API calls are replaced with this static data
// ============================================================

export const DEMO_MODE = false;

export const DEMO_ROLE = 'senior'; // Logged in as Senior Advocate (NLK Sir)

// ---- CASES ----
export const MOCK_CASES = [
  {
    _id: 'case001',
    caseId: 'NLK-2026-00001',
    bank: 'ICICI Bank',
    status: 'approved',
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-05-01T12:00:00Z',
    clientId: { name: 'Rajesh Sharma', phone: '9876543210', email: 'rajesh@gmail.com', address: 'Flat 4B, Sai Nagar, Pune' },
    propertyId: { address: 'Plot No. 45, Baner Road, Pune', surveyNo: 'SRV/2024/1234', village: 'Baner', taluka: 'Haveli', district: 'Pune' },
    assignedTo: 'Adv. Priya Kulkarni',
  },
  {
    _id: 'case002',
    caseId: 'NLK-2026-00002',
    bank: 'ICICI Bank',
    status: 'under_review',
    createdAt: '2026-04-15T10:00:00Z',
    updatedAt: '2026-05-05T09:00:00Z',
    clientId: { name: 'Sunita Desai', phone: '9812345678', email: 'sunita.d@yahoo.com', address: '12, Shivaji Colony, Nashik' },
    propertyId: { address: 'Gat No. 78, Dindori Road, Nashik', surveyNo: 'SRV/2024/5678', village: 'Dindori', taluka: 'Dindori', district: 'Nashik' },
    assignedTo: 'Adv. Arun Patil',
  },
  {
    _id: 'case003',
    caseId: 'NLK-2026-00003',
    bank: 'Aditya Birla',
    status: 'draft_ready',
    createdAt: '2026-04-20T11:00:00Z',
    updatedAt: '2026-05-08T14:00:00Z',
    clientId: { name: 'Vikram Joshi', phone: '9765432100', email: 'vikramj@hotmail.com', address: 'C-17, NIBM Road, Pune' },
    propertyId: { address: 'CTS No. 290/A, Kondhwa, Pune', surveyNo: 'SRV/2024/9012', village: 'Kondhwa', taluka: 'Haveli', district: 'Pune' },
    assignedTo: 'Adv. Priya Kulkarni',
  },
  {
    _id: 'case004',
    caseId: 'NLK-2026-00004',
    bank: 'Bajaj Finserv',
    status: 'in_progress',
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
    clientId: { name: 'Meera Nair', phone: '9901234567', email: 'meeranair@gmail.com', address: '88, MG Road, Nagpur' },
    propertyId: { address: 'Survey No. 112, Hingna Road, Nagpur', surveyNo: 'SRV/2025/1122', village: 'Hingna', taluka: 'Nagpur', district: 'Nagpur' },
    assignedTo: 'Adv. Rohan Sane',
  },
  {
    _id: 'case005',
    caseId: 'NLK-2026-00005',
    bank: 'ICICI Bank',
    status: 'shared_to_bank',
    createdAt: '2026-03-25T12:00:00Z',
    updatedAt: '2026-04-30T16:00:00Z',
    clientId: { name: 'Anand Kulkarni', phone: '9823456781', email: 'anand.k@gmail.com', address: '23, Deccan Gymkhana, Pune' },
    propertyId: { address: 'CTS No. 56/B, FC Road, Pune', surveyNo: 'SRV/2024/3333', village: 'Shivajinagar', taluka: 'Haveli', district: 'Pune' },
    assignedTo: 'Adv. Priya Kulkarni',
  },
  {
    _id: 'case006',
    caseId: 'NLK-2026-00006',
    bank: 'Aditya Birla',
    status: 'assigned',
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-10T09:00:00Z',
    clientId: { name: 'Pradeep Bhosale', phone: '9654321098', email: 'pradeepb@gmail.com', address: 'Flat 7A, Kothrud, Pune' },
    propertyId: { address: 'Plot No. 23, Karve Nagar, Pune', surveyNo: 'SRV/2025/4444', village: 'Kothrud', taluka: 'Haveli', district: 'Pune' },
    assignedTo: 'Adv. Arun Patil',
  },
  {
    _id: 'case007',
    caseId: 'NLK-2026-00007',
    bank: 'Bajaj Finserv',
    status: 'created',
    createdAt: '2026-05-12T14:00:00Z',
    updatedAt: '2026-05-12T14:00:00Z',
    clientId: { name: 'Kavita Reddy', phone: '9738291045', email: 'kavita.r@outlook.com', address: '45, HSR Layout, Bangalore' },
    propertyId: { address: 'Sy No. 203, Whitefield, Bangalore', surveyNo: 'SRV/2025/7788', village: 'Whitefield', taluka: 'KR Puram', district: 'Bangalore Urban' },
    assignedTo: null,
  },
  {
    _id: 'case008',
    caseId: 'NLK-2026-00008',
    bank: 'Aditya Birla',
    status: 'approved',
    createdAt: '2026-04-05T10:00:00Z',
    updatedAt: '2026-05-02T11:00:00Z',
    clientId: { name: 'Suresh Mehta', phone: '9812098120', email: 'suresh.m@gmail.com', address: '1, Marine Drive, Mumbai' },
    propertyId: { address: 'CTS No. 1234, Bandra (W), Mumbai', surveyNo: 'SRV/2024/8800', village: 'Bandra', taluka: 'Andheri', district: 'Mumbai Suburban' },
    assignedTo: 'Adv. Rohan Sane',
  },
];

// ---- DASHBOARD STATS ----
export const MOCK_DASHBOARD = {
  stats: {
    totalCases: 8,
    pendingApproval: 2,
    approvedToday: 1,
    activeBanks: 3,
  },
  bankStats: [
    { _id: 'ICICI Bank', count: 3 },
    { _id: 'Aditya Birla', count: 3 },
    { _id: 'Bajaj Finserv', count: 2 },
  ],
  statusStats: [
    { _id: 'created', count: 1 },
    { _id: 'assigned', count: 1 },
    { _id: 'in_progress', count: 1 },
    { _id: 'draft_ready', count: 1 },
    { _id: 'under_review', count: 1 },
    { _id: 'approved', count: 2 },
    { _id: 'shared_to_bank', count: 1 },
  ],
  recentCases: MOCK_CASES.slice(0, 5),
};

// ---- TSR REPORTS (for Approvals) ----
export const MOCK_TSR_PENDING = [
  {
    _id: 'tsr001',
    caseId: {
      _id: 'case002',
      caseId: 'NLK-2026-00002',
      bank: 'ICICI Bank',
      clientId: { name: 'Sunita Desai' },
    },
    status: 'submitted',
    version: 1,
    createdAt: '2026-05-08T10:00:00Z',
    draftContent: `TITLE SEARCH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. REPORT PARTICULARS
   Case ID         : NLK-2026-00002
   Client Name     : Sunita Desai
   Bank            : ICICI Bank
   Report Prepared By: NLK Associates
   Date of Report  : 08-May-2026

2. PROPERTY DESCRIPTION
   Survey No.      : SRV/2024/5678
   Address         : Gat No. 78, Dindori Road, Nashik
   Village         : Dindori
   Taluka          : Dindori
   District        : Nashik
   Area            : 2400 Sq. Ft.

3. OWNERSHIP HISTORY (Last 30 Years)
   • 1994 – Registered in name of Shri. Balasaheb More (Sale Deed, Regn. No. 4521)
   • 2007 – Transferred to Smt. Leela More (Gift Deed, Regn. No. 7834)
   • 2018 – Sold to Sunita Desai (Sale Deed, Regn. No. 12234)
   • No disputed ownership chain noted.

4. ENCUMBRANCES & CHARGES
   • No encumbrances found in the search period.
   • Property is free from any registered mortgages.
   • EC Certificate obtained for 30 years from Sub-Registrar, Dindori.

5. LEGAL OBSERVATIONS
   • Title documents found to be in order.
   • Mutation in Revenue records completed.
   • No stay, injunction or court attachment found.
   • NA permission obtained vide order dated 12-Jan-2018.

6. TITLE OPINION
   The title of the subject property is CLEAR and MARKETABLE. 
   It is hereby opined that the property is fit for mortgage 
   purposes in favor of ICICI Bank. All documents are in order 
   and no legal impediment has been found.

Signed & Sealed,
NLK Associates — Advocates & Legal Consultants
`,
  },
  {
    _id: 'tsr002',
    caseId: {
      _id: 'case003',
      caseId: 'NLK-2026-00003',
      bank: 'Aditya Birla',
      clientId: { name: 'Vikram Joshi' },
    },
    status: 'submitted',
    version: 2,
    createdAt: '2026-05-10T14:00:00Z',
    draftContent: `TITLE SEARCH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. REPORT PARTICULARS
   Case ID         : NLK-2026-00003
   Client Name     : Vikram Joshi
   Bank            : Aditya Birla Finance
   Report Prepared By: NLK Associates
   Date of Report  : 10-May-2026

2. PROPERTY DESCRIPTION
   CTS No.         : 290/A
   Address         : Kondhwa, Pune
   Village         : Kondhwa
   Taluka          : Haveli
   District        : Pune
   Area            : 1800 Sq. Ft.

3. OWNERSHIP HISTORY (Last 30 Years)
   • 1998 – Purchased by Rajendra Joshi (Sale Deed)
   • 2022 – Gifted to son Vikram Joshi (Gift Deed)

4. ENCUMBRANCES & CHARGES
   • No existing charge or lien found.

5. LEGAL OBSERVATIONS
   • All documents submitted and verified.
   • Property tax paid up to date.

6. TITLE OPINION
   Title is CLEAR. Property is fit for mortgage with Aditya Birla Finance.

Signed & Sealed,
NLK Associates — Advocates & Legal Consultants
`,
  },
];

// ---- DOCUMENTS (for Case Detail) ----
export const MOCK_DOCUMENTS = {
  case001: [
    { _id: 'd1', originalName: 'Sale_Deed_2018.pdf', docType: 'Sale Deed', fileSize: 245760, filePath: '' },
    { _id: 'd2', originalName: 'EC_Certificate_30yr.pdf', docType: 'Search Receipt', fileSize: 102400, filePath: '' },
    { _id: 'd3', originalName: 'Tax_Receipt_2025.pdf', docType: 'Tax Receipt', fileSize: 51200, filePath: '' },
  ],
  case002: [
    { _id: 'd4', originalName: 'Agreement_to_Sale.pdf', docType: 'Agreement', fileSize: 307200, filePath: '' },
    { _id: 'd5', originalName: 'GRAS_Challan.pdf', docType: 'GRAS Challan', fileSize: 76800, filePath: '' },
  ],
  case003: [
    { _id: 'd6', originalName: 'Gift_Deed_2022.pdf', docType: 'Sale Deed', fileSize: 204800, filePath: '' },
  ],
};

// ---- TSR FOR A SPECIFIC CASE ----
export const MOCK_TSR_BY_CASE = {
  case001: {
    _id: 'tsr_c001',
    caseId: 'case001',
    status: 'approved',
    version: 1,
    draftContent: MOCK_TSR_PENDING[0].draftContent,
    createdAt: '2026-05-01T10:00:00Z',
  },
  case002: {
    _id: 'tsr001',
    caseId: 'case002',
    status: 'submitted',
    version: 1,
    draftContent: MOCK_TSR_PENDING[0].draftContent,
    createdAt: '2026-05-08T10:00:00Z',
  },
  case003: {
    _id: 'tsr002',
    caseId: 'case003',
    status: 'draft',
    version: 2,
    draftContent: MOCK_TSR_PENDING[1].draftContent,
    createdAt: '2026-05-10T14:00:00Z',
  },
};

// ============================================================
// BUSINESS LEGAL MODULE — Mock Data
// ============================================================

// ---- TSR INITIATION RECORDS ----
export const MOCK_TSR_INITIATIONS = [
  {
    _id: 'init001',
    appId: '77000234182',
    author: 'Narayan',
    branch: 'Main',
    initiationDate: '2026-05-01',
    applicant: 'Swapan Mandol',
    coApplicant: 'Ritu Mandol',
    transactionType: 'Home Loan',
    propertyDetails: 'Plot No. 45, Baner Road, Pune — 2BHK Flat, 1200 Sq.Ft.',
    executiveMobile: '9812345678',
    executiveEmail: 'exec1@nlkassociates.com',
    status: 'initiated',
    createdAt: '2026-05-01T09:00:00Z',
  },
  {
    _id: 'init002',
    appId: '77000234199',
    author: 'Narayan',
    branch: 'Pune',
    initiationDate: '2026-05-05',
    applicant: 'Ramesh Patil',
    coApplicant: '',
    transactionType: 'Loan Against Property',
    propertyDetails: 'Gat No. 78, Dindori Road, Nashik — Agricultural Land, 2400 Sq.Ft.',
    executiveMobile: '9876543211',
    executiveEmail: 'exec2@nlkassociates.com',
    status: 'in_progress',
    createdAt: '2026-05-05T10:30:00Z',
  },
  {
    _id: 'init003',
    appId: '77000234215',
    author: 'Narayan',
    branch: 'Mumbai',
    initiationDate: '2026-05-10',
    applicant: 'Kavita Shetty',
    coApplicant: 'Arun Shetty',
    transactionType: 'Home Loan',
    propertyDetails: 'CTS No. 1234, Bandra (W), Mumbai — Row House, 1800 Sq.Ft.',
    executiveMobile: '9765432100',
    executiveEmail: 'exec3@nlkassociates.com',
    status: 'completed',
    createdAt: '2026-05-10T08:00:00Z',
  },
  {
    _id: 'init004',
    appId: '77000234230',
    author: 'Narayan',
    branch: 'Main',
    initiationDate: '2026-05-15',
    applicant: 'Dilip Waghmare',
    coApplicant: '',
    transactionType: 'Commercial Loan',
    propertyDetails: 'Survey No. 112, Hingna Road, Nagpur — Shop, 600 Sq.Ft.',
    executiveMobile: '9901234567',
    executiveEmail: 'exec4@nlkassociates.com',
    status: 'initiated',
    createdAt: '2026-05-15T11:00:00Z',
  },
];

// ---- TSR DRAFTS (Business Legal) ----
export const MOCK_TSR_DRAFTS = [
  {
    _id: 'draft001',
    tsrRefNo: 'TSR001',
    appId: '77000234182',
    applicant: 'Swapan Mandol',
    templateType: 'Standard TSR Template',
    status: 'draft',
    createdAt: '2026-05-20T09:00:00Z',
    updatedAt: '2026-05-20T09:00:00Z',
    content: `TITLE SEARCH REPORT — STANDARD TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TSR Reference No : TSR001
Application No   : 77000234182
Applicant Name   : Swapan Mandol
Co-Applicant     : Ritu Mandol
Branch           : Main
Date             : 20-May-2026
Prepared By      : NLK Associates

PROPERTY DESCRIPTION:
Plot No. 45, Baner Road, Pune — 2BHK Flat, 1200 Sq.Ft.

OWNERSHIP CHAIN:
• 2005 – Original Purchase by Shri. Vijay Desai (Sale Deed)
• 2019 – Transferred to Swapan Mandol (Sale Deed, Regn. No. 44521)

ENCUMBRANCES: None found.
LEGAL STATUS: CLEAR and MARKETABLE.

NLK Associates — Advocates & Legal Consultants`,
  },
  {
    _id: 'draft002',
    tsrRefNo: 'TSR002',
    appId: '77000234199',
    applicant: 'Ramesh Patil',
    templateType: 'Residential TSR Template',
    status: 'submitted',
    createdAt: '2026-05-18T11:00:00Z',
    updatedAt: '2026-05-19T14:00:00Z',
    content: `TITLE SEARCH REPORT — RESIDENTIAL TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TSR Reference No : TSR002
Application No   : 77000234199
Applicant Name   : Ramesh Patil
Branch           : Pune
Date             : 18-May-2026

PROPERTY: Gat No. 78, Dindori Road, Nashik
TITLE: CLEAR. Suitable for mortgage.

NLK Associates — Advocates & Legal Consultants`,
  },
  {
    _id: 'draft003',
    tsrRefNo: 'TSR003',
    appId: '77000234215',
    applicant: 'Kavita Shetty',
    templateType: 'Commercial TSR Template',
    status: 'approved',
    createdAt: '2026-05-12T09:00:00Z',
    updatedAt: '2026-05-14T16:00:00Z',
    content: `TITLE SEARCH REPORT — COMMERCIAL TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TSR Reference No : TSR003
Application No   : 77000234215
Applicant Name   : Kavita Shetty
Co-Applicant     : Arun Shetty
Branch           : Mumbai
Date             : 12-May-2026

PROPERTY: CTS No. 1234, Bandra (W), Mumbai
TITLE: CLEAR and MARKETABLE. Approved for mortgage.

NLK Associates — Advocates & Legal Consultants`,
  },
];

export const MOCK_EXTRACTION_PROFILES = [
  {
    _id: 'mock_ext_1',
    author: 'Advocate Anil',
    appId: '77000244168',
    refNo: 'IHFC/TSR/691/2026',
    branch: 'Pune',
    initiationDate: '2026-04-30',
    applicant: 'Mr. Ramesh Kumar',
    coApplicant: 'Mrs. Sunita Kumar',
    existingOwner: 'Mr. Subhash Ganpat Sarak',
    transactionType: 'Home Loan',
    bankBranch: 'Hadapsar Branch, Pune',
    municipalPropertyNo: 'P/M/83/01239000',
    rccConstructionArea: '750 sq. ft.',
    village: 'Uruli Devachi',
    taluka: 'Haveli',
    district: 'Pune',
    municipalCouncil: 'Fursungi Municipal Council',
    surveyNoDetails: 'Survey No. 237, Hissa No. 2A/43 admeasuring 100 sq. mtrs.',
    boundaryEast: 'Property of Prabhakar Gaikwad',
    boundaryWest: 'Property of Ghatkambale',
    boundarySouth: 'Property bearing Survey No. 222',
    boundaryNorth: 'Common Road',
    executiveMobile: '9822456789',
    executiveEmail: 'pune.exec@bank.com',
    status: 'initiated',
    createdAt: '2026-04-30T10:00:00Z',
  },
  {
    _id: 'mock_ext_2',
    author: 'Advocate Priya',
    appId: '99000555331',
    refNo: 'HDFC/TSR/102/2026',
    branch: 'Mumbai',
    initiationDate: '2026-05-15',
    applicant: 'Mr. Vikram Singh',
    coApplicant: 'Ms. Anjali Singh',
    existingOwner: 'Mr. Rajesh Patel',
    transactionType: 'LAP',
    bankBranch: 'Andheri Branch, Mumbai',
    municipalPropertyNo: 'M/W/12/55512000',
    rccConstructionArea: '1200 sq. ft.',
    village: 'Andheri',
    taluka: 'Andheri',
    district: 'Mumbai Suburban',
    municipalCouncil: 'BMC',
    surveyNoDetails: 'CTS No. 445, admeasuring 150 sq. mtrs.',
    boundaryEast: 'Plot No 44',
    boundaryWest: 'Public Garden',
    boundarySouth: 'Main Road',
    boundaryNorth: 'CTS No 446',
    executiveMobile: '9123456780',
    executiveEmail: 'andheri.exec@bank.com',
    status: 'initiated',
    createdAt: '2026-05-15T11:00:00Z',
  }
];

// Advanced dynamic compiler for high-fidelity advocates' letterhead reports
export function compileTSRReportContent(data) {
  const applicant = data.applicant || 'Mr. Ganesh Sarak';
  const coApplicant = data.coApplicant || 'Mr. Subhash Ganpat Sarak';
  const owner = data.existingOwner || 'Mr. Subhash Ganpat Sarak';
  const appId = data.appId || '77000244168';
  const refNo = data.refNo || 'IHFC/TSR/691/2026';
  const dateStr = data.initiationDate ? new Date(data.initiationDate).toLocaleDateString('en-IN') : '30.04.2026';
  const transactionType = data.transactionType || 'LAP';
  const bankBranch = data.bankBranch || 'Hadapsar Branch, Pune';
  const village = data.village || 'Uruli Devachi';
  const taluka = data.taluka || 'Haveli';
  const district = data.district || 'Pune';
  const municipalCouncil = data.municipalCouncil || 'Fursungi–Uruli Devachi Municipal Council';
  
  const east = data.boundaryEast || 'Property of Prabhakar Gaikwad';
  const west = data.boundaryWest || 'Property of Ghatkambale';
  const south = data.boundarySouth || 'Property bearing Survey No. 222';
  const north = data.boundaryNorth || 'Common Road';
  
  const construction = data.rccConstructionArea || '750 sq. ft.';
  const municipalNo = data.municipalPropertyNo || 'P/M/83/01239000';
  const surveyDetails = data.surveyNoDetails || 'Survey No. 237, Hissa No. 2A/43 admeasuring 100 sq. mtrs.';

  return `TITLE SEARCH REPORT & LEGAL SCRUTINY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ref. No. : ${refNo}                                 Date : ${dateStr}

Application No.     : ${appId}
Transaction Type    : ${transactionType}
Applicant           : ${applicant}
Co-Applicant        : ${coApplicant}
Existing Owner      : ${owner}

To,
The Branch Manager,
ICICI Home Finance Co. Ltd.,
${bankBranch}.

Subject: Legal Scrutiny Report pertaining to the file of ${applicant} and ${coApplicant}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART I : PROPERTY DETAILS

All that piece and parcel of property bearing land situated at Village – ${village}, Taluka – ${taluka}, District – ${district}, within the jurisdiction of Sub-Registrar ${taluka} and within the limits of ${municipalCouncil}, comprising:
${surveyDetails}, aggregating to a total area of the subject property, together with R.C.C. construction standing thereon admeasuring about ${construction} on ground floor, bearing Property No. ${municipalNo}, and bounded as follows:

On or towards East  : By ${east}
On or towards West  : By ${west}
On or towards South : By ${south}
On or towards North : By ${north}

Hereinafter, referred to as the "Subject Property".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART II : LIST OF DOCUMENTS SCRUTINIZED

1. Sale Deed, dated 11.11.2011 executed by Mr. Hanumant Anandrao Yadav in favour of Mr. Ravindra Ramdas Gaikwad, registered SRO Haveli No. 6 (Serial No. 11106/2011).
2. Sale Deed, dated 25.09.2014 executed by Mr. Anand Appaso Chougule in favour of Mr. Ravindra Ramdas Gaikwad, registered SRO Haveli No. 6 (Serial No. 9684/2014).
3. Sale Deed, dated 01.01.2026 executed by Mr. Ravindra Ramdas Gaikwad (via POA Mr. Subhash Ganpat Sarak) in favour of Mr. Subhash Ganpat Sarak, registered SRO Kedgaon (Serial No. 9186/2026).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART III : FLOW OF TITLE

The land situated at ${village}, Taluka ${taluka}, District ${district}, was originally owned by Mr. Hanumant Anandrao Yadav. Via registered Conveyance Deed dated 11.11.2011 (Serial No. 11106/2011), he sold 00 H 01 R to Mr. Ravindra Ramdas Gaikwad.
Further, land owned by Mr. Anand Appaso Chougule was sold to Mr. Ravindra Ramdas Gaikwad via Sale Deed dated 25.09.2014 (Serial No. 9684/2014).
Subsequently, Mr. Ravindra Ramdas Gaikwad executed a Sale Deed dated 01.01.2026 (Serial No. 9186/2026) transferring the aggregated property of 150 sq. mtrs. with RCC construction to ${owner}.
The revenue records have been mutated accordingly in the name of ${owner} vide Mutation Entry No. 30668. The properties are free from encumbrances.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART V : OTHER PROVISIONS & STATUTORY COMPLIANCE

5.1  Urban Land Ceiling Applicable?         : No.
5.2  Any Minor's claim/share?               : No.
5.3  Affected by Tenancy regulations?        : No.
5.4  Converted to Non-Agricultural (NA)?    : Yes.
5.5  Up to date tax/land revenue paid?      : Yes, verified.
5.6  Original documents scrutinized?        : Yes, photocopies matched with index.
5.7  Required documents for mortgage?       : Yes, available.
5.8  Previous owners transfer competency?   : Yes, competent.
5.9  Proposed owners competency?            : Yes, competent.
5.10 Tenure of the land                     : Tenure Class - 1.
5.11 Is land Adivasi/Tribal?                : No.
5.12 Joint Family Property?                 : No.
5.13 SARFAESI Act applicable?               : Yes.
5.14 Reservations / Acquisitions?           : No.
5.15 Transferred by Power of Attorney?      : Yes.
5.16 Search Report obtained & submitted?    : Yes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART VI : CERTIFICATE OF TITLE

I hereby certify that the subject property is clear, marketable, and owned and possessed by ${owner}, who derived valid title by virtue of registered deeds. He is competent to mortgage the property.

NARAYAN L. KHAMKAR
ADVOCATE & NOTARY`;
}

