const fs = require('fs');
const path = require('path');

/**
 * PDF Text Extractor + Legal Field Mapper
 * 
 * Reads real text from uploaded PDFs using pdf-parse,
 * then applies regex patterns to extract Indian legal document fields.
 * Returns ONLY fields that were actually found in the document.
 */

/**
 * Extract raw text from a PDF file
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromPDF(filePath) {
  // Use PDFParse class from the modern pdf-parse package
  const { PDFParse } = require('pdf-parse');
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  try {
    const data = await parser.getText();
    return data.text || '';
  } finally {
    await parser.destroy().catch(() => {});
  }
}

/**
 * Apply regex patterns to extracted text and return matched fields
 * Only returns fields where data was actually found.
 * 
 * @param {string} text - Raw text extracted from PDF
 * @param {string} fileName - Original filename (helps identify document type)
 * @returns {Object} - Object with only the fields that were detected
 */
function extractFieldsFromText(text, fileName = '') {
  const fields = {};
  const lowerText = text.toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  // ========== DOCUMENT TYPE DETECTION ==========
  const isESearchReceipt = lowerFileName.includes('esearch') || lowerFileName.includes('e-search') ||
    lowerText.includes('esearch') || lowerText.includes('e-search') || lowerText.includes('igr maharashtra');
  
  const isGRASChallan = lowerFileName.includes('challan') || lowerFileName.includes('gras') ||
    lowerText.includes('gras') || lowerText.includes('government receipt');
  
  const isSaleDeed = lowerFileName.includes('sale') || lowerFileName.includes('deed') || 
    lowerFileName.includes('kharedi') || lowerFileName.includes('conveyance') ||
    lowerText.includes('sale deed') || lowerText.includes('conveyance deed') || 
    lowerText.includes('विक्री करारनामा') || lowerText.includes('खरेदीखत');
  
  const isAgreement = lowerFileName.includes('agreement') || 
    lowerText.includes('agreement to sell') || lowerText.includes('agreement of sale');
  
  const isTaxReceipt = lowerFileName.includes('tax') || 
    lowerText.includes('property tax') || lowerText.includes('मालमत्ता कर');
  
  const isIndex2 = lowerFileName.includes('index') || 
    lowerText.includes('index ii') || lowerText.includes('index 2') || lowerText.includes('अनुक्रमणिका');

  const isOC = lowerFileName.includes('oc') || lowerFileName.includes('occupancy') ||
    lowerText.includes('occupancy certificate') || lowerText.includes('completion certificate');

  const isMap = lowerFileName.includes('map') || lowerFileName.includes('layout') ||
    lowerText.includes('layout plan') || lowerText.includes('site plan');

  // ========== COMMON PATTERNS (all document types) ==========

  // Village / गाव
  const villagePatterns = [
    /village\s*[:\-–]\s*([A-Za-z\s]+?)(?:\s*,|\s*taluka|\s*tal\.|$)/im,
    /गाव\s*[:\-–]\s*([^\s,]+)/im,
    /Village\s*Name\s*[:\-–]\s*([A-Za-z\s]+?)(?:\s*,|\s*$)/im,
    /मौजे\s*[:\-–]?\s*([^\s,]+)/im,
    /mouje\s*[:\-–]?\s*([A-Za-z\s]+?)(?:\s*,|\s*$)/im,
  ];
  for (const pat of villagePatterns) {
    const m = text.match(pat);
    if (m && m[1]?.trim()) { fields.village = m[1].trim(); break; }
  }

  // Taluka / तालुका
  const talukaPatterns = [
    /taluka\s*[:\-–]\s*([A-Za-z\s]+?)(?:\s*,|\s*dist|\s*district|$)/im,
    /tal\.\s*([A-Za-z\s]+?)(?:\s*,|\s*dist|\s*$)/im,
    /तालुका\s*[:\-–]\s*([^\s,]+)/im,
  ];
  for (const pat of talukaPatterns) {
    const m = text.match(pat);
    if (m && m[1]?.trim()) { fields.taluka = m[1].trim(); break; }
  }

  // District / जिल्हा
  const districtPatterns = [
    /district\s*[:\-–]\s*([A-Za-z\s]+?)(?:\s*,|\s*\n|\s*$)/im,
    /dist\.\s*([A-Za-z\s]+?)(?:\s*,|\s*\n|\s*$)/im,
    /जिल्हा\s*[:\-–]\s*([^\s,]+)/im,
  ];
  for (const pat of districtPatterns) {
    const m = text.match(pat);
    if (m && m[1]?.trim()) { fields.district = m[1].trim(); break; }
  }

  // Survey Number / सर्वे नंबर
  const surveyPatterns = [
    /(?:survey|srv|s\.)\s*(?:no|number)\.?\s*[:\-–]?\s*([\d\/\w\s,\-\.]+?)(?:\s*,\s*(?:hissa|village|taluka)|$)/im,
    /(?:गट|सर्वे)\s*(?:नं|नंबर|क्र)\.?\s*[:\-–]?\s*([\d\/\w\s,\-\.]+)/im,
    /CTS\s*(?:No|Number)\.?\s*[:\-–]?\s*([\d\/\w\s,\-\.]+)/im,
    /(?:Hissa|हिस्सा)\s*(?:No|Number|नं)\.?\s*[:\-–]?\s*([\d\/\w\s,\-\.]+)/im,
    /(?:Gat|गट)\s*(?:No|Number|नं)\.?\s*[:\-–]?\s*([\d\/\w\s,\-\.]+)/im,
  ];
  for (const pat of surveyPatterns) {
    const m = text.match(pat);
    if (m && m[1]?.trim()) { 
      fields.surveyNoDetails = m[1].trim(); 
      break; 
    }
  }

  // ========== eSEARCH RECEIPT SPECIFIC ==========
  if (isESearchReceipt) {
    // SRO Office / Sub-Registrar Office
    const sroMatch = text.match(/(?:SRO|Sub[\s\-]?Registrar|उपनिबंधक)\s*(?:Office|कार्यालय)?\s*[:\-–]?\s*([A-Za-z\s\d]+?)(?:\s*,|\s*\n|\s*$)/im)
      || text.match(/Office\s*of\s*(?:the\s*)?Sub[\s\-]?Registrar\s*[:\-–]?\s*([A-Za-z\s\d]+?)(?:\s*,|\s*\n|\s*$)/im);
    if (sroMatch && sroMatch[1]?.trim()) {
      const sro = sroMatch[1].trim();
      // SRO name often indicates the taluka
      if (!fields.taluka) fields.taluka = sro;
    }

    // GRN / Receipt number
    const grnMatch = text.match(/(?:GRN|Receipt\s*No|Transaction\s*ID)\s*[:\-–]?\s*([A-Z0-9\-]+)/im);
    if (grnMatch) fields.refNo = grnMatch[1].trim();

    // Party names from eSearch
    const partyPatterns = [
      /(?:Party|Executant|पक्षकार|दाता)\s*(?:1|Name)?\s*[:\-–]\s*([^\n,]+)/im,
      /(?:First\s*Party|Seller|विक्रेता)\s*[:\-–]?\s*([^\n,]+)/im,
    ];
    for (const pat of partyPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) { 
        if (!fields.existingOwner) fields.existingOwner = m[1].trim();
        break; 
      }
    }

    const claimantPatterns = [
      /(?:Claimant|Purchaser|Second\s*Party|घेणारा|खरेदीदार)\s*[:\-–]?\s*([^\n,]+)/im,
    ];
    for (const pat of claimantPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) { 
        if (!fields.applicant) fields.applicant = m[1].trim();
        break; 
      }
    }

    // Year / Date from eSearch
    const dateMatch = text.match(/(?:Date|दिनांक)\s*[:\-–]?\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/im);
    if (dateMatch) fields.initiationDate = dateMatch[1].trim();
  }

  // ========== SALE DEED / CONVEYANCE SPECIFIC ==========
  if (isSaleDeed || isAgreement || isIndex2) {
    // Registration / Serial Number
    const regnPatterns = [
      /(?:Serial|Regn|Registration)\s*(?:No|Number)\.?\s*[:\-–]?\s*(\d+[\/\d]*)/im,
      /(?:नोंदणी|दस्त)\s*(?:क्रमांक|नं)\.?\s*[:\-–]?\s*(\d+[\/\d]*)/im,
    ];
    for (const pat of regnPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) { 
        if (!fields.refNo) fields.refNo = m[1].trim();
        break; 
      }
    }

    // Seller / Executant (existing owner)
    const sellerPatterns = [
      /(?:Seller|Executant|Vendor|दाता|विक्रेता)\s*[:\-–]?\s*(?:Mr\.|Shri\.?|श्री\.?)\s*([A-Za-z\s]+?)(?:\s*,|\s*\n|\s*age|\s*वय|\s*$)/im,
      /executed\s+by\s+(?:Mr\.|Shri\.?|श्री\.?)\s*([A-Za-z\s]+?)(?:\s+in\s+favour|\s*$)/im,
    ];
    for (const pat of sellerPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) {
        fields.existingOwner = m[1].trim();
        break;
      }
    }

    // Purchaser / Claimant (applicant)
    const purchaserPatterns = [
      /(?:Purchaser|Claimant|Buyer|खरेदीदार|घेणारा)\s*[:\-–]?\s*(?:Mr\.|Shri\.?|श्री\.?)\s*([A-Za-z\s]+?)(?:\s*,|\s*\n|\s*age|\s*वय|\s*$)/im,
      /in\s+favour\s+of\s+(?:Mr\.|Shri\.?|श्री\.?)\s*([A-Za-z\s]+?)(?:\s*,|\s*$)/im,
    ];
    for (const pat of purchaserPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) {
        fields.applicant = m[1].trim();
        break;
      }
    }

    // Area / admeasuring
    const areaPatterns = [
      /admeasuring\s*(?:about\s*)?([\d\.\s]+\s*(?:sq\.?\s*(?:ft|mt|mtr|meter)|(?:H\s*\d+\s*R|hectare|are|guntha)))/im,
      /area\s*[:\-–]?\s*([\d\.\s]+\s*(?:sq\.?\s*(?:ft|mt|mtr)|(?:H\s*\d+\s*R|hectare|are|guntha)))/im,
      /(?:carpet|built[\s\-]?up|super[\s\-]?built)\s*(?:area)?\s*[:\-–]?\s*([\d\.\s]+\s*(?:sq\.?\s*(?:ft|mt)))/im,
    ];
    for (const pat of areaPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) {
        fields.rccConstructionArea = m[1].trim();
        break;
      }
    }

    // Execution date
    const execDatePatterns = [
      /(?:dated|executed\s*on|date\s*of\s*execution)\s*[:\-–]?\s*(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4})/im,
      /दिनांक\s*[:\-–]?\s*(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4})/im,
    ];
    for (const pat of execDatePatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) {
        if (!fields.initiationDate) fields.initiationDate = m[1].trim();
        break;
      }
    }

    // Boundaries
    const boundaryPatterns = {
      boundaryEast: [
        /(?:east|पूर्व)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+?)(?:\s*(?:west|पश्चिम|south|दक्षिण|north|उत्तर)|$)/im,
        /(?:on\s*or\s*towards\s*east)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+)/im,
      ],
      boundaryWest: [
        /(?:west|पश्चिम)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+?)(?:\s*(?:south|दक्षिण|north|उत्तर|east|पूर्व)|$)/im,
        /(?:on\s*or\s*towards\s*west)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+)/im,
      ],
      boundarySouth: [
        /(?:south|दक्षिण)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+?)(?:\s*(?:north|उत्तर|east|पूर्व|west|पश्चिम)|$)/im,
        /(?:on\s*or\s*towards\s*south)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+)/im,
      ],
      boundaryNorth: [
        /(?:north|उत्तर)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+?)(?:\s*(?:east|पूर्व|west|पश्चिम|south|दक्षिण)|$)/im,
        /(?:on\s*or\s*towards\s*north)\s*[:\-–]?\s*(?:by\s*)?([^\n;]+)/im,
      ],
    };

    for (const [field, patterns] of Object.entries(boundaryPatterns)) {
      for (const pat of patterns) {
        const m = text.match(pat);
        if (m && m[1]?.trim() && m[1].trim().length > 2) {
          fields[field] = m[1].trim();
          break;
        }
      }
    }
  }

  // ========== GRAS CHALLAN SPECIFIC ==========
  if (isGRASChallan) {
    const challanMatch = text.match(/(?:Challan|GRN)\s*(?:No|Number)\.?\s*[:\-–]?\s*([A-Z0-9\-]+)/im);
    if (challanMatch) fields.refNo = challanMatch[1].trim();

    const amountMatch = text.match(/(?:Amount|Total)\s*(?:Paid)?\s*[:\-–]?\s*(?:Rs\.?\s*)?([\d,\.]+)/im);
    if (amountMatch) fields._challanAmount = amountMatch[1].trim();
  }

  // ========== TAX RECEIPT SPECIFIC ==========
  if (isTaxReceipt) {
    const propNoPatterns = [
      /(?:Property\s*No|मालमत्ता\s*क्र)\s*\.?\s*[:\-–]?\s*([A-Z\/\d\-]+)/im,
      /(?:Assessment\s*No)\s*\.?\s*[:\-–]?\s*([A-Z\/\d\-]+)/im,
    ];
    for (const pat of propNoPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) { fields.municipalPropertyNo = m[1].trim(); break; }
    }

    const municipalPatterns = [
      /(?:Municipal\s*(?:Corporation|Council)|महानगरपालिका|नगरपालिका)\s*[:\-–]?\s*([A-Za-z\s]+?)(?:\s*,|\s*\n|$)/im,
    ];
    for (const pat of municipalPatterns) {
      const m = text.match(pat);
      if (m && m[1]?.trim()) { fields.municipalCouncil = m[1].trim(); break; }
    }
  }

  // ========== POST-PROCESSING ==========
  // Clean up extracted values — remove extra whitespace, trim trailing punctuation
  for (const key of Object.keys(fields)) {
    if (typeof fields[key] === 'string') {
      fields[key] = fields[key]
        .replace(/\s+/g, ' ')
        .replace(/[,;:\-–]+$/, '')
        .trim();
      
      // Remove empty strings
      if (!fields[key]) delete fields[key];
    }
  }

  return fields;
}

