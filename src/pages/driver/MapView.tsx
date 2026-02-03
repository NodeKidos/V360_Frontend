import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheckCircle, FaClock, FaArrowLeft } from 'react-icons/fa';
import { MdLocationOn, MdHotel, MdLocalActivity } from 'react-icons/md';
import ItineraryMap from '../../components/driver-dashboard/ItineraryMap';
import { useDriverStore } from '../../store/useDriverStore';
import { driverService } from '../../services/driver.service';
import { Loader } from '../../components/ui/Loader';
import { toast } from 'react-toastify';

const MapView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentSchedule, isLoadingSchedule, fetchItinerarySchedule } = useDriverStore();
    const [locationProgress, setLocationProgress] = useState<any[]>([]);
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);

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
            setLocationProgress([]);
        } finally {
            setIsLoadingProgress(false);
        }
    };

    // Flatten all locations in order
    const allLocations = currentSchedule?.schedule?.flatMap((day: any, dayIndex: number) => {
        const locs: any[] = [];

        if (day.destination) {
            locs.push({
                id: day.destination.id,
                name: day.destination.name,
                type: 'destination',
                coordinates: day.destination.coordinates,
                dayIndex,
            });
        }

        day.excursions?.forEach((exc: any) => {
            locs.push({
                id: exc.id,
                name: exc.name,
                type: 'excursion',
                coordinates: exc.coordinates,
                dayIndex,
            });
        });

        if (day.hotel) {
            locs.push({
                id: day.hotel.id,
                name: day.hotel.name,
                type: 'hotel',
                coordinates: day.hotel.coordinates,
                dayIndex,
            });
        }

        return locs;
    }) || [];

    // Find current location (first non-completed)
    const currentLocationIndex = allLocations.findIndex(loc => {
        const progress = locationProgress.find(p => p.locationId === loc.id);
        return progress?.status !== 'completed';
    });

    const currentLocation = currentLocationIndex !== -1 ? allLocations[currentLocationIndex] : null;
    const nextLocation = currentLocationIndex !== -1 && currentLocationIndex < allLocations.length - 1
        ? allLocations[currentLocationIndex + 1]
        : null;

    // Prepare map locations with status
    const mapLocations = allLocations.filter(loc => loc.coordinates).map((loc, idx) => {
        const progress = locationProgress.find(p => p.locationId === loc.id);
        const status = progress?.status || 'not_started';

        return {
            lat: loc.coordinates.lat,
            lng: loc.coordinates.lng,
            name: loc.name,
            type: loc.type,
            status: status === 'completed' ? 'completed' : idx === currentLocationIndex ? 'current' : 'upcoming',
            description: status === 'completed'
                ? '✓ Completed'
                : idx === currentLocationIndex
                    ? '📍 You are here'
                    : `Stop ${idx + 1}`,
        };
    });

    const handleCompleteLocation = async () => {
        if (!currentLocation || !id) return;

        try {
            // Mark current as completed
            await driverService.updateLocationProgress(id, currentLocation.id, 'completed');

            // Start next if exists
            if (nextLocation) {
                await driverService.updateLocationProgress(id, nextLocation.id, 'started');
            }

            // Reload progress
            await loadLocationProgress(id);
            toast.success('Location completed!');
        } catch (error: any) {
            console.error('Failed to update:', error);
            toast.error('Failed to update location');
        }
    };

    const handleSOS = () => {
        navigate('/driver/emergency');
    };

    const getLocationIcon = (type: string) => {
        switch (type) {
            case 'destination':
                return <MdLocationOn className="text-2xl" />;
            case 'hotel':
                return <MdHotel className="text-2xl" />;
            case 'excursion':
                return <MdLocalActivity className="text-2xl" />;
            default:
                return <FaMapMarkerAlt className="text-2xl" />;
        }
    };

    if (isLoadingSchedule || isLoadingProgress) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-16 h-16" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-white flex relative">
            {/* Left Progress Panel - Fixed */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-50 shadow-lg">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
                    <h2 className="text-lg font-bold text-white font-poppins">Tour Progress</h2>
                    <p className="text-sm text-purple-100 mt-1">
                        {currentLocationIndex + 1} of {allLocations.length} locations
                    </p>
                </div>

                {/* Current Location */}
                {currentLocation && (
                    <div className="p-4 border-b-4 border-purple-600 bg-purple-50">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 ring-4 ring-blue-100 text-white">
                                {getLocationIcon(currentLocation.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-purple-600 font-semibold mb-1">CURRENT LOCATION</p>
                                <p className="text-base font-bold text-gray-800">{currentLocation.name}</p>
                                <p className="text-xs text-gray-600 mt-1 capitalize flex items-center gap-1">
                                    {currentLocation.type === 'destination' && <MdLocationOn />}
                                    {currentLocation.type === 'hotel' && <MdHotel />}
                                    {currentLocation.type === 'excursion' && <MdLocalActivity />}
                                    {currentLocation.type}
                                </p>
                            </div>
                        </div>

                        {/* Complete Button */}
                        <button
                            onClick={handleCompleteLocation}
                            className="w-full mt-4 px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow-md"
                        >
                            <FaCheckCircle /> Complete This Location
                        </button>
                    </div>
                )}

                {/* Next Location */}
                {nextLocation && (
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 text-gray-600">
                                <FaClock className="text-xl" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-semibold mb-1">NEXT UP</p>
                                <p className="text-sm font-semibold text-gray-700">{nextLocation.name}</p>
                                <p className="text-xs text-gray-500 mt-1 capitalize flex items-center gap-1">
                                    {nextLocation.type === 'destination' && <MdLocationOn className="text-xs" />}
                                    {nextLocation.type === 'hotel' && <MdHotel className="text-xs" />}
                                    {nextLocation.type === 'excursion' && <MdLocalActivity className="text-xs" />}
                                    {nextLocation.type}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upcoming Locations List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Upcoming Stops</h3>
                    <div className="space-y-2">
                        {allLocations.slice(currentLocationIndex + 2).map((loc, idx) => {
                            const progress = locationProgress.find(p => p.locationId === loc.id);
                            const isCompleted = progress?.status === 'completed';

                            return (
                                <div key={loc.id} className={`flex items-center gap-3 p-2 rounded-lg ${isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {isCompleted ? <FaCheckCircle /> : currentLocationIndex + idx + 3}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>{loc.name}</p>
                                        <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                                            {loc.type === 'destination' && <MdLocationOn className="text-xs" />}
                                            {loc.type === 'hotel' && <MdHotel className="text-xs" />}
                                            {loc.type === 'excursion' && <MdLocalActivity className="text-xs" />}
                                            {loc.type}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <button
                        onClick={handleSOS}
                        className="w-full px-4 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                    >
                        🚨 Emergency SOS
                    </button>
                </div>
            </div>

            {/* Right: Full Screen Map */}
            <div className="flex-1 relative">
                {/* Map */}
                {mapLocations.length > 0 ? (
                    <ItineraryMap locations={mapLocations as any} height="100%" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No map data available</p>
                    </div>
                )}

                {/* Floating Finish Button */}
                <div className="absolute bottom-6 right-6 z-40">
                    <button
                        onClick={() => navigate(`/driver/itinerary/${id}`)}
                        className="px-8 py-4 rounded-lg bg-purple-600 text-white font-semibold text-lg hover:bg-purple-700 transition shadow-xl flex items-center gap-2"
                    >
                        View Details
                        <FaArrowLeft className="rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapView;
