import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRoute, FaClock, FaMapMarkedAlt, FaCheckCircle } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import { useDriverStore } from '../../store/useDriverStore';
import { Loader } from '../../components/ui/Loader';

const MyTrips = () => {
    const navigate = useNavigate();
    const { itineraries, isLoadingItineraries, fetchAssignedItineraries } = useDriverStore();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

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

    const activeTrips = itineraries?.filter(it => it.status === 'in_progress') || [];
    const upcomingTrips = itineraries?.filter(it => it.status === 'accepted') || [];
    const completedTrips = itineraries?.filter(it => it.status === 'completed') || [];

    const getFilteredTrips = () => {
        switch (activeTab) {
            case 'active': return activeTrips;
            case 'upcoming': return upcomingTrips;
            case 'completed': return completedTrips;
            default: return itineraries || [];
        }
    };

    const filteredTrips = getFilteredTrips();

    const tabs = [
        { id: 'all' as const, label: 'All Trips', count: itineraries?.length || 0 },
        { id: 'active' as const, label: 'Active', count: activeTrips.length },
        { id: 'upcoming' as const, label: 'Upcoming', count: upcomingTrips.length },
        { id: 'completed' as const, label: 'Completed', count: completedTrips.length },
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
                        My Trips
                    </h1>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 font-semibold transition border-b-2 ${activeTab === tab.id
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>

                    {isLoadingItineraries ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="w-16 h-16" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTrips.map((trip) => {
                                const statusConfig = {
                                    in_progress: { color: 'blue', label: 'Active', icon: <FaRoute /> },
                                    accepted: { color: 'yellow', label: 'Upcoming', icon: <MdPending /> },
                                    completed: { color: 'green', label: 'Completed', icon: <FaCheckCircle /> },
                                };
                                const config = statusConfig[trip.status as keyof typeof statusConfig] || statusConfig.accepted;

                                return (
                                    <div
                                        key={trip.id}
                                        className={`bg-white rounded-xl shadow-md border-l-4 border-${config.color}-500 p-6 hover:shadow-lg transition cursor-pointer`}
                                        onClick={() => navigate(`/driver/itinerary/${trip.id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">#{trip.itineraryNumber}</p>
                                                <h3 className="text-lg font-bold text-gray-800">{trip.customerName}</h3>
                                            </div>
                                            <div className={`px-3 py-1 bg-${config.color}-100 text-${config.color}-700 rounded-full text-sm font-semibold flex items-center gap-1`}>
                                                {config.icon}
                                                {config.label}
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
                                );
                            })}

                            {filteredTrips.length === 0 && (
                                <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <FaRoute className="text-6xl mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Trips Found</h3>
                                    <p className="text-gray-600">
                                        {activeTab === 'all' ? 'You don\'t have any trips assigned yet.' : `No ${activeTab} trips.`}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTrips;
