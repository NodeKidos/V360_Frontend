import  { useState, useEffect } from "react";
import Sidebar from "../../components/AdminSidebar";
import { Button } from "../../components/ui/button";
import { FiArrowUpRight, FiBell, FiMenu } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import logo from "../../assets/favicon.png"; // Your logo

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect if the screen is mobile or desktop
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Reusable Sidebar Component */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

     
       {/* Main Section */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full md:ml-0 overflow-x-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          {/* Mobile Menu + Logo */}
          {isMobile ? (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                onClick={() => setSidebarOpen(true)}
                className="text-2xl text-gray-700 hover:text-purple-600"
              >
                <FiMenu />
              </Button>
              <div className="flex items-center justify-center flex-1">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-20 h-20 object-contain mx-auto"
                />
              </div>
              <FiBell className="text-xl text-gray-500 cursor-pointer hover:text-purple-600" />
            </div>
          ) : (
            <>
              <div className="flex-1 flex justify-center">
                <div className="relative lg:w-[700px] sm:w-[500px]">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B749DB] text-xl" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="border px-12 py-2 w-full bg-[#B749DB]/10 rounded-full focus:ring-2 focus:ring-purple-400 placeholder:text-[#B749DB] text-center shadow-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiBell className="text-lg text-gray-500 cursor-pointer hover:text-purple-600" />
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/50" alt="Admin" />
                  <AvatarFallback>ADMIN</AvatarFallback>
                </Avatar>
              </div>
            </>
          )}
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ">
          {[{ label: "Total Customer", value: "50" },
          { label: "Total Vehicle", value: "28" },
          { label: "Total Driver", value: "40" },
          { label: "Driving Hours", value: "16hr 12m" },
          ].map((item) => (
            <Card
              key={item.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100  "
            >
              <CardContent className="p-6 text-center">
                <p className="text-black text-left font-roboto-condensed font-bold lg:text-[28px] sm:text-[24px] text-[20px]">{item.label}</p>
                <h3 className="text-[26px] sm:text-[24px] lg:text-[28px] font-bold mt-2 text-purple-600">
                  {item.value}
                </h3>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 ">
          {/* Calendar + Trip */}
          <div className="flex flex-col gap-8">
            {/* Calendar */}
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 h-70 lg:w-100%">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-black font-roboto-condensed font-bold lg:text-[28px] sm:text-[24px] text-[20px]">Calendar</p>
                  <div className="bg-linear-to-r from-purple-500 to-pink-400 text-white rounded-full p-1 cursor-pointer hover:scale-105 transition-transform">
                    <FiArrowUpRight className="text-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2.5 text-center text-[16px] ">
                  {"MTWTFSS".split("").map((d, i) => (
                    <span key={i} className="font-semibold text-gray-600">
                      {d}
                    </span>
                  ))}
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-md mx-auto ${i % 7 === 0
                        ? "bg-purple-300"
                        : i % 5 === 0
                          ? "bg-green-400"
                          : "bg-gray-200"
                        }`}></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Total Trip */}
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center h-35 lg:w-100%">
              <CardContent className="p-5">
                <p className="text-left font-semibold mb-1 lg:text-[28px] sm:text-[24px] text-[20px] text-black font-roboto-condensed ">Total Trip</p>
                <h2 className="text-[26px] sm:text-[24px] lg:text-[28px] font-bold text-purple-600 ">1200</h2>
              </CardContent>
            </Card>
          </div>

          {/* Reward Details */}
          <Card className="bg-white lg:w-100% rounded-2xl shadow-sm border border-gray-100 overflow-x-auto ">
            <CardContent className="p-5 sm:h-[400px] lg:h-full flex flex-col justify-start">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-black font-roboto-condensed lg:text-[28px] sm:text-[24px] text-[20px] ">Reward Details</p>
                <div className="bg-linear-to-r from-purple-500 to-pink-400 text-white rounded-full p-1 cursor-pointer hover:scale-105 transition-transform">
                  <FiArrowUpRight className="text-lg" />
                </div>
              </div>

              {/* Table (reduced gap) */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full text-center text-xs sm:text-sm">
                  <thead>
                    <tr className="text-gray-700 font-semibold border-b bg-gray-50 lg:text-[20px] md:text-[18px] text-[16px]">
                      <th className="p-2">Reward Id</th>
                      <th className="p-2">Reward Type</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Customer Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["RI001", "Referring a Friend", "03.04.2025", "CI001"],
                      ["RI002", "Birthdays", "03.04.2025", "CI002"],
                      ["RI003", "Review", "03.04.2025", "CI001"],
                      ["RI004", "Active Participation", "03.04.2025", "CI003"],
                    ].map(([id, type, date, cid]) => (
                      <tr key={id} className="border-b hover:bg-gray-50 lg:text-[20px] md:text-[18px] text-[16px]">
                        <td className="p-2">{id}</td>
                        <td className="p-2">{type}</td>
                        <td className="p-2">{date}</td>
                        <td className="p-2">{cid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full md:h-100% lg:h-100% md:w-160 lg:w-full">
            <CardContent className="p-0 flex flex-col flex-1">
              {/* Header */}
              <div className="flex justify-between items-center px-5 pt-4 pb-2">
                <p className="font-semibold text-black font-roboto-condensed text-[20px]">Map</p>
                <div className="bg-lineart-to-r from-purple-500 to-pink-400 text-white rounded-full p-1 cursor-pointer hover:scale-105 transition-transform">
                  <FiArrowUpRight className="text-lg" />
                </div>
              </div>

              {/* Google Map (auto fill height) */}
              <div className="flex flex-1 ">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Itinerary Details */}
          <Card className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 w-full h-full">
            <CardContent className="p-6 h-full">
              {/* Flex container for heading and arrow */}
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-black font-roboto-condensed lg:text-[28px] sm:text-[24px] text-[20px]">
                  Itinerary Details
                </p>
                <div className="bg-linear-to-r from-purple-500 to-pink-400 text-white rounded-full p-1 cursor-pointer hover:scale-105 transition-transform">
                  <FiArrowUpRight className="text-lg" />
                </div>
              </div>

              {/* Table Container with overflow-x-scroll on mobile and tablet */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-center font-inter ">
                  <thead>
                    <tr className="text-gray-600 border-b lg:text-[20px] md:text-[18px] text-[20px]">
                      <th className="p-2">Itinerary</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50 lg:text-[20px] sm:text-[16px] text-[16px]">
                        <td className="p-2">ID00{i + 1}</td>
                        <td className="p-2">Alice</td>
                        <td className="p-2 whitespace-nowrap">{`+94 74 455 2676`}</td> {/* Prevent phone number from breaking into multiple lines */}
                        <td className="p-2 whitespace-nowrap">
                          <div>{`07-Sep-2025`}</div> {/* Date */}
                          <div className="text-sm text-gray-500">{`14:30`}</div> {/* Time */}
                        </td>
                        <td className="p-2">Started</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Best Destination */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full md:w-[590px] lg:w-full h-full">
            <CardContent className="p-5 h-full">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-black font-roboto-condensed lg:text-[28px] sm:text-[24px] text-[20px]">
                  Best Destination
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-10px sm:text-sm h-8 px-4 py-1 items-end"
                >
                  Filters
                </Button>
              </div>

              {/* Destination List */}
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-10 p-2 rounded-xl border border-gray-100 hover:shadow-md transition-all bg-white"
                  >
                    {/* Image */}
                    <img
                      src="https://i.ibb.co/7R1D2zH/waterfall.jpg"
                      alt="Lotus Tower"
                      className="w-12 h-12 rounded-md object-cover shrink-0"
                    />

                    {/* Info */}
                    <div>
                      <p className="font-medium text-[20px] leading-tight">
                        Lotus Tower
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        📍 Colombo · ⭐ 4.8
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
