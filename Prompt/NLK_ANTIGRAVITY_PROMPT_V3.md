# 🏛️ NLK LAW ASSOCIATES — ANTIGRAVITY PROMPT V3
## Continue from where you stopped — Backend APIs + Frontend Layout

---

## ✅ ALREADY COMPLETED (DO NOT REDO)

You have already done:
- Fixed MongoDB connection in Server.js (connectDB called)
- Added senior role to Users.js (senior@123)
- Created all 7 Mongoose models: Case, Client, Property, Document, TSRReport, ApprovalLog, BankShare

---

## 🎯 YOUR TASK NOW — COMPLETE IN THIS EXACT ORDER

---

### STEP 1 — Install Missing Packages First

```bash
# Backend
cd Backend
npm install multer openai pdfkit

# Frontend
cd ../Frontend
npm install recharts
```

---

### STEP 2 — Backend: Cases API

**Create `Backend/controllers/caseController.js`:**

```javascript
const Case = require('../models/Case');
const Client = require('../models/Client');
const Property = require('../models/Property');

// Auto-generate Case ID: NLK-2026-00001
const generateCaseId = async () => {
  const year = new Date().getFullYear();
  const count = await Case.countDocuments();
  const padded = String(count + 1).padStart(5, '0');
  return `NLK-${year}-${padded}`;
};

// CREATE CASE (admin only)
const createCase = async (req, res) => {
  try {
    const { clientName, clientPhone, clientEmail, clientAddress, bank,
            propertyAddress, surveyNo, village, taluka, district } = req.body;

    // Create client
    const client = await Client.create({
      name: clientName, phone: clientPhone,
      email: clientEmail, address: clientAddress
    });

    // Create case
    const caseId = await generateCaseId();
    const newCase = await Case.create({
      caseId, bank, clientId: client._id,
      status: 'created', createdBy: req.user.role,
    });

    // Create property
    await Property.create({
      caseId: newCase._id, address: propertyAddress,
      surveyNo, village, taluka, district
    });

    res.status(201).json({ success: true, case: newCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL CASES (with optional filters)
const getCases = async (req, res) => {
  try {
    const { bank, status, limit = 20, sort = 'newest', search } = req.query;
    const filter = {};
    if (bank) filter.bank = bank;
    if (status) filter.status = status;

    let query = Case.find(filter).populate('clientId').populate('propertyId');
    if (sort === 'newest') query = query.sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const cases = await query;
    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET CASE BY ID
const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate('clientId').populate('propertyId');
    if (!caseData) return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, case: caseData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE CASE STATUS
const updateCaseStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { status, ...(assignedTo && { assignedTo }), updatedAt: Date.now() },
      { new: true }
    );
    res.json({ success: true, case: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createCase, getCases, getCaseById, updateCaseStatus };
```

**Create `Backend/routes/caseRoutes.js`:**

```javascript
const express = require('express');
const router = express.Router();
const { createCase, getCases, getCaseById, updateCaseStatus } = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCases);
router.post('/', protect, createCase);
router.get('/:id', protect, getCaseById);
router.put('/:id/status', protect, updateCaseStatus);

module.exports = router;
```

---

### STEP 3 — Backend: Dashboard Stats API

**Create `Backend/controllers/dashboardController.js`:**

```javascript
const Case = require('../models/Case');

const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalCases, pendingApproval, approvedToday, recentCases] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: 'under_review' }),
      Case.countDocuments({ status: 'approved', updatedAt: { $gte: today } }),
      Case.find().populate('clientId').sort({ createdAt: -1 }).limit(10),
    ]);

    // Cases by bank
    const bankStats = await Case.aggregate([
      { $group: { _id: '$bank', count: { $sum: 1 } } }
    ]);

    // Cases by status
    const statusStats = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const activeBanks = bankStats.length;

    res.json({
      success: true,
      stats: { totalCases, pendingApproval, approvedToday, activeBanks },
      bankStats,
      statusStats,
      recentCases,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats };
```

**Create `Backend/routes/dashboardRoutes.js`:**

```javascript
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);

module.exports = router;
```

---

