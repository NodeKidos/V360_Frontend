import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OtpVerification from "./pages/auth/OtpVerification";
import VerifyOtp from "./pages/auth/VerifyOtp";
import AboutUs from "./pages/main/AboutUs";
import Itinerary from "./pages/main/Itinerary";
import ExcursionDetails from "./pages/ExcursionDetails";
import ForgotPassword from "./pages/auth/forgotPassword";
import ExcursionPoints from "./pages/ExcursionPoints";
import HotelList from "./pages/HotelList";
import HomePage from "./pages/main/HomePage";

// ✅ Import Admin Dashboard
// import AdminDashboard from "./pages/dashboard/AdminDashboard";

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
      <Route path="/excursion-points" element={<ExcursionPoints />} />
      <Route path="/hotel-list" element={<HotelList />} />
      <Route path="/excursion-details" element={<ExcursionDetails />} />

      {/* ✅ Admin Dashboard */}
      {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
