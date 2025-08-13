import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },      // Single UTC timestamp when marked
  isValid: { type: Boolean, default: true },
  dayKey: { type: String, required: true }  // 'YYYY-MM-DD' in IST
}, { timestamps: true });

// DB-level uniqueness: one document per userId per IST day.
// This is the main guard against duplicate entries.
attendanceSchema.index({ userId: 1, dayKey: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
