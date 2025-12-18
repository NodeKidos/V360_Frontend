import React from 'react';

interface EmergencyService {
    type: 'driver' | 'ambulance' | 'police' | 'firefighter';
    label: string;
    icon: string;
    color: string;
}

interface EmergencyServicesProps {
    onServiceSelect: (type: string) => void;
}

const EmergencyServices: React.FC<EmergencyServicesProps> = ({ onServiceSelect }) => {
    const services: EmergencyService[] = [
        { type: 'driver', label: 'Driver', icon: '🚗', color: 'bg-purple-100 text-purple-700' },
        { type: 'ambulance', label: 'Ambulance', icon: '🚑', color: 'bg-purple-100 text-purple-700' },
        { type: 'police', label: 'Police', icon: '👮', color: 'bg-purple-100 text-purple-700' },
        { type: 'firefighter', label: 'Firefighters', icon: '🚒', color: 'bg-purple-100 text-purple-700' },
    ];

    return (
        <div className="flex gap-4">
            {services.map((service) => (
                <button
                    key={service.type}
                    onClick={() => onServiceSelect(service.type)}
                    className={`${service.color} px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-80 transition`}
                >
                    <span className="text-2xl">{service.icon}</span>
                    <span>{service.label}</span>
                </button>
            ))}
        </div>
    );
};

export default EmergencyServices;
