/**
 * create_mock_pdfs.js
 * Generates valid minimal PDF files for all mock documents used in seed data.
 * Run once: node create_mock_pdfs.js
 */

const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const files = [
  { filename: "Conveyance_Deed_Amit.pdf",   title: "Conveyance Deed 2021 – Amit Vinayak Kulkarni" },
  { filename: "Index_II_Amit.pdf",           title: "Index II 2021 – Kothrud, Pune" },
  { filename: "Tax_Receipt_2026.pdf",        title: "Tax Receipt 2026 – PMC/KTH/56" },
  { filename: "7_12_Extract_Amit.pdf",       title: "7/12 Extract – Survey No. 88, Hissa 1-B" },
  { filename: "Mutation_Cert.pdf",           title: "Mutation Certificate – Kothrud" },
  { filename: "Sale_Deed_Sharma.pdf",        title: "Sale Deed 2015 – Rajesh Madanlal Sharma" },
  { filename: "Index_II_Sharma.pdf",         title: "Index II 2015 – Hadapsar, Pune" },
  { filename: "Mutation_Sharma.pdf",         title: "Mutation Entry 4452 – Hadapsar" },
  { filename: "Tax_Sharma.pdf",              title: "Tax Receipt 2025 – MNC/2026/A-9" },
  { filename: "NA_Order_Sharma.pdf",         title: "NA Conversion Order – Survey No. 124" },
  { filename: "Agreement_Sale_Sneha.pdf",    title: "Agreement for Sale 2018 – Sneha Rahul Deshmukh" },
  { filename: "Property_Card_Sneha.pdf",     title: "Property Card – PMC/DEC/42" },
  { filename: "NOC_Society_Sneha.pdf",       title: "NOC from Society – Deccan Gymkhana" },
  { filename: "Tax_Receipt_Sneha.pdf",       title: "Tax Paid Receipt – PMC/DEC/42" },
  { filename: "Index_II_Sneha.pdf",          title: "Index II 2018 – Deccan, Pune" },
  { filename: "Sale_Deed_Kadam.pdf",         title: "Sale Deed 2022 – Rohan Vinod Kadam" },
  { filename: "Index_II_Kadam.pdf",          title: "Index II 2022 – Baner, Pune" },
  { filename: "Search_Report_30_Yrs.pdf",    title: "Search Report 30 Years – Survey No. 110" },
  { filename: "EC_1996_2026.pdf",            title: "Encumbrance Certificate 1996-2026" },
  { filename: "Share_Cert_Kadam.pdf",        title: "Society Share Certificate – PMC/BNR/900" },
];

/**
 * Build a valid minimal single-page PDF with a text line.
 * Uses only PDF 1.4 objects with correct xref table byte offsets.
 */
function buildPdf(title) {
  // We build the PDF as a string, measuring byte offsets carefully.
  const lines = [];

  const push = (s) => lines.push(s);

  push("%PDF-1.4");
  push("%\xe2\xe3\xcf\xd3"); // binary comment to signal binary content

  const offsets = [];

  // Object 1: Catalog
  offsets[1] = lines.join("\n").length + 1; // +1 for \n
  push("1 0 obj");
  push("<< /Type /Catalog /Pages 2 0 R >>");
  push("endobj");

  // Object 2: Pages
  offsets[2] = lines.join("\n").length + 1;
  push("2 0 obj");
  push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  push("endobj");

  // Object 3: Page
  offsets[3] = lines.join("\n").length + 1;
  push("3 0 obj");
  push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]");
  push("   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>");
  push("endobj");

  // Object 4: Content stream
  const safeTitle = title.replace(/[()\\]/g, (c) => `\\${c}`);
  const stream = `BT /F1 14 Tf 72 720 Td (${safeTitle}) Tj ET`;
  offsets[4] = lines.join("\n").length + 1;
  push("4 0 obj");
  push(`<< /Length ${stream.length} >>`);
  push("stream");
  push(stream);
  push("endstream");
  push("endobj");

  // Object 5: Font
  offsets[5] = lines.join("\n").length + 1;
  push("5 0 obj");
  push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  push("endobj");

  // xref
  const xrefOffset = lines.join("\n").length + 1;
  push("xref");
  push(`0 6`);
  push("0000000000 65535 f ");
  for (let i = 1; i <= 5; i++) {
    push(`${String(offsets[i]).padStart(10, "0")} 00000 n `);
  }

  push("trailer");
  push("<< /Size 6 /Root 1 0 R >>");
  push("startxref");
  push(String(xrefOffset));
  push("%%EOF");

  return lines.join("\n");
}

let created = 0;
for (const { filename, title } of files) {
  const filepath = path.join(uploadsDir, filename);
  const pdfContent = buildPdf(title);
  fs.writeFileSync(filepath, pdfContent, "binary");
  console.log(`✓ Created: ${filename}`);
  created++;
}

console.log(`\n✅ Done — ${created} valid PDF files created in Backend/uploads/`);
