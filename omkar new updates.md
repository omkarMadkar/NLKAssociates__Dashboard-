# Omkar's Project Updates Summary

Here is a detailed breakdown of all the design improvements, feature relocations, and backend/frontend integrations successfully implemented in this version:

---

## 1. Feature Relocation: Waiting Report
- **Relocated from Drafting to Initiation**: Relocated the Waiting Report checklist from the drafting phase into the **TSR Initiation** phase as the final step.
- **Cheklist Form Integration**: Added a dynamic checklist form inside the TSR Initiation view pre-loaded with the 5 standard mandatory legal documents.
- **Single-Transaction Submission**: Updated the submission flow so that Basic Info, Property Details, Excel Title Flow, and the Waiting Report Checklist are all sent in a single backend submission.
- **Checklist File Attachments**: Added direct file drop upload capabilities to each row of the Waiting Report checklist. Uploaded files are sent dynamically to the backend and saved with a green checkmark indicating successful upload.

---

## 2. Robust Backend & Database Setup
- **TSRWaitingReport Schema**: Developed a new Mongoose Schema (`TSRWaitingReport.js`) to store report metadata, case references, and file paths for individual checklist attachments.
- **REST Endpoints & Controllers**: Implemented controllers and routing middleware for saving and retrieving checklist entries.
- **FileUpload Middleware**: Added secure file upload endpoints saving documents directly to the backend storage directory.

---

## 3. In-Window Details Modal & Inline File Previewer (React Portals)
- **Centering & Screen-wide Blur**: Replaced standard modal containers with a **React Portal** that renders at the document body root level. This fixes styling crops and applies a glassmorphic overlay (`backdrop-filter: blur(8px)`) that blurs the entire viewport (sidebar and topbar included).
- **Tab-Free PDF/Image Previews**: Created an inline File Previewer Portal overlay. Clicking the `👁 View` icon beside any file (in the Waiting Report checklist or OCR scans) opens an inline frame (using `<iframe src={url} />` for PDFs and `<img>` for PNGs/JPEGs) without launching external browser tabs.
- **Excel Event Parsing & OCR Lists**: Rendered the full parsed list of Excel title flow events with current owner highlights, and OCR scan records in the details modal sections.

---

## 4. UI Themes & Typography Polish
- **Central Navy-to-Black Theme Migration**: Updated the `--navy` CSS variable inside `index.css` to true black (`#000000`), instantly updating sidebars, headers, and badge backgrounds.
- **Premium Monochrome Buttons**: Replaced vibrant button fills (indigo, emerald, amber, teal) with monochrome styles:
  * **Generate Draft**: Solid black (`#000000`)
  * **Save as Draft & Export PDF**: Slate outline (`border: '1px solid #cbd5e1'`)
  * **Submit for Approval**: Elegant accent outline (`border: '1px solid #000000'`)
- **Carbon AI Badges**: Changed the purple gradients on "AI-Powered" tags to a carbon slate-and-zinc gradient (`linear-gradient(135deg, #09090b, #27272a)`).
- **Checklist Row Addition**: Changed the Waiting Report "+ Add Row" button from purple to monochrome black.

---

## 5. Dashboard Polish & Chart Enhancements
- **Clean Stat Cards**: Redesigned dashboard cards from solid saturated color blocks to flat, clean white-background cards with a subtle drop-shadow and mouse-hover slide up (`translateY(-4px)`).
- **Descriptive Iconography**: Embedded Lucide icons (`Briefcase`, `Clock`, `CheckCircle`, `Landmark`) inside circular tags with soft gray washes, complete with trending subtitles ("Cases in database", etc.).
- **Recharts Gradients**: Added SVG linear gradients (`#0f172a` to `#475569`) and horizontal gridlines to the Bank Bar Chart.
- **Legend & Label Alignment**: Added a capitalize-formatted Legend at the bottom of the Status Donut Chart and removed overlapping labels.
- **Recent Cases Table Layout**: Increased vertical padding, styled headers, wrapped Case IDs in monospace gray pill blocks, and created pill-style status badges with matching internal colored dots.
- **Red Under Review Badge**: Changed the "Under Review" badge styling from orange to premium red (`#dc2626` text with `#fee2e2` background) across the dashboard, case lists, case details, and search views.

---

## 6. Scrollable Scrollbar-Hidden Sidebar
- **Nav Hide Scrollbar**: Integrated a `.no-scrollbar` utility in `index.css` and added it to the sidebar `<nav>` tag. This enables the navigation list to scroll vertically when list categories expand, while hiding the scrollbars for a clean look.
