import { useState, useEffect } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { HiUsers, HiTruck } from "react-icons/hi";
import { IoCarSport } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { Card, CardContent } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import TopBar from "../../components/Topbar";
import Sidebar from "../../components/AdminSidebar";
import carImage from '../../assets/car.png'; // Importing car image

import { GiGasPump } from "react-icons/gi";
import { FaCarSide } from 'react-icons/fa'; // Length icon (car)
import { IoMdKey } from 'react-icons/io'; // Key icon (license plate)
import { MdEventAvailable } from 'react-icons/md'; // Service due icon

const DriverDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Current Trip data
  const trips = [
    { location: "Lotus Tower", time: "9:30 am" },
    { location: "Gangaramaya Temple", time: "11:30 am" },
    { location: "Galle Face", time: "12:30 pm" },
    { location: "Independence Memorial Hall", time: "3:30 pm" },
    { location: "Port City", time: "5:30 pm" }
  ];

  // Handle window resizing for mobile responsiveness
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
      {/* Sidebar */}
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

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Trip", value: "84 t", icon: <HiTruck className="text-blue-500" />, color: "bg-blue-50" },
              { label: "Distance Driven", value: "1628 km", icon: <IoCarSport className="text-purple-500" />, color: "bg-purple-50" },
              { label: "Driving Hours", value: "16 hr 12 m", icon: <BiTime className="text-orange-500" />, color: "bg-orange-50" },
              { label: "Rating", value: "4.8 ⭐", icon: <HiUsers className="text-green-500" />, color: "bg-green-50" }
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
            ))}
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Left Column: Calendar + Rating */}
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

              {/* Rating */}
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-900 font-semibold text-base md:text-lg font-poppins">Rating</p>
                    <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-poppins">4.8 ⭐</h3>
                </CardContent>
              </Card>
            </div>

            {/* Current Trip */}
            <div className="flex flex-col gap-5">
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-5">
                  <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Current Trip</p>
                  <ul className="space-y-4 mt-4">
                    {trips.map(({ location, time }, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-3"></div>
                        <span>{location}</span>
                        <span className="ml-auto">{time}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Duration: 3 hr 45 min</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Map */}
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


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6 items-start">
            {/* Left Column: Schedule of Trip */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              <Card className=" bg-white rounded-xl shadow-sm border-0 w-full"> {/* Adjusted width */}
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-semibold text-gray-900 text-base md:text-lg font-poppins">Schedule of Trip</p>
                    <FiArrowUpRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-center font-inter font-medium">
                      <thead>
                        <tr className="text-[#382A59] border-b text-sm md:text-base">
                          <th className="p-3">From</th>
                          <th className="p-3">Hours</th>
                          <th className="p-3">To</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Time</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example rows */}
                        {[
                          ["Lotus Tower", "2 hr", "Gangaramaya Temple", "20/11/2025", "9:30 am", "Completed"],
                          ["Gangaramaya Temple", "2 hr", "Galle Face", "20/11/2025", "11:30 am", "Started"],
                          ["Galle Face", "2 hr", "Independence Memorial Hall", "20/11/2025", "12:30 pm", "Arrived"],
                          ["Independence Memorial Hall", "2 hr", "Port City", "20/11/2025", "3:30 pm", "Planned"]
                        ].map(([from, hours, to, date, time, status], idx) => (
                          <tr key={idx} className="border-b text-sm md:text-base">
                            <td className="p-3">{from}</td>
                            <td className="p-3">{hours}</td>
                            <td className="p-3">{to}</td>
                            <td className="p-3">{date}</td>
                            <td className="p-3">{time}</td>
                            <td className={`p-3 ${status === "Completed" ? "text-green-500" : status === "Started" ? "text-yellow-500" : status === "Arrived" ? "text-blue-500" : "text-red-500"}`}>
                              {status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Current Vehicle */}
            <div className="flex flex-col gap-5 lg:col-span-1">
              <Card className="bg-white rounded-xl shadow-sm border-0 w-full">
                <CardContent className="p-5">
                  <div className="mt-4">

                    <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-center lg:items-start">
                      {/* Left Column: Vehicle Information */}
                      <div className="flex flex-col gap-4 w-full lg:w-1/2">
                        <p className="font-semibold text-gray-900 text-base md:text-[20px] font-poppins">Current Vehicle</p>
                        <div className="mt-4 space-y-3">
                          {/* Fuel Type */}
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <GiGasPump className="text-blue-500" />
                            </div>
                            <div className="ml-3">
                              <span className="block text-black text-[18px] font-bold">Fuel Type: Diesel</span>
                              <span className="block text-black text-[20px]">8km/liter</span>
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-500">
                            <div className="bg-green-100 p-2 rounded-full">
                              <FaCarSide className="text-green-500" />
                            </div>
                            <div className="ml-3">
                              <span className="block text-black text-[18px] font-bold">Length:</span>
                              <span className="block text-black text-[20px]">2.5 meters</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <IoMdKey className="text-purple-500" />
                            </div>
                            <div className="ml-3">
                              <span className="block text-black text-[18px] font-bold">License Plate:</span>
                              <span className="block text-black text-[20px]"> NP QI-9504s</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="bg-orange-100 p-2 rounded-full">
                               <MdEventAvailable className="text-orange-500" />
                            </div>
                            <div className="ml-3">
                              <span className="block text-black text-[18px] font-bold">Service Due:</span>
                              <span className="block text-black text-[20px]">09/05/2026</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Car Image */}
                      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <img
                          src={carImage}
                          alt="Car"
                          className="w-full h-52 md:w-full md:h-full lg:mt-30 ml-5 object-cover rounded-lg"
                        />
                      </div>
                    </div>

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
