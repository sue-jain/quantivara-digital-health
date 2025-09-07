import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DoctorShell: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 hidden md:flex md:flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div style={{ backgroundColor: '#BBF1F1' }} className="p-2 rounded-full">
            <Stethoscope className="h-5 w-5 text-gray-800" />
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900">Doctor Portal</div>
            <div className="text-gray-600">Santhica</div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <Link to="/doctor" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive('/doctor') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/doctor/patients" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive('/doctor/patients') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Users className="h-4 w-4" /> Patients
          </Link>
          <Link to="/doctor/profile" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive('/doctor/profile') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Settings className="h-4 w-4" /> Profile
          </Link>
        </nav>

        <button onClick={handleLogout} className="mt-6 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorShell;


