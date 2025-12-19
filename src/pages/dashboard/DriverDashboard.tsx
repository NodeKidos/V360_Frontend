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
import { driverService } from "../../services/driver.service";
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
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [loadingTrip, setLoadingTrip] = useState(true);

  const { assignedVehicles, isLoadingVehicles, fetchAssignedVehicles } = useDriverStore();

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
      try {
        setLoadingStats(true);
        const earningsData = await driverService.getEarnings();
        // const profileData = await driverService.getProfile(); // Temporarily disabled - 500 error

        setStats({
          totalTrips: earningsData.totalTrips || 0,
          distance: 1628, // TODO: Add distance tracking to backend
          drivingHours: 16.2, // TODO: Add hours tracking to backend
          rating: 4.5, // TODO: Fix profile endpoint
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch current trip (today's itinerary)
  useEffect(() => {
    const fetchCurrentTrip = async () => {
      try {
        setLoadingTrip(true);
        const itineraries = await driverService.getAssignedItineraries();

        // Find today's or upcoming itinerary
        const today = new Date();
        const currentItinerary = itineraries.find((itin: any) => {
          const startDate = new Date(itin.startDate);
          const endDate = new Date(itin.endDate);
          return today >= startDate && today <= endDate;
        }) || itineraries[0]; // Fallback to first itinerary

        if (currentItinerary) {
          const scheduleData = await driverService.getItinerarySchedule(currentItinerary.id);
          setCurrentTrip(scheduleData);
        }
      } catch (error) {
        console.error("Failed to fetch current trip:", error);
      } finally {
        setLoadingTrip(false);
      }
    };

    fetchCurrentTrip();
  }, []);

  // Fetch assigned vehicles
  useEffect(() => {
    fetchAssignedVehicles();
  }, [fetchAssignedVehicles]);

  // Get first vehicle from assigned vehicles array
  const assignedVehicle = assignedVehicles?.[0];

  // Calculate trip duration from current trip
  const getTripDuration = () => {
    if (!currentTrip?.schedule) return "N/A";
    const schedule = currentTrip.schedule;
    const startTime = schedule[0]?.time || "9:00 AM";
    const endTime = schedule[schedule.length - 1]?.time || "5:30 PM";
    // TODO: Calculate actual duration
    return "3 hr 45 min";
  };

  // Get current trip locations
  const getTripLocations = () => {
    if (!currentTrip?.schedule) {
      return [
        { location: "No active trip", time: "-" }
      ];
    }

    return currentTrip.schedule.map((day: any, index: number) => ({
      location: day.destination?.name || `Stop ${index + 1}`,
      time: day.time || `${9 + index * 2}:30 ${index < 3 ? 'am' : 'pm'}`,
    }));
  };

  const trips = getTripLocations();

  // Format distance
  const formatDistance = (km: number) => {
    return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${km} km`;
  };

  // Format hours
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h} hr ${m} m`;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {loadingStats ? (
              <div className="col-span-2 lg:col-span-4 flex justify-center py-8">
                <Loader className="w-8 h-8" />
              </div>
            ) : (
              [
                { label: "Total Trip", value: `${stats.totalTrips} t`, icon: <HiTruck className="text-blue-500" />, color: "bg-blue-50" },
                { label: "Distance Driven", value: formatDistance(stats.distance), icon: <IoCarSport className="text-purple-500" />, color: "bg-purple-50" },
                { label: "Driving Hours", value: formatHours(stats.drivingHours), icon: <BiTime className="text-orange-500" />, color: "bg-orange-50" },
                { label: "Rating", value: `${stats.rating.toFixed(1)} ⭐`, icon: <HiUsers className="text-green-500" />, color: "bg-green-50" }
              ].map((item) => (
                <Card
                  key={item.label}
                  className="bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`${item.color} p-2.5 md:p-3 rounded-lg`}>
                        <div className="text-xl md:text-2xl">{item.icon}</div>
                      </div>
                      <FiArrowUpRight className="text-gray-400 text-base md:text-lg" />
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm font-poppins mb-1">{item.label}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">{item.value}</h3>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Calendar */}
            <div className="flex flex-col gap-5">
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-900 font-semibold text-base md:text-lg font-poppins">Calendar</p>
                    <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Current Trip */}
            <div className="flex flex-col gap-5">
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-5">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Current Trip</p>

                  {loadingTrip ? (
                    <div className="flex justify-center py-8">
                      <Loader className="w-6 h-6" />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col mt-4 relative gap-2">
                        {trips.map(({ location, time }, idx) => (
                          <div key={idx} className="flex items-center mb-6 relative">
                            <div className="flex items-center justify-center w-10">
                              {idx === 0 ? (
                                <div className="w-6 h-6 rounded-full flex justify-center items-center">
                                  <span className="text-blue-800 text-[28px] ml-1.5 font-bold"><FaLocationDot /></span>
                                </div>
                              ) : (
                                <div className="w-6 h-6 border ml-1 border-blue-800 rounded-full flex justify-center items-center">
                                  <span className="w-2 h-2 bg-blue-800 rounded-full"></span>
                                </div>
                              )}

                              {idx < trips.length - 1 && (
                                <div className="absolute top-6 left-5.5 h-10 border-l-2 border-blue-600"></div>
                              )}
                            </div>

                            <div className="flex-1 flex justify-left">
                              <span className="font-medium text-[16px] text-gray-800">{location}</span>
                            </div>

                            <div className="w-20 flex justify-end">
                              <span className="text-sm text-gray-600">{time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-center mt-4">
                        <div className="bg-purple-100 rounded-lg p-2">
                          <p className="text-sm text-purple-600">Duration: {getTripDuration()}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-5">
              <Card className="bg-white rounded-xl shadow-sm border-0 overflow-hidden flex flex-col min-h-[300px] md:min-h-[400px]">
                <CardContent className="p-0 flex flex-col flex-1">
                  <div className="flex justify-between items-center px-5 pt-5 pb-3">
                    <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Map</p>
                    <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  <div className="flex flex-1">
                    <iframe
                      title="Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63346.5686232434!2d79.8282095750634!3d6.927078293065846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25960d01982b9%3A0x4dded76d7a5dc0f8!2sColombo!5e0!3m2!1sen!2slk!4v1698672328116!5m2!1sen!2slk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Schedule & Vehicle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6 items-start">
            {/* Schedule of Trip */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              <Card className="bg-white rounded-xl shadow-sm border-0 w-full">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Schedule of Trip</p>
                    <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  {loadingTrip ? (
                    <div className="flex justify-center py-8">
                      <Loader className="w-6 h-6" />
                    </div>
                  ) : currentTrip?.schedule ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="w-full text-center font-inter font-medium">
                        <thead>
                          <tr className="text-[#382A59] border-b text-sm md:text-base">
                            <th className="p-3">Day</th>
                            <th className="p-3">Destination</th>
                            <th className="p-3">Hotel</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Activities</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTrip.schedule.slice(0, 4).map((day: any, idx: number) => (
                            <tr key={idx} className="border-b text-sm md:text-base">
                              <td className="p-3">Day {day.dayNumber}</td>
                              <td className="p-3">{day.destination?.name || 'N/A'}</td>
                              <td className="p-3">{day.hotel?.name || 'N/A'}</td>
                              <td className="p-3">{new Date(day.date).toLocaleDateString()}</td>
                              <td className="p-3">{day.excursions?.length || 0} activities</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No scheduled trips</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Current Vehicle */}
            <div className="flex flex-col gap-5 lg:col-span-1">
              <Card className="bg-white rounded-xl shadow-sm border-0 w-full">
                <CardContent className="p-5">
                  <div className="mt-4">
                    {isLoadingVehicles ? (
                      <div className="flex justify-center py-8">
                        <Loader className="w-6 h-6" />
                      </div>
                    ) : assignedVehicle ? (
                      <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-center lg:items-start">
                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                          <p className="font-semibold text-gray-900 text-base md:text-[20px] font-poppins">Current Vehicle</p>
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <GiGasPump className="text-blue-500" />
                              </div>
                              <div className="ml-3">
                                <span className="block text-black text-[18px] font-bold">Fuel Type:
                                  {assignedVehicle.fuelType || 'Diesel'}</span>
                                <span className="block text-black text-[20px]">
                                  {assignedVehicle.fuelEfficiency || 8}km/liter
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                              <div className="bg-green-100 p-2 rounded-full">
                                <FaCarSide className="text-green-500" />
                              </div>
                              <div className="ml-3">
                                <span className="block text-black text-[18px] font-bold">Vehicle:</span>
                                <span className="block text-black text-[20px]">
                                  {assignedVehicle.make} {assignedVehicle.model}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                              <div className="bg-purple-100 p-2 rounded-full">
                                <IoMdKey className="text-purple-500" />
                              </div>
                              <div className="ml-3">
                                <span className="block text-black text-[18px] font-bold">License Plate:</span>
                                <span className="block text-black text-[20px]">
                                  {assignedVehicle.registrationNumber}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                              <div className="bg-orange-100 p-2 rounded-full">
                                <MdEventAvailable className="text-orange-500" />
                              </div>
                              <div className="ml-3">
                                <span className="block text-black text-[18px] font-bold">Service Due:</span>
                                <span className="block text-black text-[20px]">
                                  {assignedVehicle.nextServiceDate
                                    ? new Date(assignedVehicle.nextServiceDate).toLocaleDateString()
                                    : '09/05/2026'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                          <img
                            src={carImage}
                            alt="Car"
                            className="w-full h-52 md:w-full md:h-full lg:mt-30 ml-5 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No vehicle assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