### STEP 4 — Backend: Document Upload API

**Create `Backend/middleware/upload.js`:**

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/jpg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF, DOCX, JPG, XLS allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = upload;
```

**Create `Backend/controllers/documentController.js`:**

```javascript
const Document = require('../models/Document');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const doc = await Document.create({
      caseId: req.params.caseId,
      docType: req.body.docType || 'General',
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      uploadedBy: req.user.role,
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ caseId: req.params.caseId }).sort({ uploadedAt: -1 });
    res.json({ success: true, documents: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadDocument, getDocuments };
```

**Create `Backend/routes/documentRoutes.js`:**

```javascript
const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/upload/:caseId', protect, upload.single('file'), uploadDocument);
router.get('/:caseId', protect, getDocuments);

module.exports = router;
```

---

### STEP 5 — Backend: TSR AI Generator API

**Create `Backend/controllers/tsrController.js`:**

```javascript
const TSRReport = require('../models/TSRReport');
const Case = require('../models/Case');
const Document = require('../models/Document');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// GENERATE AI DRAFT
const generateTSR = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId).populate('clientId').populate('propertyId');
    if (!caseData) return res.status(404).json({ success: false, message: 'Case not found' });

    const docs = await Document.find({ caseId: req.params.caseId });
    const docList = docs.map(d => d.originalName).join(', ') || 'No documents uploaded';

    const prompt = `You are a senior Indian legal advocate. Generate a formal Title Search Report (TSR) in structured legal format for the following property:

Client: ${caseData.clientId?.name || 'N/A'}
Bank: ${caseData.bank}
Property Address: ${caseData.propertyId?.address || 'N/A'}
Survey No: ${caseData.propertyId?.surveyNo || 'N/A'}
Village: ${caseData.propertyId?.village || 'N/A'}
Taluka: ${caseData.propertyId?.taluka || 'N/A'}
District: ${caseData.propertyId?.district || 'N/A'}
Documents Available: ${docList}

Format the TSR with these sections:
1. REPORT PARTICULARS
2. PROPERTY DESCRIPTION
3. OWNERSHIP HISTORY (last 30 years)
4. ENCUMBRANCES & CHARGES
5. LEGAL OBSERVATIONS
6. TITLE OPINION

Use formal Indian legal language. Be thorough and professional.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    });

    const draftContent = completion.choices[0].message.content;

    // Check if TSR already exists for this case
    let tsr = await TSRReport.findOne({ caseId: req.params.caseId });
    if (tsr) {
      tsr.draftContent = draftContent;
      tsr.version = (tsr.version || 1) + 1;
      tsr.aiGenerated = true;
      tsr.status = 'draft';
      await tsr.save();
    } else {
      tsr = await TSRReport.create({
        caseId: req.params.caseId, draftContent,
        version: 1, status: 'draft', aiGenerated: true,
        createdBy: req.user.role,
      });
    }

    // Update case status
    await Case.findByIdAndUpdate(req.params.caseId, { status: 'draft_ready' });

    res.json({ success: true, tsr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET TSR FOR CASE
const getTSR = async (req, res) => {
  try {
    const tsr = await TSRReport.findOne({ caseId: req.params.caseId });
    res.json({ success: true, tsr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// SAVE DRAFT EDITS
const saveDraft = async (req, res) => {
  try {
    const tsr = await TSRReport.findByIdAndUpdate(
      req.params.id,
      { draftContent: req.body.draftContent },
      { new: true }
    );
    res.json({ success: true, tsr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// SUBMIT TO NLK SIR
const submitTSR = async (req, res) => {
  try {
    const tsr = await TSRReport.findByIdAndUpdate(
      req.params.id,
      { status: 'submitted' },
      { new: true }
    );
    await Case.findByIdAndUpdate(tsr.caseId, { status: 'under_review' });
    res.json({ success: true, tsr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { generateTSR, getTSR, saveDraft, submitTSR };
```

**Create `Backend/routes/tsrRoutes.js`:**

