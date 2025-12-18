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

const CustomerInfoCard: React.FC<CustomerInfo> = ({
    name,
    dateOfBirth,
    gender,
    email,
    phone,
    groupComposition,
    countryOfResidence,
    arrivalDate,
    departureDate,
    preferredDuration,
}) => {
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'N/A';
        try {
            return new Date(date).toLocaleDateString();
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Customer Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {/* Row 1 */}
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Customer Name</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{name || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Contact No</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{phone || 'N/A'}</span>
                </div>

                {/* Row 2 */}
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Date of birth</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{dateOfBirth ? formatDate(dateOfBirth) : 'N/A'}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Country of residence</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{countryOfResidence || 'N/A'}</span>
                </div>

                {/* Row 3 */}
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Gender</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{gender || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Arrival Date</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{formatDate(arrivalDate)}</span>
                </div>

                {/* Row 4 */}
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Email Address</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{email || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Departure Date</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{formatDate(departureDate)}</span>
                </div>

                {/* Row 5 */}
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Group Composition</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{groupComposition || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-48">Preferred Duration of stay</span>
                    <span className="text-sm text-gray-500 mx-2">:</span>
                    <span className="text-sm font-semibold text-gray-800">{preferredDuration || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoCard;
