import { useState, useEffect } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { HiUsers, HiTruck } from "react-icons/hi";
import { IoCarSport } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { Card, CardContent } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import TopBar from "../../components/Topbar";
import Sidebar from "../../components/AdminSidebar";
import carImage from '../../assets/car.png';
import { GiGasPump } from "react-icons/gi";
import { FaCarSide, FaLocationDot } from 'react-icons/fa6';
import { IoMdKey } from 'react-icons/io';
import { MdEventAvailable } from 'react-icons/md';
import { useDriverStore } from "../../store/useDriverStore";
import { Loader } from "../../components/ui/Loader";

const DriverDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Dynamic data states
  const [stats, setStats] = useState({
    totalTrips: 0,
    distance: 0,
    drivingHours: 0,
    rating: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [_currentTrip, _setCurrentTrip] = useState<any>(null);
  const [_loadingTrip, _setLoadingTrip] = useState(true);

  const { itineraries: _itineraries, /* currentSchedule, */ assignedVehicles, isLoadingVehicles, fetchAssignedItineraries: _fetchAssignedItineraries, /* fetchItinerarySchedule, */ fetchAssignedVehicles } = useDriverStore();

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch driver stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // Mocking statistics fetch - normally would call driverService.getEarnings() or similar
        setStats({
          totalTrips: 12,
          distance: 1250,
          drivingHours: 156,
          rating: 4.8,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
    fetchAssignedVehicles();
  }, [fetchAssignedVehicles]);

  const assignedVehicle = assignedVehicles.length > 0 ? assignedVehicles[0] : null;

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">Driver Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {/* Stat Cards */}
              <Card className="bg-white border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Trips</p>
                      <h3 className="text-2xl font-bold mt-1">{loadingStats ? '...' : stats.totalTrips}</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <FiArrowUpRight className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Distance Covered</p>
                      <h3 className="text-2xl font-bold mt-1 text-green-600">
                        {loadingStats ? '...' : `${stats.distance} km`}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl">
                      <HiTruck className="text-green-600 text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Driving Hours</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {loadingStats ? '...' : `${stats.drivingHours} hrs`}
                      </h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <BiTime className="text-purple-600 text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Rating</p>
                      <h3 className="text-2xl font-bold mt-1 text-yellow-500">
                        {loadingStats ? '...' : stats.rating} ★
                      </h3>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-xl">
                      <HiUsers className="text-yellow-600 text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Vehicle Status */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-none shadow-md h-full overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-800 font-poppins">Vehicle Status</h2>
                    </div>

                    {isLoadingVehicles ? (
                      <div className="flex items-center justify-center p-12">
                        <Loader className="w-12 h-12" />
                      </div>
                    ) : assignedVehicle ? (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900 text-lg">Current Vehicle</p>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${assignedVehicle.status === 'available'
                                ? 'bg-green-100 text-green-700'
                                : assignedVehicle.status.includes('in')
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-orange-100 text-orange-700'
                                }`}>
                                {assignedVehicle.status}
                              </span>
                            </div>

                            <div className="mt-6 flex flex-col items-center">
                              <div className="w-full h-40 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group">
                                <img
                                  src={carImage}
                                  alt="Vehicle"
                                  className="w-48 object-contain transform group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/50 shadow-sm">
                                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Plate Number</p>
                                  <p className="font-bold text-gray-900 text-sm">{assignedVehicle.plateNumber}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 mt-2">
                              <div className="flex items-center gap-3 group">
                                <div className="bg-blue-50 p-2.5 rounded-lg group-hover:bg-blue-100 transition shadow-sm">
                                  <GiGasPump className="text-blue-500 text-lg" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fuel Economy</p>
                                  <p className="font-bold text-gray-900">{assignedVehicle.fuelEfficiency || 8.5} km/liter</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 group">
                                <div className="bg-green-50 p-2.5 rounded-lg group-hover:bg-green-100 transition shadow-sm">
                                  <FaCarSide className="text-green-500 text-lg" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Model & Make</p>
                                  <p className="font-bold text-gray-900">{assignedVehicle.make || assignedVehicle.name} {assignedVehicle.model}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                  <IoMdKey className="text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-800">Quick Specs</h3>
                              </div>
                              <div className="grid grid-cols-2 gap-y-3">
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Type</p>
                                  <p className="font-bold text-gray-700 text-sm capitalize">{assignedVehicle.type}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Capacity</p>
                                  <p className="font-bold text-gray-700 text-sm">{assignedVehicle.capacity} Pax</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Fuel Type</p>
                                  <p className="font-bold text-gray-700 text-sm capitalize">{assignedVehicle.fuelType || 'Petrol'}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Mileage</p>
                                  <p className="font-bold text-gray-700 text-sm truncate">{assignedVehicle.currentMileage ? `${assignedVehicle.currentMileage}km` : 'N/A'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <span className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                  <MdEventAvailable className="text-purple-500" /> Insurance Expiry
                                </span>
                                <span className="font-bold text-gray-800 text-sm">{assignedVehicle.insuranceExpiry ? new Date(assignedVehicle.insuranceExpiry).toLocaleDateString() : 'N/A'}</span>
                              </div>
                              <button className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                                <IoCarSport className="text-xl" /> View All Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IoCarSport className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No vehicle assigned to you yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Stats & Schedule Summary */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white border-none shadow-md overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-gray-100 bg-purple-600">
                      <h2 className="text-xl font-bold text-white font-poppins">Trip Calendar</h2>
                    </div>
                    <div className="p-4 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Next Trip Mini Card */}
                <Card className="bg-white border-none shadow-md border-l-4 border-purple-500 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2.5 rounded-lg shadow-sm">
                        <FaLocationDot className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Next Destination</p>
                        <h4 className="font-bold text-gray-800">Kandy City Tour</h4>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 text-purple-600 rounded-lg font-bold text-sm transition-colors border border-purple-100">
                      View Next Itinerary
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
