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
import "react-toastify/dist/ReactToastify.css";

// ✅ Import Admin Dashboard
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
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user" element={<CustomerManagement />} />
      <Route path="/user/add" element={<AddCustomer />} />
      <Route path="/user/edit/:customerId" element={<EditCustomer />} />

      <Route path="/vehicle" element={<VehicleManagement />} />
      <Route path="/vehicle/add" element={<AddVehicle />} />
      <Route path="/vehicle/edit/:vehicleId" element={<EditVehicle />} />

      <Route path="/tour" element={<TourManagement />} />
      <Route path="/tour/edit/:tourId" element={<EditTour />} />

      <Route path="/destination-hotel" element={<DestinationHotelManagement />} />
      <Route path="/destination/add" element={<AddDestination />} />
      <Route path="/hotel/add" element={<AddHotel />} />
      <Route path="/excursion/add" element={<AddExcursion />} />
      <Route path="/destination/edit/:destinationrId" element={<EditDestination />} />
      <Route path="/hotel/edit/:hotelId" element={<EditHotel />} />
      <Route path="/excursion/edit/:excursionId" element={<EditExcursion />} />
      <Route path="/excursion/details/:excursionId" element={<ExDetails />} />

      <Route path="/driver" element={<DriverManagement />} />
      <Route path="/driver/add" element={<AddDriver />} />
      <Route path="/driver/edit/:driverId" element={<EditDriver />} />
      <Route path="//driver/:driverId" element={<DriverInfo />} />

      <Route path="/staff" element={<StaffManagement />} />
      <Route path="/staff/add" element={<AddStaff />} />
      <Route path="/staff/edit/:staffId" element={<EditStaff />} />

      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/itinerary-summary" element={<ItinerarySummary />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
