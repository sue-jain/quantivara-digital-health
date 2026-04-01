import { Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="bg-[#1e3a5f] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <img
              src="/slide1_Picture 3.png"
              alt="Santhica"
              className="h-10 w-auto brightness-200"
            />
            <span className="text-sm text-gray-300">care that connects</span>
          </div>

          {/* Contact + social */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="mailto:support@santhica.com"
              className="text-gray-300 hover:text-white transition-colors"
            >
              support@santhica.com
            </a>
            <a
              href="https://www.linkedin.com/company/santhica/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>&copy; 2026 Santhica, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
