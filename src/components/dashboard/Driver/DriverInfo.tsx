import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { MdArrowBack } from "react-icons/md";  // Back icon
import { CiEdit } from "react-icons/ci"; // Edit icon

interface Driver {
    id: string | undefined;
    name: string;
    contact: string;
    email: string;
    bod: string;
    bloodGroup: string;
    nic: string;
    assignedVehicle: string;
    status: string;
    joinDate: string;
    licenseInfo: string;
}

export default function DriverInfo() {
    const { id } = useParams();  // Get driver ID from URL
    const navigate = useNavigate();  // Initialize navigate function
    const [driver, setDriver] = useState<Driver | null>(null);

    useEffect(() => {
        // Dummy data fetch simulation (replace this with your actual data fetching logic)
        const fetchedDriver = {
            id,
            name: "Alice",
            contact: "+94 768435606",
            email: "alice@gmail.com",
            bod: "03.04.1995",
            bloodGroup: "A+",
            nic: "200080803520",
            assignedVehicle: "Van #201",
            status: "Active",
            joinDate: "15.03.2024",
            licenseInfo: "License Image",
        };

        setDriver(fetchedDriver);  // Set the fetched driver data
    }, [id]);

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            <Sidebar collapsed={false} setCollapsed={() => { }} isMobile={false} sidebarOpen={false} setSidebarOpen={() => { }} />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={false} setSidebarOpen={() => { }} />

                    {/* Breadcrumb with Back Button */}
                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                        <button
                            onClick={() => navigate("/driver")}  // Navigate back to Driver list
                            className="flex items-center text-gray-500 hover:text-[#B749DB] cursor-pointer"
                        >
                            <MdArrowBack className="mr-2 text-[18px]" />  {/* Back icon */}
                            Back
                        </button>
                    </div>

                    {/* Driver Information Section */}
                    {driver && (
                        <div className="mt-4 md:mt-6 bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                            {/* Title Section with Edit Icon */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-semibold text-[#B749DB] font-poppins">
                                    Driver Information
                                </h2>
                                <CiEdit
                                    className="text-[#B749DB] cursor-pointer text-[24px] hover:text-[#9f37c9]"
                                    onClick={() => navigate(`/driver/edit/${id}`)}  // Navigate to Edit Driver page
                                />
                            </div>

                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Details about {driver.name}
                            </p>

                            {/* Profile Section */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="col-span-1 sm:col-span-2 flex items-left justify-left">
                                    <img src="https://i.pravatar.cc/200" alt="Profile" className="w-30 h-30 rounded-[15px] border-2 " />
                                </div>

                                {/* Driver Info */}
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">Name</p>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins">{driver.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">Date of Birth</p>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins">{driver.bod}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">NIC</p>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins">{driver.nic}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">Contact No</p>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins">{driver.contact}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">Email</p>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins">{driver.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">Assigned Vehicle</p>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins">{driver.assignedVehicle}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">Status</p>
                                    <p className={`text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins ${driver.status === "Active" ? "text-green-600" : "text-red-600"}`}>{driver.status}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">Join Date</p>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] font-poppins">{driver.joinDate}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-gray-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">License Info</p>
                                    <div className="mt-2 h-24 w-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-500 font-poppins">
                                        {driver.licenseInfo}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
