import React, { useState } from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Components
import BlogSection from "./components/BlogSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import ServicesPage from "./pages/ServicesPage";
import MaidProfiles from "./components/MaidProfiles";
import Testimonials from "./components/Testimonials";
import AuthRedirect from "./components/AuthRedirect";
import VerificationBanner from "./components/VerificationBanner";

// Pages
import PartNer from "./pages/RegisterPartnerPage";


import AdminPage from "./pages/AdminPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import BookingPage from "./pages/BookingPage";
import CheckLinkPage from "./pages/CheckLinkPage";

import DashboardPartnerPage from "./pages/DashboardPartnerPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Partner from "./pages/RegisterPartnerPage";
import LogIn from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentResultPage from "./pages/PaymentResult";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import UpdateInformationPage from "./pages/UpdateInformation";
// Component nh? d? ch?a n?i dung trang ch?, gi�p code trong <Routes> g?n g�ng hon
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
  const { user, userProfile } = useAuth();
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50">
      {user && userProfile && userProfile.status !== 'active' && showVerificationBanner && (
        <VerificationBanner 
          user={user} 
          onClose={() => setShowVerificationBanner(false)}
        />
      )}      <Header />
      
      <AuthRedirect>
        <Routes>
            <Route
              path="/"
              element={
                <main>
                  <Hero />
                  <Services />
                  <MaidProfiles />
                  <Testimonials />
                  <BlogSection />
                </main>
              }
            />
            <Route path="/home" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/partner" element={<PartNer />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            {/*<Route path="/profile" element={<ProfilePage />} />*/}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/check-link" element={<CheckLinkPage />} />        
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/update-information" element={<UpdateInformationPage />} />
            <Route path="/booking-details/:bookingId" element={<BookingDetailPage />} />
            <Route path="*" element={<h1 className="text-center text-2xl">404 - Page Not Found</h1>} />
        </Routes>
      </AuthRedirect>

      <Routes>
        {/* --- C�C ROUTE C�NG KHAI & CH�NH --- */}
        {/* Trang ch? s? hi?n th? m?t t?p h?p c�c component */}
        <Route path="/" element={<HomePageContent />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* --- LU?NG X�C TH?C NGU?I D�NG --- */}
        {/* C�c trang li�n quan d?n dang nh?p, dang k�, qu�n m?t kh?u */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/update-information" element={<UpdateInformationPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/check-link" element={<CheckLinkPage />} />

        {/* --- C�C ROUTE C?A NGU?I D�NG & �?I T�C (Y�U C?U �ANG NH?P) --- */}
        {/* C�c trang ch?c nang ch�nh sau khi ngu?i d�ng d� dang nh?p */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-details/:bookingId" element={<BookingDetailPage />} />
        <Route path="/dashboardpartner" element={<DashboardPartnerPage />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* --- C�C ROUTE C?A QU?N TR? VI�N (Y�U C?U VAI TR� ADMIN) --- */}
        <Route path="/admin" element={<AdminPage />} />

        {/* --- ROUTE B?T L?I 404 (KH�NG T�M TH?Y TRANG) --- */}
        {/* Lu�n d?t route n�y ? cu?i c�ng */}
        <Route path="*" element={<h1 className="text-center text-2xl p-8">404 - Page Not Found</h1>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;