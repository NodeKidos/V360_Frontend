import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FaMapMarkerAlt, FaHotel, FaHiking, FaTimes, FaExchangeAlt, FaCloudSun, FaTools, FaClock, FaMedkit, FaEdit } from 'react-icons/fa';

interface DayItem {
    id: string;
    name: string;
    type: 'destination' | 'hotel' | 'excursion';
}

interface DroppableDayProps {
    dayNumber: number;
    date: string;
    title?: string;
    description?: string;
    destination?: DayItem;
    hotel?: DayItem;
    excursions: DayItem[];
    onRemoveItem: (type: 'destination' | 'hotel' | 'excursion', id?: string) => void;
    onReschedule?: (dayNumber: number, reason: string) => void;
    isAdmin?: boolean;
}

export function DroppableDay({
    dayNumber,
    date,
    title,
    description,
    destination,
    hotel,
    excursions,
    onRemoveItem,
    onReschedule,
    isAdmin = false,
}: DroppableDayProps) {
    const [showReasons, setShowReasons] = useState(false);
    const [customReason, setCustomReason] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

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

    const reasons = [
        { id: 'weather', label: 'Bad Weather', icon: <FaCloudSun className="text-blue-500" /> },
        { id: 'technical', label: 'Technical Issue', icon: <FaTools className="text-gray-500" /> },
        { id: 'delay', label: 'Schedule Delay', icon: <FaClock className="text-yellow-500" /> },
        { id: 'medical', label: 'Medical Emergency', icon: <FaMedkit className="text-red-500" /> },
    ];

    const handleRescheduleClick = (reason: string) => {
        if (onReschedule) {
            onReschedule(dayNumber, reason);
        }
        setShowReasons(false);
        setShowCustomInput(false);
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

    const isPostponed = title === 'Schedule Adjustment';

    return (
        <div
            ref={setNodeRef}
            className={`relative border-2 rounded-xl p-4 transition-all ${isOver
                ? 'border-green-500 bg-green-50 shadow-lg'
                : isPostponed && !hasContent
                    ? 'border-amber-300 bg-amber-50 shadow-sm'
                    : hasContent
                        ? 'border-gray-300 bg-white'
                        : 'border-dashed border-gray-300 bg-gray-50'
                }`}
        >
            {isPostponed && !hasContent && (
                <div className="absolute top-2 right-12 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                    POSTPONED
                </div>
            )}
            {/* Day Header */}
            <div className="mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#B749DB]">Day {dayNumber}</h3>
                        <span className="text-[10px] text-gray-600">{formatDate(date)}</span>
                    </div>
                    {isAdmin && (
                        <div className="relative">
                            <button
                                onClick={() => setShowReasons(!showReasons)}
                                className="p-1.5 bg-purple-50 text-[#B749DB] rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1 text-xs font-semibold"
                                title="Move to Next Day"
                            >
                                <FaExchangeAlt size={12} />
                                <span>Move</span>
                            </button>

                            {showReasons && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in duration-200">
                                    <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Reason</p>
                                    {reasons.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => handleRescheduleClick(r.label)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors text-left"
                                        >
                                            {r.icon}
                                            <span>{r.label}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setShowCustomInput(!showCustomInput)}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors text-left"
                                    >
                                        <FaEdit className="text-purple-500" />
                                        <span>Other...</span>
                                    </button>

                                    {showCustomInput && (
                                        <div className="p-2 space-y-2 border-t mt-1">
                                            <input
                                                type="text"
                                                value={customReason}
                                                onChange={(e) => setCustomReason(e.target.value)}
                                                placeholder="Enter reason..."
                                                className="w-full text-xs border rounded p-1.5 outline-none focus:border-purple-400"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleRescheduleClick(customReason || 'Other reason')}
                                                disabled={!customReason.trim()}
                                                className="w-full py-1.5 bg-[#B749DB] text-white text-xs font-bold rounded-lg disabled:opacity-50"
                                            >
                                                Confirm Move
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-2 min-h-[100px]">
                {isPostponed && !hasContent && !isOver && (
                    <div className="bg-white/60 border border-amber-200 rounded-lg p-3 text-center space-y-1">
                        <p className="text-amber-800 text-xs font-bold uppercase">Schedule Adjustment</p>
                        <p className="text-amber-600 text-[11px] italic leading-tight">
                            {description || 'No reason provided'}
                        </p>
                        <div className="pt-2 border-t border-amber-100">
                            <p className="text-[9px] text-amber-400 font-medium italic">Drop new items here to fill this day</p>
                        </div>
                    </div>
                )}

                {!hasContent && !isOver && !isPostponed && (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        <p>Drop items here</p>
                    </div>
                )}

                {isOver && (
                    <div className="flex items-center justify-center h-full text-green-600 text-sm font-semibold">
                        <p>Drop here to assign</p>
                    </div>
                )}

                {destination && (
                    <div>
                        <p className="text-[10px] text-gray-500 mb-0.5 font-bold uppercase tracking-tight">Destination</p>
                        <ItemDisplay
                            item={destination}
                            onRemove={() => onRemoveItem('destination')}
                        />
                    </div>
                )}

                {hotel && (
                    <div>
                        <p className="text-[10px] text-gray-500 mb-0.5 font-bold uppercase tracking-tight">Hotel</p>
                        <ItemDisplay
                            item={hotel}
                            onRemove={() => onRemoveItem('hotel')}
                        />
                    </div>
                )}

                {excursions.length > 0 && (
                    <div>
                        <p className="text-[10px] text-gray-500 mb-0.5 font-bold uppercase tracking-tight">Excursions</p>
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
