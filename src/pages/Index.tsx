
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import SolutionSection from '@/components/sections/SolutionSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building, Heart, LayoutDashboard, User, FileText, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user, userType } = useAuth();

  // If user is authenticated, show role-based home page
  if (isAuthenticated && userType === 'patient') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Personalized Welcome Section */}
        <section className="py-16 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Welcome back, {user?.firstName || user?.username}! 👋
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Manage your health records, upload documents, and connect with your care team
              </p>
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
                Everything you need to manage your health records
              </p>
            </div>

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

              {/* Profile Settings Quick Action */}
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



        <Footer />
      </div>
    );
  }

  if (isAuthenticated && userType === 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Doctor Welcome Section */}
        <section className="py-16 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Welcome, Dr. {user?.lastName || user?.username}
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Access your practice dashboard and patient tools
              </p>
            </div>
          </div>
        </section>

        {/* Doctor Quick Actions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <p className="text-lg text-gray-600">Navigate your core tools</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
              <Link to="/doctor/dashboard" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-healthcare-blue-300 h-full flex flex-col">
                  <div className="w-12 h-12 bg-healthcare-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-healthcare-blue-200 transition-colors">
                    <LayoutDashboard className="h-6 w-6 text-healthcare-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctor Dashboard</h3>
                  <p className="text-gray-600 text-sm">View your patients and tools</p>
                </div>
              </Link>

              <Link to="/doctor/patients" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-healthcare-green-300 h-full flex flex-col">
                  <div className="w-12 h-12 bg-healthcare-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-healthcare-green-200 transition-colors">
                    <User className="h-6 w-6 text-healthcare-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Lookup</h3>
                  <p className="text-gray-600 text-sm">Search and request consent</p>
                </div>
              </Link>

              <Link to="/doctor/profile" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-orange-300 h-full flex flex-col">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <Settings className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
                  <p className="text-gray-600 text-sm">Update professional details</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // If user is not authenticated, show the original marketing page
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Problem Statement */}
      <ProblemSection />
      
      {/* Solution Overview */}
      <SolutionSection />
      
      {/* Testimonials */}
      <TestimonialsSection />

      {/* Market Opportunity */}
      <section className="py-20 bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              A $11+ Billion Market Opportunity
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              India's healthcare market is growing at 35% CAGR, driven by digital transformation and rural accessibility needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold">1.4B</div>
              <p className="text-blue-100">People in India needing healthcare access</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Building className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold">70K+</div>
              <p className="text-blue-100">Hospitals, majority still paper-based</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold">35%</div>
              <p className="text-blue-100">Annual growth rate in healthtech</p>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="bg-white text-healthcare-blue-900 hover:bg-gray-100" asChild>
              <Link to="/about">
                Learn About Our Mission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Ready to Transform Healthcare in India?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of healthcare providers already using Quantivara to deliver better care across rural and urban India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 hover:from-healthcare-blue-700 hover:to-healthcare-green-700" asChild>
                <Link to="/contact">
                  Request Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
