import QrScanner from 'react-qr-scanner';
import API from '../utils/api';
import { useState, useRef } from 'react';

export default function QRScanner() {
  const [message, setMessage] = useState('');
  const scanLock = useRef(false); // 🔒 Lock to prevent multiple scans

  const handleScan = async (data) => {
    if (!data || scanLock.current) return;

    try {
      const parsed = JSON.parse(data.text || data);

      scanLock.current = true; // Lock further scans
      await API.post('/attendance/mark', parsed);
      setMessage('✅ Attendance marked!');
    } catch (err) {
      console.error("Scan error:", err);
      setMessage('❌ Invalid QR code');
    }

    setTimeout(() => {
      setMessage('');
      scanLock.current = false; // Unlock after 3 seconds
    }, 3000);
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
    setMessage('⚠️ Camera access error');
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <div className="w-full max-w-sm aspect-square overflow-hidden rounded shadow-md border border-gray-300">
        <QrScanner
          delay={300}
          style={{ width: '100%' }}
          onError={handleError}
          onScan={handleScan}
          constraints={{
            video: {
              facingMode: { ideal: 'environment' },
            }
          }}
        />
      </div>

      {message && (
        <div className="mt-4 text-center text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
    </div>
  );
}
