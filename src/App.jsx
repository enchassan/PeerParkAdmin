import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Spots from './pages/Spots.jsx';
import Verifications from './pages/Verifications.jsx';
import Bookings from './pages/Bookings.jsx';

function ProtectedLayout() {
  const token = localStorage.getItem('peerpark_admin_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen flex-col xl:flex-row">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-5 lg:p-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/spots" element={<Spots />} />
              <Route path="/verifications" element={<Verifications />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}