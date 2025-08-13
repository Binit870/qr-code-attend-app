import { useEffect, useState } from 'react';
import API from '../utils/api';

export default function QRCodeGenerator() {
  const [qr, setQr] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get('/qr/generate')
      .then((res) => {
        setQr(res.data.qr);
        setLoading(false);
      })
      .catch((err) => {
        console.error('QR generation error:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="text-center text-[#008B8B] font-medium mt-4">
        🔄 Generating your QR code...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium mt-4">
        ❌ Failed to generate QR code
      </p>
    );
  }

  return (
    <div className="mt-4 flex justify-center">
      {qr && (
        <img
          src={qr}
          alt="QR Code"
          className="w-64 max-w-full rounded-lg border border-gray-200 shadow-md p-2 bg-white"
        />
      )}
    </div>
  );
}
