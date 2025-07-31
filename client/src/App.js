import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import ServicesPage from "./pages/ServicesPage";
import MaidProfiles from "./components/MaidProfiles";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import Footer from "./components/Footer";

// Pages
import PartNer from "./pages/RegisterPartnerPage";
import LogIn from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentResultPage from "./pages/PaymentResult";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import CheckLinkPage from "./pages/CheckLinkPage";
import BookingPage from "./pages/BookingPage";
function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/check-link" element={<CheckLinkPage />} />        
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/booking" element={<BookingPage />} />
      </Routes>

        <Footer />
      </div>
  );
}

export default App;
