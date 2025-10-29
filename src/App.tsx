import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/forgotPassword";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
