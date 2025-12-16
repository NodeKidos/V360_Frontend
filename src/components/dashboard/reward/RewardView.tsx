import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
import Sidebar from '../../AdminSidebar';
import TopBar from '../../Topbar';
import { IoMdAdd } from 'react-icons/io';
import img1 from '../../../assets/reward/img1.png';
import img2 from '../../../assets/reward/img2.png';
import img3 from '../../../assets/reward/img3.png';
import img4 from '../../../assets/reward/img4.png';
import { CiSearch } from 'react-icons/ci';

const RewardManagement = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Sample statistics data
    const rewardStats = {
        activeCustomers: 10,
        referralCount: 1000,
        totalRewardsDistributed: 1000,
        pendingApprovals: 500
    };

    // Sample data for rewards
    const rewards = [
        { id: 'RI001', type: 'Referring a Friend', date: '03.04.2025', customerId: 'CI001' },
        { id: 'RI002', type: 'Birthdays', date: '03.04.2025', customerId: 'CI002' },
        { id: 'RI003', type: 'Review', date: '03.04.2025', customerId: 'CI001' },
        { id: 'RI004', type: 'Active Participation', date: '03.04.2025', customerId: 'CI003' },
        { id: 'RI005', type: 'Birthdays', date: '03.04.2025', customerId: 'CI001' },
        { id: 'RI006', type: 'Active Participation', date: '03.04.2025', customerId: 'CI002' },
        { id: 'RI007', type: 'Referring a Friend', date: '03.04.2025', customerId: 'CI001' },
        { id: 'RI008', type: 'Review', date: '03.04.2025', customerId: 'CI001' }
    ];

    // Reward Categories
    const rewardCategories = [
        {
            title: "Referring a Friend",
            description: "Users earn rewards for referring friends.",
            validUntil: "Valid for 03.11.2025",
            image: "https://example.com/referring-a-friend.jpg"
        },
        {
            title: "Birthdays",
            description: "Automated birthday rewards.",
            validUntil: "Valid for 03.11.2025",
            image: "https://example.com/birthdays.jpg"
        },
        {
            title: "Reviews",
            description: "Rewards for leaving reviews.",
            validUntil: "Valid for 03.11.2025",
            image: "https://example.com/reviews.jpg"
        },
        {
            title: "Active Participation",
            description: "Points for staying active on the platform.",
            validUntil: "Valid for 03.11.2025",
            image: "https://example.com/active-participation.jpg"
        }
    ];

    // Filter rewards based on search query
    const filteredRewards = rewards.filter((reward) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            reward.id.toLowerCase().includes(searchLower) ||
            reward.type.toLowerCase().includes(searchLower) ||
            reward.customerId.toLowerCase().includes(searchLower)
        );
    });

    // Handle Add Reward button click
    const handleAddRewardClick = () => {
        navigate("/reward/add"); // Navigate to the Add Reward page
    };

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-6">
                    <TopBar
                        isMobile={isMobile}
                        setSidebarOpen={setSidebarOpen}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    {/* TITLE - Desktop with Add button */}
                    <div className="mb-4 mt-4 hidden md:flex md:justify-between md:items-center">
                        <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
                            Reward Management
                        </h2>
                        <button
                            className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
                            onClick={handleAddRewardClick} // Trigger navigation on click
                        >
                            Add
                            <IoMdAdd className="text-[18px]" />
                        </button>
                    </div>

                    {/* TITLE - Mobile */}
                    <div className="mb-4 mt-4 md:hidden">
                        <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
                            Reward Management
                        </h2>
                    </div>

                    {/* SEARCH BAR - Mobile Only */}
                    <div className="mb-6 relative md:hidden">
                        <div className="relative">
                            <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px]" />
                            <input
                                type="text"
                                placeholder="Search here"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-[14px] md:text-[16px] font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
                            />
                        </div>
                    </div>

                    {/* Reward Stats Section */}
                    <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {/* Active Customers */}
                        <div className="bg-[#E7C0EC] rounded-lg p-4 flex items-center justify-between w-full h-38">
                            <img src={img1} alt="Active Customers" className="w-35 h-36 object-cover" />
                            <div className="ml-4">
                                <h3 className="text-xl font-bold text-gray-800">Active Customers</h3>
                                <p className="text-2xl font-bold text-purple-500">{rewardStats.activeCustomers}</p>
                            </div>
                        </div>

                        {/* Referral Count */}
                        <div className="bg-[#D1B6FD] rounded-lg p-4 flex items-center justify-between w-full h-38">
                            <img src={img2} alt="Referral Count" className="w-30 h-36 object-cover" />
                            <div className="ml-4 mr-6">
                                <h3 className="text-xl font-bold text-gray-800">Referral Count</h3>
                                <p className="text-2xl font-bold text-purple-500">{rewardStats.referralCount}</p>
                            </div>
                        </div>

                        {/* Total Rewards Distributed */}
                        <div className="bg-[#DDA4F5] rounded-lg p-4 flex items-center justify-between w-full h-38">
                            <img src={img3} alt="Total Rewards" className="w-35 h-36 object-cover" />
                            <div className="ml-9">
                                <h3 className="text-xl font-bold text-gray-800">Total Rewards Distributed</h3>
                                <p className="text-2xl font-bold text-purple-500">{rewardStats.totalRewardsDistributed}</p>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-[#E8B9F0] rounded-lg p-4 flex items-center justify-between w-full h-38">
                            <img src={img4} alt="Pending Approvals" className="w-35 h-36 object-cover" />
                            <div className="ml-4">
                                <h3 className="text-xl font-bold text-gray-800">Pending Approvals</h3>
                                <p className="text-2xl font-bold text-purple-500">{rewardStats.pendingApprovals}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Left and Right Layout */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left: Reward Records */}
                        <div className="w-full md:w-full bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-[24px] font-bold text-gray-800">Reward Records</h3>
                            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="border-b text-center">
                                            <th className="p-4  text-xl font-semibold text-gray-700">Reward ID</th>
                                            <th className="p-4  text-xl font-semibold text-gray-700">Reward Type</th>
                                            <th className="p-4  text-xl font-semibold text-gray-700">Date</th>
                                            <th className="p-4  text-xl font-semibold text-gray-700">Customer ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRewards.map((reward, index) => (
                                            <tr key={index} className="border-b text-center hover:bg-gray-50">
                                                <td className="p-4 text-[16px] text-gray-700">{reward.id}</td>
                                                <td className="p-4 text-[16px] text-gray-700">{reward.type}</td>
                                                <td className="p-4 text-[16px] text-gray-700">{reward.date}</td>
                                                <td className="p-4 text-[16px] text-gray-700">{reward.customerId}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right: Reward Categories */}
                        <div className="w-full md:w-[700px] bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-[24px] font-bold text-gray-800 mb-4">Reward Categories</h3>
                            {rewardCategories.map((category, index) => (
                                <div key={index} className="bg-purple-200 p-4 rounded-lg mb-4">
                                    <div className="flex items-center mb-4 ml-3">
                                        <img src={category.image} alt={category.title} className="w-30 h-15 object-cover rounded-full" />
                                        <div className="ml-10">
                                            <h4 className="text-xl font-semibold text-gray-800">{category.title}</h4>
                                            <p className="text-lg text-gray-600">{category.description}</p>
                                            <p className="text-sm text-gray-500">{category.validUntil}</p>
                                        </div>
                                    </div>
                                    <button className="text-purple-500 hover:text-purple-700 text-sm">
                                        <span>View Details</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RewardManagement;
