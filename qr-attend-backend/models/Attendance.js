import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  time: String,
  isValid: Boolean
});

export default mongoose.model('Attendance', attendanceSchema);
