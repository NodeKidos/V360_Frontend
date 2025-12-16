import { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Search Icon
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
          <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Schedule of Trip</h2>

            {/* Search Bar */}
            <div className="relative mt-4">
              <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
              />
            </div>
          </div>

          {/* Schedule List */}
          <div className="space-y-8">
            {/* Colombo Box */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Colombo</h3>
              <div className="space-y-4">
                {schedule.Colombo.map((trip, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-md font-semibold">{trip.location}</span>
                      <span className="text-sm text-gray-600">{`${trip.duration} | ${trip.date} | ${trip.time}`}</span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        trip.status === 'Completed'
                          ? 'bg-green-100 text-green-500'
                          : trip.status === 'Started'
                          ? 'bg-red-100 text-red-500'
                          : trip.status === 'Planned'
                          ? 'bg-orange-100 text-orange-500'
                          : 'bg-blue-100 text-blue-500'
                      }`}
                    >
                      {trip.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Galle Box */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Galle</h3>
              <div className="space-y-4">
                {schedule.Galle.map((trip, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-md font-semibold">{trip.location}</span>
                      <span className="text-sm text-gray-600">{`${trip.duration} | ${trip.date} | ${trip.time}`}</span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        trip.status === 'Completed'
                          ? 'bg-green-100 text-green-500'
                          : trip.status === 'Started'
                          ? 'bg-red-100 text-red-500'
                          : trip.status === 'Planned'
                          ? 'bg-orange-100 text-orange-500'
                          : 'bg-blue-100 text-blue-500'
                      }`}
                    >
                      {trip.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kandy Box */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Kandy</h3>
              <div className="space-y-4">
                {schedule.Kandy.map((trip, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-md font-semibold">{trip.location}</span>
                      <span className="text-sm text-gray-600">{`${trip.duration} | ${trip.date} | ${trip.time}`}</span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        trip.status === 'Completed'
                          ? 'bg-green-100 text-green-500'
                          : trip.status === 'Started'
                          ? 'bg-red-100 text-red-500'
                          : trip.status === 'Planned'
                          ? 'bg-orange-100 text-orange-500'
                          : 'bg-blue-100 text-blue-500'
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
