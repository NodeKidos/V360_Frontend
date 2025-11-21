import  { useState, useEffect } from "react";
import Sidebar from "../../components/AdminSidebar";
import { Button } from "../../components/ui/button";
import { FiArrowUpRight, FiFilter } from "react-icons/fi";
import { HiUsers, HiTruck } from "react-icons/hi";
import { IoCarSport } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { Card, CardContent } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import TopBar from "../../components/Topbar";

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          {[
            { label: "Total Customer", value: "50", icon: <HiUsers className="text-blue-500" />, color: "bg-blue-50" },
            { label: "Total Vehicle", value: "28", icon: <IoCarSport className="text-purple-500" />, color: "bg-purple-50" },
            { label: "Total Driver", value: "40", icon: <HiTruck className="text-green-500" />, color: "bg-green-50" },
            { label: "Driving Hours", value: "16hr 12m", icon: <BiTime className="text-orange-500" />, color: "bg-orange-50" },
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
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
                  {item.value}
                </h3>
              </CardContent>
            </Card>
          ))}
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
                />
              </CardContent>
            </Card>

            {/* Total Trip */}
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-900 font-semibold text-base md:text-lg font-poppins">Total Trip</p>
                  <FiArrowUpRight className="text-gray-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins">1200</h2>
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
              <div className="overflow-x-auto rounded-xl border border-gray-100" style={{scrollbarWidth: "thin"}}>
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
                  Itinerary Details
                </p>
                <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto rounded-xl border border-gray-100" style={{scrollbarWidth: "thin"}}>
                <table className="w-full text-center font-inter font-medium">
                  <thead>
                    <tr className="text-[#382A59] border-b text-sm md:text-base">
                      <th className="p-3">Itinerary</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50 text-xs md:text-sm">
                        <td className="p-3">ID00{i + 1}</td>
                        <td className="p-3">Alice</td>
                        <td className="p-3 whitespace-nowrap">+94 74 455 2676</td>
                        <td className="p-3 whitespace-nowrap">
                          <div>07-Sep-2025</div>
                          <div className="text-xs text-gray-500">14:30</div>
                        </td>
                        <td className="p-3">Started</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

              {/* Destination List */}
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all bg-white"
                  >
                    {/* Image */}
                    <img
                      src="https://i.ibb.co/7R1D2zH/waterfall.jpg"
                      alt="Lotus Tower"
                      className="w-12 h-12 rounded-md object-cover shrink-0"
                    />

                    {/* Info */}
                    <div>
                      <p className="font-medium text-sm md:text-base leading-tight">
                        Lotus Tower
                      </p>
                      <p className="text-xs text-gray-500">
                        📍 Colombo · ⭐ 4.8
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
