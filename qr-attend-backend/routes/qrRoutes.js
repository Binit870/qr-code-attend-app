import express from 'express';
import { generateQR } from '../controllers/qrController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/generate', authenticate, generateQR);

export default router;
