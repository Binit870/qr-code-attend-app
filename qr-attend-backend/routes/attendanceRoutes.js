// routes/attendanceRoutes.js
import express from 'express';
import { mark, getAll } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin scans QR → Mark attendance
router.post('/mark', authenticate, mark);

// Admin views all attendance records
router.get('/all', authenticate, getAll);

export default router;