```javascript
const express = require('express');
const router = express.Router();
const { generateTSR, getTSR, saveDraft, submitTSR } = require('../controllers/tsrController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate/:caseId', protect, generateTSR);
router.get('/:caseId', protect, getTSR);
router.put('/:id', protect, saveDraft);
router.post('/:id/submit', protect, submitTSR);

module.exports = router;
```

---

### STEP 6 — Backend: Approval API

**Create `Backend/controllers/approvalController.js`:**

```javascript
const TSRReport = require('../models/TSRReport');
const ApprovalLog = require('../models/ApprovalLog');
const Case = require('../models/Case');

// GET PENDING TSRs (senior only)
const getPending = async (req, res) => {
  try {
    if (req.user.role !== 'senior') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const pending = await TSRReport.find({ status: 'submitted' }).populate('caseId');
    res.json({ success: true, pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// APPROVE
const approveTSR = async (req, res) => {
  try {
    if (req.user.role !== 'senior') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const tsr = await TSRReport.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    await Case.findByIdAndUpdate(tsr.caseId, { status: 'approved' });
    await ApprovalLog.create({
      caseId: tsr.caseId, reportId: tsr._id,
      reportType: 'TSR', action: 'approved',
      doneBy: req.user.role, notes: req.body.notes || '',
    });
    res.json({ success: true, message: 'TSR Approved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// REJECT / REQUEST CHANGES
const rejectTSR = async (req, res) => {
  try {
    if (req.user.role !== 'senior') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const tsr = await TSRReport.findByIdAndUpdate(req.params.id, { status: 'rejected', approvalNotes: req.body.notes }, { new: true });
    await Case.findByIdAndUpdate(tsr.caseId, { status: 'in_progress' });
    await ApprovalLog.create({
      caseId: tsr.caseId, reportId: tsr._id,
      reportType: 'TSR', action: 'changes_requested',
      doneBy: req.user.role, notes: req.body.notes || '',
    });
    res.json({ success: true, message: 'Changes Requested' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPending, approveTSR, rejectTSR };
```

**Create `Backend/routes/approvalRoutes.js`:**

```javascript
const express = require('express');
const router = express.Router();
const { getPending, approveTSR, rejectTSR } = require('../controllers/approvalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/pending', protect, getPending);
router.post('/:id/approve', protect, approveTSR);
router.post('/:id/reject', protect, rejectTSR);

module.exports = router;
```

---

### STEP 7 — Register ALL Routes in Server.js

Update `Backend/Server.js` to add all new routes. Add these lines AFTER the existing auth route:

```javascript
// ADD THESE IMPORTS after existing ones:
const caseRoutes = require('./routes/caseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const documentRoutes = require('./routes/documentRoutes');
const tsrRoutes = require('./routes/tsrRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const path = require('path');
const fs = require('fs');

// CREATE uploads folder if not exists (add before app.listen):
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// SERVE uploaded files statically:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ADD THESE ROUTES after existing /api/auth:
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/tsr', tsrRoutes);
app.use('/api/approvals', approvalRoutes);
```

Also add to `Backend/.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

---

### STEP 8 — Frontend: Add Google Fonts to index.html

In `Frontend/index.html`, inside `<head>`, add:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

---

### STEP 9 — Frontend: CSS Variables in index.css

Replace the entire content of `Frontend/src/index.css` with:

```css
@import "tailwindcss";

:root {
  --navy: #1a2744;
  --gold: #c9a84c;
  --gold-light: #e8c96e;
  --accent: #2563eb;
  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;
  --bg: #f1f5f9;
  --card: #ffffff;
  --border: #e2e8f0;
  --text: #0f172a;
  --muted: #64748b;
  --sidebar-width: 260px;
}

* { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
h1, h2, h3, .font-display { font-family: 'Playfair Display', serif; }
body { background: var(--bg); color: var(--text); margin: 0; }

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
}
.animate-in { animation: fadeSlideUp 0.4s ease forwards; }
.animate-in-delay { animation: fadeSlideUp 0.4s ease forwards; animation-delay: calc(var(--i, 0) * 0.08s); opacity: 0; }
```

---

### STEP 10 — Frontend: Sidebar Component

**Create `Frontend/src/components/Layout/Sidebar.jsx`:**

```jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NAV = [
  { label: 'Dashboard', icon: '⊞', path: '/dashboard' },
  { label: 'All Cases', icon: '📁', path: '/cases' },
  {
    label: 'Non-Litigation', icon: '🏛️', path: null,
    children: [
      { label: 'ICICI Bank', path: '/non-litigation/icici' },
      { label: 'Aditya Birla', path: '/non-litigation/aditya-birla' },
      { label: 'Bajaj', path: '/non-litigation/bajaj' },
    ]
  },
  { label: 'Search', icon: '🔍', path: '/search' },
  { label: 'Approvals', icon: '✅', path: '/approvals' },
  { label: 'Reports', icon: '📊', path: '/reports' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [nlOpen, setNlOpen] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ width: collapsed ? 64 : 260, background: 'var(--navy)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease',
      position: 'fixed', top: 0, left: 0, zIndex: 100, overflow: 'hidden' }}>

      {/* Logo */}
      <div style={{ padding: '24px 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'Playfair Display', color: 'var(--gold)', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>NLK</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>Associates</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18, padding: 4 }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV.map((item) => {
          if (item.children) {
            return (
              <div key={item.label}>
                <button onClick={() => setNlOpen(!nlOpen)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px 20px' : '12px 20px',
                    color: 'rgba(255,255,255,0.7)', fontSize: 13, justifyContent: collapsed ? 'center' : 'flex-start' }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {!collapsed && <><span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span><span>{nlOpen ? '▾' : '▸'}</span></>}
                </button>
                {nlOpen && !collapsed && item.children.map(child => (
                  <Link key={child.path} to={child.path}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 10px 44px',
                      color: isActive(child.path) ? 'var(--gold)' : 'rgba(255,255,255,0.55)',
                      textDecoration: 'none', fontSize: 13, borderLeft: isActive(child.path) ? '3px solid var(--gold)' : '3px solid transparent',
                      background: isActive(child.path) ? 'rgba(201,168,76,0.08)' : 'transparent',
                      transition: 'all 0.15s ease' }}>
                    {child.label}
                  </Link>
                ))}
              </div>
            );
          }
          return (
            <Link key={item.path} to={item.path}
              style={{ display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '12px 20px' : '12px 20px', justifyContent: collapsed ? 'center' : 'flex-start',
                color: isActive(item.path) ? 'var(--gold)' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none', fontSize: 13, borderLeft: isActive(item.path) ? '3px solid var(--gold)' : '3px solid transparent',
                background: isActive(item.path) ? 'rgba(201,168,76,0.08)' : 'transparent',
                transition: 'all 0.15s ease' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: role + logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {!collapsed && (
          <div style={{ marginBottom: 10, padding: '6px 10px', background: 'rgba(201,168,76,0.15)',
            borderRadius: 6, color: 'var(--gold)', fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: 1 }}>
            {role || 'staff'}
          </div>
        )}
        <button onClick={logout}
          style={{ width: '100%', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
            color: '#f87171', padding: '8px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {collapsed ? '↩' : '↩ Logout'}
        </button>
      </div>
    </div>
  );
}
```

---

### STEP 11 — Frontend: Topbar Component

**Create `Frontend/src/components/Layout/Topbar.jsx`:**

```jsx
import { useLocation } from 'react-router-dom';

const BREADCRUMBS = {
  '/dashboard': ['Dashboard'],
  '/cases': ['Cases', 'All Cases'],
  '/cases/new': ['Cases', 'New Case'],
  '/search': ['Search'],
  '/approvals': ['Approvals'],
  '/reports': ['Reports'],
};

const ROLE_COLORS = {
  admin: { bg: '#dbeafe', color: '#1d4ed8', label: 'Admin' },
  staff: { bg: '#dcfce7', color: '#15803d', label: 'Staff' },
  senior: { bg: '#fef9c3', color: '#854d0e', label: 'NLK Sir' },
};

export default function Topbar() {
  const location = useLocation();
  const role = localStorage.getItem('role') || 'staff';
  const crumbs = BREADCRUMBS[location.pathname] || ['Dashboard'];
  const rc = ROLE_COLORS[role] || ROLE_COLORS.staff;

  return (
    <div style={{ height: 60, background: 'white', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <span style={{ color: 'var(--muted)' }}>›</span>}
            <span style={{ color: i === crumbs.length - 1 ? 'var(--text)' : 'var(--muted)', fontSize: 14, fontWeight: i === crumbs.length - 1 ? 600 : 400 }}>{c}</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ padding: '4px 12px', borderRadius: 20, background: rc.bg, color: rc.color, fontSize: 12, fontWeight: 600 }}>
          {rc.label}
        </span>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--navy)',
          color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14, fontFamily: 'Playfair Display' }}>
          {role[0].toUpperCase()}
        </div>
      </div>
    </div>
  );
}
```

---

### STEP 12 — Frontend: MainLayout Component

**Create `Frontend/src/components/Layout/MainLayout.jsx`:**

```jsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, [navigate]);

  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: 'margin-left 0.25s ease', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <main style={{ flex: 1, padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

### STEP 13 — Frontend: Update App.jsx with All Routes

Replace `Frontend/src/App.jsx` completely:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import BankCases from './pages/NonLitigation/BankCases';
import TSRGenerator from './pages/NonLitigation/TSRGenerator';
import CaseCreate from './pages/Cases/CaseCreate';
import CaseDetail from './pages/Cases/CaseDetail';
import Approvals from './pages/Approvals';
import SearchPage from './pages/SearchPage';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<Dashboard />} />
          <Route path="/cases/new" element={<CaseCreate />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/non-litigation/:bank" element={<BankCases />} />
          <Route path="/tsr/:caseId" element={<TSRGenerator />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
```

---

### STEP 14 — Frontend: Dashboard Page (Full Build)

Replace `Frontend/src/pages/Dashboard.jsx` completely with a full working dashboard:
- 4 stat cards (Total Cases, Pending Approval, Approved Today, Active Banks) with animated number counters
- Bar chart (recharts) for cases by bank
- Donut chart for cases by status
- Recent cases table with colored status badges
- Quick action buttons based on role
- All data fetched from `GET /api/dashboard/stats`
- Use the color system and CSS animation classes defined in index.css
- Status badge colors: created=gray, assigned=blue, in_progress=amber, draft_ready=purple, under_review=orange, approved=green, shared_to_bank=teal

---

### STEP 15 — Create Stub Pages (So App doesn't crash)

Create these as minimal stubs so routing works while we build them next session:

`Frontend/src/pages/NonLitigation/BankCases.jsx` — show bank name from URL param + "Coming soon"
`Frontend/src/pages/NonLitigation/TSRGenerator.jsx` — show "TSR Generator - Coming soon"
`Frontend/src/pages/Cases/CaseCreate.jsx` — show "Create Case - Coming soon"
`Frontend/src/pages/Cases/CaseDetail.jsx` — show "Case Detail - Coming soon"
`Frontend/src/pages/Approvals.jsx` — show "Approvals - Coming soon"
`Frontend/src/pages/SearchPage.jsx` — show "Search - Coming soon"
`Frontend/src/pages/Reports.jsx` — show "Reports - Coming soon"

All stubs should use this template:
```jsx
export default function PageName() {
  return <div className="animate-in" style={{ padding: 32, fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)' }}>Page Name</div>;
}
```

---

## ✅ WHAT DONE LOOKS LIKE

After completing all 15 steps:
- `npm run dev` in Frontend → Login page loads, login works, redirects to `/dashboard`
- Dashboard shows: 4 stat cards, 2 charts, recent cases table
- Sidebar shows: NLK logo, all nav items, collapse works, logout works
- All routes navigate without errors (stub pages load)
- Backend: all 6 route groups registered and responding on port 5000

---

## ❌ DO NOT

- Do NOT touch Login.jsx
- Do NOT touch existing auth files
- Do NOT use TypeScript
- Do NOT install Redux, Prisma, or any unlisted package
- Do NOT change Tailwind or Vite versions
- Do NOT skip creating the stub pages (App will crash without them)

---

*Prompt V3 | NLK Law Associates | Building: Backend APIs + Frontend Layout + Dashboard*
