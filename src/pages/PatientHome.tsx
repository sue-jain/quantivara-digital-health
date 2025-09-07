import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const PatientHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header strip inside shell content */}
      <section className="py-10 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Welcome back, {user?.firstName || user?.username}!
            </h1>
            <p className="text-blue-100">Quick access to your core actions</p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            <Link to="/user/dashboard" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-healthcare-blue-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-healthcare-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-healthcare-blue-200 transition-colors">
                  <LayoutDashboard className="h-6 w-6 text-healthcare-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600 text-sm">View your health overview and recent activity</p>
              </div>
            </Link>

            <Link to="/processor" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-healthcare-green-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-healthcare-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-healthcare-green-200 transition-colors">
                  <FileText className="h-6 w-6 text-healthcare-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
                <p className="text-gray-600 text-sm">Upload medical documents for AI analysis</p>
              </div>
            </Link>

            <Link to="/user/settings" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-orange-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
                <p className="text-gray-600 text-sm">Update your details and preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientHome;


