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
import SettingsView from "./components/dashboard/Settings/SettingsView";
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
import ItinerarySummary from "./components/user-dashboard/ItinerarySummary";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ItineraryManagement from "./components/dashboard/Itinerary/ItineraryView";
import EditItinerary from "./pages/admin/EditItinerary";
import PackagePrice from "./components/user-dashboard/PackagePrice";
import Reward from "./components/user-dashboard/Reward";
import UserProfile from "./components/user-dashboard/UserProfile";
import ActivityLogView from "./components/dashboard/ActivityLog/ActivityLogView";
import EditMyItinerary from "./pages/customer-itinerary-edit/EditMyItinerary";
import DriverDashboard from "./pages/dashboard/DriverDashboard";
import MyTrips from "./pages/driver/MyTrips";
import DriverProfile from "./pages/driver/DriverProfile";
import DriverVehicle from "./pages/driver/DriverVehicle";
import ItineraryDetails from "./components/driver-dashboard/ItineraryDetails";
import DetailedItinerary from "./components/driver-dashboard/DetailedItinerary";
import DriverItineraryView from "./pages/driver/DriverItineraryView";
import TourDetails from "./pages/driver/TourDetails";
import MapView from "./pages/driver/MapView";
import EmergencyPage from "./pages/driver/EmergencyPage";
import RewardManagement from "./components/dashboard/reward/RewardView";
import AddReward from "./components/dashboard/reward/AddReward";
import VehicleDetails from "./components/driver-dashboard/VehicleDetails";
import TripPhotos from "./components/user-dashboard/TripPhotos";
import Gallery from "./components/user-dashboard/Gallery";
import GameManagement from "./components/dashboard/game/GameView";
import QuizCreator from "./components/dashboard/game/QuizCreator";
import GameHost from "./components/dashboard/game/GameHost";
import JoinGame from "./pages/game/JoinGame";
import GameLobby from "./pages/game/GameLobby";
import PlayerScreen from "./pages/game/PlayerScreen";

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

        {/* Public Core Pages */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* Public Informational & Feature Pages */}
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/excursion-points" element={<ExcursionPoints />} />
        <Route path="/hotel-list" element={<HotelList />} />
        <Route path="/excursion-details" element={<ExcursionDetails />} />

        {/* Public Game Play Routes (No auth required to join) */}
        <Route path="/play" element={<JoinGame />} />
        <Route path="/play/lobby/:pin" element={<GameLobby />} />
        <Route path="/play/game/:pin" element={<PlayerScreen />} />

        {/* ==========================================================
            PROTECTED ROUTES
            ========================================================== */}

        {/* COMMON / PROFILE ROUTES */}
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER ROUTES */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-itineraries"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <MyItineraries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-my-itinerary/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <EditMyItinerary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary-summary"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <ItinerarySummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/package-price"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <PackagePrice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reward"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <Reward />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memories"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <TripPhotos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memories/:place"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <Gallery />
            </ProtectedRoute>
          }
        />

        {/* ADMIN & STAFF SHARED ROUTES */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Management */}
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
          path="/user/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditCustomer />
            </ProtectedRoute>
          }
        />

        {/* Vehicle Management */}
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

        {/* Tour Management */}
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

        {/* Destination & Hotel Management */}
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
          path="/destination/edit/:destinationId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditDestination />
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
          path="/hotel/edit/:hotelId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EditHotel />
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

        {/* Driver Management (Admin/Staff view) */}
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
          path="/driver/:driverId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <DriverInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/edit/:driverId"
          element={
            // Driver can also edit their own profile
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.DRIVER]}>
              <EditDriver />
            </ProtectedRoute>
          }
        />

        {/* Itinerary Management (Admin/Staff view) */}
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

        {/* Game Management */}
        <Route
          path="/v360/game"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.DRIVER]}>
              <GameManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/v360/game/create"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <QuizCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/v360/game/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <QuizCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/v360/game/host/:pin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.DRIVER]}>
              <GameHost />
            </ProtectedRoute>
          }
        />

        {/* Activity Log */}
        <Route
          path="/activity-log"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <ActivityLogView />
            </ProtectedRoute>
          }
        />

        {/* Reward Settings */}
        <Route
          path="/reward/management"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <RewardManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reward/add-template"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AddReward />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ONLY ROUTES */}
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

        {/* DRIVER SPECIFIC ROUTES */}
        <Route
          path="/driver-dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <SettingsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-trips"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <MyTrips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <DriverProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-vehicle"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <DriverVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary-details"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <ItineraryDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary-details/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <DetailedItinerary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/itinerary/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <DriverItineraryView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/tour-details/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <TourDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/map/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <MapView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/emergency"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <EmergencyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle-details"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
