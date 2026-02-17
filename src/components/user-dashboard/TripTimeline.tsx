import { useMemo } from 'react';
import TripProgressStepper from '../driver/TripProgressStepper';
import type { Itinerary } from '../../types/itinerary.types';

interface TripTimelineProps {
    itinerary: Itinerary;
    locationProgress: any[];
}

export const TripTimeline = ({ itinerary, locationProgress }: TripTimelineProps) => {

    const dayGroups = useMemo(() => {
        if (!itinerary.days) return [];

        return itinerary.days
            .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
            .map((day) => {
                const dayNumber = day.dayNumber;

                return {
                    dayNumber,
                    date: day.date,
                    title: day.title,
                    description: day.description,
                    destination: day.destination,
                    hotel: day.hotel,
                    excursions: day.excursions || [],
                    // Flatten all locations for this day with unique IDs per day
                    locations: [
                        ...(day.destination ? [{
                            id: `day-${dayNumber}-dest-${day.destination.id}`, // Make ID unique per day
                            originalId: day.destination.id, // Keep original for backend calls
                            name: day.destination.name,
                            type: 'destination',
                        }] : []),
                        ...(day.excursions || []).map((exc: any) => ({
                            id: `day-${dayNumber}-exc-${exc.id}`, // Make ID unique per day
                            originalId: exc.id,
                            name: exc.name,
                            type: 'excursion',
                        })),
                        ...(day.hotel ? [{
                            id: `day-${dayNumber}-hotel-${day.hotel.id}`, // Make ID unique per day
                            originalId: day.hotel.id,
                            name: day.hotel.name,
                            type: 'hotel',
                        }] : []),
                    ]
                };
            });
    }, [itinerary]);

    // Get all locations in sequential order across all days
    const allLocationsInOrder = useMemo(() => dayGroups.flatMap(day => day.locations), [dayGroups]);

    // Update locations with progress from backend
    const getLocationsWithProgress = (locations: any[]) => {
        return locations.map((loc) => {
            // Look up progress using originalId (backend stores by original location ID)
            const originalId = loc.originalId || loc.id;
            const progress = locationProgress.find(p => p.locationId === originalId);
            const status = progress?.status || 'not_started';
            const isCompleted = status === 'completed';

            // Find index of this location in the global order
            const globalIndex = allLocationsInOrder.findIndex(l => l.id === loc.id);

            // Check if all locations BEFORE this one (globally) are completed
            const allBeforeThisCompleted = globalIndex === 0 || allLocationsInOrder
                .slice(0, globalIndex)
                .every(prevLoc => {
                    const prevOriginalId = prevLoc.originalId || prevLoc.id;
                    const prevProgress = locationProgress.find(p => p.locationId === prevOriginalId);
                    return prevProgress?.status === 'completed';
                });

            // More robust logic for "Current":
            // If status is started or arrived, it is definitely current.
            // If status is not_started, but everything before it is completed, it is effectively the next current target.
            // However, usually "current" implies active connection.
            // Let's stick to simple logic:
            // It is current if (status is in_progress/arrived) OR (it is the first not_completed and preceeded by all completed)

            const isStartedOrArrived = status === 'started' || status === 'arrived';
            const isNextUp = !isCompleted && allBeforeThisCompleted;

            return {
                ...loc,
                visited: isCompleted,
                current: isStartedOrArrived || (isNextUp && locationProgress.length > 0), // Only show "current" prediction if trip has started (progress exists)
            };
        });
    };

    // Get status for a specific day
    const getDayStatus = (dayLocations: any[]): 'not-started' | 'in-progress' | 'completed' => {
        if (dayLocations.length === 0) return 'not-started';

        const locationsWithProgress = dayLocations.map((loc) => {
            const originalId = loc.originalId || loc.id;
            return locationProgress.find(p => p.locationId === originalId);
        });

        const allCompleted = locationsWithProgress.every(p => p?.status === 'completed');
        const anyStarted = locationsWithProgress.some(p =>
            p?.status === 'started' || p?.status === 'arrived' || p?.status === 'completed'
        );

        if (allCompleted) return 'completed';
        if (anyStarted) return 'in-progress';
        return 'not-started';
    };

    if (!itinerary.days || itinerary.days.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-[#5B247A] font-poppins">Trip Timeline</h2>
                {locationProgress.length > 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full animate-pulse">
                        Live Updates
                    </span>
                )}
            </div>

            {dayGroups.map((day) => (
                <TripProgressStepper
                    key={day.dayNumber}
                    dayNumber={day.dayNumber}
                    date={day.date}
                    title={day.title}
                    description={day.description}
                    destination={day.destination}
                    hotel={day.hotel}
                    excursions={day.excursions}
                    locations={getLocationsWithProgress(day.locations)}
                    status={getDayStatus(day.locations)}
                />
            ))}
        </div>
    );
};
