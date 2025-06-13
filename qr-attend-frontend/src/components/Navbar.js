// src/components/Navbar.js
export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold text-blue-600">QR Attendance</div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user.role === 'admin' ? '🛠 Admin' : '🎓 Student'} | {user.name}
        </span>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
