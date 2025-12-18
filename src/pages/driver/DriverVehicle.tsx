import { useState, useEffect } from 'react';
import { MdDirectionsCar, MdLocalGasStation, MdSpeed, MdEvent, MdCheckCircle } from 'react-icons/md';
import { FaCar, FaTools } from 'react-icons/fa';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import { Loader } from '../../components/ui/Loader';

const DriverVehicle = () => {
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

    // Mock vehicle data - in production, fetch from backend
    const vehicle = {
        id: '1',
        make: 'Toyota',
        model: 'KDH',
        year: 2020,
        registrationNumber: 'ABC-1234',
        type: 'Van',
        capacity: 14,
        fuelType: 'Diesel',
        mileage: 45000,
        color: 'White',
        insuranceExpiry: '2025-06-30',
        lastServiceDate: '2024-11-15',
        nextServiceDate: '2025-02-15',
        status: 'active',
        features: [
            'Air Conditioning',
            'GPS Navigation',
            'First Aid Kit',
            'Fire Extinguisher',
            'Reclining Seats',
            'USB Charging Ports',
        ],
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

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 mt-4 font-poppins">
                        My Vehicle
                    </h1>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="w-16 h-16" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Vehicle Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                        <FaCar className="text-6xl text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">{vehicle.make} {vehicle.model}</h2>
                                    <p className="text-gray-600 mt-1">{vehicle.year} • {vehicle.type}</p>
                                    <div className="mt-4 w-full space-y-2">
                                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                                            <MdCheckCircle /> Active
                                        </div>
                                        <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold">
                                            {vehicle.registrationNumber}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Vehicle Specifications */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Vehicle Specifications</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <MdDirectionsCar className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Type</p>
                                                <p className="font-semibold text-gray-800">{vehicle.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdDirectionsCar className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Capacity</p>
                                                <p className="font-semibold text-gray-800">{vehicle.capacity} Passengers</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdLocalGasStation className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Fuel Type</p>
                                                <p className="font-semibold text-gray-800">{vehicle.fuelType}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdSpeed className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Mileage</p>
                                                <p className="font-semibold text-gray-800">{vehicle.mileage.toLocaleString()} km</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaCar className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Color</p>
                                                <p className="font-semibold text-gray-800">{vehicle.color}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Maintenance & Insurance */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Maintenance & Insurance</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <MdEvent className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Insurance Expiry</p>
                                                <p className="font-semibold text-gray-800">{new Date(vehicle.insuranceExpiry).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaTools className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Last Service</p>
                                                <p className="font-semibold text-gray-800">{new Date(vehicle.lastServiceDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 md:col-span-2">
                                            <FaTools className="text-2xl text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Next Service Due</p>
                                                <p className="font-semibold text-gray-800">{new Date(vehicle.nextServiceDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Features & Amenities</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {vehicle.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg">
                                                <MdCheckCircle />
                                                <span className="text-sm font-medium">{feature}</span>
                                            </div>
                                        ))}
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

export default DriverVehicle;
