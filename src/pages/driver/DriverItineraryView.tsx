import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import CustomerInfoCard from '../../components/driver/CustomerInfoCard';
import TripProgressStepper from '../../components/driver/TripProgressStepper';
import { useDriverStore } from '../../store/useDriverStore';
import { Loader } from '../../components/ui/Loader';

const DriverItineraryView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentSchedule, isLoadingSchedule, fetchItinerarySchedule } = useDriverStore();

    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // State for tracking trip progress per city
    const [cityProgress, setCityProgress] = useState<Record<string, {
        status: 'not-started' | 'in-progress' | 'completed';
        visitedLocationIds: Set<string>;
        currentLocationIndex: number;
    }>>({});

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load progress from localStorage when component mounts
    useEffect(() => {
        if (id) {
            const savedProgress = localStorage.getItem(`trip-progress-${id}`);
            if (savedProgress) {
                try {
                    const parsed = JSON.parse(savedProgress);
                    const progressWithSets: typeof cityProgress = {};
                    Object.keys(parsed).forEach(city => {
                        progressWithSets[city] = {
                            ...parsed[city],
                            visitedLocationIds: new Set(parsed[city].visitedLocationIds)
                        };
                    });
                    setCityProgress(progressWithSets);
                } catch (e) {
                    console.error('Failed to load progress:', e);
                }
            }
        }
    }, [id]);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (id && Object.keys(cityProgress).length > 0) {
            const progressForStorage: any = {};
            Object.keys(cityProgress).forEach(city => {
                progressForStorage[city] = {
                    ...cityProgress[city],
                    visitedLocationIds: Array.from(cityProgress[city].visitedLocationIds)
                };
            });
            localStorage.setItem(`trip-progress-${id}`, JSON.stringify(progressForStorage));
        }
    }, [cityProgress, id]);

    useEffect(() => {
        if (id) {
            fetchItinerarySchedule(id);
        }
    }, [id, fetchItinerarySchedule]);

    // Group schedule by destination/city
    const groupedTrips = currentSchedule?.schedule.reduce((acc: any, day: any) => {
        const cityName = day.destination?.name || 'Other';
        if (!acc[cityName]) {
            acc[cityName] = [];
        }

        // Add destination
        if (day.destination) {
            acc[cityName].push({
                id: day.destination.id,
                name: day.destination.name,
                visited: false,
                current: false,
            });
        }

        // Add excursions
        day.excursions?.forEach((exc: any) => {
            acc[cityName].push({
                id: exc.id,
                name: exc.name,
                visited: false,
                current: false,
            });
        });

        // Add hotel
        if (day.hotel) {
            acc[cityName].push({
                id: day.hotel.id,
                name: day.hotel.name,
                visited: false,
                current: false,
            });
        }

        return acc;
    }, {}) || {};

    // Update locations with visited status
    const getLocationsWithProgress = (cityName: string, locations: any[]) => {
        const progress = cityProgress[cityName];
        if (!progress) return locations;

        return locations.map((loc, index) => ({
            ...loc,
            visited: progress.visitedLocationIds.has(loc.id),
            current: index === progress.currentLocationIndex && progress.status === 'in-progress',
        }));
    };

    const handleStatusChange = (cityName: string, locationId: string, status: string) => {
        setCityProgress(prev => {
            const currentCityProgress = prev[cityName] || {
                status: 'not-started',
                visitedLocationIds: new Set<string>(),
                currentLocationIndex: 0,
            };

            const locations = groupedTrips[cityName] || [];
            const newVisitedIds = new Set(currentCityProgress.visitedLocationIds);
            let newStatus = currentCityProgress.status;
            let newCurrentIndex = currentCityProgress.currentLocationIndex;

            if (status === 'start') {
                newStatus = 'in-progress';
                newCurrentIndex = 0;
                // Mark first location as visited
                if (locations[0]) {
                    newVisitedIds.add(locations[0].id);
                }
            } else if (status === 'arrived') {
                // Mark current location as visited
                if (locations[newCurrentIndex]) {
                    newVisitedIds.add(locations[newCurrentIndex].id);
                }
                // Move to next location
                if (newCurrentIndex < locations.length - 1) {
                    newCurrentIndex++;
                }
            } else if (status === 'finished') {
                // Mark all as visited
                locations.forEach(loc => newVisitedIds.add(loc.id));
                newStatus = 'completed';
            }

            return {
                ...prev,
                [cityName]: {
                    status: newStatus,
                    visitedLocationIds: newVisitedIds,
                    currentLocationIndex: newCurrentIndex,
                }
            };
        });
    };

    const handleNext = () => {
        if (id) {
            navigate(`/driver/tour-details/${id}`);
        }
    };

    const handleSOSClick = () => {
        navigate('/driver/emergency');
    };

    if (isLoadingSchedule) {
        return (
            <div className="h-screen bg-gray-50  flex overflow-hidden">
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

    if (!currentSchedule) {
        return (
            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    isMobile={isMobile}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <p className="text-gray-500 text-lg mb-4">Itinerary not found</p>
                    <button
                        onClick={() => navigate('/itinerary-details')}
                        className="px-6 py-3 bg-[#B749DB] text-white rounded-xl hover:bg-purple-600"
                    >
                        Back to Itineraries
                    </button>
                </div>
            </div>
        );
    }

    const { itinerary } = currentSchedule;

    // Check if there's a lead with customer details
    const lead = (itinerary as any).lead;

    console.log('Itinerary data:', itinerary);
    console.log('Lead data:', lead);

    // Prepare customer info - try to get from lead first, fallback to itinerary
    const customerInfo = {
        name: itinerary.customerName || lead?.name || 'N/A',
        dateOfBirth: lead?.dateOfBirth,
        gender: lead?.gender,
        email: lead?.email || itinerary.customerEmail || 'N/A',
        phone: lead?.phoneNumber || itinerary.customerPhone || 'N/A',
        groupComposition: `${itinerary.numberOfParticipants} Participant${itinerary.numberOfParticipants > 1 ? 's' : ''}`,
        countryOfResidence: lead?.country,
        arrivalDate: itinerary.startDate,
        departureDate: itinerary.endDate,
        preferredDuration: `${currentSchedule.schedule.length} day${currentSchedule.schedule.length > 1 ? 's' : ''}`,
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

                    {/* Top Action Bar */}
                    <div className="flex items-center justify-between mt-4 mb-4">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/itinerary-details')}
                            className="flex items-center gap-2 text-[#B749DB] hover:text-purple-600 font-poppins font-medium"
                        >
                            <FaArrowLeft /> Back to Itineraries
                        </button>

                        {/* SOS Button */}
                        <button
                            onClick={handleSOSClick}
                            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110"
                            title="Emergency SOS"
                        >
                            <span className="text-white font-bold text-sm">SOS</span>
                        </button>
                    </div>

                    {/* Page Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-poppins">
                        Driver Itinerary
                    </h1>

                    {/* Customer  Details */}
                    <CustomerInfoCard customerInfo={customerInfo} />

                    {/* Trip Details */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-md border border-purple-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 font-poppins">Trip Details</h3>

                        <div className="space-y-4">
                            {Object.keys(groupedTrips).map((cityName, index) => {
                                const locations = getLocationsWithProgress(cityName, groupedTrips[cityName]);
                                const progress = cityProgress[cityName]?.status || 'not-started';

                                return (
                                    <TripProgressStepper
                                        key={index}
                                        cityName={cityName}
                                        locations={locations}
                                        onStatusChange={(locationId, status) => handleStatusChange(cityName, locationId, status)}
                                        status={progress}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                        >
                            Next
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverItineraryView;
