import { useState, useEffect } from "react";
import { FaEye } from 'react-icons/fa';
import { LuListFilter } from 'react-icons/lu';
import { CiSearch } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Topbar';
import Pagination from '../ui/Pagination';
import Sidebar from '../AdminSidebar';
import { useDriverStore } from '../../store/useDriverStore';

const ItineraryDetails = () => {
  const [showItems, setShowItems] = useState(3); // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1); // Current page number

  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  const navigate = useNavigate();
  const { itineraries, isLoadingItineraries, fetchAssignedItineraries } = useDriverStore();

  // Fetch itineraries on mount
  useEffect(() => {
    fetchAssignedItineraries();
  }, [fetchAssignedItineraries]);

  // Filter itineraries based on search query, destination, and status
  const filteredItineraries = itineraries.filter((itinerary) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      itinerary.itineraryNumber?.toLowerCase().includes(searchLower) ||
      itinerary.customerName?.toLowerCase().includes(searchLower) ||
      itinerary.destination?.toLowerCase().includes(searchLower) ||
      itinerary.startDate?.toLowerCase().includes(searchLower) ||
      itinerary.endDate?.toLowerCase().includes(searchLower) ||
      itinerary.status?.toLowerCase().includes(searchLower)
    );

    const matchesDestination = destinationFilter === "" || itinerary.destination?.includes(destinationFilter);
    const matchesStatus = statusFilter === "" || itinerary.status === statusFilter;

    return matchesSearch && matchesDestination && matchesStatus;
  });

  // Calculate the data for the current page
  const indexOfLastItem = currentPage * showItems;
  const indexOfFirstItem = indexOfLastItem - showItems;
  const currentItineraries = filteredItineraries.slice(indexOfFirstItem, indexOfLastItem);

  // Handle window resizing for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

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
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {/* TITLE - Desktop with Add button */}
          <div className="mb-4 mt-4 hidden md:flex md:justify-between md:items-center">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
              Itinerary Details
            </h2>
          </div>
          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              Itinerary Details
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
          {/* VIEW & MANAGE SECTION - Desktop */}
          <div className="mb-6 hidden md:block">
            <div className="flex justify-between items-center p-2">
              {/* LEFT: Title */}
              <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px] lg:text-[18px]">
                View & manage Itinerary Details
              </h4>

              {/* RIGHT: Filters */}
              <div className="flex items-center gap-3 mt-4">
                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                >
                  <option value="">Destination</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Australia">Australia</option>
                </select>

                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="Started">Started</option>
                  <option value="Planned">Planned</option>
                </select>

                <button
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                  onClick={() => {
                    setDestinationFilter("");
                    setStatusFilter("");
                    setSearchQuery("");
                  }}
                  title="Clear all filters"
                >
                  <LuListFilter className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* VIEW & MANAGE SECTION - Mobile */}
          <div className="mb-6 md:hidden">
            <div className="flex justify-between items-center mb-4">
              {/* LEFT: Title */}
              <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px]">
                View & manage Tour Details
              </h4>
            </div>
            {/* FILTERS - Mobile */}
            <div className="flex items-center gap-2 justify-start">
              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
              >
                <option value="">Destination</option>
                <option value="Colombo">Colombo</option>
                <option value="Singapore">Singapore</option>
                <option value="Australia">Australia</option>
              </select>

              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Started">Started</option>
                <option value="Planned">Planned</option>
              </select>

              <button
                className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                onClick={() => {
                  setDestinationFilter("");
                  setStatusFilter("");
                  setSearchQuery("");
                }}
                title="Clear all filters"
              >
                <LuListFilter className="text-[18px]" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[14px] md:text-[16px] font-poppins">Itinerary #</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[14px] md:text-[16px] font-poppins">Customer</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[14px] md:text-[16px] font-poppins">Destinations</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[14px] md:text-[16px] font-poppins">Duration</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[14px] md:text-[16px] font-poppins">Trip Info</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[14px] md:text-[16px] font-poppins">Status</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700 text-[14px] md:text-[16px] font-poppins">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingItineraries ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      Loading itineraries...
                    </td>
                  </tr>
                ) : currentItineraries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No itineraries assigned yet
                    </td>
                  </tr>
                ) : (
                  currentItineraries.map((item) => {
                    const startDate = new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const endDate = new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-700 text-[14px] font-poppins font-medium">{item.itineraryNumber}</td>
                        <td className="p-4 text-sm text-gray-700 text-[14px] font-poppins">
                          <div>
                            <p className="font-medium">{item.customerName}</p>
                            <p className="text-xs text-gray-500">{item.numberOfParticipants} participants</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-700 text-[14px] font-poppins">
                          {item.allDestinations && item.allDestinations.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.allDestinations.slice(0, 2).map((dest: string, idx: number) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {dest}
                                </span>
                              ))}
                              {item.allDestinations.length > 2 && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                  +{item.allDestinations.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">{item.destination}</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-700 text-[14px] font-poppins">
                          <div>
                            <p className="font-medium">{item.totalDays || 0} Days</p>
                            <p className="text-xs text-gray-500">{startDate} - {endDate}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-700 text-[14px] font-poppins">
                          <div className="flex gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              🏨 {item.totalHotels || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              🎯 {item.totalExcursions || 0}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-poppins">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.status || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => navigate(`/driver/itinerary/${item.id}`)}
                            className="bg-[#B749DB] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-2 mx-auto"
                          >
                            <FaEye />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredItineraries.length}
              itemsPerPage={showItems}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setShowItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetails;
