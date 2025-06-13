import QRCodeGenerator from './QRCodeGenerator';
import QRScanner from './QRScanner';

export default function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-700">
        Welcome, {user.name}
      </h1>

      {user.role === 'student' && (
        <div className="w-full max-w-sm bg-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Your QR Code</h2>
          <QRCodeGenerator />
        </div>
      )}

      {user.role === 'admin' && (
        <div className="w-full max-w-md bg-white p-6 rounded shadow mt-6 text-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Scan Student QR</h2>
          <QRScanner />
        </div>
      )}
    </div>
  );
}
