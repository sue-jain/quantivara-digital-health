import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/slide1_Picture 3.png" alt="Santhica" className="h-10 w-auto" />
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-500">
            <Link to="/privacy-policy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: {lastUpdated}</p>
        <div className="prose prose-neutral max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p]:mb-4 [&_ul]:text-[15px] [&_ul]:leading-relaxed [&_ul]:text-gray-700 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1.5">
          {children}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Santhica, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
