import express from 'express';
import {
  getUserByEmail,
  createUser,
  updateUserHistory,
  updateUserReportData
} from '../controllers/userController.js';

const router = express.Router();

// Get user by email
router.get('/:email', getUserByEmail);

// Create a new user
router.post('/', createUser);

// Update user history
router.put('/:userId/history', updateUserHistory);

// Update user report data
router.put('/:userId/report-data', updateUserReportData);

export default router;