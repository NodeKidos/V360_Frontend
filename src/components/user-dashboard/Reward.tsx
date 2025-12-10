import { useState, useEffect } from "react";
import Sidebar from "../../components/AdminSidebar";
import TopBar from "../../components/Topbar";
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { FaBirthdayCake, FaStar, FaTrophy, FaShareAlt, FaFire, FaRegMoneyBillAlt, FaGift, FaCoins } from "react-icons/fa";
import { motion } from "framer-motion";
import friend from "../../assets/reward/friend.png";
import birthday from "../../assets/reward/birthday.png";
import review from "../../assets/reward/review.png";
import active from "../../assets/reward/active.png";
import type { JSX } from "react/jsx-runtime";

const RewardDashboard = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [streakCount, setStreakCount] = useState(5);
    const [availablePoints, setAvailablePoints] = useState(1000);
    const [todayPoints, setTodayPoints] = useState(2);
    const [balancePoints, setBalancePoints] = useState(500);

    // Modal system for reward actions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const rewards = [
        { img: friend, label: "Referring a Friend", icon: <FaShareAlt />, action: "Share your referral" },
        { img: birthday, label: "Birthdays", icon: <FaBirthdayCake />, action: "Claim birthday points" },
        { img: review, label: "Review", icon: <FaStar />, action: "Submit your review" },
        { img: active, label: "Active Participation", icon: <FaTrophy />, action: "View your achievements" }
    ];

    const openModal = (reward: { img?: string; label: any; icon?: JSX.Element; action?: string; }) => {
        setModalTitle(reward.label);
        setNotes("");
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const submitNotes = () => {
        alert(`Submitted Notes for ${modalTitle}: ${notes}`);
        closeModal();
    };

    return (
        <div className="flex w-full min-h-screen bg-white">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className={`flex-1 p-4 transition-all duration-300 ${collapsed ? "ml-2" : "ml-6"}`}>
                <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                {/* Mobile Search */}
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

                {/* Dashboard Heading */}
                <h1 className="text-3xl font-roboto-condensed font-semibold text-[#5B247A] mb-6">
                    Reward Dashboard
                </h1>

                {/* Stats Section */}
                <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-5 mb-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

                        {/* Greeting - always on top for mobile */}
                        <div className="text-xl font-poppins font-semibold text-gray-700">
                            Hi Jacqueline!
                        </div>

                        {/* Stats go below in mobile, right side in desktop */}
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">

                            {[
                                { label: "Streak Count", value: streakCount, icon: <FaFire size={28} className="text-red-800" /> },
                                { label: "Available Points", value: availablePoints, icon: <FaRegMoneyBillAlt size={28} className="text-green-900" /> },
                                { label: "Today Points", value: todayPoints, icon: <FaGift size={28} className="text-blue-900" /> },
                                { label: "Balance Points", value: balancePoints, icon: <FaCoins size={28} className="text-yellow-300" /> }
                            ].map((stat, index) => (
                                <div key={index} className="bg-[#c871e5] p-5 rounded-lg text-center flex items-center gap-5 lg:gap-8 text-black">
                                    {stat.icon}
                                    <div>
                                        <div className="text-[20px] font-bold font-poppins">{stat.label}</div>
                                        <div className="text-2xl font-semibold">{stat.value}</div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                {/* Rewards Section */}
                <h2 className="text-[24px] font-semibold text-[#5B247A] mb-4">Claim Your Reward</h2>
                <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {rewards.map((reward, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer w-full"
                                onClick={() => openModal(reward)}
                            >
                                {/* Image (Uniform height) */}
                                <img
                                    src={reward.img}
                                    alt={reward.label}
                                    className="w-full h-56 object-cover"
                                />

                                {/* Bottom Info Section */}
                                <div className="absolute bottom-0 left-0 w-full h-20 bg-black/50 rounded-b-xl flex justify-between items-center px-4 py-2 text-white">
                                    <span className="text-[18px] lg:text-[20px] font-semibold">
                                        {reward.label}
                                    </span>

                                    {/* Circle Icon */}
                                    <span className="text-[20px] border-2 border-[#B749DB] bg-[#B749DB] rounded-full p-2 flex items-center justify-center">
                                        {reward.icon}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default RewardDashboard;
