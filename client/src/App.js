import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
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
          <Route path="/partner" element={<PartNer />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
        </Routes>

        <Footer />
      </div>
  );
}

export default App;
