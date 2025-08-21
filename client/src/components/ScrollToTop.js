import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react'; // Cài đặt lucide-react nếu chưa có: npm install lucide-react

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hiển thị nút khi cuộn xuống một khoảng nhất định
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Nút sẽ hiện ra sau khi cuộn xuống 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Cuộn về đầu trang một cách mượt mà
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Cuộn mượt
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Dọn dẹp event listener khi component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 bg-primary-600 text-white
        p-3 rounded-full shadow-lg transition-all duration-300
        hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        z-50
      `}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;