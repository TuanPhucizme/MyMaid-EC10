import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Footer = () => {
  const { ref: footerRef, hasIntersected } = useIntersectionObserver();
  
  const contentRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.staggerChildren(element, '.footer-section', 0.1);
    }
  }, [hasIntersected]);

  const footerLinks = {
    services: [
      { name: 'Dọn dẹp nhà cửa', path: '/services/cleaning' },
      { name: 'Giặt ủi', path: '/services/laundry' },
      { name: 'Chăm sóc trẻ em', path: '/services/childcare' },
      { name: 'Vệ sinh chuyên sâu', path: '/services/deep-cleaning' },
      { name: 'Chuyển nhà', path: '/services/moving' }
    ],
    company: [
      { name: 'Về MyMaid', path: '/about-us' },
      { name: 'Tuyển dụng', path: '/careers' },
      { name: 'Tin tức', path: '/news' },
      { name: 'Liên hệ', path: '/contact' },
      { name: 'Đối tác', path: '/partner' }
    ],
    support: [
      { name: 'Trung tâm hỗ trợ', path: '/help' },
      { name: 'Câu hỏi thường gặp', path: '/faq' },
      { name: 'Chính sách bảo mật', path: '/privacy' },
      { name: 'Điều khoản sử dụng', path: '/terms' },
      { name: 'Khiếu nại', path: '/complaints' }
    ]
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: 'https://facebook.com/mymaid'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.807-2.026 1.218-3.323 1.218z"/>
        </svg>
      ),
      url: 'https://instagram.com/mymaid'
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      url: 'https://youtube.com/mymaid'
    },
    {
      name: 'Zalo',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.224-.487-.336-.951-.336-.465 0-.783.112-.952.336-.169.224-.253.499-.253.825 0 .325.084.6.253.825.169.224.487.336.952.336.464 0 .782-.112.951-.336.169-.225.253-.5.253-.825 0-.326-.084-.601-.253-.825z"/>
        </svg>
      ),
      url: 'https://zalo.me/mymaid'
    }
  ];

  return (
    <footer ref={footerRef} className="bg-neutral-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="footer-section text-center">
            <h3 className="text-2xl font-bold mb-4">
              Đăng ký nhận thông tin mới nhất
            </h3>
            <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
              Nhận các mẹo vặt dọn dẹp, ưu đãi đặc biệt và thông tin về dịch vụ mới
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <Button>
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="footer-section lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img
                src="/logo.png"
                alt="MyMaid"
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold">MyMaid</span>
            </Link>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              MyMaid là nền tảng kết nối người dùng với các dịch vụ giúp việc 
              chuyên nghiệp, uy tín và chất lượng cao tại TP.HCM.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-neutral-400">123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-neutral-400">1900 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-neutral-400">support@mymaid.vn</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="font-semibold text-lg mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4 className="font-semibold text-lg mb-4">Công ty</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="font-semibold text-lg mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="footer-section mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-neutral-800 rounded-lg"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-neutral-400 text-sm">
                © 2024 MyMaid. Tất cả quyền được bảo lưu.
              </p>
              <p className="text-neutral-500 text-xs mt-1">
                Phát triển bởi MyMaid Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
