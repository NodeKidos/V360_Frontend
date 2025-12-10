import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Navigate hook
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import driverService from "../../../services/driver.service";
import vehicleService, { type Vehicle } from "../../../services/vehicle.service";

interface DriverData {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
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
    dob: string;
    bloodGroup: string;
}

export default function EditDriver() {
    const navigate = useNavigate(); // Initialize the navigation function
    const { driverId } = useParams<{ driverId: string }>(); // Get driver ID from URL
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(true);

    // Initialize driver data
    const [driverData, setDriverData] = useState<DriverData>({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
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
        dob: "",
        bloodGroup: "",
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

    // Fetch driver data
    useEffect(() => {
        const fetchDriver = async () => {
            if (!driverId) {
                toast.error("Driver ID not found", {
                    position: "top-right",
                    autoClose: 3000,
                });
                navigate("/driver");
                return;
            }

            try {
                setFetchLoading(true);
                const driver = await driverService.getDriverById(driverId);

                // Parse name into firstName and lastName
                const nameParts = driver.name ? driver.name.split(' ') : ['', ''];
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                setDriverData({
                    firstName,
                    lastName,
                    email: driver.email,
                    contact: driver.contact,
                    nic: driver.nic,
                    licenseNumber: driver.licenseNumber || '',
                    licenseExpiry: driver.licenseExpiry ? driver.licenseExpiry.split('T')[0] : '',
                    languages: driver.languages ? (Array.isArray(driver.languages) ? driver.languages.join(', ') : driver.languages) : '',
                    experienceYears: driver.experienceYears ? driver.experienceYears.toString() : '',
                    assignedVehicle: driver.assignedVehicleDetails?.id || '',
                    status: driver.status || 'Active',
                    profileImage: null,
                    licenseInfo: null,
                    joinDate: driver.joinDate ? driver.joinDate.split('T')[0] : '',
                    dob: driver.dateOfBirth ? driver.dateOfBirth.split('T')[0] : '',
                    bloodGroup: driver.bloodGroup || '',
                });
            } catch (err: any) {
                const errorMessage = err?.response?.data?.message || "Failed to fetch driver data";
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 3000,
                });
                navigate("/driver");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchDriver();
    }, [driverId, navigate]);

    // Form submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!driverId) return;

        // Validation
        if (!driverData.firstName || !driverData.lastName || !driverData.email || !driverData.contact ||
            !driverData.licenseNumber || !driverData.licenseExpiry) {
            toast.error("Please fill in all required fields", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            setLoading(true);
            await driverService.updateDriver(driverId, {
                name: `${driverData.firstName} ${driverData.lastName}`,
                email: driverData.email,
                contact: driverData.contact,
                dateOfBirth: driverData.dob ? driverData.dob : undefined,
                bloodGroup: driverData.bloodGroup ? driverData.bloodGroup as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' : undefined,
                nic: driverData.nic ? driverData.nic : undefined,
                licenseNumber: driverData.licenseNumber,
                licenseExpiry: driverData.licenseExpiry,
                languages: driverData.languages ? driverData.languages.split(',').map(l => l.trim()) : undefined,
                experienceYears: driverData.experienceYears ? parseInt(driverData.experienceYears) : undefined,
                assignedVehicle: driverData.assignedVehicle ? driverData.assignedVehicle : undefined,
                status: driverData.status ? driverData.status as 'Active' | 'Inactive' : undefined,
                joinDate: driverData.joinDate ? driverData.joinDate : undefined,
                profileImage: driverData.profileImage || undefined,
                licenseInfo: driverData.licenseInfo || undefined,
            });

            toast.success("Driver updated successfully!", {
                position: "top-right",
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate("/driver");
            }, 2000);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || "Failed to update driver";
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof DriverData) => {
        if (e.target.files && e.target.files.length > 0) {
            setDriverData((prevData) => ({ ...prevData, [field]: e.target.files![0] }));
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
                        <span className="text-gray-500">
                            <MdKeyboardArrowRight />
                        </span>
                        <span className="font-semibold text-black">Edit Driver</span>
                    </div>

                    {/* Form Container */}
                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                        {/* Title */}
                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                                Edit a Driver
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Update the driver details
                            </p>
                        </div>

                        {fetchLoading ? (
                            <div className="mt-6 text-center text-gray-500">Loading driver data...</div>
                        ) : (
                            /* FORM START */
                            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">First Name<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={driverData.firstName}
                                            onChange={(e) => setDriverData({ ...driverData, firstName: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Last Name<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={driverData.lastName}
                                            onChange={(e) => setDriverData({ ...driverData, lastName: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* Email & Contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Email<span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            value={driverData.email}
                                            onChange={(e) => setDriverData({ ...driverData, email: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No<span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            value={driverData.contact}
                                            onChange={(e) => setDriverData({ ...driverData, contact: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* Profile Image & License Info File */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Profile Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "profileImage")}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License Info</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, "licenseInfo")}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* License Number & License Expiry */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License Number<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={driverData.licenseNumber}
                                            onChange={(e) => setDriverData({ ...driverData, licenseNumber: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License Expiry<span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={driverData.licenseExpiry}
                                            onChange={(e) => setDriverData({ ...driverData, licenseExpiry: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    {/* Date of Birth */}
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={driverData.dob}
                                            onChange={(e) => setDriverData({ ...driverData, dob: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    {/* Blood Group */}
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Blood Group</label>
                                        <select
                                            value={driverData.bloodGroup}
                                            onChange={(e) => setDriverData({ ...driverData, bloodGroup: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
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
                                {/* NIC & Assigned Vehicle */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">NIC</label>
                                        <input
                                            type="text"
                                            value={driverData.nic}
                                            onChange={(e) => setDriverData({ ...driverData, nic: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assigned Vehicle</label>
                                        <select
                                            value={driverData.assignedVehicle}
                                            onChange={(e) => setDriverData({ ...driverData, assignedVehicle: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
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
                                            value={driverData.languages}
                                            onChange={(e) => setDriverData({ ...driverData, languages: e.target.value })}
                                            placeholder="e.g., English, Sinhala, Tamil"
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Experience Years</label>
                                        <input
                                            type="number"
                                            value={driverData.experienceYears}
                                            onChange={(e) => setDriverData({ ...driverData, experienceYears: e.target.value })}
                                            min="0"
                                            placeholder="Years of driving experience"
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* Status & Join Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                                        <select
                                            value={driverData.status}
                                            onChange={(e) => setDriverData({ ...driverData, status: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Join Date</label>
                                        <input
                                            type="date"
                                            value={driverData.joinDate}
                                            onChange={(e) => setDriverData({ ...driverData, joinDate: e.target.value })}
                                            className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        />
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/driver")}
                                        className="px-8 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium disabled:bg-purple-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Saving..." : "Save"}
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
