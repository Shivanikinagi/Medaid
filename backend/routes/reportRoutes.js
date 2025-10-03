import express from 'express';
import { upload, processReport, generateReportExplanation, analyzeSymptomsFromReport } from '../controllers/reportController.js';

const router = express.Router();

// Process uploaded medical report
router.post('/process', upload.single('report'), processReport);

// Generate report explanation
router.post('/explanation', generateReportExplanation);

// Analyze symptoms from report
router.post('/analyze', analyzeSymptomsFromReport);

export default router;