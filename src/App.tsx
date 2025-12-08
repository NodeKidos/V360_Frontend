import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./store/useAuthStore";
import { UserRole } from "./types/auth.types";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OtpVerification from "./pages/auth/OtpVerification";
import VerifyOtp from "./pages/auth/VerifyOtp";
import AboutUs from "./pages/main/AboutUs";
import Itinerary from "./pages/main/Itinerary";
import MyItineraries from "./pages/main/MyItineraries";
import ExcursionDetails from "./pages/ExcursionDetails";
import ForgotPassword from "./pages/auth/forgotPassword";
import ExcursionPoints from "./pages/ExcursionPoints";
import HotelList from "./pages/HotelList";
import HomePage from "./pages/main/HomePage";
import "react-toastify/dist/ReactToastify.css";

// Admin Dashboard
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CustomerManagement from "./components/dashboard/User/UserView";
import AddCustomer from "./components/dashboard/User/AddUser";
import EditCustomer from "./components/dashboard/User/EditUser";
import VehicleManagement from "./components/dashboard/Vehicle/VehicleView";
import AddVehicle from "./components/dashboard/Vehicle/AddVehicle";
import EditVehicle from "./components/dashboard/Vehicle/EditVehicle";
import TourManagement from "./components/dashboard/Tour/TourView";
import EditTour from "./components/dashboard/Tour/EditTour";
import AddDestination from "./components/dashboard/Destination/AddDestination";
import DestinationHotelManagement from "./components/dashboard/Destination/DestinationView";
import AddHotel from "./components/dashboard/Destination/AddHotel";
import AddExcursion from "./components/dashboard/Destination/AddExcursion";
import EditDestination from "./components/dashboard/Destination/EditDestination";
import EditExcursion from "./components/dashboard/Destination/EditExcursion";
import EditHotel from "./components/dashboard/Destination/EditHotel";
import ExDetails from "./components/dashboard/Destination/ExcursionDetails";
import DriverManagement from "./components/dashboard/Driver/DriverView";
import AddDriver from "./components/dashboard/Driver/AddDriver";
import EditDriver from "./components/dashboard/Driver/EditDriver";
import DriverInfo from "./components/dashboard/Driver/DriverInfo";
import StaffManagement from "./components/dashboard/Staff/StaffView";
import EditStaff from "./components/dashboard/Staff/EditStaff";
import AddStaff from "./components/dashboard/Staff/AddStaff";
import ItinerarySummary from "./pages/main/ItinerarySummary";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ItineraryManagement from "./components/dashboard/Itinerary/ItineraryView";
import EditItinerary from "./pages/admin/EditItinerary";

export default function App() {
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);

  // Load user from localStorage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

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
        <Route
          path="/my-itineraries"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <MyItineraries />
            </ProtectedRoute>
          }
        />
        <Route path="/excursion-points" element={<ExcursionPoints />} />
        <Route path="/hotel-list" element={<HotelList />} />
        <Route path="/excursion-details" element={<ExcursionDetails />} />

        {/* User Dashboard Routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/itinerary-summary" element={<ItinerarySummary />} />

        {/* Protected Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <CustomerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/add"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AddCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit/:customerId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicle"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <VehicleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle/add"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AddVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle/edit/:vehicleId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tour"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <TourManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tour/edit/:tourId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditTour />
            </ProtectedRoute>
          }
        />

        <Route
          path="/destination-hotel"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <DestinationHotelManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/destination/add"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AddDestination />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotel/add"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AddHotel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/excursion/add"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AddExcursion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/destination/edit/:destinationrId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditDestination />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotel/edit/:hotelId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditHotel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/excursion/edit/:excursionId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditExcursion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/excursion/details/:excursionId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <ExDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <DriverManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/add"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AddDriver />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/edit/:driverId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditDriver />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/:driverId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <DriverInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <StaffManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/add"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AddStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/edit/:staffId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <EditStaff />
            </ProtectedRoute>
          }
        />

        {/* Itinerary Management Routes */}
        <Route
          path="/itineraries"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <ItineraryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary/:itineraryId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <ItinerarySummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary/:itineraryId/edit"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditItinerary />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
