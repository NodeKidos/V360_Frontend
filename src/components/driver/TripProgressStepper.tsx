import React from 'react';

interface Location {
    id: string;
    name: string;
    visited?: boolean;
    current?: boolean;
}

interface TripProgressStepperProps {
    cityName: string;
    locations: Location[];
    onStatusChange?: (locationId: string, status: 'start' | 'arrived' | 'finished') => void;
    status?: 'not-started' | 'in-progress' | 'completed';
}

const TripProgressStepper: React.FC<TripProgressStepperProps> = ({
    cityName,
    locations,
    onStatusChange,
    status = 'not-started'
}) => {
    const numLocations = locations.length;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-gray-800 font-poppins">{cityName}</h4>

                {/* All 3 buttons always visible */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onStatusChange?.(locations[0].id, 'start')}
                        disabled={status !== 'not-started'}
                        className={`px-6 py-2 rounded-lg border-2 font-semibold transition ${status === 'not-started'
                                ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
                                : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                            }`}
                    >
                        Start
                    </button>
                    <button
                        onClick={() => onStatusChange?.(locations[locations.length - 1].id, 'arrived')}
                        disabled={status !== 'in-progress'}
                        className={`px-6 py-2 rounded-lg border-2 font-semibold transition ${status === 'in-progress'
                                ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
                                : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                            }`}
                    >
                        Arrived
                    </button>
                    <button
                        onClick={() => onStatusChange?.(locations[locations.length - 1].id, 'finished')}
                        disabled={status !== 'in-progress'}
                        className={`px-6 py-2 rounded-lg border-2 font-semibold transition ${status === 'in-progress' || status === 'completed'
                                ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
                                : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                            }`}
                    >
                        Finished
                    </button>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="relative pt-6">
                {/* Location Markers */}
                <div className="flex justify-between items-start relative">
                    {locations.map((location, index) => (
                        <div key={location.id} className="flex flex-col items-center relative" style={{ flex: 1 }}>
                            {/* Connecting line - only show between dots */}
                            {index < numLocations - 1 && (
                                <div className="absolute left-1/2 top-6 h-2 bg-gray-400"
                                    style={{
                                        width: `calc(100% / ${numLocations} * ${numLocations})`,
                                        left: '50%'
                                    }}>
                                </div>
                            )}

                            {/* Blue progress line overlay */}
                            {index < numLocations - 1 && location.visited && (
                                <div className="absolute left-1/2 top-6 h-2 bg-blue-500 transition-all duration-500"
                                    style={{
                                        width: `calc(100% / ${numLocations} * ${numLocations})`,
                                        left: '50%'
                                    }}>
                                </div>
                            )}

                            {/* Marker Dot */}
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10
                                ${location.visited
                                    ? 'bg-blue-500 border-4 border-blue-200'
                                    : location.current
                                        ? 'bg-white border-4 border-blue-500 ring-4 ring-blue-100'
                                        : 'bg-white border-4 border-gray-300'
                                }
                            `}>
                                {location.visited ? (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <div className={`w-3 h-3 rounded-full ${location.current ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                )}
                            </div>

                            {/* Location Name */}
                            <p className={`
                                text-xs text-center mt-3 font-medium max-w-[100px] leading-tight
                                ${location.visited || location.current ? 'text-gray-800' : 'text-gray-500'}
                            `}>
                                {location.name}
                            </p>
                        </div>
                    ))}

                    {/* Single horizontal line spanning from first to last dot */}
                    <div className="absolute top-6 h-2 bg-gray-400"
                        style={{
                            left: `calc(100% / ${numLocations} / 2)`,
                            right: `calc(100% / ${numLocations} / 2)`,
                        }}>
                    </div>

                    {/* Blue progress overlay */}
                    <div className="absolute top-6 h-2 bg-blue-500 transition-all duration-500"
                        style={{
                            left: `calc(100% / ${numLocations} / 2)`,
                            width: `calc((100% - 100% / ${numLocations}) * ${(locations.filter(l => l.visited).length - 1) / Math.max(numLocations - 1, 1)})`,
                        }}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripProgressStepper;
