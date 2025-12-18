import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPhone, FaEnvelope, FaCar, FaUsers, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Sidebar from '../AdminSidebar';
import TopBar from '../Topbar';
import ItineraryMap from './ItineraryMap';
import { useDriverStore } from '../../store/useDriverStore';
import { Loader } from '../ui/Loader';

const DetailedItinerary = () => {
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

    // Prepare locations for map
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (isLoadingSchedule) {
        return (
            <div className="h-screen bg-white flex overflow-hidden">
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
            <div className="h-screen bg-white flex overflow-hidden">
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
                        onClick={() => navigate('/driver-trips')}
                        className="px-6 py-3 bg-[#B749DB] text-white rounded-xl hover:bg-purple-600"
                    >
                        Back to Itineraries
                    </button>
                </div>
            </div>
        );
    }

    const { itinerary, schedule } = currentSchedule;

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

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/driver-trips')}
                        className="flex items-center gap-2 text-[#B749DB] hover:text-purple-600 font-poppins font-medium mb-4 mt-4"
                    >
                        <FaArrowLeft /> Back to Itineraries
                    </button>

                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-[#B749DB] to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6 shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-2">
                                    {itinerary.itineraryNumber}
                                </h1>
                                <p className="text-purple-100 text-lg">{itinerary.customerName}</p>
                            </div>
                            <div className="flex flex-col md:items-end gap-2">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt />
                                    <span className="font-medium">
                                        {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaUsers />
                                    <span>{itinerary.numberOfParticipants} Participants</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Vehicle Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Customer Contact */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-poppins">Customer Contact</h3>
                            <div className="space-y-3">
                                {itinerary.customerPhone && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <FaPhone className="text-[#B749DB]" />
                                        <a href={`tel:${itinerary.customerPhone}`} className="hover:text-[#B749DB]">
                                            {itinerary.customerPhone}
                                        </a>
                                    </div>
                                )}
                                {itinerary.customerEmail && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <FaEnvelope className="text-[#B749DB]" />
                                        <a href={`mailto:${itinerary.customerEmail}`} className="hover:text-[#B749DB]">
                                            {itinerary.customerEmail}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        {itinerary.vehicle && (
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-poppins">Assigned Vehicle</h3>
                                <div className="flex items-center gap-3">
                                    <FaCar className="text-[#B749DB] text-2xl" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{itinerary.vehicle.make} {itinerary.vehicle.model}</p>
                                        <p className="text-sm text-gray-600">{itinerary.vehicle.registrationNumber}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Special Requests */}
                    {itinerary.specialRequests && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-amber-900 mb-2 font-poppins">Special Requests</h3>
                            <p className="text-amber-800">{itinerary.specialRequests}</p>
                        </div>
                    )}

                    {/* Route Map */}
                    {mapLocations.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100 mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#B749DB]" />
                                Route Map
                            </h3>
                            <ItineraryMap locations={mapLocations} height="400px" />
                            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                    <span className="text-gray-700">Destinations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                    <span className="text-gray-700">Hotels</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                                    <span className="text-gray-700">Excursions</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Day-by-Day Schedule */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 font-poppins">Day-by-Day Schedule</h3>

                        <div className="space-y-6">
                            {schedule?.map((day: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                    {/* Day Header */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#B749DB] font-poppins">
                                                Day {day.dayNumber}
                                            </h4>
                                            <p className="text-gray-600 text-sm">{formatDate(day.date)}</p>
                                        </div>
                                        {day.title && (
                                            <p className="text-gray-700 font-medium">{day.title}</p>
                                        )}
                                    </div>

                                    {/* Destination */}
                                    {day.destination && (
                                        <div className="mb-4">
                                            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                📍 Destination
                                            </h5>
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <p className="font-medium text-gray-900">{day.destination.name}</p>
                                                <p className="text-sm text-gray-600 mt-1">{day.destination.location}</p>
                                                {day.destination.description && (
                                                    <p className="text-sm text-gray-700 mt-2">{day.destination.description}</p>
                                                )}
                                                {day.destination.highlights && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        <span className="font-medium">Highlights:</span> {day.destination.highlights}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hotel */}
                                    {day.hotel && (
                                        <div className="mb-4">
                                            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                🏨 Accommodation
                                            </h5>
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="font-medium text-gray-900">{day.hotel.name}</p>
                                                <p className="text-sm text-gray-600">{"⭐".repeat(day.hotel.starRating || 0)}</p>
                                                <p className="text-sm text-gray-700 mt-2">{day.hotel.address}</p>
                                                {day.hotel.contactNumber && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        📞 {day.hotel.contactNumber}
                                                    </p>
                                                )}
                                                {day.hotel.amenities && day.hotel.amenities.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-sm font-medium text-gray-700">Amenities:</p>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {day.hotel.amenities.slice(0, 5).map((amenity: string, idx: number) => (
                                                                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Excursions */}
                                    {day.excursions && day.excursions.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                🎯 Activities & Excursions ({day.excursions.length})
                                            </h5>
                                            <div className="space-y-3">
                                                {day.excursions.map((exc: any, excIdx: number) => (
                                                    <div key={excIdx} className="bg-orange-50 rounded-lg p-4">
                                                        <p className="font-medium text-gray-900">{exc.name}</p>
                                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                                                            {exc.duration && (
                                                                <span>⏱️ {exc.duration} hours</span>
                                                            )}
                                                            {exc.bestTime && (
                                                                <span>🌅 {exc.bestTime}</span>
                                                            )}
                                                            {exc.difficulty && (
                                                                <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">
                                                                    {exc.difficulty}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {exc.description && (
                                                            <p className="text-sm text-gray-700 mt-2">{exc.description}</p>
                                                        )}
                                                        {exc.meetingPoint && (
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                <span className="font-medium">Meeting Point:</span> {exc.meetingPoint}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Day Notes */}
                                    {day.notes && (
                                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                                            <p className="text-sm text-gray-600">{day.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedItinerary;
