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
import rewardService, { type Reward } from '../../../services/reward.service';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const RewardManagement = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile] = useState(false);

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState({
        activeCustomers: 0,
        referralCount: 0,
        totalRewardsDistributed: 0,
        pendingApprovals: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rewardsData, transactionsData] = await Promise.all([
                rewardService.getAllRewards(),
                rewardService.getAllTransactions()
            ]);
            setRewards(rewardsData);
            setTransactions(transactionsData);

            // Calculate basic stats from transactions
            const uniqueCustomers = new Set(transactionsData.map(t => t.customerId)).size;
            const referrals = transactionsData.filter(t => t.type === 'referral').length;
            // Assuming 'amount < 0' signifies a distributed reward, adjust if logic is different
            const distributed = transactionsData.filter(t => t.amount < 0).length;

            setStats({
                activeCustomers: uniqueCustomers,
                referralCount: referrals,
                totalRewardsDistributed: distributed,
                pendingApprovals: 0 // Logic for pending approvals if needed
            });
        } catch (error) {
            console.error("Failed to fetch admin reward data", error);
            toast.error("Failed to load reward management data");
        }
    };


    // Filter rewards based on search query
    const filteredTransactions = transactions.filter((t) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            t.id.toLowerCase().includes(searchLower) ||
            t.type.toLowerCase().includes(searchLower) ||
            t.customerId.toLowerCase().includes(searchLower)
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
                                <p className="text-2xl font-bold text-purple-500">{stats.activeCustomers}</p>
                            </div>
                        </div>

                        {/* Referral Count */}
                        <div className="bg-[#D1B6FD] rounded-lg p-4 flex items-center justify-between w-full h-38">
                            <img src={img2} alt="Referral Count" className="w-30 h-36 object-cover" />
                            <div className="ml-4 mr-6">
                                <h3 className="text-xl font-bold text-gray-800">Referral Count</h3>
                                <p className="text-2xl font-bold text-purple-500">{stats.referralCount}</p>
                            </div>
                        </div>

                        {/* Total Rewards Distributed */}
                        <div className="bg-[#DDA4F5] rounded-lg p-4 flex items-center justify-between w-full h-38">
                            <img src={img3} alt="Total Rewards" className="w-35 h-36 object-cover" />
                            <div className="ml-9">
                                <h3 className="text-xl font-bold text-gray-800">Total Rewards Distributed</h3>
                                <p className="text-2xl font-bold text-purple-500">{stats.totalRewardsDistributed}</p>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-[#E8B9F0] rounded-lg p-4 flex items-center justify-between w-full h-38">
                            <img src={img4} alt="Pending Approvals" className="w-35 h-36 object-cover" />
                            <div className="ml-4">
                                <h3 className="text-xl font-bold text-gray-800">Pending Approvals</h3>
                                <p className="text-2xl font-bold text-purple-500">{stats.pendingApprovals}</p>
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
                                        {filteredTransactions.map((t, index) => (
                                            <tr key={index} className="border-b text-center hover:bg-gray-50">
                                                <td className="p-4 text-[16px] text-gray-700">{t.id.substring(0, 8)}</td>
                                                <td className="p-4 text-[16px] text-gray-700 capitalize">{t.type}</td>
                                                <td className="p-4 text-[16px] text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-[16px] text-gray-700">{t.customerId.substring(0, 8)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right: Reward Categories (Real managed rewards) */}
                        <div className="w-full md:w-[700px] bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-[24px] font-bold text-gray-800 mb-4">Managed Rewards</h3>
                            {rewards.length > 0 ? rewards.map((reward, index) => (
                                <div key={index} className="bg-purple-200 p-4 rounded-lg mb-4">
                                    <div className="flex items-center mb-4 ml-3">
                                        <img src={reward.image || img1} alt={reward.name} className="w-30 h-15 object-cover rounded-full" />
                                        <div className="ml-10">
                                            <h4 className="text-xl font-semibold text-gray-800">{reward.name}</h4>
                                            <p className="text-lg text-gray-600">{reward.description}</p>
                                            <p className="text-sm text-gray-500">Requires {reward.pointsRequired} points</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="text-purple-600 hover:text-purple-800 text-sm font-semibold" onClick={() => navigate(`/reward/edit/${reward.id}`)}>
                                            <span>Edit Details</span>
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 text-sm font-semibold" onClick={() => rewardService.deleteReward(reward.id).then(() => fetchData())}>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500">No rewards created yet. Click "Add" to create one.</div>
                            )}
                        </div>
                    </div>
                    <ToastContainer />

                </div>
            </div>
        </div>
    );
};

export default RewardManagement;
