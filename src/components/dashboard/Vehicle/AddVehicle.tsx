import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect, type SetStateAction } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AddVehicle() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [vehicleImage, setVehicleImage] = useState(null);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleImageChange = (event: { target: { files: SetStateAction<null>[]; }; }) => {
        setVehicleImage(event.target.files[0]);
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
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/user")}>
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
                        <form
                            className="mt-4 md:mt-6 space-y-4 md:space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                toast.success("Customer added successfully!", {
                                    position: "top-right",
                                    autoClose: 2000,
                                });
                            }}
                        >
                            {/* Vehicle Name + Vehicle Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Name</label>
                                    <input
                                        type="vehiclename"
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle Name"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Type</label>
                                    <input
                                        type="vehicletype"
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle type"
                                    />
                                </div>
                            </div>
                            {/* Vehicle No plate+Vehicle Model */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle No plate</label>
                                    <input
                                        type="vehicleNoPlate"
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Vehicle No Plate"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Model</label>
                                    <input
                                        type="vehiclemodel"
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Seat Count"
                                    />
                                </div>
                            </div>
                            {/* Seat Count+Assign Driver */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Seat Count</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Seat Count"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assign Driver</label>
                                    <input
                                        type="assignDriver"
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                        placeholder="Enter Driver Name"
                                    />
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
                                {vehicleImage && <p className="text-gray-500 mt-2">{vehicleImage.name}</p>}
                            </div>

                            {/* Vehicle Status */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center">
                                        <input type="radio" name="status" value="Active" />
                                        <span className="ml-2 text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="status" value="In Service" />
                                        <span className="ml-2 text-gray-700">In Service</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="status" value="Need Repair" />
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
                                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
                                >
                                    Submit
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
