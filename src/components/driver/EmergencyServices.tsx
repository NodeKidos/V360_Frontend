import React from 'react';
import { MdLocalPolice, /* MdLocalHospital, */ MdLocalFireDepartment, MdDirectionsCar } from 'react-icons/md';
import { FaAmbulance } from 'react-icons/fa';

interface EmergencyService {
    type: 'driver' | 'ambulance' | 'police' | 'firefighter';
    label: string;
    icon: React.ReactNode;
    color: string;
}

interface EmergencyServicesProps {
    onServiceSelect: (type: string) => void;
}

const EmergencyServices: React.FC<EmergencyServicesProps> = ({ onServiceSelect }) => {
    const services: EmergencyService[] = [
        {
            type: 'driver',
            label: 'Driver',
            icon: <MdDirectionsCar className="text-2xl" />,
            color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        },
        {
            type: 'ambulance',
            label: 'Ambulance',
            icon: <FaAmbulance className="text-2xl" />,
            color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        },
        {
            type: 'police',
            label: 'Police',
            icon: <MdLocalPolice className="text-2xl" />,
            color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        },
        {
            type: 'firefighter',
            label: 'Firefighters',
            icon: <MdLocalFireDepartment className="text-2xl" />,
            color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        },
    ];

    return (
        <div className="flex gap-4">
            {services.map((service) => (
                <button
                    key={service.type}
                    onClick={() => onServiceSelect(service.type)}
                    className={`${service.color} px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition`}
                >
                    {service.icon}
                    <span>{service.label}</span>
                </button>
            ))}
        </div>
    );
};

export default EmergencyServices;
