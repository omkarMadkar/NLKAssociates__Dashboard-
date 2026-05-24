# 🏛️ NLK LAW ASSOCIATES — MASTER PROJECT CONTEXT FILE
## Version: 2.0 | Updated: 2026-05-16 | Based on: Actual GitHub Codebase

---

## 📌 PROJECT IDENTITY

- **Client:** NLK Law Associates (Indian Law Firm)
- **Repo:** NLKAssociatesDashboard-main
- **Focus:** Non-Litigation Module (Phase 1)
- **Build Platform:** Antigravity / Cursor / any AI builder
- **Stack:** React 19 + Vite 8 + Tailwind 4 | Node + Express 5 + MongoDB + Mongoose

---

## ✅ WHAT IS ALREADY BUILT (DO NOT RECREATE)

| File | Status | Notes |
|------|--------|-------|
| Frontend/src/App.jsx | ✅ Done | Routes: / → Login, /dashboard → Dashboard |
| Frontend/src/pages/Login.jsx | ✅ Done | Role selector + password, JWT to localStorage |
| Frontend/src/api/axios.js | ✅ Done | Axios pointing to localhost:5000/api |
| Backend/Server.js | ✅ Done | Express + CORS + /api/auth (but db.js NOT connected yet!) |
| Backend/config/db.js | ✅ Done | Mongoose connect (not called yet) |
| Backend/routes/authRoutes.js | ✅ Done | POST /api/auth/login |
| Backend/controllers/authController.js | ✅ Done | Login by role+password |
| Backend/middleware/authMiddleware.js | ✅ Done | JWT Bearer protect |
| Backend/models/Users.js | ✅ Done | Hardcoded: admin/admin@123, staff/staff@123 |
| Backend/utils/generateToken.js | ✅ Done | jwt.sign 2d expiry |
| Backend/.env | ✅ Done | MONGO_URI + JWT_SECRET |

## ⚠️ CRITICAL BUG IN EXISTING CODE
`Server.js` does NOT call `connectDB()` — MongoDB is never connected. **First fix: import and call connectDB in Server.js.**

## 🔲 WHAT NEEDS TO BE BUILT

### Backend
- [ ] Fix: Call connectDB() in Server.js
- [ ] Add "senior" role to Users.js (password: senior@123)
- [ ] Mongoose models: Case, Client, Property, Document, TSRReport, ApprovalLog, BankShare
- [ ] Dashboard API: GET /api/dashboard/stats
- [ ] Cases API: CRUD + status update
- [ ] Documents API: Multer upload + list
- [ ] TSR API: AI generate + save + submit
- [ ] Approval API: list pending + approve + reject
- [ ] Reports API: generate PDF + share to bank

### Frontend
- [ ] Protected route wrapper (no token → redirect to /)
- [ ] Sidebar component (navy/gold, collapsible)
- [ ] Topbar component (breadcrumb + role badge)
- [ ] MainLayout (Sidebar + Topbar + Outlet)
- [ ] Update App.jsx routes with MainLayout wrapper
- [ ] Dashboard.jsx — Full build (stats + charts + table)
- [ ] BankCases.jsx — /non-litigation/:bank
- [ ] CaseCreate.jsx — /cases/new
- [ ] CaseDetail.jsx — /cases/:id
- [ ] TSRGenerator.jsx — /tsr/:caseId
- [ ] Approvals.jsx — /approvals (senior only)
- [ ] SearchPage.jsx — /search
- [ ] Reports.jsx — /reports

---

## 🛠️ EXACT TECH STACK (LOCKED — DO NOT CHANGE)

### Frontend
```json
"react": "^19.2.6"
"react-dom": "^19.2.6"
"react-router-dom": "^7.15.0"
"axios": "^1.16.1"
"tailwindcss": "^4.3.0"
"@tailwindcss/vite": "^4.3.0"
"vite": "^8.0.12"
```
To add: `recharts` (charts on dashboard)

### Backend
```json
"express": "^5.2.1"
"mongoose": "^9.6.2"
"jsonwebtoken": "^9.0.3"
"bcryptjs": "^3.0.3"
"dotenv": "^17.4.2"
"cors": "^2.8.6"
```
To add: `multer` (file upload), `openai` (TSR draft), `pdfkit` (report PDF)

**NO Prisma, NO TypeScript, NO Redux, NO React Query**

---

## 🗄️ DATABASE (MongoDB via Mongoose)

**Connection string:** `mongodb://localhost:27017/NLKAssociates`

### Collections to create:
- cases (caseId, bank, clientId, propertyId, status, assignedTo, createdBy)
- clients (name, phone, email, address)
- properties (caseId, address, surveyNo, village, taluka, district)
- documents (caseId, docType, originalName, filePath, fileSize, uploadedBy)
- tsrreports (caseId, draftContent, version, status, aiGenerated, approvalNotes, createdBy)
- approvallogs (caseId, reportId, reportType, action, doneBy, notes)
- bankshares (caseId, reportId, sharedToBank, sharedBy, sharedAt)

### Case Status Flow:
`created → assigned → in_progress → draft_ready → under_review → approved → shared_to_bank`

### Case ID Format: `NLK-2026-00001` (auto-increment, padded 5 digits)

---

