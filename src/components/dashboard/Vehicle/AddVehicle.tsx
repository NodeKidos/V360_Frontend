import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import vehicleService from "../../../services/vehicle.service";
import { adminDriverService, type Driver } from "../../../services/admin.service";
import { SearchableSelect } from "../../ui/SearchableSelect";

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
        fuelType: string;
        nextServiceDate: string;
        assignDriver: string;
        status: string;
        vehicleImages: File[];
        year: string;
        color: string;
        pricePerDay: string;
        mileage: string;
    }>({
        vehicleName: "",
        vehicleType: "",
        vehicleNoPlate: "",
        vehicleModel: "",
        seatCount: "",
        fuelType: "diesel",
        nextServiceDate: "",
        assignDriver: "",
        status: "Active",
        vehicleImages: [],
        year: new Date().getFullYear().toString(),
        color: "White",
        pricePerDay: "0",
        mileage: "0",
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setVehicleData({ ...vehicleData, vehicleImages: Array.from(event.target.files) });
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

            const mappedType = vehicleData.vehicleType.toLowerCase();

            // Prepare FormData for multipart upload
            const formData = new FormData();
            formData.append('registrationNumber', vehicleData.vehicleNoPlate);
            formData.append('type', mappedType);
            formData.append('make', vehicleData.vehicleName);
            formData.append('model', vehicleData.vehicleModel);
            formData.append('seatingCapacity', vehicleData.seatCount);
            formData.append('fuelType', vehicleData.fuelType);
            formData.append('status', mappedStatus);
            formData.append('pricePerDay', vehicleData.pricePerDay);
            formData.append('year', vehicleData.year);
            formData.append('color', vehicleData.color);
            formData.append('mileage', vehicleData.mileage);

            if (vehicleData.nextServiceDate) {
                formData.append('nextServiceDate', vehicleData.nextServiceDate);
            }

            vehicleData.vehicleImages.forEach((image) => {
                formData.append('newImages', image);
            });

            // Create Vehicle
            const newVehicle = await vehicleService.createVehicle(formData);

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
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle Name (e.g. Toyota)"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Type</label>
                                    <SearchableSelect
                                        options={[
                                            { label: "Sedan", value: "sedan" },
                                            { label: "SUV", value: "suv" },
                                            { label: "Van", value: "van" },
                                            { label: "Minibus", value: "minibus" },
                                            { label: "Bus", value: "bus" },
                                            { label: "Luxury", value: "luxury" }
                                        ]}
                                        value={vehicleData.vehicleType}
                                        onChange={(value) => setVehicleData(prev => ({ ...prev, vehicleType: value }))}
                                        placeholder="Select Type"
                                        className="w-full mt-1"
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
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
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
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle Model (e.g. Prius)"
                                    />
                                </div>
                            </div>

                            {/* Seat Count + Fuel Type */}
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
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Seat Count"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Fuel Type</label>
                                    <SearchableSelect
                                        options={[
                                            { label: "Diesel", value: "diesel" },
                                            { label: "Petrol", value: "petrol" },
                                            { label: "Electric", value: "electric" },
                                            { label: "Hybrid", value: "hybrid" }
                                        ]}
                                        value={vehicleData.fuelType}
                                        onChange={(value) => setVehicleData(prev => ({ ...prev, fuelType: value }))}
                                        placeholder="Select Fuel Type"
                                        className="w-full mt-1"
                                    />
                                </div>
                            </div>

                            {/* Year + Color */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        min="1990"
                                        max="2027"
                                        value={vehicleData.year}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Year (1990-2027)"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Color</label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={vehicleData.color}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Color (e.g. White)"
                                    />
                                </div>
                            </div>

                            {/* Price Per Day + Mileage */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Price Per Day (LKR)</label>
                                    <input
                                        type="number"
                                        name="pricePerDay"
                                        min="0"
                                        step="0.01"
                                        value={vehicleData.pricePerDay}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Price Per Day"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Mileage (km)</label>
                                    <input
                                        type="number"
                                        name="mileage"
                                        min="0"
                                        value={vehicleData.mileage}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Current Mileage"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Images */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins font-semibold">Vehicle Images</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                                {vehicleData.vehicleImages.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 font-poppins">{vehicleData.vehicleImages.length} image(s) selected</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
                                            {vehicleData.vehicleImages.map((file, index) => (
                                                <div key={index} className="relative border border-purple-200 rounded-lg p-1 group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setVehicleData({
                                                            ...vehicleData,
                                                            vehicleImages: vehicleData.vehicleImages.filter((_, i) => i !== index)
                                                        })}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Next Service Date + Assign Driver */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Next Service Date (Optional)</label>
                                    <input
                                        type="date"
                                        name="nextServiceDate"
                                        value={vehicleData.nextServiceDate}
                                        onChange={handleChange}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assign Driver</label>
                                    <SearchableSelect
                                        options={drivers.map((driver) => ({
                                            label: driver.name || `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || 'Unknown Driver',
                                            value: driver.id
                                        }))}
                                        value={vehicleData.assignDriver}
                                        onChange={(value) => setVehicleData(prev => ({ ...prev, assignDriver: value }))}
                                        placeholder={drivers.length === 0 ? "No drivers available" : "Select a driver (optional)"}
                                        disabled={drivers.length === 0}
                                        className="w-full mt-1"
                                    />
                                    {drivers.length === 0 && (
                                        <p className="text-gray-500 text-[12px] mt-1">
                                            No drivers found. Please add drivers first.
                                        </p>
                                    )}
                                </div>
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
            </div >
        </div >
    );
}
