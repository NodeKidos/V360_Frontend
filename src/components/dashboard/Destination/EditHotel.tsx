import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import StarRating from "../../ui/StarRating";

export default function EditHotel() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { id } = useParams();
    const [hotelData, setHotelData] = useState({
        name: "",
        type: "",
        location: "",
        contactNo: "",
        city: "",
        review: "",
        rating: 0,
    });
    const [hotelImages, setHotelImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

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
            location: "Colombo",
            contactNo: "011 5678530",
            city: "Colombo",
            review: "Excellent hotel",
            rating: 5,
        });
        setExistingImages([
            "https://example.com/images/hotel_a.jpg",
            "https://example.com/images/hotel_a2.jpg"
        ]);
    }, [id]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setHotelImages(Array.from(event.target.files));
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Logic for updating the hotel (replace with actual logic)
        toast.success("Hotel updated successfully!", {
            position: "top-right",
            autoClose: 2000,
        });

        setTimeout(() => {
            navigate("/destination-hotel"); // Redirect to the hotel list page
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
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Name</label>
                                <input
                                    type="text"
                                    value={hotelData.name}
                                    onChange={(e) => setHotelData({ ...hotelData, name: e.target.value })}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                            </div>
                            {/* Hotel Type */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Type</label>
                                <select
                                    value={hotelData.type}
                                    onChange={(e) => setHotelData({ ...hotelData, type: e.target.value })}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                >
                                    <option value="">Select Hotel Type</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Heritage">Heritage</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>

                            {/* Hotel Images */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Images (Multiple)</label>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-600 font-poppins mb-2">Current Images:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {existingImages.map((img, index) => (
                                                <div key={index} className="relative border border-purple-200 rounded-lg p-1">
                                                    <img
                                                        src={img}
                                                        alt={`Existing ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(index)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />

                                {/* New Images Preview */}
                                {hotelImages.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 font-poppins">{hotelImages.length} new image(s) selected</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                                            {hotelImages.map((file, index) => (
                                                <div key={index} className="relative border border-purple-300 rounded-lg p-1">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setHotelImages(hotelImages.filter((_, i) => i !== index))}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Location</label>
                                <input
                                    type="text"
                                    value={hotelData.location}
                                    onChange={(e) => setHotelData({ ...hotelData, location: e.target.value })}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>
                                <input
                                    type="text"
                                    value={hotelData.contactNo}
                                    onChange={(e) => setHotelData({ ...hotelData, contactNo: e.target.value })}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                            </div>

                            {/* Review */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Review</label>
                                <textarea
                                    value={hotelData.review}
                                    onChange={(e) => setHotelData({ ...hotelData, review: e.target.value })}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Rating</label>
                                <div className="mt-2">
                                    <StarRating
                                        rating={hotelData.rating}
                                        onRatingChange={(rating) => setHotelData({ ...hotelData, rating })}
                                        maxStars={5}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/destination-hotel")}
                                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
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