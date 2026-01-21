import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigate hook
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminDriverService } from "../../../services/admin.service";
import vehicleService, { type Vehicle } from "../../../services/vehicle.service";
import { PhoneInput } from "../../ui/PhoneInput";
import { Loader } from "../../ui/Loader";

interface DriverData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    dob: string;
    bloodGroup: string;
    nic: string;
    licenseNumber: string;
    licenseExpiry: string;
    languages: string;
    experienceYears: string;
    assignedVehicle: string;
    status: string;
    profileImage: File | null;
    licenseInfo: File | null;
    joinDate: string;
}

export default function AddDriver() {
    const navigate = useNavigate(); // Initialize the navigation function
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(true);
    const [driverData, setDriverData] = useState<DriverData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contact: "",
        dob: "",
        bloodGroup: "",
        nic: "",
        licenseNumber: "",
        licenseExpiry: "",
        languages: "",
        experienceYears: "",
        assignedVehicle: "",
        status: "",
        profileImage: null,
        licenseInfo: null,
        joinDate: "",
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch vehicles for dropdown
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setVehiclesLoading(true);
                const fetchedVehicles = await vehicleService.getVehiclesForDropdown();
                setVehicles(fetchedVehicles);
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
                toast.error("Failed to load vehicles. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setVehiclesLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDriverData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof DriverData) => {
        if (e.target.files && e.target.files.length > 0) {
            setDriverData((prevData) => ({ ...prevData, [field]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!driverData.firstName || !driverData.lastName || !driverData.email || !driverData.password ||
            !driverData.contact || !driverData.licenseNumber || !driverData.licenseExpiry) {
            toast.error("Please fill in all required fields", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }


        try {
            setLoading(true);

            await adminDriverService.createDriver({
                firstName: driverData.firstName,
                lastName: driverData.lastName,
                email: driverData.email,
                password: driverData.password,
                phone: driverData.contact,
                licenseNumber: driverData.licenseNumber,
                licenseExpiry: driverData.licenseExpiry,
                dateOfBirth: driverData.dob ? driverData.dob : undefined,
                bloodGroup: driverData.bloodGroup ? driverData.bloodGroup as any : undefined,
                nationalId: driverData.nic ? driverData.nic : undefined,
                languages: driverData.languages ? driverData.languages.split(',').map(l => l.trim()) : undefined,
                experienceYears: driverData.experienceYears ? parseInt(driverData.experienceYears) : undefined,
                assignedVehicleId: driverData.assignedVehicle ? driverData.assignedVehicle : undefined,
                status: driverData.status ? driverData.status as any : undefined,
                joinDate: driverData.joinDate ? driverData.joinDate : undefined,
                profileImage: driverData.profileImage || undefined,
                licenseImage: driverData.licenseInfo || undefined,
            });

            toast.success("Driver added successfully!", {
                position: "top-right",
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate("/driver");
            }, 2000);
        } catch (err: any) {
            console.error('Error creating driver:', err);
            console.error('Error response:', err?.response?.data);
            const errorMessage = err?.response?.data?.message || "Failed to add driver";
            toast.error(errorMessage, {
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
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/driver")}>
                            Driver
                        </span>
                        <span className="text-gray-500"><MdKeyboardArrowRight /></span>
                        <span className="font-semibold text-black">Add Driver</span>
                    </div>

                    {/* Form Container */}
                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
                        {/* Title */}
                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                                Add a Driver
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Details about the Driver
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <Loader src="/loaders/travelloading.lottie" message="Adding Driver..." size={250} />
                            </div>
                        ) : (
                            /* FORM START */
                            <form
                                className="mt-4 md:mt-6 space-y-4 md:space-y-6"
                                onSubmit={handleSubmit}
                            >
                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">First Name<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={driverData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Last Name<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={driverData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* Email & Contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Email<span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={driverData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No<span className="text-red-500">*</span></label>
                                        <div className="mt-1">
                                            <PhoneInput
                                                value={driverData.contact}
                                                onChange={(value) => setDriverData(prev => ({ ...prev, contact: value }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password & Profile Image */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Password<span className="text-red-500">*</span></label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={driverData.password}
                                            onChange={handleInputChange}
                                            required
                                            minLength={6}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Profile Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "profileImage")}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* License Number & License Expiry */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License Number<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            value={driverData.licenseNumber}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License Expiry<span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            name="licenseExpiry"
                                            value={driverData.licenseExpiry}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth & Blood Group */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={driverData.dob}
                                            onChange={handleInputChange}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={driverData.bloodGroup}
                                            onChange={handleInputChange}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option>A+</option>
                                            <option>B+</option>
                                            <option>O+</option>
                                            <option>AB-</option>
                                            <option>A-</option>
                                            <option>B-</option>
                                            <option>O-</option>
                                            <option>AB+</option>
                                        </select>
                                    </div>
                                </div>
                                {/* NIC */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">NIC</label>
                                        <input
                                            type="text"
                                            name="nic"
                                            value={driverData.nic}
                                            onChange={handleInputChange}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    {/* Assigned Vehicle */}
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assigned Vehicle</label>
                                        <select
                                            name="assignedVehicle"
                                            value={driverData.assignedVehicle}
                                            onChange={handleInputChange}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                            disabled={vehiclesLoading}
                                        >
                                            <option value="">
                                                {vehiclesLoading ? "Loading vehicles..." : "Select Vehicle"}
                                            </option>
                                            {vehicles.map((vehicle) => (
                                                <option key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {/* Languages & Experience Years */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Languages (comma separated)</label>
                                        <input
                                            type="text"
                                            name="languages"
                                            value={driverData.languages}
                                            onChange={handleInputChange}
                                            placeholder="e.g., English, Sinhala, Tamil"
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Experience Years</label>
                                        <input
                                            type="number"
                                            name="experienceYears"
                                            value={driverData.experienceYears}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Years of driving experience"
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* Status & Join Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                                        <select
                                            name="status"
                                            value={driverData.status}
                                            onChange={handleInputChange}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Join Date</label>
                                        <input
                                            type="date"
                                            name="joinDate"
                                            value={driverData.joinDate}
                                            onChange={handleInputChange}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>
                                {/* License Info */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License Info</label>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, "licenseInfo")}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/driver")}
                                        className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium disabled:bg-purple-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Adding..." : "Submit"}
                                    </button>
                                </div>
                            </form>
                        )}
                        {/* FORM END */}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}
