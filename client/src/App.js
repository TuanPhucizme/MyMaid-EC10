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
import PartnerPage from "./pages/RegisterPartnerPage"; // Đổi tên để khớp với cách sử dụng trong route
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
import ServiceFlowDemo from "./pages/ServiceFlowDemo";
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

    // Danh sách các trang công khai mà đối tác KHÔNG được phép truy cập
    // Lưu ý: '/home' và '/blog' được giữ lại từ code gốc dù không có route cụ thể trong khối <Routes>
    const publicPages = ['/', '/services', '/consultation'];

    if (user && userProfile) {
      // Nếu là đối tác và đang ở trang công khai -> đá về dashboard
      if (userProfile.role === 'partner') {
        navigate('/dashboard-partner', { replace: true });
      }
      // (Tùy chọn) Nếu là admin và đang ở trang công khai -> đá về trang admin
      else if (userProfile.role === 'admin') {
        navigate('/', { replace: true });
      }
    }
  }, [user, userProfile, loading, navigate, location]);

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

      {/* ✅ CHỈ SỬ DỤNG MỘT KHỐI <Routes> DUY NHẤT */}
      <Routes>
        {/* --- CÁC ROUTE CÔNG KHAI & CHÍNH --- */}
        <Route path="/" element={<HomePageContent />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/demo" element={<ServiceFlowDemo />} />
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
        {/* Lưu ý: Các route này cần được bọc trong một ProtectedRoute hoặc kiểm tra quyền truy cập bên trong component để hoạt động đúng */}
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
        {/* Lưu ý: Route này cần được bọc trong một AdminRoute hoặc kiểm tra quyền truy cập bên trong component */}
        <Route path="/admin" element={<AdminPage />} />

        {/* --- ROUTE BẮT LỖI 404 --- */}
        <Route path="*" element={<h1 className="text-center text-2xl p-8">404 - Page Not Found</h1>} />
      </Routes>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;