/**
 * TSR Template Engine
 * Generates the Draft format based on the real Marathi & English sample data provided.
 */

function formatCurrentDate() {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
}

export function generateEnglishTSR(data) {
  const refNo = data.refNo || "[Reference Number]";
  const appId = data.appId || "[Application Number]";
  const dateStr = data.initiationDate
    ? new Date(data.initiationDate).toLocaleDateString("en-IN")
    : formatCurrentDate();

  const applicant = data.applicant || "[Applicant Name]";
  const coApplicant = data.coApplicant || "[Co-Applicant Name]";
  const owner = data.existingOwner || "[Existing Owner Name]";
  const transactionType = data.transactionType || "[Transaction Type]";
  const bankBranch = data.bankBranch || "[Bank Branch]";

  const village = data.village || "[Village]";
  const taluka = data.taluka || "[Taluka]";
  const district = data.district || "[District]";
  const municipalCouncil = data.municipalCouncil || "[Municipal Council]";
  const parcelDescription =
    data.landParcels?.length > 0
      ? data.landParcels
          .map((parcel, index) => {
            return `${index + 1}. Survey No. ${parcel.surveyNo || "-"}, Hissa No. ${parcel.hissaNo || "-"} admeasuring ${parcel.area || "-"} ${parcel.unit || ""}`;
          })
          .join("\n")
      : "[Survey Details]";
  const construction = data.rccConstructionArea || "[Construction Area]";
  const municipalNo = data.municipalPropertyNo || "[Municipal Property No]";

  const east = data.boundaryEast || "[East Boundary]";
  const west = data.boundaryWest || "[West Boundary]";
  const south = data.boundarySouth || "[South Boundary]";
  const north = data.boundaryNorth || "[North Boundary]";

  //PART II : List of Documents Submitted for Scrutiny and Legal Opinion
  const documentList =
    data.documentList?.length > 0
      ? data.documentList
          .map((doc, index) => {
            const executionDate = doc.executionDate
              ? new Date(doc.executionDate).toLocaleDateString("en-GB")
              : "[Date]";

            return `${index + 1}. ${doc.documentType}, dated ${executionDate} executed by ${
              doc.executedBy || "[Executant]"
            } to and in favour of ${
              doc.executedInFavourOf || "[Claimant]"
            }, which is registered in the office of ${
              doc.registrationOffice || "[Registration Office]"
            } under serial number ${
              doc.registrationNumber || "[Registration No]"
            }.${doc.remarks ? ` (${doc.remarks})` : ""}`;
          })
          .join("\n\n")
      : "No documents submitted.";

  //PART III : FLOW OF TITLE OF PROPERTY
  const titleFlow =
    data.titleFlow?.length > 0
      ? data.titleFlow
          .flatMap((flow) => flow.events || [])
          .sort((a, b) => a.eventNo - b.eventNo)
          .map((event, index) => {
            const ownerText =
              event.currentOwner === "YES"
                ? ` Thus, ${event.toParty} became owner and in possession of the said property.`
                : "";

            return `${index + 1}. Thereafter, ${
              event.fromParty || "[Transferor]"
            } has executed a ${event.documentType || "[Document Type]"} dated ${
              event.documentDate || "[Date]"
            }, thereby sold, transferred and conveyed ${
              event.propertyDetails || "the property"
            } to and in favour of ${event.toParty || "[Transferee]"}.

The said ${
              event.documentType || "document"
            } is duly registered under Registration No. ${
              event.registrationNo || "-"
            } in the office of ${event.srOfficeName || "[SRO]"}.${ownerText}${
              event.remarks && event.remarks !== "NA"
                ? ` Remarks: ${event.remarks}`
                : ""
            }`;
          })
          .join("\n\n")
      : "No title flow available.";

  //PART IV : EVIDENCE OF THE TITLE OF PROPERTY
  const titleEvidence =
    data.titleEvidence?.length > 0
      ? data.titleEvidence
          .map((doc, index) => {
            const executionDate = doc.executionDate
              ? new Date(doc.executionDate).toLocaleDateString("en-GB")
              : "[Date]";

            return `${index + 1}. ${doc.documentType}, dated ${executionDate} executed by ${
              doc.executedBy || "[Executant]"
            } to and in favour of ${
              doc.executedInFavourOf || "[Claimant]"
            }, which is registered in the office of ${
              doc.registrationOffice || "[Registration Office]"
            } under serial number ${
              doc.registrationNumber || "[Registration No]"
            }.${doc.remarks ? ` (${doc.remarks})` : ""}`;
          })
          .join("\n\n")
      : "No documents submitted.";

  //PART V : OTHER PROVISIONS
  const otherProvisions =
    data.otherProvision?.answers?.length > 0
      ? data.otherProvision.answers
          .map((item) => {
            return `${item.code.padEnd(5)} ${item.question.padEnd(90)} ${
              item.answer || "-"
            }`;
          })
          .join("\n")
      : "No Other Provisions Available.";
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

All that piece and parcel of property bearing land situated at Village – ${village}, Taluka – ${taluka}, District – ${district}, within the jurisdiction of Sub-Registrar ${taluka} and within the limits of ${municipalCouncil}, comprising the following land parcels:

${parcelDescription}

Together with R.C.C. construction standing thereon admeasuring about ${construction}
on ground floor, bearing Property No. ${municipalNo},
and bounded as follows:

On or towards East  : ${east}
On or towards West  : ${west}
On or towards South : ${south}
On or towards North : ${north}

Hereinafter, referred to as the "Subject Property".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART II : LIST OF DOCUMENTS SUBMITTED BEFORE ME FOR SCRUTINY AND LEGAL OPINION :

${documentList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART III : FLOW OF TITLE OF PROPERTY.

Upon perusal of the documents placed on record and on the basis of the search conducted on the official IGR website, the chain of title in respect of the subject property is traced as follows:

${titleFlow}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART IV : EVIDENCE OF THE TITLE OF PROPERTY

${titleEvidence}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PART V : OTHER PROVISIONS

${otherProvisions}


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
  console.log("TSR DATA:", data);
  console.log("DOCUMENT LIST:", data.documentList);
  return generateEnglishTSR(data).replace(
    "TITLE SEARCH REPORT & LEGAL SCRUTINY REPORT",
    "TITLE SEARCH REPORT (MARATHI FORMAT)",
  );
}

export function generateEnglishWaitingReport(data) {
  const refNo = data.refNo || "[Reference Number]";
  const appId = data.appId || "[Application Number]";
  const dateStr = data.initiationDate
    ? new Date(data.initiationDate).toLocaleDateString("en-IN")
    : formatCurrentDate();

  const applicant = data.applicant || "[Applicant Name]";
  const coApplicant = data.coApplicant || "[Co-Applicant Name]";
  const owner = data.existingOwner || "[Existing Owner Name]";
  const transactionType = data.transactionType || "[Transaction Type]";
  const bankBranch = data.bankBranch || "[Bank Branch]";

  const village = data.village || "[Village]";
  const taluka = data.taluka || "[Taluka]";
  const district = data.district || "[District]";
  const municipalCouncil = data.municipalCouncil || "[Municipal Council]";

  const wr = data.waitingReportId || {};
  const chalanNo = wr.chalanNo || "N/A";
  const wrDate = wr.date
    ? new Date(wr.date).toLocaleDateString("en-IN")
    : "N/A";
  const reportSrNo = wr.reportSrNo || "N/A";

  let docListStr = "";
  if (wr.documents && wr.documents.length > 0) {
    docListStr = wr.documents
      .map((doc) => {
        const attachmentStr = doc.fileName
          ? `\n      Attachment: ${doc.fileName}`
          : "";
        return `[${doc.available === "Yes" ? "✔" : "✘"}] Sr. ${doc.srNo}: ${doc.name}
      Available: ${doc.available}
      Remarks: ${doc.remarks || "None"}${attachmentStr}`;
      })
      .join("\n\n");
  } else {
    docListStr = "No document checklist found.";
  }

  return `TSR WAITING & PENDING DOCUMENTS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ref. No. : ${refNo}                                 Date : ${dateStr}

Application No.     : ${appId}
Report Sr. No.       : ${reportSrNo}
Chalan No.           : ${chalanNo}
Chalan Date          : ${wrDate}
Transaction Type    : ${transactionType}
Applicant           : ${applicant}
Co-Applicant        : ${coApplicant}
Existing Owner      : ${owner}

To,
The Branch Manager,
ICICI Home Finance Co. Ltd.,
${bankBranch}.

Subject: Scrutiny Waiting Report pertaining to pending documents of ${applicant} & ${coApplicant}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PROPERTY DESCRIPTION:

All that piece and parcel of property situated at Village – ${village}, Taluka – ${taluka}, District – ${district}, within limits of ${municipalCouncil}.

• WAITING / PENDING DOCUMENTS SCRUTINY STATUS:

The following is the checklist status of the documents submitted vs pending. The loan disbursal may be withheld or conditional upon the production of the pending ('No') documents listed below:

${docListStr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• ADVOCATE LEGAL OPINION & RECOMMENDATION:

Please verify the original copies of the available documents at the time of execution. The applicant is required to submit the pending documents marked above with [✘] as soon as possible to complete the final Title Search Report.

NARAYAN L. KHAMKAR
ADVOCATE & NOTARY`;
}

export function generateMarathiWaitingReport(data) {
  const refNo = data.refNo || "[संदर्भ क्रमांक]";
  const appId = data.appId || "[अर्ज क्रमांक]";
  const dateStr = data.initiationDate
    ? new Date(data.initiationDate).toLocaleDateString("en-IN")
    : formatCurrentDate();

  const applicant = data.applicant || "[अर्जदाराचे नाव]";
  const coApplicant = data.coApplicant || "[सह-अर्जदाराचे नाव]";
  const owner = data.existingOwner || "[मालकाचे नाव]";
  const transactionType = data.transactionType || "[व्यवहाराचा प्रकार]";
  const bankBranch = data.bankBranch || "[बँक शाखा]";

  const village = data.village || "[गाव]";
  const taluka = data.taluka || "[तालुका]";
  const district = data.district || "[जिल्हा]";
  const municipalCouncil = data.municipalCouncil || "[नगरपालिका/महानगरपालिका]";

  const wr = data.waitingReportId || {};
  const chalanNo = wr.chalanNo || "निरंक";
  const wrDate = wr.date
    ? new Date(wr.date).toLocaleDateString("en-IN")
    : "निरंक";
  const reportSrNo = wr.reportSrNo || "निरंक";

  let docListStr = "";
  if (wr.documents && wr.documents.length > 0) {
    docListStr = wr.documents
      .map((doc) => {
        const attachmentStr = doc.fileName
          ? `\n      जोडलेले पत्र/फाइल: ${doc.fileName}`
          : "";
        return `[${doc.available === "Yes" ? "✔" : "✘"}] अनु. क्र. ${doc.srNo}: ${doc.name}
      उपलब्धता: ${doc.available === "Yes" ? "होय" : "नाही"}
      शेरा: ${doc.remarks || "काही नाही"}${attachmentStr}`;
      })
      .join("\n\n");
  } else {
    docListStr = "कोणतीही दस्तऐवज यादी आढळली नाही.";
  }

  return `प्रलंबित कागदपत्रे व वेटिंग रिपोर्ट (TSR WAITING REPORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

संदर्भ क्र. : ${refNo}                                 दिनांक : ${dateStr}

अर्ज क्र.            : ${appId}
अहवाल अनु. क्र.      : ${reportSrNo}
चलन क्र.            : ${chalanNo}
चलन दिनांक          : ${wrDate}
व्यवहाराचा प्रकार    : ${transactionType}
अर्जदार             : ${applicant}
सह-अर्जदार          : ${coApplicant}
सध्याचे मालक        : ${owner}

प्रति,
शाखा व्यवस्थापक,
आयसीआयसीआय होम फायनान्स कं. लि.,
${bankBranch}.

विषय: ${applicant} आणि ${coApplicant} यांच्या गृहकर्ज नस्ती मधील प्रलंबित कागदपत्रांचा पडताळणी अहवाल.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• मालमत्तेचे वर्णन:

मोजे गाव – ${village}, तालुका – ${taluka}, जिल्हा – ${district}, हदद ${municipalCouncil} मधील मालमत्ता.

• प्रलंबित व उपलब्ध कागदपत्रांची सद्यस्थिती:

सादर केलेल्या व प्रलंबित कागदपत्रांची सद्यस्थिती खालीलप्रमाणे आहे. कर्ज मंजुरी/वितरण हे [✘] म्हणून चिन्हांकित केलेल्या प्रलंबित कागदपत्रे सादर करण्याच्या अधीन राहील:

${docListStr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• वकिलांचे कायदेशीर मत आणि शिफारस:

कृपया कर्ज वितरणाच्या वेळी उपलब्ध असलेल्या कागदपत्रांच्या मूळ प्रतींची पडताळणी करा. अंतिम मालक शोध अहवाल (Final TSR) पूर्ण करण्यासाठी अर्जदाराने [✘] चिन्हांकित केलेली प्रलंबित कागदपत्रे लवकरात लवकर सादर करणे आवश्यक आहे.

नारायण एल. खामकर
ADVOCATE & NOTARY`;
}
