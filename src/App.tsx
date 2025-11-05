import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import VerifyOtp from "./pages/VerifyOtp";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Itinerary from "./pages/Itinerary";
import ExcursionDetails from "./pages/ExcursionDetails"; // ✅ newly added page
import ForgotPassword from "./pages/forgotPassword";

import ExcursionPoints from "./pages/ExcursionPoints";
import HotelList from "./pages/HotelList";

export default function App() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Core Pages */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Informational & Feature Pages */}
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/itinerary" element={<Itinerary />} />

        {/* ✅ CONNECTED NEW PAGES */}
        <Route path="/excursion-points" element={<ExcursionPoints />} />
        <Route path="/hotel-list" element={<HotelList />} />
        
      <Route path="/excursion-details" element={<ExcursionDetails />} /> {/* ✅ new route */}
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
