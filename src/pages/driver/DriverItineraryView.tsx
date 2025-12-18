// TEMP FILE - Complete rewrite of DriverItineraryView to use backend location progress
// This will replace the existing implementation

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Sidebar from '../../components/AdminSidebar';
import TopBar from '../../components/Topbar';
import CustomerInfoCard from '../../components/driver/CustomerInfoCard';
import TripProgressStepper from '../../components/driver/TripProgressStepper';
import ItineraryMap from '../../components/driver-dashboard/ItineraryMap';
import { useDriverStore } from '../../store/useDriverStore';
import { driverService } from '../../services/driver.service';
import { Loader } from '../../components/ui/Loader';
import { toast } from 'react-toastify';

const DriverItineraryView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentSchedule, isLoadingSchedule, fetchItinerarySchedule, updateTripStatus } = useDriverStore();

    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [locationProgress, setLocationProgress] = useState<any[]>([]);
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);

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
            loadLocationProgress(id);
        }
    }, [id, fetchItinerarySchedule]);

    // Load location progress from backend
    const loadLocationProgress = async (itineraryId: string) => {
        setIsLoadingProgress(true);
        try {
            const progress = await driverService.getLocationProgress(itineraryId);
            setLocationProgress(progress);
        } catch (error: any) {
            console.error('Failed to load progress:', error);
            // If progress doesn't exist, initialize it
            if (error.response?.status === 404 || error.response?.status === 500) {
                console.log('No progress found, will be initialized on first action');
                setLocationProgress([]);
            }
        } finally {
            setIsLoadingProgress(false);
        }
    };

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
                type: 'destination',
            });
        }

        // Add excursions
        day.excursions?.forEach((exc: any) => {
            acc[cityName].push({
                id: exc.id,
                name: exc.name,
                type: 'excursion',
            });
        });

        // Add hotel
        if (day.hotel) {
            acc[cityName].push({
                id: day.hotel.id,
                name: day.hotel.name,
                type: 'hotel',
            });
        }

        return acc;
    }, {}) || {};

    // Get status for a specific city's locations
    const getCityStatus = (cityName: string): 'not-started' | 'in-progress' | 'completed' => {
        const locations = groupedTrips[cityName] || [];
        if (locations.length === 0) return 'not-started';

        const locationsWithProgress = locations.map((loc: any) =>
            locationProgress.find(p => p.locationId === loc.id)
        );

        const allCompleted = locationsWithProgress.every(p => p?.status === 'completed');
        const anyStarted = locationsWithProgress.some(p =>
            p?.status === 'started' || p?.status === 'arrived' || p?.status === 'completed'
        );

        if (allCompleted) return 'completed';
        if (anyStarted) return 'in-progress';
        return 'not-started';
    };

    // Get all locations in sequential order across all cities
    const allLocationsInOrder = Object.keys(groupedTrips).flatMap(city =>
        groupedTrips[city].map(loc => ({ ...loc, cityName: city }))
    );

    // Update locations with progress from backend
    const getLocationsWithProgress = (cityName: string, locations: any[]) => {
        return locations.map((loc) => {
            const progress = locationProgress.find(p => p.locationId === loc.id);
            const status = progress?.status || 'not_started';
            const isCompleted = status === 'completed';

            // Find index of this location in the global order
            const globalIndex = allLocationsInOrder.findIndex(l => l.id === loc.id);

            // Check if all locations BEFORE this one (globally) are completed
            const allBeforeThisCompleted = globalIndex === 0 || allLocationsInOrder
                .slice(0, globalIndex)
                .every(prevLoc => {
                    const prevProgress = locationProgress.find(p => p.locationId === prevLoc.id);
                    return prevProgress?.status === 'completed';
                });

            const isCurrent = !isCompleted && allBeforeThisCompleted;

            return {
                ...loc,
                visited: isCompleted,
                current: isCurrent,
            };
        });
    };

    const handleStatusChange = async (cityName: string, locationId: string, status: string) => {
        if (!id) return;

        try {
            const locations = groupedTrips[cityName] || [];

            if (status === 'start') {
                // Mark first location as started
                await driverService.updateLocationProgress(id, locationId, 'started');
                await updateTripStatus(id, 'start');
            } else if (status === 'arrived') {
                // Mark current location as completed (arrived = completed)
                await driverService.updateLocationProgress(id, locationId, 'completed');

                // Find next location
                const currentIndex = locations.findIndex(loc => loc.id === locationId);
                if (currentIndex < locations.length - 1) {
                    // Start next location automatically
                    const nextLocation = locations[currentIndex + 1];
                    await driverService.updateLocationProgress(id, nextLocation.id, 'started');
                }
            } else if (status === 'finished') {
                // Mark all remaining locations as completed
                for (const loc of locations) {
                    const progress = locationProgress.find(p => p.locationId === loc.id);
                    if (!progress || progress.status !== 'completed') {
                        await driverService.updateLocationProgress(id, loc.id, 'completed');
                    }
                }
                await updateTripStatus(id, 'finished');
            }

            // Reload progress from backend
            await loadLocationProgress(id);
            toast.success(`Location status updated!`);
        } catch (error: any) {
            console.error('Failed to update status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleNext = () => {
        navigate(`/driver/tour-details/${id}`);
    };

    const handleSOSClick = () => {
        navigate('/driver/emergency');
    };

    // Prepare map locations
    const mapLocations = currentSchedule?.schedule?.flatMap((day: any) => {
        const locs: any[] = [];

        if (day.destination?.coordinates) {
            locs.push({
                lat: day.destination.coordinates.lat,
                lng: day.destination.coordinates.lng,
                name: day.destination.name,
                type: 'destination',
            });
        }

        day.excursions?.forEach((exc: any) => {
            if (exc.coordinates) {
                locs.push({
                    lat: exc.coordinates.lat,
                    lng: exc.coordinates.lng,
                    name: exc.name,
                    type: 'excursion',
                });
            }
        });

        if (day.hotel?.coordinates) {
            locs.push({
                lat: day.hotel.coordinates.lat,
                lng: day.hotel.coordinates.lng,
                name: day.hotel.name,
                type: 'hotel',
            });
        }

        return locs;
    }) || [];

    if (isLoadingSchedule || isLoadingProgress) {
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
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Itinerary not found</p>
                </div>
            </div>
        );
    }

    const { itinerary } = currentSchedule;

    console.log('Itinerary data:', itinerary);

    // Prepare customer info - use itinerary data directly
    const customerInfo = {
        name: itinerary.customerName,
        dateOfBirth: undefined,
        gender: undefined,
        email: (itinerary as any).customerEmail || 'N/A',
        phone: (itinerary as any).customerPhone || 'N/A',
        groupComposition: `${itinerary.numberOfParticipants} Participant${itinerary.numberOfParticipants > 1 ? 's' : ''}`,
        countryOfResidence: undefined,
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

                    {/* Header with back button, title, and SOS */}
                    <div className="flex items-center justify-between mt-4 mb-4">
                        <button
                            onClick={() => navigate('/driver-trips')}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-poppins font-medium text-lg"
                        >
                            ← Back to Itineraries
                        </button>

                        <button
                            onClick={handleSOSClick}
                            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110"
                            title="Emergency SOS"
                        >
                            <span className="text-white font-bold text-sm">SOS</span>
                        </button>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-poppins">
                        Driver Itinerary
                    </h1>

                    {/* Customer Info Card */}
                    <CustomerInfoCard {...customerInfo} />

                    {/* Trip Progress by City */}
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Trip Details</h2>
                        {Object.keys(groupedTrips).map((cityName) => (
                            <TripProgressStepper
                                key={cityName}
                                cityName={cityName}
                                locations={getLocationsWithProgress(cityName, groupedTrips[cityName])}
                                status={getCityStatus(cityName)}
                                onStatusChange={(locationId, status) => handleStatusChange(cityName, locationId, status)}
                            />
                        ))}
                    </div>

                    {/* Map */}
                    {mapLocations.length > 0 && (
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 font-poppins">Route Overview</h3>
                                <button
                                    onClick={() => navigate(`/driver/map/${id}`)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    View full screen map
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                                <ItineraryMap locations={mapLocations} height="400px" />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleNext}
                            className="flex-1 px-8 py-4 rounded-lg bg-purple-600 text-white font-semibold text-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverItineraryView;
