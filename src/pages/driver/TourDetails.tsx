import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import DestinationTimeline from '../../components/driver/DestinationTimeline';
import ItineraryMap from '../../components/driver-dashboard/ItineraryMap';
import { useDriverStore } from '../../store/useDriverStore';
import { Loader } from '../../components/ui/Loader';

const TourDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentSchedule, isLoadingSchedule, fetchItinerarySchedule } = useDriverStore();

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
        if (id) {
            fetchItinerarySchedule(id);
        }
    }, [id, fetchItinerarySchedule]);

    // Group destinations by city
    const groupedTimeline = currentSchedule?.schedule.reduce((acc: any, day: any) => {
        const cityName = day.destination?.name || 'Other';
        if (!acc[cityName]) {
            acc[cityName] = [];
        }

        // Add excursions as timeline items
        day.excursions?.forEach((exc: any, index: number) => {
            acc[cityName].push({
                id: exc.id,
                name: exc.name,
                time: exc.visitTime || `${9 + index * 2}:30 am`,
                isFirst: acc[cityName].length === 0,
            });
        });

        return acc;
    }, {}) || {};

    // Prepare map locations
    const mapLocations = currentSchedule?.schedule?.flatMap((day: any) => {
        const locs: any[] = [];

        if (day.destination?.coordinates) {
            locs.push({
                lat: day.destination.coordinates.lat,
                lng: day.destination.coordinates.lng,
                name: day.destination.name,
                type: 'destination',
                description: day.destination.description,
            });
        }

        day.excursions?.forEach((exc: any) => {
            if (exc.coordinates) {
                locs.push({
                    lat: exc.coordinates.lat,
                    lng: exc.coordinates.lng,
                    name: exc.name,
                    type: 'excursion',
                    description: exc.description,
                });
            }
        });

        return locs;
    }) || [];

    const handlePrevious = () => {
        navigate(`/driver/itinerary/${id}`);
    };

    const handleNext = () => {
        navigate(`/driver/map/${id}`);
    };

    if (isLoadingSchedule) {
        return (
            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    isMobile={isMobile}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className="flex-1 flex items-center justify-center">
                    <Loader className="w-16 h-16" />
                </div>
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

                    {/* Top Navigation Bar - Driver Friendly */}
                    <div className="flex items-center justify-between mt-4 mb-4">
                        <button
                            onClick={() => navigate(`/driver/itinerary/${id}`)}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-poppins font-medium text-lg"
                        >
                            <FaArrowLeft /> Back
                        </button>

                        {/* SOS Button */}
                        <button
                            onClick={() => navigate('/driver/emergency')}
                            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110"
                            title="Emergency SOS"
                        >
                            <span className="text-white font-bold text-sm">SOS</span>
                        </button>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-poppins">
                        Tour Details
                    </h1>

                    {/* Main Content: Timeline + Map */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Timeline */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 max-h-[700px] overflow-y-auto">
                            {Object.keys(groupedTimeline).map((cityName, index) => (
                                <DestinationTimeline
                                    key={index}
                                    cityName={cityName}
                                    locations={groupedTimeline[cityName]}
                                />
                            ))}
                        </div>

                        {/* Right: Map */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 font-poppins">Route Map</h3>
                                <button
                                    onClick={() => navigate(`/driver/map/${id}`)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    View larger map
                                </button>
                            </div>
                            <div className="flex-1 min-h-[600px]">
                                {mapLocations.length > 0 ? (
                                    <ItineraryMap locations={mapLocations} height="100%" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No map data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Navigation - Large Touch-Friendly Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handlePrevious}
                            className="flex-1 px-8 py-4 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold text-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
                        >
                            <FaArrowLeft /> Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-8 py-4 rounded-lg bg-purple-600 text-white font-semibold text-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                        >
                            Next <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetails;
