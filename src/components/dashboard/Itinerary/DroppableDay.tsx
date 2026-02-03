
import { useDroppable } from '@dnd-kit/core';
import { FaMapMarkerAlt, FaHotel, FaHiking, FaTimes } from 'react-icons/fa';

interface DayItem {
    id: string;
    name: string;
    type: 'destination' | 'hotel' | 'excursion';
}

interface DroppableDayProps {
    dayNumber: number;
    date: string;
    destination?: DayItem;
    hotel?: DayItem;
    excursions: DayItem[];
    onRemoveItem: (type: 'destination' | 'hotel' | 'excursion', id?: string) => void;
}

export function DroppableDay({
    dayNumber,
    date,
    destination,
    hotel,
    excursions,
    onRemoveItem,
}: DroppableDayProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `day-${dayNumber}`,
        data: { dayNumber, date },
    });

    const hasContent = destination || hotel || excursions.length > 0;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const ItemDisplay = ({ item, onRemove }: { item: DayItem; onRemove: () => void }) => {
        const getIcon = () => {
            switch (item.type) {
                case 'destination':
                    return <FaMapMarkerAlt className="text-blue-600" />;
                case 'hotel':
                    return <FaHotel className="text-purple-600" />;
                case 'excursion':
                    return <FaHiking className="text-green-600" />;
            }
        };

        const getBgColor = () => {
            switch (item.type) {
                case 'destination':
                    return 'bg-blue-50 border-blue-200';
                case 'hotel':
                    return 'bg-purple-50 border-purple-200';
                case 'excursion':
                    return 'bg-green-50 border-green-200';
            }
        };

        return (
            <div className={`flex items-center gap-2 p-2 border rounded-lg ${getBgColor()}`}>
                {getIcon()}
                <span className="flex-1 text-sm font-medium text-gray-800">{item.name}</span>
                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Remove"
                >
                    <FaTimes className="text-red-500" size={12} />
                </button>
            </div>
        );
    };

    return (
        <div
            ref={setNodeRef}
            className={`border-2 rounded-xl p-4 transition-all ${isOver
                ? 'border-green-500 bg-green-50 shadow-lg'
                : hasContent
                    ? 'border-gray-300 bg-white'
                    : 'border-dashed border-gray-300 bg-gray-50'
                }`}
        >
            {/* Day Header */}
            <div className="mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#B749DB]">Day {dayNumber}</h3>
                    <span className="text-sm text-gray-600">{formatDate(date)}</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-2 min-h-[100px]">
                {!hasContent && !isOver && (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        <p>Drop destination, hotel, or excursion here</p>
                    </div>
                )}

                {isOver && (
                    <div className="flex items-center justify-center h-full text-green-600 text-sm font-semibold">
                        <p>Drop here to assign</p>
                    </div>
                )}

                {destination && (
                    <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Destination</p>
                        <ItemDisplay
                            item={destination}
                            onRemove={() => onRemoveItem('destination')}
                        />
                    </div>
                )}

                {hotel && (
                    <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Hotel</p>
                        <ItemDisplay
                            item={hotel}
                            onRemove={() => onRemoveItem('hotel')}
                        />
                    </div>
                )}

                {excursions.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Excursions</p>
                        <div className="space-y-1">
                            {excursions.map((excursion) => (
                                <ItemDisplay
                                    key={excursion.id}
                                    item={excursion}
                                    onRemove={() => onRemoveItem('excursion', excursion.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
