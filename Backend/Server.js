const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// CONFIG
dotenv.config();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const caseRoutes = require('./routes/caseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const documentRoutes = require('./routes/documentRoutes');
const tsrRoutes = require('./routes/tsrRoutes');
const tsrInitiationRoutes = require('./routes/tsrInitiationRoutes');
const tsrOtherProvisionRoutes = require("./routes/tsrOtherProvisionRoutes");
const tsrTitleFlowRoutes = require("./routes/tsrTitleFlowRoutes");
const tsrWaitingReportRoutes = require("./routes/tsrWaitingReportRoutes");
const approvalRoutes = require('./routes/approvalRoutes');
const tsrDocumentListRoutes = require("./routes/tsrDocumentList");
const tsrTitleEvidenceRoutes = require("./routes/tsrTitleEvidenceRoutes");

const masterDBRoutes = require("./routes/masterDBRoutes");

const tsrDraftRoutes = require("./routes/tsrDraftRoutes");
const path = require('path');
const fs = require('fs');

// Connect Database
connectDB();

// APP
const app = express();

// MIDDLEWARE
app.use(cors());

app.use(express.json());

// CREATE uploads folder if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// SERVE uploaded files statically:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("NLK Legal Management API Running...");
});


// API ROUTES
app.use("/api/auth", authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/tsr', tsrRoutes);
app.use('/api/tsr-initiation', tsrInitiationRoutes);
app.use('/api/approvals', approvalRoutes);
app.use("/api/tsr-other-provisions",tsrOtherProvisionRoutes);
app.use("/api/tsr-title-flow",tsrTitleFlowRoutes);
app.use("/api/tsr-waiting-report", tsrWaitingReportRoutes);
app.use("/api/tsr-document-list", tsrDocumentListRoutes);
app.use("/api/tsr-title-evidence",tsrTitleEvidenceRoutes);

app.use("/api/tsr-draft", tsrDraftRoutes);
app.use("/api/masterdb", masterDBRoutes);


// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// PORT
const PORT = process.env.PORT || 5000;


// SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});