import React from "react";
import "./index.css"; // Assuming you have some global styles
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Services from "./components/Services";
import PartNer from "./pages/RegisterPartnerPage";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/BlogPage";
import LogIn from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import BookingSuccess from "./pages/BookingSuccess";
import CheckoutPage from "./pages/CheckoutPage";
import LaundryForm from "./pages/LaundryPage"; // Assuming you have a LaundryFormPage component

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-light">
              <Banner />
              <Services />
            </div>
          }
        />
        <Route path="/partner" element={<PartNer />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/laundry" element={<LaundryForm />} />
      </Routes>
    </>
  );
}

export default App;

//gắn BE