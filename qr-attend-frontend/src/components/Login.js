import { useState } from 'react';
import { MdQrCode2 } from 'react-icons/md';
import API from '../utils/api';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      return alert('⚠️ Please fill out both fields.');
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      alert('❌ Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Branding Section */}
      <div className="flex flex-col items-center justify-center bg-[#008B8B] text-white p-6 md:w-1/2">
        <MdQrCode2 className="text-white w-20 h-20 md:w-32 md:h-32 mb-4" />
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center">
          QR Attendance
        </h1>
        <p className="text-sm md:text-lg text-center max-w-xs md:max-w-md">
          Secure and quick login to manage your attendance with ease.
        </p>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-[#008B8B]">
            Login to Your Account
          </h2>

          <input
            type="email"
            autoFocus
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
          />

          <button
            onClick={login}
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-cyan-400' : 'bg-[#008B8B] hover:bg-[#006d6d]'
            } text-white font-semibold py-2 px-4 rounded transition duration-300`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#008B8B] hover:underline font-semibold"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
