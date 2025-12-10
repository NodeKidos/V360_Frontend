import { useState, useEffect } from "react";
import { CiEdit, CiSearch } from "react-icons/ci"; // Import the Edit icon
import { MdDeleteOutline } from "react-icons/md"; // Import the Delete icon
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import Pagination from "../../ui/Pagination";
import deleteicon from "../../../assets/delete.png"; // Import delete icon image
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuListFilter } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import vehicleService from "../../../services/vehicle.service";
import { Loader } from "../../ui/Loader";

const VehicleManagement = () => {
    const navigate = useNavigate(); // Initialize the navigation function

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [SeatCountFilter, setSeatCountFilter] = useState("");
    const [V_TypeFilter, setV_TypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await vehicleService.getAllVehicles({ limit: 1000 }); // Fetch all for now to keep client-side filtering working easily
            console.log("Raw vehicles response:", response.vehicles); // Debug: See raw data

            const mappedVehicles = response.vehicles.map(v => {
                let displayStatus = "Active";
                if (v.status === "available") displayStatus = "Active";
                else if (v.status === "in_use") displayStatus = "In Service";
                else if (v.status === "maintenance" || v.status === "out_of_service") displayStatus = "Need Repair";

                // Extract driver name - driver info is in driver.user relation
                let driverName = "Unassigned";
                if ((v as any).drivers && Array.isArray((v as any).drivers) && (v as any).drivers.length > 0) {
                    const driver = (v as any).drivers[0];
                    console.log(`Driver object for vehicle ${v.registrationNumber}:`, driver); // Debug driver object

                    // Driver entity has a 'user' relation where firstName/lastName are stored
                    if (driver.user) {
                        const firstName = driver.user.firstName || '';
                        const lastName = driver.user.lastName || '';
                        driverName = `${firstName} ${lastName}`.trim() || "Unknown Driver";
                    } else if (driver.name) {
                        // Fallback to name field if user relation not loaded
                        driverName = driver.name;
                    } else {
                        // Last fallback
                        const fullName = `${driver.firstName || ''} ${driver.lastName || ''}`.trim();
                        driverName = fullName || "Unknown Driver";
                    }
                }

                console.log(`Vehicle ${v.registrationNumber} - Final Driver Name:`, driverName); // Debug final name

                return {
                    id: v.id,
                    name: v.make || "Unknown",
                    type: v.type,
                    plate: v.registrationNumber,
                    model: v.model,
                    seats: v.seatingCapacity || 0,
                    driver: driverName,
                    status: displayStatus
                };
            });
            const normalizedVehicles = mappedVehicles; // No further normalization needed
            console.log("Mapped vehicles:", normalizedVehicles);

            setVehicles(normalizedVehicles);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };



    // Filter vehicle based on search query, V_Type,SeatCount, and status
    const filteredVehicles = vehicles.filter((vehicle) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            (vehicle.id && vehicle.id.toLowerCase().includes(searchLower)) ||
            (vehicle.name && vehicle.name.toLowerCase().includes(searchLower)) ||
            (vehicle.type && vehicle.type.toLowerCase().includes(searchLower)) ||
            (vehicle.plate && vehicle.plate.toLowerCase().includes(searchLower)) ||
            (vehicle.model && vehicle.model.toLowerCase().includes(searchLower)) ||
            String(vehicle.seats).toLowerCase().includes(searchLower) ||
            (vehicle.driver && vehicle.driver.toLowerCase().includes(searchLower)) ||
            (vehicle.status && vehicle.status.toLowerCase().includes(searchLower))
        );
        const matchesSeatCount = SeatCountFilter === "" || String(vehicle.seats) === SeatCountFilter;
        const matchesV_Type = V_TypeFilter === "" || vehicle.type === V_TypeFilter;
        // Check exact match for status or mapped status
        const matchesStatus = statusFilter === "" || vehicle.status === statusFilter || vehicle.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesV_Type && matchesStatus && matchesSeatCount;
    });

    const indexOfLastVehicle = page * itemsPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - itemsPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Initial Fetch
        fetchVehicles();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleEditClick = (vehicleId: string) => {
        navigate(`/vehicle/edit/${vehicleId}`);
    };

    const handleDeleteClick = (vehicleId: string) => {
        setSelectedVehicleId(vehicleId);
        setDeleteConfirmationVisible(true);
    };

    const confirmDelete = async () => {
        if (!selectedVehicleId) return;

        try {
            await vehicleService.deleteVehicle(selectedVehicleId);
            setVehicles(vehicles.filter((vehicle) => vehicle.id !== selectedVehicleId));
            toast.success("Vehicle deleted successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete vehicle");
        } finally {
            setDeleteConfirmationVisible(false);
            setSelectedVehicleId(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmationVisible(false);
    };

    const handleAddVehicleClick = () => {
        navigate("/vehicle/add");
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
                            Vehicle Management
                        </h2>
                        <button
                            className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
                            onClick={handleAddVehicleClick}
                        >
                            Add
                            <IoMdAdd className="text-[18px]" />
                        </button>
                    </div>
                    {/* TITLE - Mobile */}
                    <div className="mb-4 mt-4 md:hidden">
                        <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
                            Vehicle Management
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
                                    value={SeatCountFilter}
                                    onChange={(e) => setSeatCountFilter(e.target.value)}
                                >
                                    <option>Seat Count</option>
                                    <option>3</option>
                                    <option>5</option>
                                    <option>7</option>
                                    <option>9</option>
                                    <option>11</option>
                                </select>

                                <select
                                    className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                    value={V_TypeFilter}
                                    onChange={(e) => setV_TypeFilter(e.target.value)}
                                >                                    <option>V_Type</option>
                                    <option>Car</option>
                                    <option>Van</option>
                                    <option>SUV</option>
                                </select>

                                <select
                                    className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >                                    <option>Status</option>
                                    <option>Active</option>
                                    <option>In Service</option>
                                    <option>Need Repair</option>
                                </select>
                                <button
                                    className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                                    onClick={() => {
                                        setSeatCountFilter("");
                                        setV_TypeFilter("");
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
                                onClick={handleAddVehicleClick}
                            >
                                <IoMdAdd className="text-[20px]" />
                            </button>
                        </div>

                        {/* FILTERS - Mobile */}
                        <div className="flex items-center gap-2 justify-start">
                            <select
                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                                value={SeatCountFilter}
                                onChange={(e) => setSeatCountFilter(e.target.value)}
                            >
                                <option>Seat Count</option>
                                <option>3</option>
                                <option>5</option>
                                <option>7</option>
                                <option>9</option>
                                <option>11</option>
                            </select>

                            <select
                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                                value={V_TypeFilter}
                                onChange={(e) => setV_TypeFilter(e.target.value)}
                            >                                    <option>V_Type</option>
                                <option>Car</option>
                                <option>Van</option>
                                <option>SUV</option>
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
                                    setSeatCountFilter("");
                                    setV_TypeFilter("");
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
                    {loading ? (
                        <Loader src="/loaders/travelloading.lottie" message="Loading vehicles..." size={250} />
                    ) : (
                        <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-50 text-[#382A59] font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-center font-poppins">
                                        {/* <th className="px-3 py-3 whitespace-nowrap">Vehicle Id</th> */}
                                        <th className="px-3 py-3 whitespace-nowrap">V_Name</th>
                                        <th className="px-3 py-3 whitespace-nowrap">V_Type</th>
                                        <th className="px-3 py-3 whitespace-nowrap">V_No_Plate</th>
                                        <th className="px-3 py-3 whitespace-nowrap">V_Model</th>
                                        <th className="px-3 py-3 whitespace-nowrap">Seat_Count</th>
                                        <th className="px-3 py-3 whitespace-nowrap">Assign Driver</th>
                                        <th className="px-3 py-3 whitespace-nowrap">Active</th>
                                    </tr>
                                </thead>

                                <tbody className="font-poppins">
                                    {currentVehicles.map((v) => (
                                    <tr key={v.id} className="border-b border-gray-100 text-center text-[13px] sm:text-[14px] md:text-[15px] hover:bg-gray-50">
                                        {/* <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{v.id}</td> */}
                                        <td className="py-3 px-2 text-gray-600 whitespace-nowrap ">{v.name}</td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{v.type}</td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{v.plate}</td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{v.model}</td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{v.seats}</td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{v.driver}</td>
                                        <td className={`px-2 py-3 font-medium whitespace-nowrap ${v.status === "Active" ? "text-green-600" : v.status === "In Service" ? "text-[#FF8D28]" : "text-red-600"}`}>{v.status}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex gap-3 justify-center">
                                                <CiEdit
                                                    className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                                                    onClick={() => handleEditClick(v.id)}
                                                />
                                                <MdDeleteOutline
                                                    className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                                                    onClick={() => handleDeleteClick(v.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* PAGINATION */}
                    <div className="mt-4">
                        <Pagination
                            currentPage={page}
                            totalItems={vehicles.length}
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

export default VehicleManagement;
