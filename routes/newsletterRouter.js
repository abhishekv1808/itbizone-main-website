const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// Subscribe to newsletter
router.post('/api/newsletter/subscribe', newsletterController.subscribeNewsletter);

// Unsubscribe from newsletter
router.post('/api/newsletter/unsubscribe', newsletterController.unsubscribeNewsletter);

// Get all subscribers (for admin)
router.get('/api/newsletter/subscribers', newsletterController.getAllSubscribers);

module.exports = router;
