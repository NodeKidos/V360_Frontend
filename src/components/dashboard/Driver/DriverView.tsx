import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci"; // Edit icon
import { MdDeleteOutline } from "react-icons/md"; // Delete icon
import { useNavigate } from "react-router-dom"; // Navigate hook
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import Pagination from "../../ui/Pagination";
import deleteicon from "../../../assets/delete.png"; // Delete icon image
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuListFilter } from "react-icons/lu";
import { CiSearch } from "react-icons/ci"; // Search icon
import { IoMdAdd } from "react-icons/io"; // Add icon

const DriverManagement = () => {
    const navigate = useNavigate(); // Initialize the navigation function

    const [drivers, setDrivers] = useState([
        { id: "D001", name: "Alice", contact: "+94 768435606", email: "alice@gmail.com", bod: "03.04.1995", bloodGroup: "A+", nic: "200080803520", assignedVehicle: "Van #201", status: "Active" },
        { id: "D002", name: "Bob", contact: "+94 762347830", email: "bob@gmail.com", bod: "12.06.1992", bloodGroup: "B-", nic: "200080803521", assignedVehicle: "Van #202", status: "Inactive" },
        { id: "D003", name: "Charlie", contact: "+94 773456789", email: "charlie@gmail.com", bod: "10.11.1987", bloodGroup: "O+", nic: "200080803522", assignedVehicle: "Van #203", status: "Active" },
        { id: "D004", name: "Alice", contact: "+94 768435606", email: "alice@gmail.com", bod: "03.04.1995", bloodGroup: "A+", nic: "200080803520", assignedVehicle: "Van #204", status: "Active" },
        { id: "D005", name: "Bob", contact: "+94 762347830", email: "bob@gmail.com", bod: "12.06.1992", bloodGroup: "B-", nic: "200080803521", assignedVehicle: "Van #205", status: "Inactive" },
        { id: "D006", name: "Charlie", contact: "+94 773456789", email: "charlie@gmail.com", bod: "10.11.1987", bloodGroup: "O+", nic: "200080803522", assignedVehicle: "Van #206", status: "Active" },

    ]);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [bloodGroupFilter, setBloodGroupFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [assignedVehicleFilter, setAssignedVehicleFilter] = useState("");

    // Filter drivers based on search query, gender, and status
    const filteredDrivers = drivers.filter((driver) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            driver.id.toLowerCase().includes(searchLower) ||
            driver.name.toLowerCase().includes(searchLower) ||
            driver.contact.toLowerCase().includes(searchLower) ||
            driver.email.toLowerCase().includes(searchLower) ||
            driver.bod.toLowerCase().includes(searchLower) ||
            driver.bloodGroup.toLowerCase().includes(searchLower) ||
            driver.nic.toLowerCase().includes(searchLower) ||
            driver.assignedVehicle.toLowerCase().includes(searchLower) ||
            driver.status.toLowerCase().includes(searchLower)
        );

        const matchesBloodGroup = bloodGroupFilter === "" || driver.bloodGroup === bloodGroupFilter;
        const matchesAssignedVehicle = assignedVehicleFilter === "" || driver.assignedVehicle === assignedVehicleFilter;
        const matchesStatus = statusFilter === "" || driver.status === statusFilter;

        return matchesSearch && matchesAssignedVehicle && matchesStatus && matchesBloodGroup;
    });

    const indexOfLastDriver = page * itemsPerPage;
    const indexOfFirstDriver = indexOfLastDriver - itemsPerPage;
    const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver);

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
    }, [searchQuery, assignedVehicleFilter, statusFilter, bloodGroupFilter]);

    // Navigate to Edit Driver page
    const handleEditClick = (driverId: string) => {
        navigate(`/driver/edit/${driverId}`); // Navigate to the Edit Driver page with the driverId
    };

    // Handle delete action
    const handleDeleteClick = (driverId: string) => {
        setSelectedDriverId(driverId); // Store the selected driver ID
        setDeleteConfirmationVisible(true); // Show confirmation overlay
    };

    // Confirm the delete action
    const confirmDelete = () => {
        setDrivers(drivers.filter((driver) => driver.id !== selectedDriverId));
        setDeleteConfirmationVisible(false);

        toast.success("Driver deleted successfully!", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    // Cancel delete action
    const cancelDelete = () => {
        setDeleteConfirmationVisible(false); // Hide the overlay
    };

    // Navigate to Add Driver page
    const handleAddDriverClick = () => {
        navigate("/driver/add"); // Navigate to Add Driver page
    };
    const handleViewClick = (driverId: string) => {
        navigate(`/driver/${driverId}`);  // Navigates to the DriverInfo page with driverId in the URL
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
                            Driver Management
                        </h2>
                        <button
                            className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
                            onClick={handleAddDriverClick}
                        >
                            Add
                            <IoMdAdd className="text-[18px]" />
                        </button>
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
                                View & manage Driver Details
                            </h4>

                            {/* RIGHT: Filters */}
                            <div className="flex items-center gap-3">
                                <select
                                    className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                    value={bloodGroupFilter}
                                    onChange={(e) => setBloodGroupFilter(e.target.value)}
                                >
                                    <option value="">Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="B+">B+</option>
                                    <option value="O+">O+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="A-">A-</option>
                                    <option value="B-">B-</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                </select>


                                <select
                                    className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>

                                <select
                                    className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                    value={assignedVehicleFilter}
                                    onChange={(e) => setAssignedVehicleFilter(e.target.value)}
                                >
                                    <option value="">AssignedVehicle</option>
                                    <option value="Van #201">Van #201</option>
                                    <option value="Van #202">Van #202</option>
                                    <option value="Van #203">Van #203</option>
                                    <option value="Van #204">Van #204</option>
                                    <option value="Van #205">Van #205</option>
                                </select>

                                <button
                                    className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                                    onClick={() => {
                                        setAssignedVehicleFilter("");
                                        setBloodGroupFilter("");
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
                                View & manage Driver Details
                            </h4>

                            {/* RIGHT: Add button */}
                            <button
                                className="w-8 h-8 rounded-full border-2 border-[#B749DB] text-[#B749DB] flex items-center justify-center hover:bg-purple-50 cursor-pointer"
                                onClick={handleAddDriverClick}
                            >
                                <IoMdAdd className="text-[20px]" />
                            </button>
                        </div>

                        {/* FILTERS - Mobile */}
                        <div className="flex items-center gap-2 justify-start">
                            <select
                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                                value={bloodGroupFilter}
                                onChange={(e) => setBloodGroupFilter(e.target.value)}
                            >
                                <option value="">Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="B+">B+</option>
                                <option value="O+">O+</option>
                                <option value="AB-">AB-</option>
                                <option value="A-">A-</option>
                                <option value="B-">B-</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                            </select>
                            <select
                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                                value={assignedVehicleFilter}
                                onChange={(e) => setAssignedVehicleFilter(e.target.value)}
                            >
                                <option value="">AssignedVehicle</option>
                                <option value="Van #201">Van #201</option>
                                <option value="Van #202">Van #202</option>
                                <option value="Van #203">Van #203</option>
                                <option value="Van #204">Van #204</option>
                                <option value="Van #205">Van #205</option>
                            </select>

                            <select
                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <button
                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
                                onClick={() => {
                                    setAssignedVehicleFilter("");
                                    setBloodGroupFilter("");
                                    setStatusFilter("");
                                    setSearchQuery("");
                                }}
                                title="Clear all filters"
                            >
                                <LuListFilter className="text-[18px]" />
                            </button>
                        </div>
                    </div>
                    {/* TABLE */}
                    <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-50 text-[#382A59] font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-center font-poppins">
                                    <th className="px-4 py-4 whitespace-nowrap">Driver Id</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Driver Name</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Contact No</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Email</th>
                                    <th className="px-4 py-4 whitespace-nowrap">BOD</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Blood Group</th>
                                    <th className="px-4 py-4 whitespace-nowrap">NIC</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Assigned Vehicle</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Status</th>
                                    <th className="px-4 py-4 whitespace-nowrap"></th>
                                </tr>
                            </thead>

                            <tbody className="font-poppins">
                                {currentDrivers.map((d) => (
                                    <tr key={d.id} className="border-b border-gray-100 text-center text-[16px] sm:text-[16px] md:text-[16px] hover:bg-gray-50">
                                        <td className="py-3 px-2" onClick={() => handleViewClick(d.id)}>
                                            <span className="text-blue-500 cursor-pointer">{d.id}</span> {/* Make ID clickable */}
                                        </td>                                       
                                         <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src="https://i.pravatar.cc/40" className="w-8 h-8 md:w-9 md:h-9 rounded-full" alt={d.name} />
                                                <span className="font-medium text-gray-800">{d.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{d.contact}</td>
                                        <td className="py-4 px-4 text-gray-600">{d.email}</td>
                                        <td className="py-4 px-4 text-gray-600">{d.bod}</td>
                                        <td className="py-4 px-4 text-gray-600">{d.bloodGroup}</td>
                                        <td className="py-4 px-4 text-gray-600">{d.nic}</td>
                                        <td className="py-4 px-4 text-gray-600">{d.assignedVehicle}</td>
                                        <td className={`py-4 px-4 ${d.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                                            {d.status}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex gap-3 justify-center">
                                                <CiEdit className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => handleEditClick(d.id)} />
                                                <MdDeleteOutline className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => handleDeleteClick(d.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-4">
                        <Pagination currentPage={page} totalItems={filteredDrivers.length} itemsPerPage={itemsPerPage} onPageChange={setPage} onItemsPerPageChange={setItemsPerPage} />
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
                                    <button className="bg-[#E5E5E5] font-medium font-inter text-black px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#D5D5D5] text-[14px] md:text-[16px]" onClick={cancelDelete}>Cancel</button>
                                    <button className="bg-[#B749DB] font-medium font-inter text-white px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#9f37c9] text-[14px] md:text-[16px]" onClick={confirmDelete}>Delete</button>
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

export default DriverManagement;
