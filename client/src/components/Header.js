import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  // 2. TẠO BIẾN CHO TÊN VÀ CHỮ CÁI ĐẦU
  // Ghép họ và tên, xử lý trường hợp profile chưa có
  const fullName = userProfile ? `${userProfile.lastName} ${userProfile.firstName}`.trim() : null;
  // Lấy chữ cái đầu của tên, nếu không có thì lấy của email, cuối cùng là 'U'
  const userInitial = userProfile?.firstName ? userProfile.firstName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U');

  const headerRef = useGSAP((gsap, element) => {
    animations.slideInFromBottom(element);

    // Logo animation
    gsap.fromTo('.logo',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
    );

    // Navigation items stagger animation
    animations.staggerChildren(element, '.nav-item', 0.1);
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Dịch vụ', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Đối tác', path: '/partner' }
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="logo relative">
              <img
                src="/logo.png"
                alt="MyMaid"
                className="w-8 h-8 lg:w-10 lg:h-10 transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
              MyMaid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-neutral-700'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{user.displayName || 'User'}</span>
                  <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Hồ sơ
                    </Link>
                    <Link
                      to="/services"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Đặt dịch vụ
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 border-t border-neutral-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="px-4 pt-4 border-t border-neutral-200 space-y-2">
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{user.displayName || 'User'}</span>
                </div>
                <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    Đơn hàng của tôi
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    Hồ sơ
                  </Button>
                </Link>
                <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    Đơn hàng của tôi
                  </Button>
                </Link>
                <div onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                  <Button variant="danger" className="w-full justify-center">
                    Đăng xuất
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-neutral-200">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
