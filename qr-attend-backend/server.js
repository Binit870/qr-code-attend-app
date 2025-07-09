import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import qrRoutes from './routes/qrRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

dotenv.config();
const app = express();

// ✅ Fix CORS: Allow specific origins including localhost and deployed frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://qr-code-attendace-app.netlify.app/'], // Add deployed frontend URL here if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ✅ Handle preflight requests properly
app.options('*', cors());

// ✅ Manual CORS Headers for Render
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // No wildcard!
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Instant response to preflight
  }
  next();
});


// ✅ Other middleware
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo DB connected"))
  .catch(err => console.error("Mongo connection error:", err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/attendance', attendanceRoutes);

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
