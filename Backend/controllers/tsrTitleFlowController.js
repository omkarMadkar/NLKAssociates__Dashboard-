const XLSX = require("xlsx");
const TSRTitleFlow = require("../models/TSRTitleFlow");
const TSRInitiation = require("../models/TSRInitiation");

function excelDateToJSDate(serial) {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;

  const dateInfo = new Date(utcValue * 1000);

  const day = String(dateInfo.getDate()).padStart(2, "0");
  const month = String(dateInfo.getMonth() + 1).padStart(2, "0");
  const year = dateInfo.getFullYear();

  return `${day}.${month}.${year}`;
}

const allowedEventTypes = [
  "ORIGINAL_OWNER",
  "TRANSFER",
  "DEVELOPMENT",
  "POA",
  "LEASE",
  "MUTATION",
  "INHERITANCE",
  "GIFT",
  "PARTITION",
  "COURT_ORDER",
  "NA_ORDER",
  "ASSIGNMENT",
  "OTHER",
];

exports.createTitleFlow = async (req, res) => {
  try {
    const { tsrInitiationId, events } = req.body;

    const titleFlow = await TSRTitleFlow.create({
      tsrInitiationId,
      events,
    });

    await TSRInitiation.findByIdAndUpdate(tsrInitiationId, {
      titleFlowId: titleFlow._id,
    });

    return res.status(201).json({
      success: true,
      data: titleFlow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.parseTitleFlowExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row.Event_Type && !allowedEventTypes.includes(row.Event_Type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid Event Type at Row ${i + 1}`,
        });
      }
    }

    return res.json({
      success: true,
      rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.uploadAndSaveTitleFlow = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { tsrInitiationId } = req.body;

    const tsr = await TSRInitiation.findById(tsrInitiationId);

    if (!tsr) {
      return res.status(404).json({
        success: false,
        message: "TSR Initiation not found",
      });
    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row.Event_Type && !allowedEventTypes.includes(row.Event_Type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid Event Type at Row ${i + 1}`,
        });
      }
    }

    const events = rows.map((row) => {
      let formattedDate = "";

      if (row.Document_Date && typeof row.Document_Date === "number") {
        formattedDate = excelDateToJSDate(row.Document_Date);
      } else {
        formattedDate = row.Document_Date || "";
      }

      return {
        eventNo: row.Event_No || 0,

        eventType: row.Event_Type || "",

        fromParty: row.From_Party || "",

        toParty: row.To_Party || "",

        currentOwner: String(row.Current_Owner || "NO")
          .trim()
          .toUpperCase(),

        documentType: row.Document_Type || "",

        documentDate: formattedDate,

        registrationNo: row.Registration_No || "",

        sroName: row.SRO_Name || "",

        propertyDetails: row.Property_Details || "",

        areaTransferred: row.Area_Transferred || "",

        remarks: row.Remarks || "",

        generateParagraph: String(row.Generate_Paragraph || "YES")
          .trim()
          .toUpperCase(),
      };
    });

    const titleFlow = await TSRTitleFlow.create({
      tsrInitiationId,
      events,
    });

    await TSRInitiation.findByIdAndUpdate(tsrInitiationId, {
      titleFlowId: titleFlow._id,
    });

    return res.status(201).json({
      success: true,
      data: titleFlow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getByTSR = async (req, res) => {
  try {
    const data = await TSRTitleFlow.findOne({
      tsrInitiationId: req.params.tsrId,
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downloadTitleFlowTemplate = async (req, res) => {
  try {
    const headers = [
      "Event_No",
      "Event_Type",
      "From_Party",
      "To_Party",
      "Current_Owner",
      "Document_Type",
      "Document_Date",
      "Registration_No",
      "SRO_Name",
      "Property_Details",
      "Area_Transferred",
      "Remarks",
      "Generate_Paragraph"
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    // Set column widths to prevent truncation
    worksheet["!cols"] = [
      { wch: 10 }, // Event_No
      { wch: 18 }, // Event_Type
      { wch: 20 }, // From_Party
      { wch: 20 }, // To_Party
      { wch: 15 }, // Current_Owner
      { wch: 20 }, // Document_Type
      { wch: 18 }, // Document_Date
      { wch: 18 }, // Registration_No
      { wch: 18 }, // SRO_Name
      { wch: 30 }, // Property_Details
      { wch: 20 }, // Area_Transferred
      { wch: 20 }, // Remarks
      { wch: 20 }  // Generate_Paragraph
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TitleFlowTemplate");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=TITLE_FLOW_Template.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    console.error("Title Flow template download error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

