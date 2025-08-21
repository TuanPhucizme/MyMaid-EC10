import React, { useEffect, useState } from "react";
import "./index.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Components
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import MaidProfiles from "./components/MaidProfiles";
import Testimonials from "./components/Testimonials";
import VerificationBanner from "./components/VerificationBanner";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";

// Pages
import AdminPage from "./pages/AdminPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import BookingPage from "./pages/BookingPage";
import CheckLinkPage from "./pages/CheckLinkPage";
import DashboardPartnerPage from "./pages/DashboardPartnerPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import PartnerPage from "./pages/RegisterPartnerPage";
import PartnerSuccessPage from "./pages/PartnerSuccessPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentResultPage from "./pages/PaymentResult";
import ProfilePage from "./pages/ProfilePage";
import OrderManagementPage from "./pages/OrderManagementPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ServicesPage from "./pages/ServicesPage";
import UpdateInformationPage from "./pages/UpdateInformation";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import LeaveReviewPage from "./pages/ReviewPage";
import ConsultationPage from "./pages/ConsultationPage";

// Component cho nội dung trang chủ
const HomePageContent = () => (
  <main>
    <Hero />
    <Services />
    <MaidProfiles />
    <Testimonials />
  </main>
);

function App() {
  const { user, userProfile, loading } = useAuth();
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return; // Đợi cho đến khi xác thực xong
    }

    // Danh sách các trang công khai mà người dùng đã đăng nhập nên được điều hướng khỏi
    // bao gồm cả các trang xác thực (login, register)
    const publicAndAuthPages = [
      '/',
      '/services',
      '/consultation',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/check-link',
      '/partner', // Trang đăng ký đối tác cũng nên được xử lý nếu người dùng đã đăng nhập
      '/partner-registration-success'
    ];

    // Nếu người dùng đã đăng nhập và có userProfile
    if (user && userProfile) {
      // Chỉ điều hướng nếu người dùng hiện đang ở trên một trong các trang công khai/xác thực
      if (publicAndAuthPages.includes(location.pathname)) {
        if (userProfile.role === 'partner') {
          navigate('/dashboard-partner', { replace: true });
        } else if (userProfile.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          // Đối với khách hàng thông thường, nếu họ đang ở trang đăng nhập/đăng ký
          // hoặc trang công khai sau khi đăng nhập, hãy đưa họ về trang chủ.
          // Hoặc bạn có thể quyết định để họ ở lại trang công khai nếu đó là ý định của họ.
          // Ở đây, chúng ta sẽ đưa họ về trang chủ nếu họ ở trên trang auth, còn public page thì không redirect
          if (['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/check-link'].includes(location.pathname)) {
            navigate('/', { replace: true });
          }
        }
      }
    }
  }, [user, userProfile, loading, navigate, location.pathname]); // Thêm location.pathname vào dependency array

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Verification Banner */}
      {user && userProfile && userProfile.status !== "active" && showVerificationBanner && (
        <VerificationBanner
          user={user}
          onClose={() => setShowVerificationBanner(false)}
        />
      )}

      <Header />

      <main className="pt-16">
      <Routes>
        {/* --- CÁC ROUTE CÔNG KHAI & CHÍNH --- */}
        <Route path="/" element={<HomePageContent />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />

        {/* --- LUỒNG XÁC THỰC NGƯỜI DÙNG --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/update-information" element={<UpdateInformationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/check-link" element={<CheckLinkPage />} />

        {/* --- CÁC ROUTE CỦA NGƯỜI DÙNG & ĐỐI TÁC (YÊU CẦU ĐĂNG NHẬP) --- */}
        {/* LƯU Ý QUAN TRỌNG: Các route này *nên* được bọc trong một ProtectedRoute component
             để đảm bảo rằng chỉ người dùng đã đăng nhập mới có thể truy cập.
             Nếu không có ProtectedRoute, người dùng chưa đăng nhập có thể truy cập URL
             trực tiếp và thấy các component này (mặc dù dữ liệu có thể trống hoặc gây lỗi
             do thiếu thông tin user). */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/partner-registration-success" element={<PartnerSuccessPage />} />
        <Route path="/dashboard-partner" element={<DashboardPartnerPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-details/:bookingId" element={<BookingDetailPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/my-orders" element={<OrderManagementPage />} />
        <Route path="/leave-review/:bookingId" element={<LeaveReviewPage />} />

        {/* --- CÁC ROUTE CỦA QUẢN TRỊ VIÊN --- */}
        {/* LƯU Ý QUAN TRỌNG: Route này *nên* được bọc trong một AdminRoute component
             để đảm bảo chỉ quản trị viên mới có thể truy cập. */}
        <Route path="/admin" element={<AdminPage />} />

        {/* --- ROUTE BẮT LỖI 404 --- */}
        <Route path="*" element={<h1 className="text-center text-2xl p-8">404 - Page Not Found</h1>} />
      </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;