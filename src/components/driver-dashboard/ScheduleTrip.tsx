import { useState, useEffect } from "react";
import { CiSearch } from 'react-icons/ci'; // Search Icon for mobile
import Sidebar from '../AdminSidebar'; // Assuming Sidebar component is already created
import TopBar from '../Topbar'; // Assuming TopBar component is already created

const ScheduleTrip = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Sample schedule data
  const schedule = {
    Colombo: [
      { location: 'Lotus Tower', duration: '2 hr', date: '20/11/2025', time: '9:30 am', status: 'Completed' },
      { location: 'Gangaramaya Temple', duration: '2 hr', date: '20/11/2025', time: '11:30 am', status: 'Completed' },
      { location: 'Galle Face', duration: '2 hr', date: '20/11/2025', time: '12:30 pm', status: 'Arrived' },
      { location: 'Independence Memorial Hall', duration: '2 hr', date: '20/11/2025', time: '12:30 pm', status: 'Planned' }
    ],
    Galle: [
      { location: 'Galle Dutch fort', duration: '2 hr', date: '20/11/2025', time: '9:30 am', status: 'Completed' },
      { location: 'Galle Light House', duration: '2 hr', date: '20/11/2025', time: '11:30 am', status: 'Started' },
      { location: 'Mirissa Beach', duration: '2 hr', date: '20/11/2025', time: '12:30 pm', status: 'Arrived' },
      { location: 'Unawatuna Beach', duration: '2 hr', date: '20/11/2025', time: '12:30 pm', status: 'Planned' }
    ],
    Kandy: [
      { location: 'Galle Dutch fort', duration: '2 hr', date: '20/11/2025', time: '9:30 am', status: 'Completed' },
      { location: 'Galle Light House', duration: '2 hr', date: '20/11/2025', time: '11:30 am', status: 'Started' },
      { location: 'Mirissa Beach', duration: '2 hr', date: '20/11/2025', time: '12:30 pm', status: 'Arrived' },
      { location: 'Unawatuna Beach', duration: '2 hr', date: '20/11/2025', time: '12:30 pm', status: 'Planned' }
    ]
  };

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
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6">
          <TopBar
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="mb-4 mt-4 hidden md:flex md:justify-between md:items-center">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
              Schedule of Trip
            </h2>
          </div>
          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              Schedule of Trip
            </h2>
          </div>

          {/* SEARCH BAR - Mobile Only */}
          <div className="mb-6 relative md:hidden">
            <div className="relative">
              <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px]" />
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-[14px] md:text-[16px] font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
              />
            </div>
          </div>
          {/* Schedule List */}
          <div className="space-y-8">
            <div className="bg-white p-4 shadow shadow-purple-300 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Colombo</h3>
              <div className="space-y-4">
                {schedule.Colombo.map((trip, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
                    <div className="flex-1 flex items-center gap-6">
                      {/* Location, Duration, Date, Time in a single row */}
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.location}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.duration}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.date}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.time}</span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${trip.status === 'Completed'
                        ? 'bg-green-100 text-green-500'
                        : trip.status === 'Arrived'
                          ? 'bg-blue-100 text-blue-500'
                          : trip.status === 'Planned'
                            ? 'bg-orange-100 text-orange-500'
                            : 'bg-red-100 text-red-500'
                        }`}
                    >
                      {trip.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Galle Box */}
            <div className="bg-white p-4 shadow shadow-purple-300 rounded-lg mt-4">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Galle</h3>
              <div className="space-y-4">
                {schedule.Galle.map((trip, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
                    <div className="flex-1 flex items-center gap-6">
                      {/* Location, Duration, Date, Time in a single row */}
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.location}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.duration}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.date}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.time}</span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${trip.status === 'Completed'
                        ? 'bg-green-100 text-green-500'
                        : trip.status === 'Arrived'
                          ? 'bg-blue-100 text-blue-500'
                          : trip.status === 'Planned'
                            ? 'bg-orange-100 text-orange-500'
                            : 'bg-red-100 text-red-500'
                        }`}
                    >
                      {trip.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kandy Box */}
            <div className="bg-white p-4 shadow shadow-purple-300 rounded-lg mt-4">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Kandy</h3>
              <div className="space-y-4">
                {schedule.Kandy.map((trip, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
                    <div className="flex-1 flex items-center gap-6">
                      {/* Location, Duration, Date, Time in a single row */}
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.location}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.duration}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.date}</span>
                      <span className="text-lg font-semibold text-gray-800 flex-1">{trip.time}</span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${trip.status === 'Completed'
                        ? 'bg-green-100 text-green-500'
                        : trip.status === 'Arrived'
                          ? 'bg-blue-100 text-blue-500'
                          : trip.status === 'Planned'
                            ? 'bg-orange-100 text-orange-500'
                            : 'bg-red-100 text-red-500'
                        }`}
                    >
                      {trip.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTrip;
