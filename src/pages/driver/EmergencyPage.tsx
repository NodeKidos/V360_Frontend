import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SOSButton from '../../components/driver/SOSButton';
import EmergencyServices from '../../components/driver/EmergencyServices';
import EmergencyContactCard from '../../components/driver/EmergencyContactCard';
import ItineraryMap from '../../components/driver-dashboard/ItineraryMap';

const EmergencyPage = () => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState<string>('');

    // Mock emergency contacts - in production, these would come from backend
    const emergencyContacts = [
        {
            id: '11587',
            name: 'Malcolm Function',
            type: 'driver' as const,
            rating: 4.5,
            phone: '+94 77 123 4567',
        },
        {
            id: '11588',
            name: 'Emergency Medical Center',
            type: 'ambulance' as const,
            rating: 4.8,
            phone: '+94 77 234 5678',
        },
        {
            id: '11589',
            name: 'Police Station - Colombo',
            type: 'police' as const,
            rating: 4.3,
            phone: '+94 77 345 6789',
        },
    ];

    // Mock current location
    const currentLocation = [
        {
            lat: 6.9271,
            lng: 79.8612,
            name: 'Current Location',
            type: 'current',
        },
    ];

    const handleCall = (phone: string) => {
        console.log(`Calling ${phone}`);
        window.location.href = `tel:${phone}`;
    };

    const handleMessage = () => {
        console.log('Opening message');
    };

    const handleServiceSelect = (type: string) => {
        setSelectedService(type);
        console.log(`Selected service: ${type}`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 font-poppins mb-2">
                                Emergency Help Needed?
                            </h1>
                            <p className="text-gray-600">Just press the button the help will reach you soon</p>
                        </div>
                        <SOSButton onClick={() => console.log('SOS Clicked')} />
                    </div>

                    {/* Emergency Services */}
                    <EmergencyServices onServiceSelect={handleServiceSelect} />
                </div>
            </div>

            {/* Main Content: Map + Contacts */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section - 2/3 width */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="h-[600px]">
                                <ItineraryMap locations={currentLocation} height="100%" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Cards Section - 1/3 width */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 font-poppins">
                            Emergency Contacts
                        </h3>
                        <div className="space-y-4">
                            {emergencyContacts.map((contact) => (
                                <EmergencyContactCard
                                    key={contact.id}
                                    contact={contact}
                                    onCall={handleCall}
                                    onMessage={handleMessage}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                    >
                        Next
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyPage;
