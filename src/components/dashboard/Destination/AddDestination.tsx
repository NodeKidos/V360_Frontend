import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import SriLankaMap from "../../home/SriLankaMap";
import destinationService from "../../../services/destination.service";

export default function AddDestination() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track form data
  const [destinationName, setDestinationName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [destinationImages, setDestinationImages] = useState<File[]>([]);
  const [reviews, setReviews] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setDestinationImages(Array.from(event.target.files));
    }
  };

  const mapCategoryToBackend = (cat: string) => {
    const mapping: Record<string, string> = {
      "Historical / Cultural": "historical_cultural",
      "Beach / Nature": "beach_nature",
      "Hiking / Spiritual": "hiking_spiritual",
      "Historical / Heritage": "historical_cultural",
      "Nature / Hiking": "beach_nature",
      "Heritage / City Tour": "urban",
      "Wildlife": "wildlife",
      "Adventure": "adventure"
    };
    return mapping[cat] || "historical_cultural";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!destinationName || !location || !category || destinationImages.length === 0 || !reviews) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", destinationName);
      formData.append("location", location);
      formData.append("category", mapCategoryToBackend(category));
      formData.append("description", reviews);

      destinationImages.forEach((image) => {
        formData.append("images", image);
      });

      await destinationService.create(formData);

      toast.success("Destination added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Navigate back to destination list page
      setTimeout(() => {
        navigate("/destination-hotel");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating destination:", error);
      toast.error(error.response?.data?.message || "Failed to create destination");
    } finally {
      setIsSubmitting(false);
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
            <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/destination-hotel")}>
              Destination
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Add Destination</span>
          </div>

          {/* Form Container */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
            {/* Title */}
            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                Add a Destination
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                Details about the destination
              </p>
            </div>

            {/* Form */}
            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Destination Name */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Destination Name</label>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter destination name"
                />
              </div>

              {/* Map Selection */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins mb-2 block">
                  Select Location on Map
                </label>
                <div className="mb-4">
                  <SriLankaMap
                    selectedCities={location ? [location] : []}
                    onCityClick={(city) => setLocation(city)}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter location or select from map"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                >
                  <option value="">Select Category</option>
                  <option value="Historical / Cultural">Historical / Cultural</option>
                  <option value="Beach / Nature">Beach / Nature</option>
                  <option value="Hiking / Spiritual">Hiking / Spiritual</option>
                  <option value="Historical / Heritage">Historical / Heritage</option>
                  <option value="Nature / Hiking">Nature / Hiking</option>
                  <option value="Heritage / City Tour">Heritage / City Tour</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>

              {/* Destination Images */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Destination Images (Multiple)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
                {destinationImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-poppins">{destinationImages.length} image(s) selected</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                      {destinationImages.map((file, index) => (
                        <div key={index} className="relative border border-purple-200 rounded-lg p-1">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setDestinationImages(destinationImages.filter((_, i) => i !== index))}
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

              {/* Reviews */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Reviews</label>
                <textarea
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter destination reviews"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/destination-hotel")}
                  className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
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
