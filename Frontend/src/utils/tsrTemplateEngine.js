/**
 * TSR Template Engine
 * Generates the Draft format based on the real Marathi & English sample data provided.
 */

function formatCurrentDate() {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

export function generateEnglishTSR(data) {
  const refNo = data.refNo || '[Reference Number]';
  const appId = data.appId || '[Application Number]';
  const dateStr = data.initiationDate ? new Date(data.initiationDate).toLocaleDateString('en-IN') : formatCurrentDate();
  
  const applicant = data.applicant || '[Applicant Name]';
  const coApplicant = data.coApplicant || '[Co-Applicant Name]';
  const owner = data.existingOwner || '[Existing Owner Name]';
  const transactionType = data.transactionType || '[Transaction Type]';
  const bankBranch = data.bankBranch || '[Bank Branch]';
  
  const village = data.village || '[Village]';
  const taluka = data.taluka || '[Taluka]';
  const district = data.district || '[District]';
  const municipalCouncil = data.municipalCouncil || '[Municipal Council]';
  const surveyDetails = data.surveyNoDetails || '[Survey Details]';
  const construction = data.rccConstructionArea || '[Construction Area]';
  const municipalNo = data.municipalPropertyNo || '[Municipal Property No]';

  const east = data.boundaryEast || '[East Boundary]';
  const west = data.boundaryWest || '[West Boundary]';
  const south = data.boundarySouth || '[South Boundary]';
  const north = data.boundaryNorth || '[North Boundary]';

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

• PART II : LIST OF DOCUMENTS SUBMITTED BEFORE ME FOR SCRUTINY AND LEGAL OPINION :

1. [User to list uploaded documents here]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART III : FLOW OF TITLE OF PROPERTY.

[User to detail the chain of ownership over the last 30 years based on uploaded Index II and Sale Deeds]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART IV : EVIDENCE OF THE TITLE OF PROPERTY

[User to verify if the documents submitted reflect clear title and mutations]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART V : OTHER PROVISIONS

5.1  Urban Land Ceiling Applicable?         : No.
5.2  Any Minor's claim/share?               : No.
5.3  Affected by Tenancy regulations?        : No.
5.4  Converted to Non-Agricultural (NA)?    : [Yes/No]
5.5  Up to date tax/land revenue paid?      : [Yes/No]
5.6  Original documents scrutinized?        : Yes.
5.7  Required documents for mortgage?       : Yes.
5.8  Previous owners transfer competency?   : Yes.
5.9  Proposed owners competency?            : Yes.
5.10 Tenure of the land                     : [Class 1 / Class 2]
5.11 Is land Adivasi/Tribal?                : No.
5.12 Joint Family Property?                 : No.
5.13 SARFAESI Act applicable?               : Yes.
5.14 Reservations / Acquisitions?           : No.
5.15 Transferred by Power of Attorney?      : [Yes/No]
5.16 Search Report obtained & submitted?    : Yes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART VI : CERTIFICATE.

I hereby certify that the subject property is clear, marketable, and owned and possessed by ${owner}, who derived valid title by virtue of registered deeds. He/She is competent to mortgage the property.

• Following documents needs to be submitted prior to disbursal of loan/at the time of disbursment of the loan:
1. Original registered Sale Deed
2. Latest Property Tax Receipt

• Following documents are required post disbursal (if any) :
1. Mutation Entry

SEARCH RESULTS FOUND DURING E-SEARCH OF THE SUBJECT LAND PROPERTY
[Enter eSearch findings here]

CHALLAN
[Enter GRAS Challan details here]

NARAYAN L. KHAMKAR
ADVOCATE & NOTARY`;
}

export function generateMarathiTSR(data) {
  // Can be mapped similarly in Marathi based on Ganesh Sarak sample
  return generateEnglishTSR(data).replace('TITLE SEARCH REPORT & LEGAL SCRUTINY REPORT', 'TITLE SEARCH REPORT (MARATHI FORMAT)');
}
