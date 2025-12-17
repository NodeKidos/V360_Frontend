import { useState, useEffect } from "react";
import { FaEye, FaPlayCircle } from 'react-icons/fa';
import { LuListFilter } from 'react-icons/lu'; // Import the filter icon
import { CiSearch } from 'react-icons/ci'; // Search Icon
import TopBar from '../Topbar';
import Pagination from '../ui/Pagination';
import Sidebar from '../AdminSidebar';

const ItineraryDetails = () => {
  const [showItems, setShowItems] = useState(3); // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1); // Current page number

  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  // Sample data for the table
  const itineraries = [
    { id: 'ID001', cName: 'Alice', destination: 'Colombo', tour: 'Lotus Tower', startDate: 'July 25, 2025', endDate: 'July 28, 2025', status: 'Started' },
    { id: 'ID002', cName: 'Bob', destination: 'Singapore', tour: 'Marina Bay Sands', startDate: 'Aug 25, 2025', endDate: 'Aug 28, 2025', status: 'Planned' },
    { id: 'ID003', cName: 'Charlie', destination: 'Australia', tour: 'Sydney Opera House', startDate: 'Sept 5, 2025', endDate: 'Sept 7, 2025', status: 'Planned' },
    { id: 'ID004', cName: 'Dave', destination: 'Colombo', tour: 'Galle Face', startDate: 'Oct 12, 2025', endDate: 'Oct 14, 2025', status: 'Started' },
    { id: 'ID005', cName: 'Eve', destination: 'Australia', tour: 'Great Barrier Reef', startDate: 'Nov 10, 2025', endDate: 'Nov 15, 2025', status: 'Planned' },
    { id: 'ID006', cName: 'Frank', destination: 'Singapore', tour: 'Sentosa Island', startDate: 'Dec 20, 2025', endDate: 'Dec 22, 2025', status: 'Started' },
    { id: 'ID007', cName: 'Grace', destination: 'Colombo', tour: 'Independence Memorial Hall', startDate: 'Jan 5, 2026', endDate: 'Jan 7, 2026', status: 'Planned' },
    { id: 'ID008', cName: 'Hank', destination: 'Australia', tour: 'Sydney Harbour Bridge', startDate: 'Feb 20, 2026', endDate: 'Feb 23, 2026', status: 'Started' },
  ];

  // Filter itineraries based on search query, destination, and status
  const filteredItineraries = itineraries.filter((itinerary) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      itinerary.id.toLowerCase().includes(searchLower) ||
      itinerary.cName.toLowerCase().includes(searchLower) ||
      itinerary.destination.toLowerCase().includes(searchLower) ||
      itinerary.tour.toLowerCase().includes(searchLower) ||
      itinerary.startDate.toLowerCase().includes(searchLower) ||
      itinerary.endDate.toLowerCase().includes(searchLower) ||
      itinerary.status.toLowerCase().includes(searchLower)
    );

    const matchesDestination = destinationFilter === "" || itinerary.destination === destinationFilter;
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
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">Itinerary id</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">C_Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">Destination</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">Tour</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">Start Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">End Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 text-[20px] font-poppins">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItineraries.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-700 text-[18px] font-poppins">{item.id}</td>
                    <td className="p-4 text-sm text-gray-700 text-[18px] font-poppins">{item.cName}</td>
                    <td className="p-4 text-sm text-gray-700 text-[18px] font-poppins">{item.destination}</td>
                    <td className="p-4 text-sm text-gray-700 text-[18px] font-poppins">{item.tour}</td>
                    <td className="p-4 text-sm text-gray-700 text-[18px] font-poppins">{item.startDate}</td>
                    <td className="p-4 text-sm text-gray-700 text-[18px] font-poppins">{item.endDate}</td>
                    <td className={`p-4 text-sm font-bold ${item.status === 'Started' ? 'text-red-500' : 'text-green-500'} text-[18px] font-poppins`}>{item.status}</td>
                    <td className="p-4 text-sm text-gray-700 text-[18px] font-poppins">
                      <button className="text-purple-500 cursor-pointer">
                        <FaEye className="inline mr-2" />
                        <FaPlayCircle className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
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
