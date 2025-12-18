import { useState, useEffect } from 'react';
import { MdPerson, MdEmail, MdPhone, MdCake, MdBloodtype, MdLocationOn, MdDirectionsCar } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import { Loader } from '../../components/ui/Loader';

const DriverProfile = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mock driver data - in production, fetch from backend
    const driver = {
        id: '1',
        firstName: 'Kamal',
        lastName: 'Perera',
        email: 'kamal@tours.lk',
        phone: '+94 77 123 4567',
        dateOfBirth: '1985-05-15',
        bloodGroup: 'O+',
        address: '123 Galle Road, Colombo 03',
        licenseNumber: 'B1234567',
        licenseExpiry: '2026-12-31',
        emergencyContact: {
            name: 'Nimal Perera',
            phone: '+94 71 987 6543',
        },
    };

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
                        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2">
                            <FaEdit /> Edit Profile
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="w-16 h-16" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Profile Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                        <MdPerson className="text-6xl text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">{driver.firstName} {driver.lastName}</h2>
                                    <p className="text-gray-600 mt-1">Professional Driver</p>
                                    <div className="mt-4 w-full space-y-2">
                                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                                            Active
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
                                                <p className="font-semibold text-gray-800">{driver.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdPhone className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-semibold text-gray-800">{driver.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdCake className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Date of Birth</p>
                                                <p className="font-semibold text-gray-800">{new Date(driver.dateOfBirth).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdBloodtype className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Blood Group</p>
                                                <p className="font-semibold text-gray-800">{driver.bloodGroup}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 md:col-span-2">
                                            <MdLocationOn className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Address</p>
                                                <p className="font-semibold text-gray-800">{driver.address}</p>
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
                                                <p className="font-semibold text-gray-800">{driver.licenseNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdCake className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Expiry Date</p>
                                                <p className="font-semibold text-gray-800">{new Date(driver.licenseExpiry).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Emergency Contact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <MdPerson className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-semibold text-gray-800">{driver.emergencyContact.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdPhone className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-semibold text-gray-800">{driver.emergencyContact.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverProfile;
