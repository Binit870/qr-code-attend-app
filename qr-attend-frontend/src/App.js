import { useState } from 'react';
import Login from './components/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';

function App() {
  // Load user from localStorage on first render (persistent login)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 🧼 clear user data
    setUser(null);
  };

  // Show Login or Register when not authenticated
  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        onLogin={(user) => {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Main authenticated view
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="p-4 sm:p-6">
        <Dashboard user={user} />
        {user.role === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

export default App;
