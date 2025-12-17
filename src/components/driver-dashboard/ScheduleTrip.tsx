import { useState, useEffect } from "react";
import { CiSearch } from 'react-icons/ci';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../AdminSidebar';
import TopBar from '../Topbar';
import { useDriverStore } from '../../store/useDriverStore';

const ScheduleTrip = () => {
  const [searchParams] = useSearchParams();
  const itineraryId = searchParams.get('id');

  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { currentSchedule, isLoadingSchedule, fetchItinerarySchedule } = useDriverStore();

  // Fetch schedule on mount
  useEffect(() => {
    if (itineraryId) {
      fetchItinerarySchedule(itineraryId);
    }
  }, [itineraryId, fetchItinerarySchedule]);

  // Handle window resizing for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group schedule by destination
  const groupedSchedule = currentSchedule?.schedule.reduce((acc: any, day: any) => {
    const destination = day.destination?.name || 'Other';
    if (!acc[destination]) {
      acc[destination] = [];
    }

    // Add all excursions for this day
    day.excursions?.forEach((excursion: any) => {
      acc[destination].push({
        location: excursion.name,
        duration: excursion.duration ? `${excursion.duration} hr` : 'N/A',
        date: new Date(day.date).toLocaleDateString(),
        time: excursion.visitTime || 'TBD',
        status: 'Planned', // You can add status logic here
        type: 'excursion'
      });
    });

    // Add hotel for this day
    if (day.hotel) {
      acc[destination].push({
        location: `🏨 ${day.hotel.name}`,
        duration: 'Overnight',
        date: new Date(day.date).toLocaleDateString(),
        time: day.hotel.checkInTime || '3:00 PM',
        status: 'Planned',
        type: 'hotel'
      });
    }

    return acc;
  }, {}) || {};

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

          {/* Itinerary Info */}
          {currentSchedule && (
            <div className="mb-6 bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-purple-700">
                {currentSchedule.itinerary.itineraryNumber} - {currentSchedule.itinerary.customerName}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(currentSchedule.itinerary.startDate).toLocaleDateString()} - {new Date(currentSchedule.itinerary.endDate).toLocaleDateString()}
              </p>
              {currentSchedule.itinerary.vehicle && (
                <p className="text-sm text-gray-600 mt-1">
                  🚗 Vehicle: {currentSchedule.itinerary.vehicle.name} ({currentSchedule.itinerary.vehicle.plateNumber})
                </p>
              )}
            </div>
          )}

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

          {/* Loading State */}
          {isLoadingSchedule && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading schedule...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingSchedule && !currentSchedule && (
            <div className="text-center py-12">
              <p className="text-gray-500">No schedule found. Please select an itinerary.</p>
            </div>
          )}

          {/* Schedule List */}
          {!isLoadingSchedule && currentSchedule && (
            <div className="space-y-8">
              {Object.keys(groupedSchedule).map((destination) => (
                <div key={destination} className="bg-white p-4 shadow shadow-purple-300 rounded-lg">
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">{destination}</h3>
                  <div className="space-y-4">
                    {groupedSchedule[destination].map((trip: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
                        <div className="flex-1 flex items-center gap-6">
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTrip;
