import React, { useState, useEffect, useRef, useCallback } from 'react';
import QrScanner from 'react-qr-scanner';
import API from '../utils/api'; // Your API utility

// This single component now handles both scanning and displaying records.
export default function QRScanner() {
  // State for the QR scanner
  const [message, setMessage] = useState('');
  const scanLock = useRef(false);

  // State for the attendance list
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Attendance List Logic ---

  // Function to fetch attendance data from the backend
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/attendance/all');
      // The backend sends pre-formatted date and time, so we use it directly.
      setRecords(res.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError('❌ Could not load attendance records.');
    } finally {
      setLoading(false);
    }
  }, []); // useCallback prevents re-creating this function on every render

  // useEffect to fetch data when the component first loads
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);


  // --- QR Scanner Logic ---

  const handleScan = async (data) => {
    if (!data || scanLock.current) return;
    scanLock.current = true; // Prevent multiple scans at once

    try {
      const parsed = JSON.parse(data.text || data);
      const res = await API.post('/attendance/mark', parsed);
      setMessage(res.data.message || '✅ Attendance marked!');
      
      // After a successful scan, refresh the attendance list
      if (res.status === 201 || res.status === 200) {
        fetchAttendance();
      }

    } catch (err) {
      console.error('Scan error:', err);
      const errorMessage = err.response?.data?.message || '❌ Invalid QR code';
      setMessage(errorMessage);
    } finally {
      // Reset the message and unlock the scanner after 3 seconds
      setTimeout(() => {
        setMessage('');
        scanLock.current = false;
      }, 3000);
    }
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
    setMessage('⚠️ Camera access error');
  };

  return (
    <div className="p-4 md:p-6">
      {/* --- QR Scanner Section --- */}
      <div className="mt-4 flex flex-col items-center">
        <div className="w-full max-w-xs sm:max-w-sm aspect-square overflow-hidden rounded-lg shadow-lg border-2 border-gray-300">
          <QrScanner
            delay={300}
            style={{ width: '100%', height: '100%' }}
            onError={handleError}
            onScan={handleScan}
            constraints={{ video: { facingMode: { ideal: 'environment' } } }}
          />
        </div>

        {message && (
          <div
            className={`mt-4 text-center text-base font-semibold px-4 py-2 rounded-md shadow-md 
              ${message.includes('✅') ? 'bg-green-100 text-green-800' : 
                message.includes('⚠️') ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}
          >
            {message}
          </div>
        )}
      </div>

      {/* --- Attendance List Section --- */}
      <div className="mt-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Attendance Records</h1>
            <p className="mt-2 text-sm text-gray-700">A list of all attendance records.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Valid QR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                    ) : error ? (
                      <tr><td colSpan="4" className="text-center py-4 text-red-500">{error}</td></tr>
                    ) : records.length > 0 ? (
                      records.map((record) => (
                        <tr key={record._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {record.userId?.name || 'Unknown User'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.formattedDate}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.formattedTime}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {record.isValid ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                No
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-sm text-gray-500">
                          No attendance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
