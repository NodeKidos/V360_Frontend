import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import vehicleService from "../../../services/vehicle.service";
import { adminDriverService, type Driver } from "../../../services/admin.service";

export default function AddVehicle() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [vehicleData, setVehicleData] = useState<{
        vehicleName: string;
        vehicleType: string;
        vehicleNoPlate: string;
        vehicleModel: string;
        seatCount: string;
        assignDriver: string;
        status: string;
        vehicleImage: File | null;
    }>({
        vehicleName: "",
        vehicleType: "",
        vehicleNoPlate: "",
        vehicleModel: "",
        seatCount: "",
        assignDriver: "",
        status: "Active",
        vehicleImage: null,
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch drivers for dropdown
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await adminDriverService.getAllDrivers();
                console.log("Fetched drivers response:", response);
                console.log("Drivers array:", response.drivers);
                setDrivers(response.drivers || []);
            } catch (error) {
                console.error("Failed to fetch drivers", error);
                toast.error("Failed to load drivers list", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setDrivers([]);
            }
        };
        fetchDrivers();
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setVehicleData({ ...vehicleData, vehicleImage: event.target.files[0] });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVehicleData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!vehicleData.vehicleName || !vehicleData.vehicleType || !vehicleData.vehicleNoPlate ||
            !vehicleData.vehicleModel || !vehicleData.seatCount || !vehicleData.status) {
            toast.error("Please fill in all required fields", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            setLoading(true);

            // Map Status and Type
            let mappedStatus = "available";
            if (vehicleData.status === "Active") mappedStatus = "available";
            else if (vehicleData.status === "In Service") mappedStatus = "in_use";
            else if (vehicleData.status === "Need Repair") mappedStatus = "maintenance";

            let mappedType = vehicleData.vehicleType.toLowerCase();
            if (mappedType === "car") mappedType = "sedan";

            // Create Vehicle
            const newVehicle = await vehicleService.createVehicle({
                registrationNumber: vehicleData.vehicleNoPlate,
                type: mappedType,
                make: vehicleData.vehicleName,
                model: vehicleData.vehicleModel,
                seatingCapacity: parseInt(vehicleData.seatCount),
                status: mappedStatus,
                pricePerDay: 0, // Default or add field if needed
                year: new Date().getFullYear(), // Default
                color: "White", // Default
            });

            // Assign Driver if provided
            if (vehicleData.assignDriver && vehicleData.assignDriver !== "" && newVehicle.id) {
                await vehicleService.assignDriver(newVehicle.id, vehicleData.assignDriver);
            }

            toast.success("Vehicle added successfully!", {
                position: "top-right",
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate("/vehicle");
            }, 2000);

        } catch (error: any) {
            console.error("Create failed", error);
            const errorMessage = error?.response?.data?.message || "Failed to create vehicle";
            const displayMsg = Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage;
            toast.error(displayMsg, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Top Bar */}
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/vehicle")}>
                            Vehicle
                        </span>
                        <span className="text-gray-500"><MdKeyboardArrowRight /></span>
                        <span className="font-semibold text-black">Add Vehicle</span>
                    </div>

                    {/* Form Container */}
                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">

                        {/* Title */}
                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                                Add a Vehicle
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Details about Vehicle
                            </p>
                        </div>

                        {/* FORM START */}
                        <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>

                            {/* Vehicle Name + Vehicle Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Name</label>
                                    <input
                                        type="text"
                                        name="vehicleName"
                                        value={vehicleData.vehicleName}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle Name (e.g. Toyota)"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Type</label>
                                    <input
                                        type="text"
                                        name="vehicleType"
                                        value={vehicleData.vehicleType}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle Type (e.g. Sedan, SUV)"
                                    />
                                </div>
                            </div>

                            {/* Vehicle No plate + Vehicle Model */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle No Plate</label>
                                    <input
                                        type="text"
                                        name="vehicleNoPlate"
                                        value={vehicleData.vehicleNoPlate}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle No Plate"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Model</label>
                                    <input
                                        type="text"
                                        name="vehicleModel"
                                        value={vehicleData.vehicleModel}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle Model (e.g. Prius)"
                                    />
                                </div>
                            </div>

                            {/* Seat Count + Assign Driver */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Seat Count</label>
                                    <input
                                        type="number"
                                        name="seatCount"
                                        min="1"
                                        step="1"
                                        value={vehicleData.seatCount}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Seat Count"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assign Driver</label>
                                    <select
                                        name="assignDriver"
                                        value={vehicleData.assignDriver}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option value="">
                                            {drivers.length === 0 ? "No drivers available" : "Select a driver (optional)"}
                                        </option>
                                        {drivers.map((driver) => (
                                            <option key={driver.id} value={driver.id}>
                                                {driver.name || `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || 'Unknown Driver'}
                                            </option>
                                        ))}
                                    </select>
                                    {drivers.length === 0 && (
                                        <p className="text-gray-500 text-[12px] mt-1">
                                            No drivers found. Please add drivers first.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Vehicle Image */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                                {vehicleData.vehicleImage && <p className="text-gray-500 mt-2">{vehicleData.vehicleImage.name}</p>}
                            </div>

                            {/* Vehicle Status */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Active"
                                            checked={vehicleData.status === "Active"}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2 text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="In Service"
                                            checked={vehicleData.status === "In Service"}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2 text-gray-700">In Service</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Need Repair"
                                            checked={vehicleData.status === "Need Repair"}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2 text-gray-700">Need Repair</span>
                                    </label>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/vehicle")}
                                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                        {/* FORM END */}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}
