import { useState } from 'react';
import API from '../utils/api';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      return alert("⚠️ Please fill out both fields.");
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      alert("❌ Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Login to Your Account
        </h2>

        <input
          type="email"
          autoFocus
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={login}
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 px-4 rounded transition duration-300`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline font-semibold"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
