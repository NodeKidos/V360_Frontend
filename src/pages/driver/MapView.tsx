import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SOSButton from '../../components/driver/SOSButton';
import ItineraryMap from '../../components/driver-dashboard/ItineraryMap';
import { useDriverStore } from '../../store/useDriverStore';
import { Loader } from '../../components/ui/Loader';

const MapView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentSchedule, isLoadingSchedule, fetchItinerarySchedule } = useDriverStore();

    useEffect(() => {
        if (id) {
            fetchItinerarySchedule(id);
        }
    }, [id, fetchItinerarySchedule]);

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

        if (day.hotel?.coordinates) {
            locs.push({
                lat: day.hotel.coordinates.lat,
                lng: day.hotel.coordinates.lng,
                name: day.hotel.name,
                type: 'hotel',
                address: day.hotel.address,
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

    const handleSOS = () => {
        // TODO: Implement SOS functionality when backend is ready
        alert('SOS Alert! Emergency services will be notified.');
        console.log('SOS button clicked');
    };

    const handleArrived = () => {
        console.log('Arrived button clicked');
        // TODO: Update trip status to 'arrived'
    };

    const handleFinished = () => {
        console.log('Finished button clicked');
        // TODO: Update trip status to 'finished'
        navigate(`/driver/itinerary/${id}`);
    };

    const handleNext = () => {
        navigate(`/driver/itinerary/${id}`);
    };

    if (isLoadingSchedule) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-16 h-16" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-white flex flex-col relative">
            {/* SOS Button - Top Left */}
            <div className="absolute top-6 left-6 z-50">
                <SOSButton onClick={handleSOS} />
            </div>

            {/* Status Buttons - Top Right */}
            <div className="absolute top-6 right-6 z-50 flex gap-3">
                <button
                    onClick={handleArrived}
                    className="px-6 py-3 rounded-lg bg-white border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition shadow-lg"
                >
                    Arrived
                </button>
                <button
                    onClick={handleFinished}
                    className="px-6 py-3 rounded-lg bg-white border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition shadow-lg flex items-center gap-2"
                >
                    Finished
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Map - Full Screen */}
            <div className="flex-1">
                {mapLocations.length > 0 ? (
                    <ItineraryMap locations={mapLocations} height="100%" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No map data available</p>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-6 right-6 z-50 flex gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-lg flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Preview
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-lg flex items-center gap-2"
                >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MapView;
