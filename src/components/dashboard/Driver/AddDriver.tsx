import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigate hook
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import driverService from "../../../services/driver.service";

interface DriverData {
    name: string;
    email: string;
    contact: string;
    dob: string;
    bloodGroup: string;
    nic: string;
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
    const [driverData, setDriverData] = useState<DriverData>({
        name: "",
        email: "",
        contact: "",
        dob: "",
        bloodGroup: "",
        nic: "",
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
        if (!driverData.name || !driverData.email || !driverData.contact || !driverData.dob ||
            !driverData.bloodGroup || !driverData.nic || !driverData.assignedVehicle ||
            !driverData.status || !driverData.joinDate) {
            toast.error("Please fill in all required fields", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            setLoading(true);
            await driverService.createDriver({
                name: driverData.name,
                email: driverData.email,
                contact: driverData.contact,
                dateOfBirth: driverData.dob,
                bloodGroup: driverData.bloodGroup as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
                nic: driverData.nic,
                assignedVehicle: driverData.assignedVehicle,
                status: driverData.status as 'Active' | 'Inactive',
                joinDate: driverData.joinDate,
                profileImage: driverData.profileImage || undefined,
                licenseInfo: driverData.licenseInfo || undefined,
            });

            toast.success("Driver added successfully!", {
                position: "top-right",
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate("/driver");
            }, 2000);
        } catch (err: any) {
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

                        {/* FORM START */}
                        <form
                            className="mt-4 md:mt-6 space-y-4 md:space-y-6"
                            onSubmit={handleSubmit}
                        >
                            {/* Driver Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Driver Name<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={driverData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                {/* Profile Image */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Profile Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, "profileImage")}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={driverData.dob}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                {/* Blood Group */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Blood Group</label>
                                    <select
                                        name="bloodGroup"
                                        value={driverData.bloodGroup}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option>Select BloodGroup</option>
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
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                {/* Assigned Vehicle */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assigned Vehicle</label>
                                    <select
                                        name="assignedVehicle"
                                        value={driverData.assignedVehicle}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option>Select Vehicle</option>
                                        <option>Van #201</option>
                                        <option>Van #202</option>
                                        <option>Van #203</option>
                                        <option>Van #204</option>
                                    </select>
                                </div>
                            </div>
                            {/* Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                                    <select
                                        name="status"
                                        value={driverData.status}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option>Select Status</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>

                                {/* Join Date */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Join Date</label>
                                    <input
                                        type="date"
                                        name="joinDate"
                                        value={driverData.joinDate}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                            </div>
                            {/* License Info */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License Info</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, "licenseInfo")}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
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
                        {/* FORM END */}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}
