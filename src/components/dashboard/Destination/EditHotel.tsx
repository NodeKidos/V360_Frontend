import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";

export default function EditHotel() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { id } = useParams();
    const [hotelData, setHotelData] = useState({
        name: "",
        type: "",
        image: "",
        location: "",
        contactNo: "",
        city: "",
        review: "",
        rating: 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Fetch the hotel data based on the `id` (replace with actual API call)
        setHotelData({
            name: "Cinnamon Life Colombo",
            type: "Luxury",
            image: "https://example.com/images/hotel_a.jpg",
            location: "Colombo",
            contactNo: "011 5678530",
            city: "Colombo",
            review: "Excellent hotel",
            rating: 5,
        });
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Logic for updating the hotel (replace with actual logic)
        toast.success("Hotel updated successfully!", {
            position: "top-right",
            autoClose: 2000,
        });

        setTimeout(() => {
            navigate("destination-hotel"); // Redirect to the hotel list page
        }, 2000);
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
            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/destination-hotel")}>
                            Hotel
                        </span>
                        <span className="text-gray-500">›</span>
                        <span className="font-semibold text-black">Edit Hotel</span>
                    </div>
                    {/* Form Container */}
                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
                        {/* Title */}
                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                                Edit Hotel
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Update the hotel details
                            </p>
                        </div>

                        {/* FORM START */}
                        <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {/* Hotel Name */}
                            <div>
                                <label className="text-gray-700">Hotel Name</label>
                                <input
                                    type="text"
                                    value={hotelData.name}
                                    onChange={(e) => setHotelData({ ...hotelData, name: e.target.value })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>
                            {/* Hotel Type */}
                            <div>
                                <label className="text-gray-700">Hotel Type</label>
                                <select
                                    value={hotelData.type}
                                    onChange={(e) => setHotelData({ ...hotelData, name: e.target.value })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                >
                                    <option value="">Select Hotel Type</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Heritage">Heritage</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>

                            {/* Hotel Image */}
                            <div>
                                <label className="text-gray-700">Hotel Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => setHotelData({ ...hotelData, image: e.target.files![0].name })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-gray-700">Location</label>
                                <input
                                    type="text"
                                    value={hotelData.location}
                                    onChange={(e) => setHotelData({ ...hotelData, location: e.target.value })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="text-gray-700">Contact No</label>
                                <input
                                    type="text"
                                    value={hotelData.contactNo}
                                    onChange={(e) => setHotelData({ ...hotelData, contactNo: e.target.value })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>

                            {/* Review */}
                            <div>
                                <label className="text-gray-700">Review</label>
                                <textarea
                                    value={hotelData.review}
                                    onChange={(e) => setHotelData({ ...hotelData, review: e.target.value })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-gray-700">Rating</label>
                                <input
                                    type="number"
                                    value={hotelData.rating}
                                    onChange={(e) => setHotelData({ ...hotelData, rating: Number(e.target.value) })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                    max={5}
                                    min={1}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/destination-hotel")}
                                    className="px-6 py-2 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}