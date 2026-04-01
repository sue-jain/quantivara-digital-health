import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Building, 
  Stethoscope, 
  LayoutDashboard, 
  User, 
  FileText, 
  Settings,
  Search,
  Calendar,
  Bell,
  Heart
} from 'lucide-react';
// import Header from '@/components/layout/Header';
import santhicaLogo from '@/assets/santhica-logo.png';

const DoctorHome: React.FC = () => {
  const { isAuthenticated, user, userType } = useAuth();

  if (!isAuthenticated || userType !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to doctors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      
      {/* Personalized Welcome Section */}
      <section className="py-16 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Welcome back, Dr. {user?.lastName}! 👨‍⚕️
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Manage your patients, review consultations, and provide quality healthcare
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                <span>{user?.hospitalName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                <span>{user?.specialty}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your practice and patients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link to="/doctor/dashboard" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-healthcare-blue-300">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                  <LayoutDashboard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600 text-sm mb-4">View your patients and practice overview</p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/doctor/patients" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-healthcare-green-300">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Lookup</h3>
                <p className="text-gray-600 text-sm mb-4">Search for patients by ABHA ID</p>
                <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                  Search Patients
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/doctor/consultations" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-purple-300">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultations</h3>
                <p className="text-gray-600 text-sm mb-4">Review and manage consultations</p>
                <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                  View Consultations
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/doctor/prescriptions" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-red-300">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4 group-hover:bg-red-200 transition-colors">
                  <Stethoscope className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Prescriptions</h3>
                <p className="text-gray-600 text-sm mb-4">Create and manage prescriptions</p>
                <div className="flex items-center text-red-600 text-sm font-medium group-hover:text-red-700">
                  Manage Prescriptions
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Practice Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Practice Overview
            </h2>
            <p className="text-lg text-gray-600">
              Your practice at a glance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">12</h3>
              <p className="text-gray-600">Active Patients</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">8</h3>
              <p className="text-gray-600">Today's Appointments</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
              <p className="text-gray-600">Pending Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <p className="text-lg text-gray-600">
              Your latest patient interactions
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New patient consent received</p>
                <p className="text-sm text-gray-600">Suresh Patel has given consent to share medical records</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Lab results ready</p>
                <p className="text-sm text-gray-600">Ramesh Kumar's blood test results are available</p>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Prescription completed</p>
                <p className="text-sm text-gray-600">Prescription for Priya Sharma has been finalized</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to provide quality healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Access your dashboard to manage patients, review consultations, and provide the best care possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/doctor/dashboard">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/doctor/patients">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                <Search className="h-5 w-5 mr-2" />
                Lookup Patient
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorHome;
