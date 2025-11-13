const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// Create a new quotation
router.post('/api/quotations', quotationController.createQuotation);

// Get quotation by ID (API)
router.get('/api/quotations/:id', quotationController.getQuotation);

// Get quotation page (view)
router.get('/quotation/:id', quotationController.getQuotationPage);

// Download quotation as PDF
router.get('/quotation/:id/download', quotationController.downloadQuotationPDF);

// Get all quotations (admin)
router.get('/api/quotations', quotationController.getAllQuotations);

// Update quotation status
router.put('/api/quotations/:id/status', quotationController.updateQuotationStatus);

module.exports = router;
