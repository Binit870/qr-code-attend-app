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
        console.error("QR generation error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-4">🔄 Generating QR code...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-4">❌ Failed to generate QR code</p>;
  }

  return (
    <div className="mt-4 flex justify-center">
      {qr && (
        <img
          src={qr}
          alt="QR Code"
          className="w-64 max-w-full rounded border shadow"
        />
      )}
    </div>
  );
}
