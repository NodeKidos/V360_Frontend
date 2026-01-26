import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import rewardService from "../../../services/reward.service";

export default function AddReward() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [rewardData, setRewardData] = useState({
        rewardName: "",
        description: "",
        amount: "",
        validUntil: "",
        status: "",
        image: null as string | null, // To store image file
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRewardData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRewardData((prevData) => ({
                ...prevData,
                image: URL.createObjectURL(file), // Store image preview URL
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await rewardService.createReward({
                name: rewardData.rewardName,
                description: rewardData.description,
                pointsRequired: parseInt(rewardData.amount),
                image: rewardData.image, // In a real app we'd upload this first
                isActive: rewardData.status === 'Active'
            });
            toast.success("Reward added successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
            setTimeout(() => {
                navigate("/reward");
            }, 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add reward");
        }
    };

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Top Bar */}
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/reward")}>
                            Rewards
                        </span>
                        <span className="text-gray-500"><MdKeyboardArrowRight /></span>
                        <span className="font-semibold text-black">Add Reward</span>
                    </div>

                    {/* Form Container */}
                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
                        {/* Title */}
                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                                Add a Reward
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Add details about the reward
                            </p>
                        </div>

                        {/* FORM START */}
                        <form
                            className="mt-4 md:mt-6 space-y-4 md:space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Reward Name */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Reward Name</label>
                                    <input
                                        type="text"
                                        name="rewardName"
                                        value={rewardData.rewardName}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={rewardData.description}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Amount */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={rewardData.amount}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                {/* Valid Until */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Valid Until</label>
                                    <input
                                        type="date"
                                        name="validUntil"
                                        value={rewardData.validUntil}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Status */}
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                                    <select
                                        name="status"
                                        value={rewardData.status}
                                        onChange={handleInputChange}
                                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option>Select</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="mt-6">
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Reward Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                            </div>

                            {/* Image Preview */}
                            {rewardData.image && (
                                <div className="mt-4">
                                    <img src={rewardData.image} alt="Reward Preview" className="w-40 h-40 object-cover rounded-lg" />
                                </div>
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/reward")}
                                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                        {/* FORM END */}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}
