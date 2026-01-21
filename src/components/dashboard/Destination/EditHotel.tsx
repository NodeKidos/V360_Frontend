import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import StarRating from "../../ui/StarRating";
import hotelService from "../../../services/hotel.service";
import destinationService from "../../../services/destination.service";

export default function EditHotel() {
    const navigate = useNavigate();
    const { hotelId: id } = useParams(); // Match route param name from App.tsx
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [hotelName, setHotelName] = useState("");
    const [hotelType, setHotelType] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [starRating, setStarRating] = useState(5);
    const [pricePerNight, setPricePerNight] = useState("");
    const [totalRooms, setTotalRooms] = useState("");
    const [destinationId, setDestinationId] = useState("");
    const [hotelImages, setHotelImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [destinations, setDestinations] = useState<any[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch destinations
                const destinationsData = await destinationService.getAll();
                setDestinations(destinationsData);

                // Fetch hotel data
                if (id) {
                    const hotel = await hotelService.getById(id);
                    setHotelName(hotel.name);
                    setHotelType(hotel.type || "");
                    setContactNo(hotel.contactNumber || "");
                    setAddress(hotel.address || "");
                    setDescription(hotel.description || "");
                    setStarRating(hotel.starRating || hotel.rating || 5);
                    setPricePerNight(hotel.pricePerNight?.toString() || "");
                    setTotalRooms(hotel.totalRooms?.toString() || "");
                    setDestinationId(hotel.destination?.id || "");
                    setExistingImages(hotel.images || []);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load hotel details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => window.removeEventListener("resize", handleResize);
    }, [id]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setHotelImages(Array.from(event.target.files));
        }
    };

    const removeExistingImage = (imgUrl: string) => {
        setExistingImages(existingImages.filter((img) => img !== imgUrl));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hotelName || !hotelType || !contactNo || !address || !description || !pricePerNight || !totalRooms || !destinationId) {
            toast.error("All fields are required!");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("name", hotelName);
            formData.append("type", hotelType.toLowerCase().replace(/ /g, "_"));
            formData.append("contactNumber", contactNo);
            formData.append("address", address);
            formData.append("description", description);
            formData.append("rating", starRating.toString());
            formData.append("pricePerNight", pricePerNight);
            formData.append("totalRooms", totalRooms);
            formData.append("destinationId", destinationId);

            // Append existing images that were kept
            existingImages.forEach((img) => {
                formData.append("existingImages[]", img);
            });

            // Append new images
            hotelImages.forEach((image) => {
                formData.append("images", image);
            });

            if (id) {
                await hotelService.update(id, formData);
                toast.success("Hotel updated successfully!");
                setTimeout(() => {
                    navigate("/destination-hotel");
                }, 1500);
            }
        } catch (error: any) {
            console.error("Error updating hotel:", error);
            toast.error(error.response?.data?.message || "Failed to update hotel");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-[#B749DB] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-white flex overflow-hidden text-[#515151]">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/destination-hotel")}>
                            Hotel
                        </span>
                        <span className="text-gray-500">›</span>
                        <span className="font-semibold text-black">Edit Hotel</span>
                    </div>

                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm relative overflow-hidden">
                        {isSubmitting && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-3">
                                <div className="w-12 h-12 border-4 border-[#B749DB] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-semibold text-[#B749DB]">Updating Hotel...</p>
                            </div>
                        )}

                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins text-left">
                                Edit Hotel
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins text-left">
                                Update the hotel details
                            </p>
                        </div>

                        <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Name</label>
                                    <input
                                        type="text"
                                        value={hotelName}
                                        onChange={(e) => setHotelName(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Select Destination</label>
                                    <select
                                        value={destinationId}
                                        onChange={(e) => setDestinationId(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option value="">Select Destination</option>
                                        {destinations.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Type</label>
                                    <select
                                        value={hotelType}
                                        onChange={(e) => setHotelType(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option value="">Select Hotel Type</option>
                                        <option value="luxury">Luxury</option>
                                        <option value="heritage">Heritage</option>
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                        <option value="mid_range">Mid Range</option>
                                        <option value="boutique">Boutique</option>
                                        <option value="budget">Budget</option>
                                        <option value="resort">Resort</option>
                                        <option value="guesthouse">Guesthouse</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>
                                    <input
                                        type="text"
                                        value={contactNo}
                                        onChange={(e) => setContactNo(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Price Per Night (USD)</label>
                                    <input
                                        type="number"
                                        value={pricePerNight}
                                        onChange={(e) => setPricePerNight(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Total Rooms</label>
                                    <input
                                        type="number"
                                        value={totalRooms}
                                        onChange={(e) => setTotalRooms(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Address / Location</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Star Rating</label>
                                <div className="mt-2 text-2xl">
                                    <StarRating
                                        rating={starRating}
                                        onRatingChange={setStarRating}
                                        maxStars={5}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins font-semibold">Hotel Images</label>

                                {existingImages.length > 0 && (
                                    <div className="mb-4 mt-2">
                                        <p className="text-sm text-gray-500 font-poppins mb-2">Current Images:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                            {existingImages.map((img, index) => (
                                                <div key={index} className="relative border border-purple-200 rounded-lg p-1 group">
                                                    <img
                                                        src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}${img}`}
                                                        alt={`Existing ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(img)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <p className="text-sm text-gray-500 font-poppins mb-2">Add New Images:</p>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />

                                {hotelImages.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500 font-poppins">{hotelImages.length} new image(s) selected</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
                                            {hotelImages.map((file, index) => (
                                                <div key={index} className="relative border border-purple-200 rounded-lg p-1 group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setHotelImages(hotelImages.filter((_, i) => i !== index))}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-row justify-end gap-3 md:gap-4 mt-8 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => navigate("/destination-hotel")}
                                    className="px-6 md:px-10 py-2.5 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 md:px-10 py-2.5 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-semibold shadow-md transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Hotel"
                                    )}
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
