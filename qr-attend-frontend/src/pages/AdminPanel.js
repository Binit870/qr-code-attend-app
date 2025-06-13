import { useEffect, useState } from 'react';
import API from '../utils/api';

export default function AdminPanel() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/attendance/all')
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("Error loading attendance:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Attendance Records</h2>

      {loading ? (
        <p className="text-center text-gray-600">🔄 Loading attendance data...</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-600">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded shadow-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 text-sm">Name</th>
                <th className="p-2 text-sm">Date</th>
                <th className="p-2 text-sm">Time</th>
                <th className="p-2 text-sm">Valid</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr
                  key={idx}
                  className={`text-center text-sm ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="p-2">{rec.userId?.name || '—'}</td>
                  <td className="p-2">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className="p-2">{rec.time}</td>
                  <td className="p-2">{rec.isValid ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
