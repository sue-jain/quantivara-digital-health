
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-healthcare-blue-500 to-healthcare-green-500 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl">Quantivara</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Care That Connects - AI-powered healthcare platform bridging rural and urban India with intelligent, mobile-first solutions.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links - Placeholder for now */}
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-healthcare-blue-600 transition-colors cursor-pointer">
                <span className="text-xs">Li</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-healthcare-blue-600 transition-colors cursor-pointer">
                <span className="text-xs">Tw</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-healthcare-blue-600 transition-colors cursor-pointer">
                <span className="text-xs">Fb</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Solutions</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">For Doctors</li>
              <li className="text-gray-300 text-sm">For Patients</li>
              <li className="text-gray-300 text-sm">For Pharmacies</li>
              <li className="text-gray-300 text-sm">For Labs</li>
              <li className="text-gray-300 text-sm">Rural Healthcare</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-healthcare-blue-400" />
                <span className="text-gray-300 text-sm">hello@quantivara.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-healthcare-blue-400" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-healthcare-blue-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Pan-India Operations<br />
                  Mumbai • Delhi • Bangalore • Kolkata
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Quantivara. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="text-gray-400 hover:text-white text-sm transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