## 🎨 DESIGN SYSTEM

### Colors
```
Navy:     #1a2744  (sidebar bg, headings)
Gold:     #c9a84c  (logo, active nav, accents)
Accent:   #2563eb  (buttons, links)
Success:  #16a34a  (approved badges)
Warning:  #d97706  (pending badges)
Danger:   #dc2626  (rejected badges)
BG:       #f1f5f9  (main background)
Card:     #ffffff
Border:   #e2e8f0
Text:     #0f172a
Muted:    #64748b
```

### Fonts (Google Fonts)
- Headings: `Playfair Display` (600, 700)
- Body/UI: `DM Sans` (400, 500, 600)

### Animations
- Page load: fadeSlideUp (opacity 0→1, translateY 16px→0, 0.4s)
- Card stagger: animation-delay using CSS variable --i
- Sidebar transitions: 0.2s ease
- Badge pulse for active/pending states

---

## 👤 USER ROLES

| Role | Password | Permissions |
|------|----------|-------------|
| admin | admin@123 | Full access, create cases |
| staff | staff@123 | View assigned cases, upload docs, generate TSR |
| senior | senior@123 | Approve/reject TSR reports only |

---

## 📊 TASKS LOG (UPDATE AFTER EACH MILESTONE)

| Date | Task | Status | Notes |
|------|------|--------|-------|
| 2026-05-16 | Codebase analysis | ✅ Done | Zip fully reviewed |
| 2026-05-16 | Login page built | ✅ Done | By friend, working |
| 2026-05-16 | Auth backend | ✅ Done | Role+password, JWT |
| 2026-05-16 | Master prompt V2 | ✅ Done | Based on actual code |
| — | Fix: connectDB in Server.js | 🔲 Next | Critical bug |
| — | Add senior user | 🔲 Next | |
| — | Mongoose models (7 schemas) | 🔲 Pending | |
| — | Dashboard API | 🔲 Pending | |
| — | Cases API | 🔲 Pending | |
| — | Sidebar + Layout | 🔲 Pending | |
| — | Dashboard UI | 🔲 Pending | |
| — | Non-Litigation bank pages | 🔲 Pending | |
| — | Case create/detail | 🔲 Pending | |
| — | Document upload | 🔲 Pending | |
| — | TSR AI generator | 🔲 Pending | |
| — | Approval queue | 🔲 Pending | |
| — | Search page | 🔲 Pending | |
| — | Report generation | 🔲 Pending | |

---

## 📂 FOLDER STRUCTURE (TARGET STATE)

```
NLKAssociatesDashboard-main/
├── Frontend/src/
│   ├── App.jsx                    ✅ (update routes)
│   ├── api/axios.js               ✅
│   ├── pages/
│   │   ├── Login.jsx              ✅ (do not touch)
│   │   ├── Dashboard.jsx          🔲 rebuild
│   │   ├── Cases/
│   │   │   ├── CaseList.jsx       🔲
│   │   │   ├── CaseCreate.jsx     🔲
│   │   │   └── CaseDetail.jsx     🔲
│   │   ├── NonLitigation/
│   │   │   ├── BankCases.jsx      🔲
│   │   │   └── TSRGenerator.jsx   🔲
│   │   ├── Approvals.jsx          🔲
│   │   ├── SearchPage.jsx         🔲
│   │   └── Reports.jsx            🔲
│   └── components/
│       └── Layout/
│           ├── Sidebar.jsx        🔲
│           ├── Topbar.jsx         🔲
│           └── MainLayout.jsx     🔲
│
└── Backend/
    ├── Server.js                  ⚠️ fix: add connectDB()
    ├── config/db.js               ✅
    ├── models/
    │   ├── Users.js               ⚠️ add senior role
    │   ├── Case.js                🔲
    │   ├── Client.js              🔲
    │   ├── Property.js            🔲
    │   ├── Document.js            🔲
    │   ├── TSRReport.js           🔲
    │   ├── ApprovalLog.js         🔲
    │   └── BankShare.js           🔲
    ├── controllers/
    │   ├── authController.js      ✅
    │   ├── dashboardController.js 🔲
    │   ├── caseController.js      🔲
    │   ├── documentController.js  🔲
    │   ├── tsrController.js       🔲
    │   └── approvalController.js  🔲
    ├── routes/
    │   ├── authRoutes.js          ✅
    │   ├── dashboardRoutes.js     🔲
    │   ├── caseRoutes.js          🔲
    │   ├── documentRoutes.js      🔲
    │   ├── tsrRoutes.js           🔲
    │   └── approvalRoutes.js      🔲
    └── middleware/
        ├── authMiddleware.js      ✅
        └── upload.js              🔲 (Multer)
```

---

## ⚠️ NOTES FOR EVERY NEW CHAT SESSION

1. **Upload this file first** in every new chat
2. **Auth is DONE** — do not touch Login.jsx or auth backend
3. **MongoDB not connected yet** — first fix in Server.js
4. **No Prisma, No TypeScript, No Redux** — plain JS + Mongoose
5. **Non-Litigation only** — Litigation & Conveyancing are Phase 2
6. **Use exact package versions listed** — do not upgrade
7. Update the Tasks Log after every completed module

---

*This is the single source of truth. Update after every session.*
