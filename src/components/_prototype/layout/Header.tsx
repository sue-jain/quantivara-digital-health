import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart, Activity, Search, ChevronDown, User, LogOut, Settings, LayoutDashboard, Stethoscope, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AbhaStatusBadge from '@/components/ui/AbhaStatusBadge';
import { useAbhaStatus } from '@/hooks/useAbhaStatus';

import RegisterModal from '@/components/auth/RegisterModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userType, isAuthenticated, logout, login } = useAuth();
  const { hasAbhaLinked, loading: abhaLoading } = useAbhaStatus();

  const navItems = [
    { href: '/about', label: 'About' },
    { href: '/technology', label: 'Technology' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    navigate('/login');
  };

  const homeHref = '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={homeHref} className="flex items-center space-x-2" onClick={(e)=>{ e.preventDefault(); navigate(homeHref); }}>
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-healthcare-blue-500 to-healthcare-green-500 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">
              Santhica
            </span>
          </Link>

          {/* Desktop Navigation - Only show for non-authenticated users */}
          {!isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-healthcare-blue-600",
                  isActiveRoute(item.href)
                    ? "text-healthcare-blue-600 bg-healthcare-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Demo Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Demo Features
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Investor Demo Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/demo" className="flex items-center gap-2 cursor-pointer font-medium">
                    <Activity className="h-4 w-4" />
                    Demo Hub
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/demo/abha-lookup" className="flex items-center gap-2 cursor-pointer">
                    <Search className="h-4 w-4" />
                    ABHA ID Lookup
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/demo/patient-lookup" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Patient Lookup
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/demo/analytics" className="flex items-center gap-2 cursor-pointer">
                    <Activity className="h-4 w-4" />
                    Real-time Analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/processor" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    AI Document Processor
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          )}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              // Hide avatar/menu on patient shell pages
              (userType === 'patient' && location.pathname.startsWith('/user')) ? null : (
              <>
                <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {userType === 'doctor' ? (
                          <Stethoscope className="h-4 w-4" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {!abhaLoading && userType === 'patient' && (
                              <AbhaStatusBadge hasAbhaLinked={hasAbhaLinked} size="sm" />
                            )}
                          </div>
                        )}
                        <span>{user?.firstName || user?.username}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userType === 'doctor' ? (
                      <>
                        <DropdownMenuLabel>Doctor Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4" />
                            Doctor Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/profile" className="flex items-center gap-2 cursor-pointer">
                            <Settings className="h-4 w-4" />
                            Doctor Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/patients" className="flex items-center gap-2 cursor-pointer">
                            <Search className="h-4 w-4" />
                            Patients
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/patients" className="flex items-center gap-2 cursor-pointer">
                            <Search className="h-4 w-4" />
                            Patient Lookup
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <FileText className="h-4 w-4" />
                            Consultations
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/doctor/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <Stethoscope className="h-4 w-4" />
                            Prescriptions
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuLabel className="flex items-center justify-between">
                          <span>My Account</span>
                          {!abhaLoading && (
                            <AbhaStatusBadge hasAbhaLinked={hasAbhaLinked} size="sm" showText />
                          )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/user/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4" />
                            My Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/user/profile" className="flex items-center gap-2 cursor-pointer">
                            <User className="h-4 w-4" />
                            My Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/user/settings" className="flex items-center gap-2 cursor-pointer">
                            <Settings className="h-4 w-4" />
                            Profile Settings
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
              )
            ) : (
              <>
                <div style={{ position: 'relative' }}>
                  <Button variant="outline" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
                <Button asChild>
                  <Link to="/contact">Request Demo</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {/* Only show marketing navigation for non-authenticated users */}
            {!isAuthenticated && (
              <>
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? "text-healthcare-blue-600 bg-healthcare-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              <div className="px-3 py-2 text-sm font-semibold text-gray-500">Demo Features</div>
              <Link
                to="/demo"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Demo Hub
              </Link>
              <Link
                to="/demo/abha-lookup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                ABHA ID Lookup
              </Link>
              <Link
                to="/demo/patient-lookup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Patient Lookup
              </Link>
              <Link
                to="/demo/analytics"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Real-time Analytics
              </Link>
              <Link
                to="/processor"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Document Processor
              </Link>
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { navigate(homeHref); setIsMenuOpen(false); }}>Home</Button>
                    {userType === 'doctor' ? (
                      <>
                        <Button className="w-full" asChild>
                          <Link to="/doctor/dashboard" onClick={() => setIsMenuOpen(false)}>
                            Doctor Dashboard
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/doctor/profile" onClick={() => setIsMenuOpen(false)}>
                            Doctor Profile
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/doctor/patients" onClick={() => setIsMenuOpen(false)}>
                            Patient Lookup
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/doctor/consultations" onClick={() => setIsMenuOpen(false)}>
                            Consultations
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full" asChild>
                          <Link to="/user/dashboard" onClick={() => setIsMenuOpen(false)}>
                            My Dashboard
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/user/profile" onClick={() => setIsMenuOpen(false)}>
                            My Profile
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/user/settings" onClick={() => setIsMenuOpen(false)}>
                            Profile Settings
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/user/documents" onClick={() => setIsMenuOpen(false)}>
                            My Documents
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/user/care-team" onClick={() => setIsMenuOpen(false)}>
                            My Care Team
                          </Link>
                        </Button>
                      </>
                    )}
                    <Button variant="outline" className="w-full" onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" asChild>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                <Button className="w-full" asChild>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    Request Demo
                  </Link>
                </Button>
                  </>
                )}
              </div>
            </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Removed inline login overlay - using /login page now */}

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
};

export default Header;
