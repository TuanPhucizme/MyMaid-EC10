import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useAuth } from '../context/AuthContext';

// 1. Tách riêng các thành phần nhỏ hơn (helper components/functions)

// Component Logo
const Logo = () => (
  <Link to="/" className="flex items-center space-x-3 group no-underline"> {/* Thêm no-underline ở đây */}
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
);

// Component Thanh điều hướng trên Desktop
const DesktopNav = ({ navItems, location }) => (
  <nav className="hidden lg:flex items-center space-x-8">
    {navItems.map((item) => (
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
);

// Component Menu người dùng Dropdown
// Thêm prop isPartner và isAdmin
const UserDropdown = ({ fullName, userInitial, setIsUserMenuOpen, isUserMenuOpen, handleLogout, isPartner, isAdmin }) => {
  // Xác định đường dẫn dựa trên vai trò
  const profilePath = isPartner ? '/profile' : '/profile';
  const ordersPath = isPartner ? '/dashboard-partner' : '/my-orders';

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
          {userInitial}
        </div>
        <span className="text-sm font-medium text-neutral-700">
          {fullName}
        </span>
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
          <Link to={ordersPath} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
            {isPartner ? 'Quản lý Dịch vụ' : 'Dịch vụ của tôi'} {/* Thay đổi text cho rõ ràng hơn */}
          </Link>
          <Link to={profilePath} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
            {isPartner ? 'Hồ sơ đối tác' : 'Hồ sơ'} {/* Thay đổi text cho rõ ràng hơn */}
          </Link>
          <Link to="/services" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
            Đặt dịch vụ
          </Link>
          {/* Admin button - chỉ hiển thị cho admin */}
          {isAdmin && (
            <Link to="/admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium">
              🛠️ Quản trị viên
            </Link>
          )}
          {/* Đã loại bỏ một link 'Dịch vụ của tôi' trùng lặp */}
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
  );
};

// Component Các nút xác thực (Đăng nhập/Đăng ký)
const AuthButtons = () => (
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
);

// Component Nút mở/đóng menu Mobile
const MobileMenuButton = ({ isMobileMenuOpen, toggleMobileMenu }) => (
  <button
    onClick={toggleMobileMenu}
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
);

// Component Thanh điều hướng trên Mobile
// Thêm prop isPartner và isAdmin
const MobileNav = ({ navItems, location, user, userProfile, handleLogout, closeMobileMenu, isPartner, isAdmin }) => {
  const mobileUserInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';

  // Xác định đường dẫn dựa trên vai trò
  const profilePath = isPartner ? '/dashboard-partner' : '/profile';
  const ordersPath = isPartner ? '/dashboard-partner' : '/my-orders';

  return (
    <div className="py-4 space-y-2 border-t border-neutral-200">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={closeMobileMenu}
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
              {mobileUserInitial}
            </div>
            <span className="text-sm font-medium text-neutral-700">{user.displayName || 'User'}</span>
          </div>
          <Link to={ordersPath} onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-center">
              {isPartner ? 'Quản lý Dịch vụ' : 'Dịch vụ của tôi'}
            </Button>
          </Link>
          <Link to={profilePath} onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-center">
              {isPartner ? 'Hồ sơ đối tác' : 'Hồ sơ'}
            </Button>
          </Link>
          {/* Admin button cho mobile - chỉ hiển thị cho admin */}
          {isAdmin && (
            <Link to="/admin" onClick={closeMobileMenu}>
              <Button variant="outline" className="w-full justify-center text-blue-600 border-blue-200 hover:bg-blue-50">
                🛠️ Quản trị viên
              </Button>
            </Link>
          )}
          {/* Đã loại bỏ một link 'Dịch vụ của tôi' trùng lặp */}
          <div onClick={() => { handleLogout(); closeMobileMenu(); }}>
            <Button variant="danger" className="w-full justify-center">
              Đăng xuất
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-neutral-200">
          <Link to="/login" onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-center">
              Đăng nhập
            </Button>
          </Link>
          <Link to="/register" onClick={closeMobileMenu}>
            <Button className="w-full justify-center">
              Đăng ký
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};


// Component chính Header
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  // Xác định xem người dùng có phải là đối tác hay admin hay không
  // Giả định userProfile có thuộc tính 'role' và giá trị 'partner' hoặc 'admin'
  const isPartner = userProfile?.role === 'partner';
  const isAdmin = userProfile?.role === 'admin';

  // Xử lý logic tên và chữ cái đầu rõ ràng hơn
  const fullName = userProfile
    ? `${userProfile.lastName || ''} ${userProfile.firstName || ''}`.trim() || user?.displayName || 'User'
    : user?.displayName || 'User';

  const userInitial = userProfile?.firstName
    ? userProfile.firstName.charAt(0).toUpperCase()
    : (user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U');

  const headerRef = useGSAP((gsap, element) => {
    animations.slideInFromBottom(element);

    gsap.fromTo('.logo',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
    );

    animations.staggerChildren(element, '.nav-item', 0.1);
  });

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
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
    { name: 'Đối tác', path: '/partner' }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
          <Logo />
          <DesktopNav navItems={navItems} location={location} />

          {/* Khu vực CTA/Thông tin người dùng trên Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <UserDropdown
                fullName={fullName}
                userInitial={userInitial}
                setIsUserMenuOpen={setIsUserMenuOpen}
                isUserMenuOpen={isUserMenuOpen}
                handleLogout={handleLogout}
                isPartner={isPartner} // Truyền prop isPartner
                isAdmin={isAdmin} // Truyền prop isAdmin
              />
            ) : (
              <AuthButtons />
            )}
          </div>

          <MobileMenuButton
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {isMobileMenuOpen && (
            <MobileNav
              navItems={navItems}
              location={location}
              user={user}
              userProfile={userProfile}
              handleLogout={handleLogout}
              closeMobileMenu={closeMobileMenu}
              isPartner={isPartner} // Truyền prop isPartner
              isAdmin={isAdmin} // Truyền prop isAdmin
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;