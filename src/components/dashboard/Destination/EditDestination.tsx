import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import SriLankaMap, { sriLankaCities } from "../../home/SriLankaMap";
import destinationService from "../../../services/destination.service";

export default function EditDestination() {
    const navigate = useNavigate();
    const { destinationId: id } = useParams(); // Match route param name from App.tsx
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [destinationName, setDestinationName] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [highlights, setHighlights] = useState("");
    const [bestTimeToVisit, setBestTimeToVisit] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [destinationImages, setDestinationImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const fetchData = async () => {
            try {
                setIsLoading(true);
                if (id) {
                    const destination = await destinationService.getById(id);
                    setDestinationName(destination.name);
                    setLocation(destination.location || "");
                    setCategory(destination.category || "");
                    setDescription(destination.description || "");
                    setHighlights(destination.highlights || "");
                    setBestTimeToVisit(destination.bestTimeToVisit || "");
                    setLatitude(destination.latitude?.toString() || destination.coordinates?.lat?.toString() || "");
                    setLongitude(destination.longitude?.toString() || destination.coordinates?.lng?.toString() || "");
                    setExistingImages(destination.images || []);
                }
            } catch (error) {
                console.error("Failed to fetch destination:", error);
                toast.error("Failed to load destination details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => window.removeEventListener("resize", handleResize);
    }, [id]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setDestinationImages(Array.from(event.target.files));
        }
    };

    const handleCityClick = (cityName: string) => {
        setLocation(cityName);
        const city = sriLankaCities.find(c => c.name === cityName);
        if (city) {
            setLatitude(city.lat.toString());
            setLongitude(city.lng.toString());
        }
    };

    const removeExistingImage = (imgUrl: string) => {
        setExistingImages(existingImages.filter((img) => img !== imgUrl));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!destinationName || !location || !category || !description) {
            toast.error("Required fields are missing!");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("name", destinationName);
            formData.append("location", location);
            formData.append("category", category);
            formData.append("description", description);

            // Highlights should be an array for the backend DTO
            const highlightsArray = highlights.split(/[,\n]/).map(h => h.trim()).filter(h => h);
            highlightsArray.forEach(h => formData.append("highlights[]", h));

            formData.append("bestTimeToVisit", bestTimeToVisit);

            if (latitude) formData.append("latitude", latitude);
            if (longitude) formData.append("longitude", longitude);

            // Append existing images that were kept
            existingImages.forEach((img) => {
                formData.append("existingImages[]", img);
            });

            // Append new images
            destinationImages.forEach((image) => {
                formData.append("images", image);
            });

            if (id) {
                await destinationService.update(id, formData);
                toast.success("Destination updated successfully!");
                setTimeout(() => {
                    navigate("/destination-hotel");
                }, 1500);
            }
        } catch (error: any) {
            console.error("Error updating destination:", error);
            toast.error(error.response?.data?.message || "Failed to update destination");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white text-[#515151]">
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

                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins text-left">
                        <span className="text-gray-500 cursor-pointer text-left" onClick={() => navigate("/destination-hotel")}>
                            Destination
                        </span>
                        <span className="text-gray-500">›</span>
                        <span className="font-semibold text-black">Edit Destination</span>
                    </div>

                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm relative overflow-hidden">
                        {isSubmitting && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-3">
                                <div className="w-12 h-12 border-4 border-[#B749DB] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-semibold text-[#B749DB]">Updating Destination...</p>
                            </div>
                        )}

                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins text-left">
                                Edit Destination
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins text-left">
                                Update the destination details
                            </p>
                        </div>

                        <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Destination Name</label>
                                    <input
                                        type="text"
                                        value={destinationName}
                                        onChange={(e) => setDestinationName(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins text-left"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="historical_cultural">Historical & Cultural</option>
                                        <option value="beach_nature">Beach & Nature</option>
                                        <option value="hiking_spiritual">Hiking & Spiritual</option>
                                        <option value="wildlife">Wildlife</option>
                                        <option value="adventure">Adventure</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="relaxation">Relaxation</option>
                                        <option value="urban">Urban</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Location (City)</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Best Time to Visit</label>
                                    <input
                                        type="text"
                                        value={bestTimeToVisit}
                                        onChange={(e) => setBestTimeToVisit(e.target.value)}
                                        className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-gray-700 text-[12px] md:text-[13px] font-poppins">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 py-2 outline-none text-[14px] font-poppins"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-700 text-[12px] md:text-[13px] font-poppins">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 py-2 outline-none text-[14px] font-poppins"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins mb-2 block font-semibold text-left">
                                    Or Select Location on Map
                                </label>
                                <div className="mb-4 text-left">
                                    <SriLankaMap
                                        selectedCities={location ? [location] : []}
                                        onCityClick={handleCityClick}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins text-left">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins text-left font-normal"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins text-left">Highlights</label>
                                <textarea
                                    value={highlights}
                                    onChange={(e) => setHighlights(e.target.value)}
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins text-left font-normal"
                                    placeholder="Enter key highlights, separated by commas or new lines"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins font-semibold">Destination Images</label>

                                {existingImages.length > 0 && (
                                    <div className="mb-4 mt-2 text-left">
                                        <p className="text-sm text-gray-500 font-poppins mb-2 text-left">Current Images:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 text-left">
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
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <p className="text-sm text-gray-500 font-poppins mb-2 text-left">Add New Images:</p>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                                />

                                {destinationImages.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500 font-poppins text-left">{destinationImages.length} new image(s) selected</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2 text-left">
                                            {destinationImages.map((file, index) => (
                                                <div key={index} className="relative border border-purple-200 rounded-lg p-1 group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setDestinationImages(destinationImages.filter((_, i) => i !== index))}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-colors"
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
                                        "Update Destination"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
