import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaMapMarkerAlt, FaHotel, FaHiking } from 'react-icons/fa';

interface DraggableItemProps {
    id: string;
    type: 'destination' | 'hotel' | 'excursion';
    data: any;
    isAssigned?: boolean;
}

export function DraggableItem({ id, type, data, isAssigned = false }: DraggableItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { type, ...data },
        disabled: false,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    const getIcon = () => {
        switch (type) {
            case 'destination':
                return <FaMapMarkerAlt className="text-blue-600" size={18} />;
            case 'hotel':
                return <FaHotel className="text-purple-600" size={18} />;
            case 'excursion':
                return <FaHiking className="text-green-600" size={18} />;
        }
    };

    const getBackgroundColor = () => {
        if (isDragging) return 'bg-gray-100';
        if (isAssigned) return 'bg-green-50 border-green-300';

        switch (type) {
            case 'destination':
                return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
            case 'hotel':
                return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
            case 'excursion':
                return 'bg-green-50 border-green-200 hover:bg-green-100';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${getBackgroundColor()} ${isDragging ? 'shadow-lg scale-105' : 'shadow-sm'
                }`}
        >
            {getIcon()}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{data.name}</p>
                {type === 'hotel' && data.destination && (
                    <p className="text-xs text-gray-500">in {data.destination}</p>
                )}
                {type === 'excursion' && data.destination && (
                    <p className="text-xs text-gray-500">at {data.destination}</p>
                )}
            </div>
            {isAssigned && (
                <div className="flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
            )}
        </div>
    );
}
