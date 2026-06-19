const XLSX = require("xlsx");
const MasterDB = require("../models/MasterDB");

exports.uploadMasterExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = rows.map((row) => ({
      author: row["Author"] || "",
      applicationNo: row["Application No"] || "",
      branch: row["Branch"] || "",

      applicant: row["Applicant"]
        ? row["Applicant"].split(",").map((item) => item.trim())
        : [],

      coApplicant: row["Co-Applicants"]
        ? row["Co-Applicants"].split(",").map((item) => item.trim())
        : [],

      transactionType: row["Transaction Type"] || "",

      propertyDetails: row["Property Details"] || "",

      vetAndCTC: String(row["Vet + CTC"] || "").trim(),

      ctc: row["CTC"] || "",
    }));

    await MasterDB.insertMany(formattedData);

    res.status(200).json({
      success: true,
      message: `${formattedData.length} records uploaded successfully`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMasterDB = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {};

    if (search.trim()) {
      query.$or = [
        { branch: { $regex: search, $options: "i" } },
        { applicant: { $regex: search, $options: "i" } },
        { coApplicant: { $regex: search, $options: "i" } },
        { transactionType: { $regex: search, $options: "i" } },
        { propertyDetails: { $regex: search, $options: "i" } },
      ];
    }

    const total = await MasterDB.countDocuments(query);

    const data = await MasterDB.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
