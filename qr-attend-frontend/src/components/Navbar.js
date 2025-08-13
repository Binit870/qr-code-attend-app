// src/components/Navbar.js
import { BiQr } from "react-icons/bi";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-md px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
      {/* Logo + Title */}
      <div className="flex items-center gap-2">
        <BiQr className="text-[#008B8B] w-6 h-6 md:w-7 md:h-7" />
        <span className="text-lg md:text-xl font-bold text-[#008B8B]">
          QR Attendance
        </span>
      </div>

      {/* User Info + Logout */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {user.role === "admin" ? "🛠 Admin" : "🎓 Student"} | {user.name}
        </span>
        <button
          onClick={onLogout}
          className="bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-3 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
