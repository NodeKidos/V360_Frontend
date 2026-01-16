import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdPhone, MdCake, MdBloodtype, MdLocationOn, MdDirectionsCar } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import { Loader } from '../../components/ui/Loader';
import userService, { type User } from '../../services/user.service';
import { toast, ToastContainer } from 'react-toastify';

const DriverProfile = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [driverData, setDriverData] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const data = await userService.getCurrentUser();
                setDriverData(data);
            } catch (error) {
                console.error("Failed to fetch driver profile", error);
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEditClick = () => {
        if (driverData?.driver?.id) {
            console.log("✏️ Driver Profile edit clicked", driverData.driver.id);
            navigate(`/driver/edit/${driverData.driver.id}`);
        } else {
            toast.error("Driver profile not found");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-16 h-16" />
            </div>
        );
    }

    if (!driverData) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-600">Failed to load profile.</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
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

                    <div className="flex items-center justify-between mb-6 mt-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-poppins">
                            My Profile
                        </h1>
                        <button
                            onClick={handleEditClick}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                    {driverData.profileImage ? (
                                        <img
                                            src={driverData.profileImage.startsWith('/') ? `http://localhost:5174${driverData.profileImage}` : driverData.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <MdPerson className="text-6xl text-purple-600" />
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">{driverData.firstName} {driverData.lastName}</h2>
                                <p className="text-gray-600 mt-1">Professional Driver</p>
                                <div className="mt-4 w-full space-y-2">
                                    <div className={`px-4 py-2 rounded-lg font-semibold ${driverData.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {driverData.status || 'Active'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <MdEmail className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-semibold text-gray-800">{driverData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdPhone className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-semibold text-gray-800">{driverData.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdCake className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Date of Birth</p>
                                            <p className="font-semibold text-gray-800">
                                                {driverData.driver?.dateOfBirth ? new Date(driverData.driver.dateOfBirth).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdBloodtype className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Blood Group</p>
                                            <p className="font-semibold text-gray-800">{driverData.driver?.bloodGroup || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <MdLocationOn className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">National ID (NIC)</p>
                                            <p className="font-semibold text-gray-800">{driverData.driver?.nationalId || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* License Information */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">License Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <MdDirectionsCar className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">License Number</p>
                                            <p className="font-semibold text-gray-800">{driverData.driver?.licenseNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdCake className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Expiry Date</p>
                                            <p className="font-semibold text-gray-800">
                                                {driverData.driver?.licenseExpiry ? new Date(driverData.driver.licenseExpiry).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Experience Information */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Professional Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <MdDirectionsCar className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Experience</p>
                                            <p className="font-semibold text-gray-800">{driverData.driver?.experienceYears || 0} Years</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdCake className="text-2xl text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Join Date</p>
                                            <p className="font-semibold text-gray-800">
                                                {driverData.driver?.joinDate ? new Date(driverData.driver.joinDate).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DriverProfile;
