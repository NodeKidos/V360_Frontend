import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci"; // Edit icon
import { MdDeleteOutline } from "react-icons/md"; // Delete icon
import { useNavigate } from "react-router-dom"; // useNavigate hook
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import Pagination from "../../ui/Pagination";
import deleteicon from "../../../assets/delete.png"; // Delete icon image
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuListFilter } from "react-icons/lu"; // Filter icon
import { CiSearch } from "react-icons/ci"; // Search icon
import { IoMdAdd } from "react-icons/io"; // Add icon

const StaffManagement = () => {
  const navigate = useNavigate(); // Initialize the navigation function

  const [staff, setStaff] = useState([
    { id: "SI001", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", age: 25, accessLevel: "Staff", status: "Unblock", nic: "200080803520" },
    { id: "SI002", name: "Jessy", email: "jes@gmail.com", gender: "Female", contact: "+94 762347830", age: 30, accessLevel: "Admin", status: "Block", nic: "200080803521" },
    { id: "SI003", name: "Charlie", email: "charlie@gmail.com", gender: "Male", contact: "+94 773456789", age: 35, accessLevel: "Manager", status: "Unblock", nic: "200080803522" },
    { id: "SI004", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", age: 25, accessLevel: "Staff", status: "Unblock", nic: "200080803520" },
    { id: "SI005", name: "Jessy", email: "jes@gmail.com", gender: "Female", contact: "+94 762347830", age: 30, accessLevel: "Admin", status: "Block", nic: "200080803521" },
    { id: "SI006", name: "Charlie", email: "charlie@gmail.com", gender: "Male", contact: "+94 773456789", age: 35, accessLevel: "Manager", status: "Unblock", nic: "200080803522" },
    { id: "SI007", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", age: 25, accessLevel: "Staff", status: "Unblock", nic: "200080803520" },
    { id: "SI008", name: "Jessy", email: "jes@gmail.com", gender: "Female", contact: "+94 762347830", age: 30, accessLevel: "Admin", status: "Block", nic: "200080803521" },
    { id: "SI009", name: "Charlie", email: "charlie@gmail.com", gender: "Male", contact: "+94 773456789", age: 35, accessLevel: "Manager", status: "Unblock", nic: "200080803522" },
    // Add more staff records as required...
  ]);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [accessLevelFilter, setAccessLevelFilter] = useState("");

  // Filter staff based on search query, gender, and status
  const filteredStaff = staff.filter((staff) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      staff.id.toLowerCase().includes(searchLower) ||
      staff.name.toLowerCase().includes(searchLower) ||
      staff.email.toLowerCase().includes(searchLower) ||
      staff.contact.toLowerCase().includes(searchLower) ||
      staff.gender.toLowerCase().includes(searchLower) ||
      staff.age.toString().includes(searchLower) ||
      staff.accessLevel.toLowerCase().includes(searchLower) ||
      staff.status.toLowerCase().includes(searchLower) ||
      staff.nic.toLowerCase().includes(searchLower)
    );

    const matchesGender = genderFilter === "" || staff.gender === genderFilter;
    const matchesStatus = statusFilter === "" || staff.status === statusFilter;
    const matchesAccessLevel = accessLevelFilter === "" || staff.accessLevel === accessLevelFilter;

    return matchesSearch && matchesGender && matchesStatus && matchesAccessLevel;
  });

  const indexOfLastStaff = page * itemsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

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
  }, [searchQuery, genderFilter, statusFilter, accessLevelFilter]);

  // Navigate to EditStaff page
  const handleEditClick = (staffId: string) => {
    navigate(`/staff/edit/${staffId}`); // Navigate to the EditStaff page with the staffId
  };

  // Handle delete action
  const handleDeleteClick = (staffId: string) => {
    setSelectedStaffId(staffId); // Store the selected staff ID
    setDeleteConfirmationVisible(true); // Show confirmation overlay
  };

  // Confirm the delete action
  const confirmDelete = () => {
    setStaff(staff.filter((staff) => staff.id !== selectedStaffId));
    setDeleteConfirmationVisible(false);

    toast.success("Staff deleted successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Cancel delete action
  const cancelDelete = () => {
    setDeleteConfirmationVisible(false); // Hide the overlay
  };

  // Navigate to AddStaff page
  const handleAddStaffClick = () => {
    navigate("/staff/add"); // Navigate to AddStaff page
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
              Staff Management
            </h2>
            <button
              className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
              onClick={handleAddStaffClick}
            >
              Add <IoMdAdd className="text-[18px]" />
            </button>
          </div>

          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              Staff Management
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
                View & manage Staff Details
              </h4>

              {/* RIGHT: Filters */}
              <div className="flex items-center gap-3">
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
                  <option value="">Status</option>
                  <option value="Unblock">Unblock</option>
                  <option value="Block">Block</option>
                </select>

                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={accessLevelFilter}
                  onChange={(e) => setAccessLevelFilter(e.target.value)}
                >
                  <option value="">Access Level</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>

                <button
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                  onClick={() => {
                    setGenderFilter("");
                    setStatusFilter("");
                    setAccessLevelFilter("");
                    setSearchQuery("");
                  }}
                  title="Clear all filters"
                >
                  <LuListFilter className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 text-[#382A59] font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-center font-poppins">
                  <th className="px-4 py-4 whitespace-nowrap">Staff Id</th>
                  <th className="px-4 py-4 whitespace-nowrap">Staff Name</th>
                  <th className="px-4 py-4 whitespace-nowrap">Email</th>
                  <th className="px-4 py-4 whitespace-nowrap">Gender</th>
                  <th className="px-4 py-4 whitespace-nowrap">NIC</th>
                  <th className="px-4 py-4 whitespace-nowrap">Contact No</th>
                  <th className="px-4 py-4 whitespace-nowrap">Age</th>
                  <th className="px-4 py-4 whitespace-nowrap">Access Level</th>
                  <th className="px-4 py-4 whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 text-center whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="font-poppins">
                {currentStaff.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 text-center text-[13px] sm:text-[14px] md:text-[15px] hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{s.id}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{s.email}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{s.gender}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{s.nic}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{s.contact}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{s.age}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{s.accessLevel}</td>
                    <td className={`px-4 py-4 font-medium whitespace-nowrap ${s.status === "Unblock" ? "text-green-600" : "text-red-600"}`}>
                      {s.status}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-3 justify-center">
                        <CiEdit
                          className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                          onClick={() =>handleEditClick(s.id)}
                        />
                        <MdDeleteOutline
                          className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                          onClick={() => handleDeleteClick(s.id)}
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
            <Pagination currentPage={page} totalItems={filteredStaff.length} itemsPerPage={itemsPerPage} onPageChange={setPage} onItemsPerPageChange={setItemsPerPage} />
          </div>

          {/* Delete Confirmation Overlay */}
          {deleteConfirmationVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 z-50 p-4">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-[450px] relative">
                <button className="absolute top-2 right-2 text-gray-500 text-2xl" onClick={cancelDelete}>
                  &times;
                </button>
                <div className="mb-4 flex justify-center">
                  <img src={deleteicon} alt="Delete Confirmation" className="w-full max-w-[300px] h-auto object-contain" />
                </div>
                <h3 className="text-[16px] md:text-[18px] lg:text-[20px] text-center font-semibold font-inter mb-4">Are you sure you want to delete this?</h3>
                <div className="flex gap-3 md:gap-4 mt-4 md:mt-6 justify-center">
                  <button className="bg-[#E5E5E5] font-medium font-inter text-black px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#D5D5D5] text-[14px] md:text-[16px]" onClick={cancelDelete}>
                    Cancel
                  </button>
                  <button className="bg-[#B749DB] font-medium font-inter text-white px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#9f37c9] text-[14px] md:text-[16px]" onClick={confirmDelete}>
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

export default StaffManagement;