/**
 * Main extraction function — takes a file path and returns extracted legal fields
 * @param {string} filePath - Path to the uploaded file
 * @param {string} originalName - Original filename
 * @returns {Promise<Object>} - { success, extractedFields, rawText, documentType }
 */
async function extractFromDocument(filePath, originalName = '') {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext !== '.pdf') {
      return {
        success: false,
        message: `File type "${ext}" not supported for text extraction. Please upload a PDF file.`,
        supportedTypes: ['.pdf'],
        extractedFields: {},
      };
    }

    const rawText = await extractTextFromPDF(filePath);
    
    if (!rawText || rawText.trim().length < 10) {
      return {
        success: true,
        message: 'PDF was read but contains very little or no extractable text. This may be a scanned image PDF. Please fill the fields manually.',
        extractedFields: {},
        rawTextPreview: rawText.substring(0, 200),
      };
    }

    const extractedFields = extractFieldsFromText(rawText, originalName);
    const fieldCount = Object.keys(extractedFields).length;

    // Detect document type for user feedback
    let documentType = 'Unknown Document';
    const lowerName = originalName.toLowerCase();
    const lowerText = rawText.toLowerCase();
    
    if (lowerName.includes('esearch') || lowerText.includes('esearch')) documentType = 'eSearch Receipt';
    else if (lowerName.includes('challan') || lowerText.includes('gras')) documentType = 'GRAS Challan';
    else if (lowerName.includes('sale') || lowerName.includes('deed') || lowerName.includes('kharedi')) documentType = 'Sale Deed / Conveyance';
    else if (lowerName.includes('agreement')) documentType = 'Agreement to Sale';
    else if (lowerName.includes('tax')) documentType = 'Property Tax Receipt';
    else if (lowerName.includes('index')) documentType = 'Index II';
    else if (lowerName.includes('oc') || lowerText.includes('occupancy')) documentType = 'Occupancy Certificate';
    else if (lowerName.includes('map') || lowerName.includes('layout')) documentType = 'Site Map / Layout Plan';

    return {
      success: true,
      message: fieldCount > 0
        ? `Successfully extracted ${fieldCount} field(s) from ${documentType}. Undetected fields are left blank for manual entry.`
        : `Document identified as ${documentType} but no specific fields could be extracted. Please fill the fields manually.`,
      documentType,
      extractedFields,
      extractedFieldNames: Object.keys(extractedFields),
      rawTextPreview: rawText.substring(0, 500),
    };
  } catch (err) {
    return {
      success: false,
      message: `Error reading document: ${err.message}`,
      extractedFields: {},
    };
  }
}

module.exports = { extractFromDocument, extractTextFromPDF, extractFieldsFromText };
