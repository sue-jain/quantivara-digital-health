import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, FlaskConical, Settings, User as UserIcon, Home, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAbhaStatus } from '@/hooks/useAbhaStatus';
import AbhaStatusBadge from '@/components/ui/AbhaStatusBadge';

const PatientShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { hasAbhaLinked } = useAbhaStatus();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
      isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r min-h-screen p-4 sticky top-0 flex flex-col">
          {/* Profile avatar block (replaces top-right avatar) */}
          <button onClick={()=>navigate('/user/profile')} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 text-left mb-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                {(user?.firstName?.[0] || user?.username?.[0] || '?').toUpperCase()}
              </div>
              <div className="absolute -bottom-0 -right-0 translate-x-1/4 translate-y-1/4 pointer-events-none">
                <AbhaStatusBadge hasAbhaLinked={hasAbhaLinked} size="xs" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 font-medium truncate">{user?.firstName || user?.username}</div>
              <div className="text-xs text-gray-500 truncate">{hasAbhaLinked ? 'ABHA Linked' : 'ABHA Pending'}</div>
            </div>
          </button>
          <button onClick={()=>navigate('/user')} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 mb-3"><Home className="h-4 w-4"/> Home</button>
          <nav className="space-y-1">
            <NavLink to="/user/dashboard" className={linkClass} end>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </NavLink>
            <NavLink to="/user/documents" className={linkClass}>
              <FileText className="h-4 w-4" /> Documents
            </NavLink>
            <NavLink to="/user/care-team" className={linkClass}>
              <Users className="h-4 w-4" /> Care Team
            </NavLink>
            <NavLink to="/user/lab-tests" className={linkClass}>
              <FlaskConical className="h-4 w-4" /> Lab Tests
            </NavLink>
            <NavLink to="/user/visits" className={linkClass}>
              <Calendar className="h-4 w-4" /> Visits
            </NavLink>
            <NavLink to="/user/settings" className={linkClass}>
              <Settings className="h-4 w-4" /> Profile Settings
            </NavLink>
            <button onClick={async()=>{ await logout(); navigate('/'); }} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 w-full">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
          
        </aside>

        {/* Content */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientShell;


