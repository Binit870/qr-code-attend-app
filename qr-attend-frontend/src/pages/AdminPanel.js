import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function AdminPanel() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/attendance/all')
      .then((res) => {
        console.log('API Response:', res.data);
        setRecords(res.data);
      })
      .catch((err) => {
        console.error('Error loading attendance:', err);
        setError('Failed to load records.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mt-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#008B8B]">
        Attendance Records
      </h2>

      {loading ? (
        <p className="text-center text-[#008B8B]">🔄 Loading attendance data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-600">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-[#008B8B]/30">
          <table className="min-w-full divide-y divide-[#008B8B]/20">
            <thead className="bg-[#008B8B]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Valid QR
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((rec) => (
                <tr key={rec._id} className="hover:bg-[#008B8B]/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rec.userId?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {rec.formattedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {rec.formattedTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {rec.isValid ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
