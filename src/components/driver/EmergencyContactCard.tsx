import React from 'react';
import { FaPhone, FaComments } from 'react-icons/fa';

interface EmergencyContact {
    id: string;
    name: string;
    type: 'driver' | 'ambulance' | 'police' | 'firefighter';
    rating: number;
    phone: string;
    image?: string;
}

interface EmergencyContactCardProps {
    contact: EmergencyContact;
    onCall: (phone: string) => void;
    onMessage: () => void;
}

const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({ contact, onCall, onMessage }) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mb-4">
            <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {contact.image ? (
                        <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400 text-2xl">👤</span>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 font-poppins">{contact.name}</h4>
                    <div className="flex items-center gap-1">
                        <span className="text-orange-500">⭐</span>
                        <span className="text-sm font-medium">{contact.rating.toFixed(1)} stars</span>
                    </div>
                    <p className="text-xs text-gray-500">ID: {contact.id}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onMessage}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    <FaComments className="text-gray-600" />
                </button>
                <button
                    onClick={() => onCall(contact.phone)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    <FaPhone className="text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default EmergencyContactCard;
