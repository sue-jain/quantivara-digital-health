import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart, Activity, Search, ChevronDown, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ProfessionalLoginModal from '@/components/auth/ProfessionalLoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const HeaderNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showHeaderLogin, setShowHeaderLogin] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, login } = useAuth();

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

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleHeaderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      await login(loginUsername, loginPassword);
      setShowHeaderLogin(false);
      setLoginUsername('');
      setLoginPassword('');
    } catch (error) {
      setLoginError('Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
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
              <>
                <Button variant="outline" asChild>
                  <Link to="/">Home</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.firstName || user?.username}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Home
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/profile" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button asChild>
                  <Link to="/processor">AI Processor</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
                  Login
                </Button>
                <Button onClick={() => setShowRegisterModal(true)}>
                  Sign Up
                </Button>
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
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        Home
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/user/dashboard" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/user/profile" onClick={() => setIsMenuOpen(false)}>
                        Profile
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/processor" onClick={() => setIsMenuOpen(false)}>
                        AI Processor
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" onClick={() => {
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }}>
                      Login
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => {
                      setShowRegisterModal(true);
                      setIsMenuOpen(false);
                    }}>
                      Sign Up
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

      {/* Compact Header Login Form */}
      {showHeaderLogin && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '20px',
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          zIndex: 50,
          minWidth: '300px'
        }}>
          <form onSubmit={handleHeaderLogin}>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            {loginError && (
              <div style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>
                {loginError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                  opacity: isLoggingIn ? 0.6 : 1
                }}
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setShowHeaderLogin(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modals */}
      <ProfessionalLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
};

export default HeaderNew;
