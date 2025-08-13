import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import qrRoutes from './routes/qrRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

dotenv.config();
const app = express();

// ✅ Allowed origins without trailing slash
const allowedOrigins = [
  'http://localhost:3000',
  'https://qr-code-attendace-app.netlify.app'
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo connection error:", err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/attendance', attendanceRoutes);

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
