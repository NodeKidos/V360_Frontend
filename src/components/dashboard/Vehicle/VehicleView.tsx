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

const VehicleManagement = () => {
    const navigate = useNavigate(); // Initialize the navigation function

    const [vehicles, setVehicles] = useState([
        { id: "V001", name: "Car #201", type: "Car", plate: "NP QL-9504", model: "Toyota", seats: 3, driver: "John", status: "Active" },
        { id: "V002", name: "Car #202", type: "Car", plate: "NP QL-9505", model: "Toyota", seats: 3, driver: "Jane", status: "In Service" },
        { id: "V003", name: "Van #301", type: "Van", plate: "NP QL-9506", model: "Toyota", seats: 9, driver: "John", status: "Active" },
        { id: "V004", name: "Car #401", type: "Car", plate: "NP QL-9804", model: "Toyota", seats: 3, driver: "John", status: "Need Rapir" },
        { id: "V005", name: "Car #302", type: "Car", plate: "NP QL-9705", model: "Toyota", seats: 5, driver: "Jane", status: "In Service" },
        { id: "V006", name: "Van #402", type: "SUV", plate: "NP QL-9308", model: "Toyota", seats: 9, driver: "John", status: "Active" },
        // Add other vehicles similarly...
    ]);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const indexOfLastVehicle = page * itemsPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - itemsPerPage;
    const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleEditClick = (vehicleId: string) => {
        navigate(`/vehicle/edit/${vehicleId}`);
    };

    const handleDeleteClick = (vehicleId: string) => {
        setSelectedVehicleId(vehicleId);
        setDeleteConfirmationVisible(true);
    };

    const confirmDelete = () => {
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== selectedVehicleId));
        setDeleteConfirmationVisible(false);

        toast.success("Vehicle deleted successfully!", {
            position: "top-right",
            autoClose: 2000,
        });
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
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />
                    {/* TITLE */}
                    <div className="flex justify-between items-center mb-4 mt-4">
                        <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
                            Vehicle Management
                        </h2>

                        <button
                            className="bg-[#B749DB] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[14px] md:text-[16px] cursor-pointer whitespace-nowrap"
                            onClick={handleAddVehicleClick}
                        >
                            + Add Customer
                        </button>
                    </div>
                    {/* FILTERS */}
                    <div className="mb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* LEFT: Title */}
                            <h4 className="font-poppins font-semibold text-black text-[16px] sm:text-[18px] lg:text-[20px]">
                                View & manage Customer Details
                            </h4>

                            {/* RIGHT: Filters */}
                            <div className="flex items-center gap-2 sm:gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                                <select className="border border-[#B749DB] text-[#B749DB] rounded-lg px-2 sm:px-3 py-2 text-[12px] sm:text-[14px] font-poppins flex-1 sm:flex-none">
                                    <option>Seat Count</option>
                                    <option>3</option>
                                    <option>5</option>
                                    <option>7</option>
                                    <option>9</option>
                                    <option>11</option>
                                </select>

                                <select className="border border-[#B749DB] text-[#B749DB] rounded-lg px-2 sm:px-3 py-2 text-[12px] sm:text-[14px] font-poppins flex-1 sm:flex-none">
                                    <option>V_Type</option>
                                    <option>Car</option>
                                    <option>Van</option>
                                    <option>SUV</option>
                                </select>

                                <select className="border border-[#B749DB] text-[#B749DB] rounded-lg px-2 sm:px-3 py-2 text-[12px] sm:text-[14px] font-poppins flex-1 sm:flex-none">
                                    <option>Status</option>
                                    <option>Active</option>
                                    <option>In Service</option>
                                    <option>Need Repair</option>
                                </select>
                                <button className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50">
                                    <LuListFilter className="text-[18px]" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-50 text-[#382A59] font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-center font-poppins">
                                    <th className="px-3 py-3 whitespace-nowrap">Vehicle Id</th>
                                    <th className="px-3 py-3">V_Name</th>
                                    <th className="px-3 py-3">V_Type</th>
                                    <th className="px-3 py-3">V_No_Plate</th>
                                    <th className="px-3 py-3">V_Model</th>
                                    <th className="px-3 py-3">Seat_Count</th>
                                    <th className="px-3 py-3">Assign Driver</th>
                                    <th className="px-3 py-3">Active</th>
                                </tr>
                            </thead>
                            <tbody className="font-poppins">
                                {currentVehicles.map((v) => (
                                    <tr key={v.id} className="border-b border-gray-100 text-center text-[12px] sm:text-[13px] md:text-[14px] hover:bg-gray-50">
                                        <td className="py-3 px-2">{v.id}</td>
                                        <td className="py-3 px-2">{v.name}</td>
                                        <td className="px-2 py-3">{v.type}</td>
                                        <td className="px-2 py-3">{v.plate}</td>
                                        <td className="px-2 py-3">{v.model}</td>
                                        <td className="px-2 py-3">{v.seats}</td>
                                        <td className="px-2 py-3">{v.driver}</td>
                                        <td className={`px-2 py-3 font-medium ${v.status === "Active" ? "text-green-600" : v.status === "In Service" ? "text-[#FF8D28]" : "text-red-600"}`}>{v.status}</td>
                                        <td className="px-2 py-3">
                                            <div className="flex gap-2 justify-center">
                                                <CiEdit
                                                    className="text-[#B749DB] cursor-pointer text-[18px] md:text-[20px] hover:text-purple-700"
                                                    onClick={() => handleEditClick(v.id)}
                                                />
                                                <MdDeleteOutline
                                                    className="text-[#B749DB] cursor-pointer text-[18px] md:text-[20px] hover:text-purple-700"
                                                    onClick={() => handleDeleteClick(v.id)}
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
