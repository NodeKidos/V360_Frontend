import React from 'react';
import { FaCircle, FaMapMarkerAlt } from 'react-icons/fa';

interface TimelineLocation {
    id: string;
    name: string;
    time: string;
    isFirst?: boolean;
    isLast?: boolean;
}

interface DestinationTimelineProps {
    cityName: string;
    locations: TimelineLocation[];
}

const DestinationTimeline: React.FC<DestinationTimelineProps> = ({ cityName, locations }) => {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">{cityName}</h3>

            <div className="relative pl-8">
                {/* Vertical Line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-300"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                    {locations.map((location, _index) => (
                        <div key={location.id} className="relative flex items-center gap-4">
                            {/* Marker */}
                            <div className="absolute -left-8 flex items-center justify-center">
                                {location.isFirst ? (
                                    <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
                                        <FaCircle className="text-blue-600 text-xs" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex items-center justify-between bg-white">
                                <span className="text-base font-medium text-gray-800 font-poppins">
                                    {location.name}
                                </span>
                                <span className="text-sm text-gray-600 font-poppins">
                                    {location.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DestinationTimeline;
