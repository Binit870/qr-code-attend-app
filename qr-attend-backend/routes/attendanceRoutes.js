import express from 'express';
import { mark, getAll } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mark', mark);
router.get('/all', authenticate, getAll);

export default router;
