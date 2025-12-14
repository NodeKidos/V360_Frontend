import { useState, useEffect } from "react";
import Sidebar from "../../components/AdminSidebar";
import { Button } from "../../components/ui/button";
import { FiArrowUpRight } from "react-icons/fi";
import { FaRoute, FaCheckCircle, FaClock, FaGift } from "react-icons/fa";
import { BiTrip } from "react-icons/bi";
import { Card, CardContent } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import TopBar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";
import userService, { type CustomerDashboardStats } from "../../services/user.service";
import { useItineraryStore } from "../../store/useItineraryStore";
import { ItineraryStatus } from "../../types/itinerary.types";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<CustomerDashboardStats | null>(null);
  const { itineraries, getMyItineraries } = useItineraryStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get itineraries for a specific date
  const getItinerariesForDate = (selectedDate: Date) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return itineraries.filter(itinerary => {
      const itineraryStartDate = new Date(itinerary.startDate).toISOString().split('T')[0];
      return itineraryStartDate === dateStr;
    });
  };

  // Check if a date has itineraries
  const hasItinerariesOnDate = (checkDate: Date) => {
    const dateStr = checkDate.toISOString().split('T')[0];
    return itineraries.some(itinerary => {
      const itineraryStartDate = new Date(itinerary.startDate).toISOString().split('T')[0];
      return itineraryStartDate === dateStr;
    });
  };

  // Get itineraries for currently selected date
  const selectedDateItineraries = date ? getItinerariesForDate(date) : [];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch both itineraries and dashboard stats
        await getMyItineraries();

        // Fetch dashboard stats from backend
        try {
          const stats = await userService.getCustomerDashboardStats();
          setDashboardStats(stats);
        } catch (error) {
          // If backend stats fail, fallback to calculating from itineraries
          console.log("Dashboard stats endpoint failed, calculating from itineraries");
        }
      } catch (error: any) {
        toast.error("Failed to load dashboard data");
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getMyItineraries]);

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {loading ? (
              // Loading skeletons
              [...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white rounded-xl shadow-sm border-0">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-gray-200 p-2.5 md:p-3 rounded-lg animate-pulse">
                        <div className="w-6 h-6"></div>
                      </div>
                      <FiArrowUpRight className="text-gray-400 text-base md:text-lg" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              [
                {
                  label: "Total Itineraries",
                  value: dashboardStats?.totalItineraries || itineraries.length,
                  icon: <FaRoute className="text-blue-500" />,
                  color: "bg-blue-50",
                  onClick: () => navigate('/my-itineraries')
                },
                {
                  label: "Accepted Trips",
                  value: dashboardStats?.acceptedItineraries || itineraries.filter(i => i.status === ItineraryStatus.ACCEPTED).length,
                  icon: <FaCheckCircle className="text-green-500" />,
                  color: "bg-green-50",
                  onClick: () => navigate('/my-itineraries')
                },
                {
                  label: "Pending Quotes",
                  value: dashboardStats?.pendingQuotes || itineraries.filter(i => i.status === ItineraryStatus.PENDING_QUOTE || i.status === ItineraryStatus.QUOTED).length,
                  icon: <FaClock className="text-orange-500" />,
                  color: "bg-orange-50",
                  onClick: () => navigate('/my-itineraries')
                },
                {
                  label: "Loyalty Points",
                  value: dashboardStats?.loyaltyPoints || 0,
                  icon: <FaGift className="text-purple-500" />,
                  color: "bg-purple-50",
                  onClick: () => navigate('/reward')
                },
              ].map((item) => (
                <Card
                  key={item.label}
                  className="bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={item.onClick}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`${item.color} p-2.5 md:p-3 rounded-lg`}>
                        <div className="text-xl md:text-2xl">{item.icon}</div>
                      </div>
                      <FiArrowUpRight className="text-gray-400 text-base md:text-lg" />
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm font-poppins mb-1">{item.label}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
                      {item.value}
                    </h3>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

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

              {/* Trips on Selected Date */}
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-900 font-semibold text-base md:text-lg font-poppins">
                      {date ? `Trips on ${formatDate(date.toISOString())}` : "Select a Date"}
                    </p>
                    <FiArrowUpRight className="text-gray-400" />
                  </div>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  ) : selectedDateItineraries.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedDateItineraries.map((itinerary) => (
                        <div
                          key={itinerary.id}
                          onClick={() => navigate(`/itinerary-summary?id=${itinerary.id}`)}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-[#B749DB]">
                                {itinerary.itineraryNumber}
                              </p>
                              <p className="text-xs text-gray-600">
                                {itinerary.numberOfParticipants}  participants
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${itinerary.status === ItineraryStatus.DRAFT ? 'bg-gray-100 text-gray-700' :
                                itinerary.status === ItineraryStatus.PENDING_QUOTE ? 'bg-yellow-100 text-yellow-700' :
                                  itinerary.status === ItineraryStatus.QUOTED ? 'bg-blue-100 text-blue-700' :
                                    itinerary.status === ItineraryStatus.ACCEPTED ? 'bg-green-100 text-green-700' :
                                      itinerary.status === ItineraryStatus.IN_PROGRESS ? 'bg-purple-100 text-purple-700' :
                                        itinerary.status === ItineraryStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                                          'bg-gray-100 text-gray-700'
                              }`}>
                              {itinerary.status.replace('_', ' ')}
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

              {/* Upcoming Trips */}
              <Card className="bg-white rounded-xl shadow-sm border-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/my-itineraries')}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-900 font-semibold text-base md:text-lg font-poppins">Upcoming Trips</p>
                    <FiArrowUpRight className="text-gray-400" />
                  </div>
                  {loading ? (
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  ) : (
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins">
                      {dashboardStats?.upcomingTrips || itineraries.filter(i =>
                        i.status === ItineraryStatus.ACCEPTED || i.status === ItineraryStatus.IN_PROGRESS
                      ).length}
                    </h2>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Itineraries */}
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-5 flex flex-col justify-start">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Recent Itineraries</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/my-itineraries')}
                    className="text-purple-600 text-sm h-8 px-3 hover:bg-purple-50"
                  >
                    View All
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100" style={{ scrollbarWidth: "thin" }}>
                  {loading ? (
                    <div className="p-6 space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : itineraries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <BiTrip className="mx-auto text-4xl mb-2 text-gray-300" />
                      <p className="text-sm">No itineraries yet</p>
                      <Button
                        onClick={() => navigate('/itinerary')}
                        className="mt-3 bg-purple-600 hover:bg-purple-700 text-white"
                        size="sm"
                      >
                        Create Your First Itinerary
                      </Button>
                    </div>
                  ) : (
                    <table className="min-w-full text-center font-inter font-medium">
                      <thead>
                        <tr className="text-[#382A59] border-b text-sm md:text-base">
                          <th className="p-3 whitespace-nowrap">Itinerary #</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Start Date</th>
                          <th className="p-3">Participants</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itineraries.slice(0, 4).map((itinerary) => (
                          <tr
                            key={itinerary.id}
                            className="border-b hover:bg-gray-50 text-xs md:text-sm cursor-pointer"
                            onClick={() => navigate(`/itinerary-summary?id=${itinerary.id}`)}
                          >
                            <td className="p-3">{itinerary.itineraryNumber}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${itinerary.status === ItineraryStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                                  itinerary.status === ItineraryStatus.QUOTED ? 'bg-blue-100 text-blue-800' :
                                    itinerary.status === ItineraryStatus.PENDING_QUOTE ? 'bg-yellow-100 text-yellow-800' :
                                      itinerary.status === ItineraryStatus.DRAFT ? 'bg-gray-100 text-gray-800' :
                                        'bg-purple-100 text-purple-800'
                                }`}>
                                {itinerary.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {new Date(itinerary.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="p-3">{itinerary.numberOfParticipants}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
            {/* My Itineraries Overview */}
            <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border-0 w-full">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">
                    My Itineraries
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/my-itineraries')}
                    className="text-purple-600 text-sm h-8 px-3 hover:bg-purple-50"
                  >
                    View All
                  </Button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-xl border border-gray-100" style={{ scrollbarWidth: "thin" }}>
                  {loading ? (
                    <div className="p-6 space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : itineraries.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <FaRoute className="mx-auto text-5xl mb-3 text-gray-300" />
                      <p className="text-base font-medium mb-2">No itineraries yet</p>
                      <p className="text-sm text-gray-400 mb-4">Start planning your dream vacation!</p>
                      <Button
                        onClick={() => navigate('/itinerary')}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <BiTrip className="mr-2" />
                        Create Itinerary
                      </Button>
                    </div>
                  ) : (
                    <table className="w-full text-center font-inter font-medium">
                      <thead>
                        <tr className="text-[#382A59] border-b text-sm md:text-base">
                          <th className="p-3">Itinerary #</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Start Date</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itineraries.slice(0, 5).map((itinerary) => {
                          const startDate = new Date(itinerary.startDate);
                          const endDate = new Date(itinerary.endDate);
                          const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                          return (
                            <tr
                              key={itinerary.id}
                              className="border-b hover:bg-gray-50 text-xs md:text-sm cursor-pointer"
                              onClick={() => navigate(`/itinerary-summary?id=${itinerary.id}`)}
                            >
                              <td className="p-3">{itinerary.itineraryNumber}</td>
                              <td className="p-3 capitalize">{itinerary.type.toLowerCase()}</td>
                              <td className="p-3 whitespace-nowrap">
                                <div>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                              </td>
                              <td className="p-3">{duration} {duration === 1 ? 'day' : 'days'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${itinerary.status === ItineraryStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                                    itinerary.status === ItineraryStatus.QUOTED ? 'bg-blue-100 text-blue-800' :
                                      itinerary.status === ItineraryStatus.PENDING_QUOTE ? 'bg-yellow-100 text-yellow-800' :
                                        itinerary.status === ItineraryStatus.DRAFT ? 'bg-gray-100 text-gray-800' :
                                          itinerary.status === ItineraryStatus.COMPLETED ? 'bg-emerald-100 text-emerald-800' :
                                            'bg-purple-100 text-purple-800'
                                  }`}>
                                  {itinerary.status.replace('_', ' ')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white rounded-xl shadow-sm border-0 w-full">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">
                    Quick Actions
                  </p>
                </div>

                {/* Action List */}
                <div className="space-y-3">
                  <div
                    onClick={() => navigate('/itinerary')}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all bg-white cursor-pointer"
                  >
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <BiTrip className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base leading-tight">
                        Create New Itinerary
                      </p>
                      <p className="text-xs text-gray-500">
                        Plan your next adventure
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => navigate('/my-itineraries')}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all bg-white cursor-pointer"
                  >
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <FaRoute className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base leading-tight">
                        View My Itineraries
                      </p>
                      <p className="text-xs text-gray-500">
                        {itineraries.length} itineraries
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => navigate('/reward')}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all bg-white cursor-pointer"
                  >
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <FaGift className="text-2xl text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base leading-tight">
                        My Rewards
                      </p>
                      <p className="text-xs text-gray-500">
                        {dashboardStats?.loyaltyPoints || 0} points
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => navigate('/user-profile')}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-green-200 transition-all bg-white cursor-pointer"
                  >
                    <div className="bg-green-50 p-3 rounded-lg">
                      <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base leading-tight">
                        My Profile
                      </p>
                      <p className="text-xs text-gray-500">
                        View & edit profile
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
