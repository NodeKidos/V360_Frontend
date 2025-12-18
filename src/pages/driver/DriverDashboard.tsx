import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRoute, FaClock, FaCheckCircle, FaMapMarkedAlt } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import { useDriverStore } from '../../store/useDriverStore';
import { Loader } from '../../components/ui/Loader';

const DriverDashboard = () => {
    const navigate = useNavigate();
    const { itineraries, isLoadingItineraries, fetchAssignedItineraries } = useDriverStore();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchAssignedItineraries();
    }, [fetchAssignedItineraries]);

    // Group itineraries by status
    const activeTrips = itineraries?.filter(it => it.status === 'in_progress') || [];
    const upcomingTrips = itineraries?.filter(it => it.status === 'accepted') || [];
    const completedTrips = itineraries?.filter(it => it.status === 'completed') || [];

    const stats = [
        { label: 'Active Trips', value: activeTrips.length, icon: <FaRoute className="text-3xl" />, color: 'bg-blue-500' },
        { label: 'Upcoming', value: upcomingTrips.length, icon: <MdPending className="text-3xl" />, color: 'bg-yellow-500' },
        { label: 'Completed', value: completedTrips.length, icon: <FaCheckCircle className="text-3xl" />, color: 'bg-green-500' },
    ];

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
                        Driver Dashboard
                    </h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                        <p className="text-4xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center text-white`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isLoadingItineraries ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="w-16 h-16" />
                        </div>
                    ) : (
                        <>
                            {/* Active Trips */}
                            {activeTrips.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Active Trips</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeTrips.map((trip) => (
                                            <div key={trip.id} className="bg-white rounded-xl shadow-md border-l-4 border-blue-500 p-6 hover:shadow-lg transition cursor-pointer"
                                                onClick={() => navigate(`/driver/itinerary/${trip.id}`)}>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Itinerary #{trip.itineraryNumber}</p>
                                                        <h3 className="text-lg font-bold text-gray-800">{trip.customerName}</h3>
                                                    </div>
                                                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                        Active
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <p className="flex items-center gap-2">
                                                        <FaClock /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <FaMapMarkedAlt /> {trip.numberOfParticipants} Participants
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Trips */}
                            {upcomingTrips.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Upcoming Trips</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {upcomingTrips.map((trip) => (
                                            <div key={trip.id} className="bg-white rounded-xl shadow-md border-l-4 border-yellow-500 p-6 hover:shadow-lg transition cursor-pointer"
                                                onClick={() => navigate(`/driver/itinerary/${trip.id}`)}>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Itinerary #{trip.itineraryNumber}</p>
                                                        <h3 className="text-lg font-bold text-gray-800">{trip.customerName}</h3>
                                                    </div>
                                                    <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                                        Upcoming
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <p className="flex items-center gap-2">
                                                        <FaClock /> {new Date(trip.startDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <FaMapMarkedAlt /> {trip.numberOfParticipants} Participants
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No trips message */}
                            {itineraries?.length === 0 && (
                                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <FaRoute className="text-6xl mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Trips Assigned</h3>
                                    <p className="text-gray-600">You don't have any trips assigned yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
