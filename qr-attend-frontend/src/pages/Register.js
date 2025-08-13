import { useState } from 'react';
import { MdQrCode2 } from 'react-icons/md';
import API from '../utils/api';

export default function Register({ onSwitchToLogin }) {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!data.name || !data.email || !data.password) {
      return alert('⚠️ Please fill out all fields.');
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/register', data);
      alert(`✅ ${res.data.message || 'Registered successfully!'}`);
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      alert('❌ Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Branding Section */}
      <div className="flex flex-col items-center justify-center bg-green-600 text-white p-6 md:w-1/2">
        <MdQrCode2 className="text-white w-20 h-20 md:w-32 md:h-32 mb-4" />
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center">
          QR Attendance
        </h1>
        <p className="text-sm md:text-lg text-center max-w-xs md:max-w-md">
          Fast, secure, and simple attendance marking with QR codes.
        </p>
      </div>

      {/* Registration Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-green-700">
            Create an Account
          </h2>

          <input
            autoFocus
            placeholder="Name"
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <select
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setData({ ...data, role: e.target.value })}
          >
            <option value="student">🎓 Student</option>
            <option value="admin">🛠 Admin</option>
          </select>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
            } text-white font-semibold py-2 px-4 rounded transition duration-300`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
