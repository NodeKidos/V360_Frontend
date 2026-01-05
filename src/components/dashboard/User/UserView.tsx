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
import userService from "../../../services/user.service";
import type { User } from "../../../services/user.service";
import { Loader } from "../../ui/Loader";

const CustomerManagement = () => {
  const navigate = useNavigate(); // Initialize the navigation function

  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers('customer');
      // Ensure data is an array
      const userList = Array.isArray(data) ? data : (data as any).data || [];
      console.log(userList);

      setCustomers(userList);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string | undefined): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter customers based on search query, gender, and status
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim().toLowerCase();
    const customerCountry = customer.customer?.country || customer.country;
    const customerGender = customer.customer?.gender || customer.gender;
    const customerPassport = customer.customer?.passportNumber || customer.passportNumber;
    const customerContact = customer.phone || customer.contact;

    const matchesSearch = (
      (customer.id && customer.id.toLowerCase().includes(searchLower)) ||
      fullName.includes(searchLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customerPassport && customerPassport.toLowerCase().includes(searchLower)) ||
      (customerContact && customerContact.toLowerCase().includes(searchLower)) ||
      (customerCountry && customerCountry.toLowerCase().includes(searchLower))
    );

    const matchesCountry = countryFilter === "" || (customerCountry && customerCountry === countryFilter);
    const matchesGender = genderFilter === "" || (customerGender && customerGender === genderFilter);
    const statusStr = (customer.status || "").toLowerCase();
    const isUserActive = statusStr === "active";
    const statusLabel = isUserActive ? "Unblock" : "Block";
    const matchesStatus = statusFilter === "" || statusLabel === statusFilter;

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
    console.log("✏️ Edit customer clicked:", customerId);
    if (!customerId) {
      console.error("❌ Cannot edit: customerId is missing");
      return;
    }
    navigate(`/user/edit/${customerId}`); // Navigate to the EditCustomer page with the customerId
  };

  // Handle delete action
  const handleDeleteClick = (customerId: string) => {
    console.log("🗑️ Delete customer clicked:", customerId);
    setSelectedCustomerId(customerId); // Store the selected customer ID
    setDeleteConfirmationVisible(true); // Show confirmation overlay
  };

  // Confirm the delete action
  const confirmDelete = async () => {
    if (!selectedCustomerId) return;

    try {
      await userService.deleteUser(selectedCustomerId);
      setCustomers(customers.filter((customer) => customer.id !== selectedCustomerId));
      toast.success("Customer deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteConfirmationVisible(false);
      setSelectedCustomerId(null);
    }
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
                View & manage Customer Details
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
                View & manage Customer Details
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
          {loading ? (
            <Loader src="/loaders/travelloading.lottie" message="Loading customers..." size={250} />
          ) : (
            <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 text-[#382A59] font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-left font-poppins">
                    {/* <th className="px-4 py-4 whitespace-nowrap">Customer Id</th> */}
                    <th className="px-4 py-4 whitespace-nowrap">Customer Name</th>
                    <th className="px-4 py-4 whitespace-nowrap">Email</th>
                    <th className="px-4 py-4 whitespace-nowrap">Gender</th>
                    <th className="px-4 py-4 whitespace-nowrap">Contact No</th>
                    <th className="px-4 py-4 whitespace-nowrap">Country</th>
                    <th className="px-4 py-4 whitespace-nowrap">Passport No</th>
                    <th className="px-4 py-4 whitespace-nowrap">Age</th>
                    <th className="px-4 py-4 whitespace-nowrap">Status</th>
                    <th className="px-4 py-4 text-center whitespace-nowrap"></th>
                  </tr>
                </thead>

                <tbody className="font-poppins">
                  {currentCustomers.map((c) => {
                    // Get customer data from customer relation or fallback to legacy fields
                    const customerGender = c.customer?.gender || c.gender;
                    const customerContact = c.phone || c.contact;
                    const customerCountry = c.customer?.country || c.country;
                    const customerPassport = c.customer?.passportNumber || c.passportNumber;
                    const customerAge = c.customer?.dateOfBirth ? calculateAge(c.customer.dateOfBirth) : c.age;

                    return (
                      <tr key={c.id} className="border-b border-gray-100 text-left text-[12px] sm:text-[13px] md:text-[14px] hover:bg-gray-50">
                        {/* <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{c.id}</td> */}

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/40" className="w-8 h-8 md:w-9 md:h-9 rounded-full" alt={c.firstName} />
                            <span className="font-medium text-gray-800">{c.firstName} {c.lastName}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.email}</td>
                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{customerGender || "N/A"}</td>
                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{customerContact || "N/A"}</td>
                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{customerCountry || "N/A"}</td>
                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{customerPassport || "N/A"}</td>
                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{customerAge || "N/A"}</td>

                        <td className={`px-4 py-4 font-medium whitespace-nowrap ${(c.status || "").toLowerCase() === "active" ? "text-green-600" : "text-red-600"}`}>
                          {(c.status || "").toLowerCase() === "active" ? "Unblock" : "Block"}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

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