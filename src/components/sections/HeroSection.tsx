
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowDown, CheckCircle2, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-healthcare-blue-50 via-white to-healthcare-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-healthcare-orange-200 rounded-full opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-healthcare-green-200 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-healthcare-blue-200 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-healthcare-blue-100 text-healthcare-blue-700 rounded-full text-sm font-medium">
              🚀 Transforming Healthcare in India
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight">
                Care That{' '}
                <span className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 bg-clip-text text-transparent">
                  Connects
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                AI-Powered Healthcare Platform Bridging Rural and Urban India
              </p>
              <p className="text-lg text-gray-500 max-w-xl">
                Connect every corner of India with equitable, intelligent healthcare through our mobile-first platform powered by AI handwriting recognition.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-healthcare-green-500" />
                <span className="text-sm font-medium text-gray-700">Mobile-First Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-healthcare-green-500" />
                <span className="text-sm font-medium text-gray-700">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-healthcare-green-500" />
                <span className="text-sm font-medium text-gray-700">Offline Capable</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-healthcare-green-500" />
                <span className="text-sm font-medium text-gray-700">Fully Interoperable</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-blue-700 hover:from-healthcare-blue-700 hover:to-healthcare-blue-800" asChild>
                <Link to="/contact">
                  Request Demo
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-healthcare-blue-200 text-healthcare-blue-700 hover:bg-healthcare-blue-50">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 space-y-2">
              <p className="text-sm text-gray-500">Trusted by healthcare providers across India</p>
              <div className="flex items-center space-x-8 text-xs text-gray-400">
                <span>🏥 500+ Hospitals</span>
                <span>👨‍⚕️ 10,000+ Doctors</span>
                <span>🧬 1,000+ Labs</span>
                <span>💊 5,000+ Pharmacies</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative z-10">
              {/* Main Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-healthcare-blue-100 to-healthcare-green-100 rounded-3xl p-8 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl p-6 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-healthcare-blue-500 to-healthcare-green-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-3xl">🏥</span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-800">
                      Healthcare Connectivity
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connecting doctors, patients, pharmacies, and labs across India
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-healthcare-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">99.9% Uptime</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg animate-scale-in" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-healthcare-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">AI-Powered</span>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-healthcare-blue-200 to-healthcare-green-200 rounded-3xl blur-3xl opacity-30 scale-110"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-gray-400" />
      </div>
    </section>
  );
};

export default HeroSection;
