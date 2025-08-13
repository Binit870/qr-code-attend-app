import Attendance from '../models/Attendance.js';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const QR_VALID_MS = 5 * 60 * 1000;

export const mark = async (req, res) => {
  const { userId, timestamp } = req.body;
  if (!userId || !timestamp) {
    return res.status(400).json({ message: '❌ Missing userId or timestamp' });
  }

  const nowUTC = new Date();
  const isValid = (Date.now() - timestamp) < QR_VALID_MS;

  // Create a robust dayKey for the IST timezone. This is critical for the
  // unique index to work correctly.
  const istTime = new Date(nowUTC.getTime() + IST_OFFSET_MS);
  const yyyy = istTime.getUTCFullYear();
  const mm = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(istTime.getUTCDate()).padStart(2, '0');
  const dayKey = `${yyyy}-${mm}-${dd}`;

  try {
    // This check is fast, but the database index is the ultimate guarantee.
    const existingRecord = await Attendance.findOne({ userId, dayKey });
    if (existingRecord) {
      return res.status(200).json({ message: '⚠️ Attendance already marked for today' });
    }

    const attendance = await Attendance.create({
      userId,
      date: nowUTC,
      isValid,
      dayKey
    });

    return res.status(201).json({
      message: isValid ? '✅ Attendance marked successfully' : '❌ Late or invalid QR code',
      attendance
    });
  } catch (err) {
    // If the DB index catches a duplicate (race condition), treat as "already marked".
    if (err?.code === 11000) {
      return res.status(200).json({ message: '⚠️ Attendance already marked for today' });
    }
    
    console.error('Attendance mark error:', err);
    return res.status(500).json({ message: '❌ Server error while marking attendance' });
  }
};

export const getAll = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 }).populate('userId');

    const formattedRecords = records.map(r => {
      const obj = r.toObject();
      const recordDateUTC = r.date ? new Date(r.date) : null;

      if (!recordDateUTC || isNaN(recordDateUTC.getTime())) {
          obj.formattedDate = 'N/A';
          obj.formattedTime = 'Invalid Time';
          return obj;
      }

      // Manually calculate and format IST date and time to send to the frontend.
      const istTime = new Date(recordDateUTC.getTime() + IST_OFFSET_MS);

      const year = istTime.getUTCFullYear();
      const month = istTime.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
      const day = istTime.getUTCDate();
      obj.formattedDate = `${day} ${month} ${year}`;

      let hours = istTime.getUTCHours();
      const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
      const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      obj.formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
        
      return obj;
    });

    res.status(200).json(formattedRecords);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: '❌ Error retrieving attendance records' });
  }
};