import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FlaskConical, Users, LayoutDashboard, LogOut } from 'lucide-react';

const LabShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('lab_session_token');
    localStorage.removeItem('lab_info');
    navigate('/login');
  };

  const labInfo = (() => {
    try {
      const raw = localStorage.getItem('lab_info');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r p-4 hidden md:flex md:flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div style={{ backgroundColor: '#BBF1F1' }} className="p-2 rounded-full">
            <FlaskConical className="h-5 w-5 text-gray-800" />
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900 truncate max-w-[11rem]" title={labInfo?.name || 'Lab'}>{labInfo?.name || 'Lab'}</div>
            <div className="text-gray-600 text-xs">{labInfo?.hfrUid ? `HFR: ${labInfo.hfrUid}` : 'Santhica'}</div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <Link to="/lab" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive('/lab') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/lab/patients" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive('/lab/patients') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Users className="h-4 w-4" /> Patients
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>

      </aside>

      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default LabShell;


