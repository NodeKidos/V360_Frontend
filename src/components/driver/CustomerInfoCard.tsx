import React from 'react';

interface CustomerInfo {
    name: string;
    dateOfBirth?: string;
    gender?: string;
    email: string;
    phone: string;
    groupComposition: string;
    countryOfResidence?: string;
    arrivalDate: string;
    departureDate: string;
    preferredDuration?: string;
}

interface CustomerInfoCardProps {
    customerInfo: CustomerInfo;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customerInfo }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const infoItems = [
        { label: 'Customer Name', value: customerInfo.name },
        { label: 'Date of birth', value: customerInfo.dateOfBirth ? formatDate(customerInfo.dateOfBirth) : 'N/A' },
        { label: 'Gender', value: customerInfo.gender || 'N/A' },
        { label: 'Email Address', value: customerInfo.email },
        { label: 'Group Composition', value: customerInfo.groupComposition },
    ];

    const contactItems = [
        { label: 'Contact No', value: customerInfo.phone },
        { label: 'Country of residence', value: customerInfo.countryOfResidence || 'N/A' },
        { label: 'Arrival Date', value: formatDate(customerInfo.arrivalDate) },
        { label: 'Departure Date', value: formatDate(customerInfo.departureDate) },
        { label: 'Preferred Duration of stay', value: customerInfo.preferredDuration || 'N/A' },
    ];

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-md border border-purple-100 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5 font-poppins">Customer Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2.5">
                {/* Left Column */}
                <div className="space-y-2.5">
                    {infoItems.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <p className="text-sm text-gray-700 font-medium w-44 font-poppins">{item.label}</p>
                            <span className="mx-2 text-gray-600">:</span>
                            <p className="text-sm text-gray-900 font-poppins flex-1">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Right Column */}
                <div className="space-y-2.5">
                    {contactItems.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <p className="text-sm text-gray-700 font-medium w-48 font-poppins">{item.label}</p>
                            <span className="mx-2 text-gray-600">:</span>
                            <p className="text-sm text-gray-900 font-poppins flex-1">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoCard;
