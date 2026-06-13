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
