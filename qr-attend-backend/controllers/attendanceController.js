// controllers/attendanceController.js

import Attendance from '../models/Attendance.js';

/**
 * POST /attendance/mark
 * Marks attendance if user hasn't already marked today and QR code is fresh.
 */
export const mark = async (req, res) => {
  const { userId, timestamp } = req.body;

  // ✅ Validate QR freshness (5 minutes)
  const valid = Date.now() - timestamp < 5 * 60 * 1000;

  // ✅ Create today's start & end times
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // ✅ Check if attendance already exists today
    const alreadyMarked = await Attendance.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: '⚠️ Attendance already marked today' });
    }

    // ✅ Save new record
    const attendance = await Attendance.create({
      userId,
      date: new Date(),
      time: new Date(),
      isValid: valid
    });

    res.status(200).json({
      message: valid ? '✅ Attendance marked' : '❌ Late or invalid',
      attendance
    });
  } catch (err) {
    console.error('Attendance mark error:', err);
    res.status(500).json({ message: '❌ Server error while marking attendance' });
  }
};

/**
 * GET /attendance/all
 * Returns all attendance records.
 */
export const getAll = async (req, res) => {
  try {
    const records = await Attendance.find().populate('userId');
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: '❌ Error retrieving attendance records' });
  }
};
