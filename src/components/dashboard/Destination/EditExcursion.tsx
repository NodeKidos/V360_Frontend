import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import StarRating from "../../ui/StarRating";

export default function EditExcursion() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { id } = useParams();
  const [excursionData, setExcursionData] = useState({
    name: "",
    location: "",
    category: "",
    bestTime: "",
    duration: "",
    rating: 0,
  });
  const [excursionImages, setExcursionImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  // Available destinations (this should come from API in real implementation)
  const [availableDestinations] = useState([
    { id: "D001", name: "Sigiriya Rock Fortress" },
    { id: "D002", name: "Mirissa Beach" },
    { id: "D003", name: "Adam's Peak" },
    { id: "D004", name: "Polonnaruwa Ancient City" },
    { id: "D005", name: "Horton Plains & World's End" },
    { id: "D006", name: "Galle Dutch Fort Walk" },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch the excursion data based on the `id` (replace with actual API call)
    setExcursionData({
      name: "Sigiriya Guided Climb",
      location: "Sigiriya",
      category: "Adventure & Cultural",
      bestTime: "Jan – Apr",
      duration: "4 hrs",
      rating: 4.8,
    });
    setExistingImages([
      "https://example.com/images/excursion1.jpg",
      "https://example.com/images/excursion2.jpg"
    ]);
    setSelectedDestination("D001"); // Set the current destination
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setExcursionImages(Array.from(event.target.files));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Logic for updating the excursion (replace with actual logic)
    toast.success("Excursion updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate("/destination-hotel"); // Redirect to the excursion list page
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
            {/* Excursion Name */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Excursion Name</label>
              <input
                type="text"
                value={excursionData.name}
                onChange={(e) => setExcursionData({ ...excursionData, name: e.target.value })}
                className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Destination Selection */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Select Destination</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              >
                <option value="">Select a destination</option>
                {availableDestinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Location</label>
              <input
                type="text"
                value={excursionData.location}
                onChange={(e) => setExcursionData({ ...excursionData, location: e.target.value })}
                className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Category</label>
              <input
                type="text"
                value={excursionData.category}
                onChange={(e) => setExcursionData({ ...excursionData, category: e.target.value })}
                className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Best Time */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Best Time</label>
              <input
                type="text"
                value={excursionData.bestTime}
                onChange={(e) => setExcursionData({ ...excursionData, bestTime: e.target.value })}
                className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Duration</label>
              <input
                type="text"
                value={excursionData.duration}
                onChange={(e) => setExcursionData({ ...excursionData, duration: e.target.value })}
                className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Rating</label>
              <div className="mt-2">
                <StarRating
                  rating={excursionData.rating}
                  onRatingChange={(rating) => setExcursionData({ ...excursionData, rating })}
                  maxStars={5}
                />
              </div>
            </div>

            {/* Excursion Images */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Excursion Images (Multiple)</label>

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
              {excursionImages.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 font-poppins">{excursionImages.length} new image(s) selected</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {excursionImages.map((file, index) => (
                      <div key={index} className="relative border border-purple-200 rounded-lg p-1">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setExcursionImages(excursionImages.filter((_, i) => i !== index))}
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
