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
import { IoMdAdd } from "react-icons/io"; // Import add icon

const CustomerManagement = () => {
  const navigate = useNavigate(); // Initialize the navigation function

  const [customers, setCustomers] = useState([
    { id: "CI001", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Australia", passport: "P4366918", age: 35, status: "Unblock" },
    { id: "CI002", name: "Jessy", email: "jes@gmail.com", gender: "Female", contact: "+94 762347830", country: "Singapore", passport: "E5787905H", age: 23, status: "Unblock" },
    { id: "CI003", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Canada", passport: "LA123456", age: 35, status: "Block" },
    { id: "CI004", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Australia", passport: "P4366918", age: 35, status: "Unblock" },
    { id: "CI005", name: "Jessy", email: "jes@gmail.com", gender: "Female", contact: "+94 762347830", country: "Singapore", passport: "E5787905H", age: 23, status: "Block" },
    { id: "CI006", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Canada", passport: "LA123456", age: 35, status: "Block" }
  ]);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  // Filter customers based on search query, gender, and status
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      customer.id.toLowerCase().includes(searchLower) ||
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.gender.toLowerCase().includes(searchLower) ||
      customer.contact.toLowerCase().includes(searchLower) ||
      customer.country.toLowerCase().includes(searchLower) ||
      customer.passport.toLowerCase().includes(searchLower) ||
      customer.age.toString().includes(searchLower) ||
      customer.status.toLowerCase().includes(searchLower)
    );

    const matchesCountry = countryFilter === "" || customer.country === countryFilter;
    const matchesGender = genderFilter === "" || customer.gender === genderFilter;
    const matchesStatus = statusFilter === "" || customer.status === statusFilter;

    return matchesSearch && matchesGender && matchesStatus && matchesCountry;
  });

  const indexOfLastCustomer = page * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

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
  }, [searchQuery, genderFilter, statusFilter]);

  // Navigate to EditCustomer page
  const handleEditClick = (customerId: string) => {
    navigate(`/user/edit/${customerId}`); // Navigate to the EditCustomer page with the customerId
  };

  // Handle delete action
  const handleDeleteClick = (customerId: string) => {
    setSelectedCustomerId(customerId); // Store the selected customer ID
    setDeleteConfirmationVisible(true); // Show confirmation overlay
  };

  // Confirm the delete action
  const confirmDelete = () => {
    setCustomers(customers.filter((customer) => customer.id !== selectedCustomerId));
    setDeleteConfirmationVisible(false);

    toast.success("Customer deleted successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Cancel delete action
  const cancelDelete = () => {
    setDeleteConfirmationVisible(false); // Hide the overlay
  };

  // Navigate to AddCustomer page
  const handleAddCustomerClick = () => {
    navigate("/user/add"); // Navigate to AddCustomer page
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
              Customer Management
            </h2>
            <button
              className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
              onClick={handleAddCustomerClick}
            >
              Add
              <IoMdAdd className="text-[18px]" />
            </button>
          </div>

          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              Customer Management
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
                View & manage vehicle Details
              </h4>

              {/* RIGHT: Filters */}
              <div className="flex items-center gap-3">
                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                >
                  <option value="">Country</option>
                  <option value="Singapore">Singapore</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
                </select>

                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Active</option>
                  <option value="Unblock">Unblock</option>
                  <option value="Block">Block</option>
                </select>

                <button
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                  onClick={() => {
                    setGenderFilter("");
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
              <button
                className="w-8 h-8 rounded-full border-2 border-[#B749DB] text-[#B749DB] flex items-center justify-center hover:bg-purple-50 cursor-pointer"
                onClick={handleAddCustomerClick}
              >
                <IoMdAdd className="text-[20px]" />
              </button>
            </div>

            {/* FILTERS - Mobile */}
            <div className="flex items-center gap-2 justify-start">
              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">Country</option>
                <option value="Singapore">Singapore</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
              </select>
              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Unblock">Unblock</option>
                <option value="Block">Block</option>
              </select>

              <button
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
                onClick={() => {
                  setGenderFilter("");
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
                <tr className="bg-gray-50 text-[#382A59] font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-left font-poppins">
                  <th className="px-4 py-4 whitespace-nowrap">Customer Id</th>
                  <th className="px-4 py-4 whitespace-nowrap">C_Name</th>
                  <th className="px-4 py-4 whitespace-nowrap">Email</th>
                  <th className="px-4 py-4 whitespace-nowrap">Gender</th>
                  <th className="px-4 py-4 whitespace-nowrap">Contact_No</th>
                  <th className="px-4 py-4 whitespace-nowrap">Country</th>
                  <th className="px-4 py-4 whitespace-nowrap">Passport_No</th>
                  <th className="px-4 py-4 whitespace-nowrap">Age</th>
                  <th className="px-4 py-4 whitespace-nowrap">Active</th>
                  <th className="px-4 py-4 text-center whitespace-nowrap"></th>
                </tr>
              </thead>

              <tbody className="font-poppins">
                {currentCustomers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 text-left text-[12px] sm:text-[13px] md:text-[14px] hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{c.id}</td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/40" className="w-8 h-8 md:w-9 md:h-9 rounded-full" alt={c.name} />
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.email}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.gender}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.contact}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.country}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.passport}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.age}</td>

                    <td className={`px-4 py-4 font-medium whitespace-nowrap ${c.status === "Unblock" ? "text-green-600" : "text-red-600"}`}>
                      {c.status}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-3 justify-center">
                        <CiEdit
                          className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                          onClick={() => handleEditClick(c.id)}
                        />
                        <MdDeleteOutline
                          className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                          onClick={() => handleDeleteClick(c.id)}
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

export default CustomerManagement;