import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci"; // Import the Edit icon
import { MdDeleteOutline } from "react-icons/md"; // Import the Delete icon
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import Pagination from "../../ui/Pagination";
import deleteicon from "../../../assets/delete.png"; // Import delete icon image
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuListFilter } from "react-icons/lu";
import { CiSearch } from "react-icons/ci"; // Import search icon

const TourManagement = () => {
  const navigate = useNavigate(); // Initialize the navigation function

  const [tours, setTour] = useState([
    { id: "TD001", name: "Alice", tour: "Beach", destination: "Colombo", startDate: "July 05, 2025", endDate: "July 08, 2025", status: "Completed" },
    { id: "TD002", name: "Alice", tour: "Beach", destination: "Colombo", startDate: "July 15, 2025", endDate: "July 18, 2025", status: "Pending" },
    { id: "TD003", name: "Alice", tour: "Beach", destination: "Kandy", startDate: "July 25, 2025", endDate: "July 28, 2025", status: "Completed" },
    { id: "TD004", name: "Alice", tour: "Beach", destination: "Colombo", startDate: "July 25, 2025", endDate: "July 28, 2025", status: "Started" },
    { id: "TD005", name: "Alice", tour: "Beach", destination: "Kandy", startDate: "July 25, 2025", endDate: "July 28, 2025", status: "Pending" },
    { id: "TD006", name: "Alice", tour: "Beach", destination: "Colombo", startDate: "July 25, 2025", endDate: "July 28, 2025", status: "Completed" },
    { id: "TD007", name: "Alice", tour: "Beach", destination: "Colombo", startDate: "July 25, 2025", endDate: "July 28, 2025", status: "Started" },
    { id: "TD008", name: "Alice", tour: "Beach", destination: "Colombo", startDate: "July 25, 2025", endDate: "July 28, 2025", status: "Initiated" },
  ]);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter customers based on search query, gender, and status
  const filteredCustomers = tours.filter((tour) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      tour.id.toLowerCase().includes(searchLower) ||
      tour.name.toLowerCase().includes(searchLower) ||
      tour.tour.toLowerCase().includes(searchLower) ||
      tour.destination.toLowerCase().includes(searchLower) ||
      tour.startDate.toLowerCase().includes(searchLower) ||
      tour.endDate.toLowerCase().includes(searchLower) ||
      tour.status.toLowerCase().includes(searchLower)
    );

    const matchesDestination = destinationFilter === "" || tour.destination === destinationFilter;
    const matchesStatus = statusFilter === "" || tour.status === statusFilter;

    return matchesSearch && matchesDestination && matchesStatus ;
  });

  const indexOfLastTour = page * itemsPerPage;
  const indexOfFirstTour = indexOfLastTour - itemsPerPage;
  const currentTour = filteredCustomers.slice(indexOfFirstTour, indexOfLastTour);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, destinationFilter, statusFilter]);

  // Navigate to EditCustomer page
  const handleEditClick = (tourId: string) => {
    navigate(`/tour/edit/${tourId}`); // Navigate to the EditCustomer page with the customerId
  };

  // Handle delete action
  const handleDeleteClick = (tourId: string) => {
    setSelectedTourId(tourId); // Store the selected customer ID
    setDeleteConfirmationVisible(true); // Show confirmation overlay
  };

  // Confirm the delete action
  const confirmDelete = () => {
    setTour(tours.filter((tour) => tour.id !== selectedTourId));
    setDeleteConfirmationVisible(false);

    toast.success("Tour deleted successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Cancel delete action
  const cancelDelete = () => {
    setDeleteConfirmationVisible(false); // Hide the overlay
  };

//   // Navigate to AddCustomer page
//   const handleAddCustomerClick = () => {
//     navigate("/user/add"); // Navigate to AddCustomer page
//   };

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
              Tour Management
            </h2>
            {/* <button
              className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
              onClick={handleAddCustomerClick}
            >
              Add
              <IoMdAdd className="text-[18px]" />
            </button> */}
          </div>

          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              Tour Management
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
                View & manage Tour Details
              </h4>

              {/* RIGHT: Filters */}
              <div className="flex items-center gap-3">
                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                >
                <option value="">Destination</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Badulla">Badulla</option>
                </select>

                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Started">Started</option>
                  <option value="Initiated">Initiated</option>
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

              {/* RIGHT: Add button */}
              {/* <button
                className="w-8 h-8 rounded-full border-2 border-[#B749DB] text-[#B749DB] flex items-center justify-center hover:bg-purple-50 cursor-pointer"
                onClick={handleAddCustomerClick}
              >
                <IoMdAdd className="text-[20px]" />
              </button> */}
            </div>

            {/* FILTERS - Mobile */}
            <div className="flex items-center gap-2 justify-start">
              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                >
                <option value="">Destination</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Badulla">Badulla</option>
                </select>
              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Started">Started</option>
                  <option value="Initiated">Initiated</option>
                </select>

              <button
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
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

          {/* TABLE - Both Desktop and Mobile (Horizontally Scrollable) */}
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 text-[#382A59] font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-left font-poppins">
                  <th className="px-4 py-4 whitespace-nowrap">Tour Id</th>
                  <th className="px-4 py-4 whitespace-nowrap">C_Name</th>
                  <th className="px-4 py-4 whitespace-nowrap">Tour</th>
                  <th className="px-4 py-4 whitespace-nowrap">Destination</th>
                  <th className="px-4 py-4 whitespace-nowrap">Start Date</th>
                  <th className="px-4 py-4 whitespace-nowrap">End date</th>
                  <th className="px-4 py-4 whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 text-center whitespace-nowrap"></th>
                </tr>
              </thead>

              <tbody className="font-poppins text-center">
                {currentTour.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 text-left text-[13px] sm:text-[14px] md:text-[15px] hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{t.id}</td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/40" className="w-8 h-8 md:w-9 md:h-9 rounded-full" alt={t.name} />
                        <span className="font-medium text-gray-800">{t.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{t.tour}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{t.destination}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{t.startDate}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{t.endDate}</td>

                    <td className={`px-4 py-4 font-medium whitespace-nowrap ${t.status === "Completed"? "text-green-500" : t.status === "Pending"? "text-orange-500" : t.status === "Started" ? "text-yellow-500" : "text-red-500"}`}>
                      {t.status}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-3 justify-center">
                        <CiEdit
                          className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                          onClick={() => handleEditClick(t.id)}
                        />
                        <MdDeleteOutline
                          className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                          onClick={() => handleDeleteClick(t.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>

          {/* Delete Confirmation Overlay */}
          {deleteConfirmationVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 z-50 p-4">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-[450px] relative">
                {/* Close icon at the top-right */}
                <button
                  className="absolute top-2 right-2 text-gray-500 text-2xl"
                  onClick={cancelDelete}
                >
                  &times;
                </button>

                {/* Image above confirmation message */}
                <div className="mb-4 flex justify-center">
                  <img
                    src={deleteicon}
                    alt="Delete Confirmation"
                    className="w-full max-w-[300px] h-auto object-contain"
                  />
                </div>

                <h3 className="text-[16px] md:text-[18px] lg:text-[20px] text-center font-semibold font-inter mb-4">
                  Are you sure you want to delete this?
                </h3>

                {/* Buttons */}
                <div className="flex gap-3 md:gap-4 mt-4 md:mt-6 justify-center">
                  <button
                    className="bg-[#E5E5E5] font-medium font-inter text-black px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#D5D5D5] text-[14px] md:text-[16px]"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>

                  <button
                    className="bg-[#B749DB] font-medium font-inter text-white px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#9f37c9] text-[14px] md:text-[16px]"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>

              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default TourManagement;