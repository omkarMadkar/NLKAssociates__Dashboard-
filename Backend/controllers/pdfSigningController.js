const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");
const { pdflibAddPlaceholder } = require("@signpdf/placeholder-pdf-lib");
const signpdf = require("@signpdf/signpdf").default;
const { P12Signer } = require("@signpdf/signer-p12");

/**
 * Generates an A4 PDF from report HTML and applies a PKCS#12 cryptographic digital signature.
 */
const signPDFReport = async (req, res) => {
  let browser = null;
  try {
    const { html, pfxBase64, password } = req.body;
    if (!html || !pfxBase64 || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (html, pfxBase64, password).",
      });
    }

    console.log("Decoding PFX certificate...");
    const pfxBuffer = Buffer.from(pfxBase64, "base64");

    console.log("Launching Puppeteer browser...");
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    
    // Set standard viewport and content
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    
    console.log("Rendering PDF via print emulation...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await browser.close();
    browser = null;

    console.log("Loading PDF document in pdf-lib...");
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    console.log("Adding digital signature placeholder dictionary...");
    pdflibAddPlaceholder({
      pdfDoc,
      reason: "Legal Scrutiny Certification",
      contactInfo: "narayan.khamkar@nlkassociates.com",
      name: "Narayan Laxman Khamkar",
      location: "Pune, India",
      signatureLength: 8192, // Reserve ample space for RSA-2048 keys
    });

    const pdfWithPlaceholder = await pdfDoc.save();

    console.log("Applying cryptographic signature via signpdf...");
    const signer = new P12Signer(pfxBuffer, { passphrase: password });
    const signedPdfBuffer = await signpdf.sign(Buffer.from(pdfWithPlaceholder), signer);

    console.log("PDF successfully signed cryptographically!");
    
    // Return base64 encoded PDF string to allow easy frontend download handling
    res.json({
      success: true,
      pdfBase64: signedPdfBuffer.toString("base64"),
    });
  } catch (error) {
    console.error("PDF Cryptographic Signing Error:", error);
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        // ignore
      }
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate signed PDF.",
    });
  }
};

module.exports = {
  signPDFReport,
};
