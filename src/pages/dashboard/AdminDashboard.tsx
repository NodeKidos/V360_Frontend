import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/AdminSidebar";
import { Button } from "../../components/ui/button";
import { FiArrowUpRight, FiFilter } from "react-icons/fi";
import { HiUsers, HiTruck } from "react-icons/hi";
import { IoCarSport } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { Card, CardContent } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import TopBar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";
import { itineraryService } from "../../services/itinerary.service";
import type { Itinerary } from "../../types/itinerary.types";
import { ItineraryStatus } from "../../types/itinerary.types";
import { adminService, type DashboardStats } from "../../services/admin.service";
import { Loader } from "../../components/ui/Loader";

// Custom hook for counting animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    startTimeRef.current = null;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration]);

  return count;
};

// StatCard component with counter animation
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const animatedValue = useCountUp(value, 2000);

  return (
    <Card className="bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`${color} p-2.5 md:p-3 rounded-lg`}>
            <div className="text-xl md:text-2xl">{icon}</div>
          </div>
          <FiArrowUpRight className="text-gray-400 text-base md:text-lg" />
        </div>
        <p className="text-gray-500 text-xs md:text-sm font-poppins mb-1">{label}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
          {animatedValue}
        </h3>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [allItineraries, setAllItineraries] = useState<Itinerary[]>([]);
  const [loadingItineraries, setLoadingItineraries] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoadingStats(true);
      try {
        const data = await adminService.getDashboardStats();
        setDashboardStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch recent itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      setLoadingItineraries(true);
      try {
        const response = await itineraryService.getAll({ limit: 100 });
        // Store all itineraries for calendar
        setAllItineraries(response.data);
        // Get only the 5 most recent itineraries for the table
        setItineraries(response.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
      } finally {
        setLoadingItineraries(false);
      }
    };

    fetchItineraries();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  // Check if itinerary has date-destination mismatch
  const checkDateMismatch = (itinerary: Itinerary): boolean => {
    if (!itinerary.startDate || !itinerary.endDate || !itinerary.days) {
      return false;
    }

    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const dateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Count unique destinations
    const uniqueDestinations = new Set(
      itinerary.days
        .map((day: any) => day.destination?.id)
        .filter(Boolean)
    );

    return uniqueDestinations.size > dateDays;
  };

  // Get status display
  const getStatusDisplay = (status: ItineraryStatus) => {
    switch (status) {
      case ItineraryStatus.DRAFT:
        return "Draft";
      case ItineraryStatus.PENDING_QUOTE:
        return "Pending";
      case ItineraryStatus.QUOTED:
        return "Quoted";
      case ItineraryStatus.NEGOTIATING:
        return "Negotiating";
      case ItineraryStatus.ACCEPTED:
        return "Accepted";
      case ItineraryStatus.REJECTED:
        return "Rejected";
      case ItineraryStatus.CANCELLED:
        return "Cancelled";
      case ItineraryStatus.CONVERTED:
        return "Converted";
      default:
        return status;
    }
  };

  const handleViewAllItineraries = () => {
    navigate("/itineraries");
  };

  const handleViewItinerary = (itineraryId: string) => {
    navigate(`/itinerary/${itineraryId}`);
  };

  // Get itineraries for a specific date
  const getItinerariesForDate = (selectedDate: Date) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return allItineraries.filter(itinerary => {
      const itineraryStartDate = new Date(itinerary.startDate).toISOString().split('T')[0];
      return itineraryStartDate === dateStr;
    });
  };

  // Check if a date has itineraries
  const hasItinerariesOnDate = (checkDate: Date) => {
    const dateStr = checkDate.toISOString().split('T')[0];
    return allItineraries.some(itinerary => {
      const itineraryStartDate = new Date(itinerary.startDate).toISOString().split('T')[0];
      return itineraryStartDate === dateStr;
    });
  };

  // Get itineraries for currently selected date
  const selectedDateItineraries = date ? getItinerariesForDate(date) : [];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Reusable Sidebar Component */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Section */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Top Bar */}
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          {/* Top Stats */}
          {loadingStats ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-20 h-20" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <StatCard
                label="Total Customer"
                value={dashboardStats?.totalCustomers || 0}
                icon={<HiUsers className="text-blue-500" />}
                color="bg-blue-50"
              />
              <StatCard
                label="Total Vehicle"
                value={dashboardStats?.totalVehicles || 0}
                icon={<IoCarSport className="text-purple-500" />}
                color="bg-purple-50"
              />
              <StatCard
                label="Total Driver"
                value={dashboardStats?.totalDrivers || 0}
                icon={<HiTruck className="text-green-500" />}
                color="bg-green-50"
              />
              <StatCard
                label="Total Itineraries"
                value={dashboardStats?.totalItineraries || 0}
                icon={<BiTime className="text-orange-500" />}
                color="bg-orange-50"
              />
              <StatCard
                label="Total Hotels"
                value={dashboardStats?.totalHotels || 0}
                icon={<BiTime className="text-pink-500" />}
                color="bg-pink-50"
              />
            </div>
          )}

          {/* Middle Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {/* Calendar + Trip */}
            <div className="flex flex-col gap-5">
              {/* Calendar */}
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
                    modifiers={{
                      hasItinerary: (day) => hasItinerariesOnDate(day)
                    }}
                    modifiersClassNames={{
                      hasItinerary: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-[#B749DB] after:rounded-full"
                    }}
                  />
                  {date && selectedDateItineraries.length > 0 && (
                    <div className="mt-4 p-3 bg-[#F8EDFC] rounded-lg border border-[#E5D4EF]">
                      <p className="text-sm font-medium text-[#5B247A] mb-2">
                        {selectedDateItineraries.length} itinerary/ies on {formatDate(date.toISOString())}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Itineraries for Selected Date */}
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-900 font-semibold text-base md:text-lg font-poppins">
                      {date ? `Trips on ${formatDate(date.toISOString())}` : "Select a Date"}
                    </p>
                    <FiArrowUpRight className="text-gray-400" />
                  </div>
                  {loadingItineraries ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader className="w-10 h-10" />
                    </div>
                  ) : selectedDateItineraries.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedDateItineraries.map((itinerary) => (
                        <div
                          key={itinerary.id}
                          onClick={() => handleViewItinerary(itinerary.id)}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-[#B749DB]">
                                {itinerary.itineraryNumber}
                              </p>
                              <p className="text-xs text-gray-600">
                                {itinerary.lead?.user?.firstName} {itinerary.lead?.user?.lastName}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${itinerary.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                              itinerary.status === 'pending_quote' ? 'bg-yellow-100 text-yellow-700' :
                                itinerary.status === 'quoted' ? 'bg-blue-100 text-blue-700' :
                                  itinerary.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    itinerary.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                                      itinerary.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-gray-100 text-gray-700'
                              }`}>
                              {getStatusDisplay(itinerary.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      No itineraries scheduled for this date
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reward Details */}
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-5 flex flex-col justify-start">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Reward Details</p>
                  <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100" style={{ scrollbarWidth: "thin" }}>
                  <table className="min-w-full text-center font-inter font-medium">
                    <thead>
                      <tr className="text-[#382A59] border-b text-sm md:text-base">
                        <th className="p-3 whitespace-nowrap">Reward Id</th>
                        <th className="p-3 whitespace-nowrap">Reward Type</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 whitespace-nowrap">Customer Id</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["RI001", "Referring a Friend", "03.04.2025", "CI001"],
                        ["RI002", "Birthdays", "03.04.2025", "CI002"],
                        ["RI003", "Review", "03.04.2025", "CI001"],
                        ["RI004", "Active Participation", "03.04.2025", "CI003"],
                      ].map(([id, type, date, cid]) => (
                        <tr key={id} className="border-b hover:bg-gray-50 text-xs md:text-sm">
                          <td className="p-3">{id}</td>
                          <td className="p-3">{type}</td>
                          <td className="p-3">{date}</td>
                          <td className="p-3">{cid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="bg-white rounded-xl shadow-sm border-0 overflow-hidden flex flex-col min-h-[300px] md:min-h-[400px]">
              <CardContent className="p-0 flex flex-col flex-1">
                {/* Header */}
                <div className="flex justify-between items-center px-5 pt-5 pb-3">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Map</p>
                  <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>

                {/* Google Map */}
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

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* Itinerary Details */}
            <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border-0 w-full">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">
                    Recent Itineraries
                  </p>
                  <FiArrowUpRight
                    className="text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={handleViewAllItineraries}
                    title="View All Itineraries"
                  />
                </div>

                {/* Loading State */}
                {loadingItineraries && (
                  <div className="flex justify-center items-center py-10">
                    <Loader className="w-20 h-20" />
                  </div>
                )}

                {/* Empty State */}
                {!loadingItineraries && itineraries.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 text-sm font-poppins">No itineraries found</p>
                  </div>
                )}

                {/* Table Container */}
                {!loadingItineraries && itineraries.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-gray-100" style={{ scrollbarWidth: "thin" }}>
                    <table className="w-full text-center font-inter font-medium">
                      <thead>
                        <tr className="text-[#382A59] border-b text-sm md:text-base">
                          <th className="p-3">Itinerary No</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Start Date</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itineraries.map((itinerary) => (
                          <tr
                            key={itinerary.id}
                            className="border-b hover:bg-gray-50 text-xs md:text-sm cursor-pointer transition-colors"
                            onClick={() => handleViewItinerary(itinerary.id)}
                          >
                            <td className="p-3 font-medium text-[#B749DB]">{itinerary.itineraryNumber}</td>
                            <td className="p-3">
                              {itinerary.lead?.user?.firstName && itinerary.lead?.user?.lastName
                                ? `${itinerary.lead.user.firstName} ${itinerary.lead.user.lastName}`
                                : itinerary.lead?.user?.firstName || itinerary.lead?.user?.lastName || "N/A"}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {itinerary.lead?.user?.phone || "N/A"}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <div>{formatDate(itinerary.startDate)}</div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-2">
                                {getStatusDisplay(itinerary.status)}
                                {checkDateMismatch(itinerary) && (
                                  <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1" title="Date-destination mismatch - needs review">
                                    ⚠️
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Best Destination */}
            <Card className="bg-white rounded-xl shadow-sm border-0 w-full">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">
                    Best Destination
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 text-sm h-8 px-3 hover:bg-gray-100"
                  >
                    <FiFilter className="mr-1.5" /> Filters
                  </Button>
                </div>

                {/* Loading State */}
                {loadingStats && (
                  <div className="flex justify-center items-center py-10">
                    <Loader className="w-20 h-20" />
                  </div>
                )}

                {/* Empty State */}
                {!loadingStats && (!dashboardStats?.destinations || dashboardStats.destinations.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 text-sm font-poppins">No destinations found</p>
                  </div>
                )}

                {/* Destination List */}
                {!loadingStats && dashboardStats?.destinations && dashboardStats.destinations.length > 0 && (
                  <div className="space-y-3">
                    {dashboardStats.destinations.slice(0, 5).map((destination: any) => (
                      <div
                        key={destination.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all bg-white cursor-pointer"
                      >
                        {/* Image */}
                        <img
                          src={destination.imageUrl || "https://i.ibb.co/7R1D2zH/waterfall.jpg"}
                          alt={destination.name}
                          className="w-12 h-12 rounded-md object-cover shrink-0"
                        />

                        {/* Info */}
                        <div>
                          <p className="font-medium text-sm md:text-base leading-tight">
                            {destination.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            📍 {destination.city || destination.location || 'N/A'}
                            {destination.rating && ` · ⭐ ${destination.rating}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
