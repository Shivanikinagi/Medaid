import express from 'express';
import {
  startConsultation,
  processClarification,
  generateReport
} from '../controllers/consultationController.js';

const router = express.Router();

// Start a new consultation
router.post('/start', startConsultation);

// Process clarification questions
router.post('/clarification', processClarification);

// Generate PDF report
router.post('/report', generateReport);

export default router;