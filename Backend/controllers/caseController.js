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

    if (search) {
      // Find matching clients
      const clients = await Client.find({ name: { $regex: search, $options: 'i' } });
      const clientIds = clients.map(c => c._id);

      // Find matching properties
      const properties = await Property.find({
        $or: [
          { address: { $regex: search, $options: 'i' } },
          { surveyNo: { $regex: search, $options: 'i' } },
          { village: { $regex: search, $options: 'i' } },
          { taluka: { $regex: search, $options: 'i' } },
          { district: { $regex: search, $options: 'i' } }
        ]
      });
      const propertyIds = properties.map(p => p._id);

      filter.$or = [
        { caseId: { $regex: search, $options: 'i' } },
        { bank: { $regex: search, $options: 'i' } },
        { assignedTo: { $regex: search, $options: 'i' } },
        { clientId: { $in: clientIds } },
        { propertyId: { $in: propertyIds } }
      ];
    }

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
