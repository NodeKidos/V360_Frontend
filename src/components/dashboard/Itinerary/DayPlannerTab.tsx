import { useState, useEffect } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { toast } from 'react-toastify';
import { DraggableItem } from './DraggableItem';
import { DroppableDay } from './DroppableDay';

interface DayPlan {
    dayNumber: number;
    date: string;
    destination?: {
        id: string;
        name: string;
    };
    hotel?: {
        id: string;
        name: string;
        destination: string;
    };
    excursions: Array<{
        id: string;
        name: string;
        destination: string;
    }>;
}

interface DayPlannerTabProps {
    itinerary: any;
    onSave: (dayPlans: DayPlan[]) => Promise<void>;
}

export function DayPlannerTab({ itinerary, onSave }: DayPlannerTabProps) {
    const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
    const [saving, setSaving] = useState(false);

    // Initialize day plans from itinerary
    useEffect(() => {
        if (!itinerary) return;

        const start = new Date(itinerary.startDate);
        const end = new Date(itinerary.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Create day plans from existing days or empty days
        const plans: DayPlan[] = [];
        for (let i = 0; i < diffDays; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);

            const existingDay = itinerary.days?.find((d: any) => d.dayNumber === i + 1);

            plans.push({
                dayNumber: i + 1,
                date: currentDate.toISOString().split('T')[0],
                destination: existingDay?.destination ? {
                    id: existingDay.destination.id,
                    name: existingDay.destination.name
                } : undefined,
                hotel: existingDay?.hotel ? {
                    id: existingDay.hotel.id,
                    name: existingDay.hotel.name,
                    destination: existingDay.destination?.name || ''
                } : undefined,
                excursions: existingDay?.excursions?.map((ex: any) => ({
                    id: ex.id,
                    name: ex.name,
                    destination: existingDay.destination?.name || ''
                })) || []
            });
        }

        setDayPlans(plans);
    }, [itinerary]);

    // Get customer selections from itinerary metadata or formData
    const getCustomerSelections = () => {
        if (!itinerary) return { destinations: [], hotels: [], excursions: [] };

        // Extract unique items from days
        const destinations = new Map();
        const hotels = new Map();
        const excursions = new Map();

        itinerary.days?.forEach((day: any) => {
            if (day.destination) {
                destinations.set(day.destination.id, {
                    id: day.destination.id,
                    name: day.destination.name,
                });
            }
            if (day.hotel) {
                hotels.set(day.hotel.id, {
                    id: day.hotel.id,
                    name: day.hotel.name,
                    destination: day.destination?.name || 'Unknown'
                });
            }
            day.excursions?.forEach((ex: any) => {
                excursions.set(ex.id, {
                    id: ex.id,
                    name: ex.name,
                    destination: day.destination?.name || 'Unknown'
                });
            });
        });

        return {
            destinations: Array.from(destinations.values()),
            hotels: Array.from(hotels.values()),
            excursions: Array.from(excursions.values())
        };
    };

    const customerSelections = getCustomerSelections();

    // Check if item is already assigned to any day
    const isItemAssigned = (type: 'destination' | 'hotel' | 'excursion', id: string) => {
        return dayPlans.some(plan => {
            if (type === 'destination') return plan.destination?.id === id;
            if (type === 'hotel') return plan.hotel?.id === id;
            if (type === 'excursion') return plan.excursions.some(ex => ex.id === id);
            return false;
        });
    };

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const item = active.data.current;
        if (!item) return;

        const dayNumber = parseInt(over.id.toString().replace('day-', ''));
        const dayIndex = dayNumber - 1;

        if (dayIndex < 0 || dayIndex >= dayPlans.length) return;

        const currentPlan = dayPlans[dayIndex];

        // Validation logic
        if (item.type === 'hotel') {
            if (!currentPlan.destination) {
                toast.error('Please assign a destination to this day before adding a hotel');
                return;
            }
            if (item.destination !== currentPlan.destination.name) {
                toast.error(`This hotel is for ${item.destination}, but day ${dayNumber} is in ${currentPlan.destination.name}`);
                return;
            }
            if (currentPlan.hotel) {
                toast.error(`Day ${dayNumber} already has a hotel assigned. Remove it first.`);
                return;
            }
        }

        if (item.type === 'excursion') {
            if (!currentPlan.destination) {
                toast.error('Please assign a destination to this day before adding excursions');
                return;
            }
            if (item.destination !== currentPlan.destination.name) {
                toast.error(`This excursion is for ${item.destination}, but day ${dayNumber} is in ${currentPlan.destination.name}`);
                return;
            }
        }

        if (item.type === 'destination' && currentPlan.destination) {
            toast.error(`Day ${dayNumber} already has a destination. Remove it first to change.`);
            return;
        }

        // Update day plan
        setDayPlans(prevPlans => {
            const newPlans = [...prevPlans];
            const plan = newPlans[dayIndex];

            if (item.type === 'destination') {
                plan.destination = { id: item.id, name: item.name };
                toast.success(`${item.name} assigned to Day ${dayNumber}`);
            } else if (item.type === 'hotel') {
                plan.hotel = { id: item.id, name: item.name, destination: item.destination };
                toast.success(`${item.name} assigned to Day ${dayNumber}`);
            } else if (item.type === 'excursion') {
                // Check against latest state to prevent duplicates from double-firing events
                if (plan.excursions.some(ex => ex.id === item.id)) {
                    console.log('Excursion already exists, skipping duplicate');
                    return prevPlans; // Return unchanged state
                }
                plan.excursions.push({ id: item.id, name: item.name, destination: item.destination });
                toast.success(`${item.name} added to Day ${dayNumber}`);
            }

            return newPlans;
        });
    };

    // Remove item from day
    const handleRemoveItem = (dayNumber: number, type: 'destination' | 'hotel' | 'excursion', id?: string) => {
        setDayPlans(prevPlans => {
            const newPlans = [...prevPlans];
            const plan = newPlans[dayNumber - 1];

            if (type === 'destination') {
                // Clear destination and dependent items
                const destName = plan.destination?.name;
                plan.destination = undefined;
                plan.hotel = undefined;
                plan.excursions = [];
                toast.info(`Removed ${destName} and all related items from Day ${dayNumber}`);
            } else if (type === 'hotel') {
                const hotelName = plan.hotel?.name;
                plan.hotel = undefined;
                toast.info(`Removed ${hotelName} from Day ${dayNumber}`);
            } else if (type === 'excursion' && id) {
                const excursion = plan.excursions.find(ex => ex.id === id);
                plan.excursions = plan.excursions.filter(ex => ex.id !== id);
                toast.info(`Removed ${excursion?.name} from Day ${dayNumber}`);
            }

            return newPlans;
        });
    };

    // Save day plans
    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(dayPlans);
            toast.success('Day plans saved successfully!');
        } catch (error) {
            console.error('Failed to save day plans:', error);
            toast.error('Failed to save day plans');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#5B247A]">Day-by-Day Planner</h2>
                        <p className="text-gray-600 mt-1">
                            Drag and drop destinations, hotels, and excursions to organize the itinerary
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-[#B749DB] text-white rounded-lg font-semibold hover:bg-[#8B2BB9] disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Day Plans'}
                    </button>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel - Available Items */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Destinations */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                📍 Destinations
                                <span className="text-xs text-gray-500">({customerSelections.destinations.length})</span>
                            </h3>
                            <div className="space-y-2">
                                {customerSelections.destinations.map((dest: any) => (
                                    <DraggableItem
                                        key={dest.id}
                                        id={`dest-${dest.id}`}
                                        type="destination"
                                        data={dest}
                                        isAssigned={isItemAssigned('destination', dest.id)}
                                    />
                                ))}
                                {customerSelections.destinations.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No destinations selected</p>
                                )}
                            </div>
                        </div>

                        {/* Hotels */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                🏨 Hotels
                                <span className="text-xs text-gray-500">({customerSelections.hotels.length})</span>
                            </h3>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {customerSelections.hotels.map((hotel: any) => (
                                    <DraggableItem
                                        key={hotel.id}
                                        id={`hotel-${hotel.id}`}
                                        type="hotel"
                                        data={hotel}
                                        isAssigned={isItemAssigned('hotel', hotel.id)}
                                    />
                                ))}
                                {customerSelections.hotels.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No hotels selected</p>
                                )}
                            </div>
                        </div>

                        {/* Excursions */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                🎯 Excursions
                                <span className="text-xs text-gray-500">({customerSelections.excursions.length})</span>
                            </h3>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {customerSelections.excursions.map((excursion: any) => (
                                    <DraggableItem
                                        key={excursion.id}
                                        id={`excursion-${excursion.id}`}
                                        type="excursion"
                                        data={excursion}
                                        isAssigned={isItemAssigned('excursion', excursion.id)}
                                    />
                                ))}
                                {customerSelections.excursions.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No excursions selected</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Day Schedule */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dayPlans.map((plan) => (
                                <DroppableDay
                                    key={plan.dayNumber}
                                    dayNumber={plan.dayNumber}
                                    date={plan.date}
                                    destination={plan.destination ? { ...plan.destination, type: 'destination' as const } : undefined}
                                    hotel={plan.hotel ? { ...plan.hotel, type: 'hotel' as const } : undefined}
                                    excursions={plan.excursions.map(ex => ({ ...ex, type: 'excursion' as const }))}
                                    onRemoveItem={(type, id) => handleRemoveItem(plan.dayNumber, type, id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DndContext>
    );
}
