import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";

// Components
import BlogSection from "./components/BlogSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MaidProfiles from "./components/MaidProfiles";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

// Pages (sắp xếp theo thứ tự bảng chữ cái)
import AdminPage from "./pages/AdminPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import BookingPage from "./pages/BookingPage";
import CheckLinkPage from "./pages/CheckLinkPage";
import DashboardPartnerPage from "./pages/DashboardPartnerPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LogIn from "./pages/LoginPage";
import Partner from "./pages/RegisterPartnerPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentResultPage from "./pages/PaymentResult";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ServicesPage from "./pages/ServicesPage";
import UpdateInformationPage from "./pages/UpdateInformation";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// Component nhỏ để chứa nội dung trang chủ, giúp code trong <Routes> gọn gàng hơn
const HomePageContent = () => (
  <main>
    <Hero />
    <Services />
    <MaidProfiles />
    <Testimonials />
    <BlogSection />
  </main>
);

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <Routes>
        {/* --- CÁC ROUTE CÔNG KHAI & CHÍNH --- */}
        {/* Trang chủ sẽ hiển thị một tập hợp các component */}
        <Route path="/" element={<HomePageContent />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* --- LUỒNG XÁC THỰC NGƯỜI DÙNG --- */}
        {/* Các trang liên quan đến đăng nhập, đăng ký, quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/update-information" element={<UpdateInformationPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/check-link" element={<CheckLinkPage />} />

        {/* --- CÁC ROUTE CỦA NGƯỜI DÙNG & ĐỐI TÁC (YÊU CẦU ĐĂNG NHẬP) --- */}
        {/* Các trang chức năng chính sau khi người dùng đã đăng nhập */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-details/:bookingId" element={<BookingDetailPage />} />
        <Route path="/dashboardpartner" element={<DashboardPartnerPage />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* --- CÁC ROUTE CỦA QUẢN TRỊ VIÊN (YÊU CẦU VAI TRÒ ADMIN) --- */}
        <Route path="/admin" element={<AdminPage />} />

        {/* --- ROUTE BẮT LỖI 404 (KHÔNG TÌM THẤY TRANG) --- */}
        {/* Luôn đặt route này ở cuối cùng */}
        <Route path="*" element={<h1 className="text-center text-2xl p-8">404 - Page Not Found</h1>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;