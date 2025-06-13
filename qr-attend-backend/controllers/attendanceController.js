import Attendance from '../models/Attendance.js';

export const mark = async (req, res) => {
  const { userId, timestamp } = req.body;
  const valid = Date.now() - timestamp < 5 * 60 * 1000;

  await Attendance.create({
    userId,
    date: new Date(),
    time: new Date().toTimeString(),
    isValid: valid
  });

  res.json({ message: valid ? 'Attendance marked' : 'Late or invalid' });
};

export const getAll = async (req, res) => {
  const records = await Attendance.find().populate('userId');
  res.json(records);
};
