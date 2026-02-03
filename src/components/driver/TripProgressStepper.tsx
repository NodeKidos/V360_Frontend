import { useState } from 'react';
import { FaMapMarkerAlt, FaHotel, FaHiking } from 'react-icons/fa';

interface Location {
    id: string;
    name: string;
    type?: string;
    visited?: boolean;
    current?: boolean;
}

interface TripProgressStepperProps {
    dayNumber: number;
    date?: string;
    destination?: any;
    hotel?: any;
    excursions?: any[];
    locations?: Location[];
    onStatusChange?: (locationId: string, status: 'start' | 'arrived' | 'finished') => void;
    status?: 'not-started' | 'in-progress' | 'completed';
}

const TripProgressStepper: React.FC<TripProgressStepperProps> = ({
    dayNumber,
    date,
    destination,
    hotel,
    excursions = [],
    locations = [],
    onStatusChange,
    status = 'not-started'
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = () => {
        switch (status) {
            case 'completed': return 'bg-green-100 border-green-500';
            case 'in-progress': return 'bg-blue-100 border-blue-500';
            default: return 'bg-gray-100 border-gray-300';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'completed': return '✓';
            case 'in-progress': return '→';
            default: return dayNumber;
        }
    };

    return (
        <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${getStatusColor()} mb-4 transition-all`}>
            {/* Day Header with Destination & Hotel */}
            <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-start gap-4 flex-1">
                    {/* Day Number Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${status === 'completed' ? 'bg-green-500 text-white' :
                        status === 'in-progress' ? 'bg-blue-500 text-white' :
                            'bg-gray-300 text-gray-700'
                        }`}>
                        {getStatusIcon()}
                    </div>

                    {/* Day Info with Destination & Hotel */}
                    <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-1">
                            <h4 className="text-xl font-bold text-gray-800 font-poppins">Day {dayNumber}</h4>
                            {date && <p className="text-sm text-gray-500">{formatDate(date)}</p>}
                        </div>

                        {/* Destination & Hotel inline */}
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            {destination && (
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-purple-600" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Destination</p>
                                        <p className="text-sm font-bold text-gray-800">{destination.name}</p>
                                    </div>
                                </div>
                            )}

                            {hotel && (
                                <div className="flex items-center gap-2">
                                    <FaHotel className="text-amber-600" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Hotel</p>
                                        <p className="text-sm font-bold text-gray-800">{hotel.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-shrink-0">
                    <button
                        onClick={() => onStatusChange?.(locations[0]?.id, 'start')}
                        disabled={status !== 'not-started'}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition text-sm ${status === 'not-started'
                            ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
                            : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                            }`}
                    >
                        Start
                    </button>
                    <button
                        onClick={() => {
                            // Find current location and mark as arrived
                            const currentLoc = locations?.find(loc => loc.current);
                            if (currentLoc) {
                                onStatusChange?.(currentLoc.id, 'arrived');
                            }
                        }}
                        disabled={status !== 'in-progress'}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition text-sm ${status === 'in-progress'
                            ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                            : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                            }`}
                    >
                        Arrived
                    </button>
                    <button
                        onClick={() => onStatusChange?.(locations[locations.length - 1]?.id, 'finished')}
                        disabled={status !== 'in-progress'}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition text-sm ${status === 'in-progress'
                            ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
                            : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                            }`}
                    >
                        Finish Day
                    </button>
                </div>
            </div>

            {/* Horizontal Progress Stepper */}
            {locations && locations.length > 0 && (
                <div className="relative pt-6 pb-4 overflow-x-auto">
                    <div className="flex justify-between items-start relative min-w-max px-4">
                        {locations.map((location, _index) => (
                            <div key={location.id} className="flex flex-col items-center relative" style={{ flex: 1, minWidth: '100px' }}>
                                {/* Marker Dot */}
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10
                                    ${location.visited
                                        ? 'bg-green-500 border-4 border-green-200'
                                        : location.current
                                            ? 'bg-blue-500 border-4 border-blue-200 ring-4 ring-blue-100'
                                            : 'bg-white border-4 border-gray-300'
                                    }
                                `}>
                                    {location.visited ? (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : location.current ? (
                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                    )}
                                </div>

                                {/* Location Name */}
                                <p className={`
                                    text-xs text-center mt-3 font-medium max-w-[100px] leading-tight
                                    ${location.visited || location.current ? 'text-gray-800 font-semibold' : 'text-gray-500'}
                                `}>
                                    {location.name}
                                </p>
                            </div>
                        ))}

                        {/* Connecting Line (base gray) */}
                        {locations.length > 1 && (
                            <div
                                className="absolute top-6 h-1 bg-gray-300"
                                style={{
                                    left: `calc(100% / ${locations.length} / 2)`, // Center of first circle
                                    right: `calc(100% / ${locations.length} / 2)`, // Center of last circle
                                }}
                            />
                        )}

                        {/* Progress Line (green overlay) */}
                        {locations.length > 1 && (
                            <div
                                className="absolute top-6 h-1 bg-green-500 transition-all duration-500"
                                style={{
                                    left: `calc(100% / ${locations.length} / 2)`,
                                    // Width = total line length * (completed count / (total - 1))
                                    // We divide by (total-1) because progress is measured by segments between circles
                                    width: locations.filter(l => l.visited).length === 0 ? '0%' :
                                        `calc((100% - 100% / ${locations.length}) * ${(locations.filter(l => l.visited).length - 1) / (locations.length - 1)
                                        })`,
                                }}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Excursions - Expandable with Progress */}
            {excursions.length > 0 && (
                <div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm mb-2"
                    >
                        <FaHiking size={16} />
                        {excursions.length} Excursion{excursions.length > 1 ? 's' : ''}
                        <span className="text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </button>

                    {isExpanded && (
                        <div className="ml-6 space-y-2">
                            {excursions.map((exc, index) => {
                                // Find this excursion in locations to check if it's completed
                                const excLocation = locations?.find(loc => loc.id === exc.id);
                                const isCompleted = excLocation?.visited || false;
                                const isCurrent = excLocation?.current || false;

                                return (
                                    <div key={exc.id || index} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isCompleted ? 'bg-green-50 border border-green-200' :
                                        isCurrent ? 'bg-blue-50 border border-blue-200' :
                                            'bg-gray-50 border border-gray-200'
                                        }`}>
                                        {/* Progress Circle */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? 'bg-green-500' :
                                            isCurrent ? 'bg-blue-500 ring-2 ring-blue-200' :
                                                'bg-gray-300'
                                            }`}>
                                            {isCompleted ? (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="text-white font-bold text-xs">{index + 1}</span>
                                            )}
                                        </div>

                                        {/* Excursion Name */}
                                        <p className={`text-sm flex-1 ${isCompleted ? 'text-green-800 font-semibold' :
                                            isCurrent ? 'text-blue-800 font-semibold' :
                                                'text-gray-700'
                                            }`}>
                                            {exc.name}
                                        </p>

                                        {/* Status Badge */}
                                        {isCompleted && (
                                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                                                ✓ Done
                                            </span>
                                        )}
                                        {isCurrent && (
                                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold">
                                                → Current
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TripProgressStepper;
