import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function AdminPanel() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/attendance/all')
      .then((res) => {
        // DEBUG: Log the API response to the console to check its structure.
        console.log('API Response:', res.data); 
        setRecords(res.data);
      })
      .catch((err) => {
        console.error("Error loading attendance:", err);
        setError("Failed to load records.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mt-6 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Attendance Records</h2>

      {loading ? (
        <p className="text-center text-gray-600">🔄 Loading attendance data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-600">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Valid QR</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rec.userId?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {/* FIX: Use the pre-formatted date from the API */}
                    {rec.formattedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {/* FIX: Use the pre-formatted time from the API */}
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