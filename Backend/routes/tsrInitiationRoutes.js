const express = require('express');
const router = express.Router();
const { 
  uploadAndExtract, 
  createTSRInitiation, 
  getTSRInitiations, 
  getTSRInitiationById, 
  updateTSRInitiation, 
  deleteTSRInitiation 
} = require('../controllers/tsrInitiationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// POST: Upload document and extract text (does not save to DB)
router.post('/upload-extract', protect, upload.single('file'), uploadAndExtract);

// CRUD operations
router.post('/create', protect, createTSRInitiation);
router.get('/list', protect, getTSRInitiations);
router.get('/:id', protect, getTSRInitiationById);
router.put('/:id', protect, updateTSRInitiation);
router.delete('/:id', protect, deleteTSRInitiation);

module.exports = router;
