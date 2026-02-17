import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import SriLankaMap, { sriLankaCities } from "../../home/SriLankaMap";
import destinationService from "../../../services/destination.service";
import { SearchableSelect } from "../../ui/SearchableSelect";

export default function AddDestination() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingDestinations, setExistingDestinations] = useState<any[]>([]);

  // Track form data
  const [destinationName, setDestinationName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [destinationImages, setDestinationImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState("");
  const [bestTimeToVisit, setBestTimeToVisit] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Fetch existing destinations to show on map
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll();
        setExistingDestinations(data);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      }
    };
    fetchDestinations();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setDestinationImages(Array.from(event.target.files));
    }
  };

  const handleCityClick = (cityName: string) => {
    setLocation(cityName);
    // Find coordinates for the city in hardcoded list first, then in fetched destinations
    let city = sriLankaCities.find(c => c.name === cityName);
    if (!city && existingDestinations.length > 0) {
      const dest = existingDestinations.find(d => d.name === cityName);
      if (dest) {
        city = { name: dest.name, lat: dest.latitude || dest.coordinates?.lat, lng: dest.longitude || dest.coordinates?.lng };
      }
    }

    if (city) {
      setLatitude(city.lat?.toString() || "");
      setLongitude(city.lng?.toString() || "");
    } else {
      setLatitude("");
      setLongitude("");
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    // Always update location to show it's a pinned point, which also clears any previously selected named city
    setLocation(`Pinned Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!destinationName || !location || !category || !description) {
      toast.error("Please fill in all required fields!");
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
    <div className="h-screen bg-white flex overflow-hidden text-[#515151]">
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
          <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins text-left">
            <span className="text-gray-500 cursor-pointer text-left" onClick={() => navigate("/destination-hotel")}>
              Destination
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Add Destination</span>
          </div>

          {/* Form Container */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm relative overflow-hidden">
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-[#B749DB] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-[#B749DB]">Creating Destination...</p>
              </div>
            )}

            {/* Title */}
            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins text-left">
                Add a Destination
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins text-left">
                Details about the destination
              </p>
            </div>

            {/* Form */}
            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

                {/* Category */}
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Category</label>
                  <SearchableSelect
                    options={[
                      { label: "Historical & Cultural", value: "historical_cultural" },
                      { label: "Beach & Nature", value: "beach_nature" },
                      { label: "Hiking & Spiritual", value: "hiking_spiritual" },
                      { label: "Wildlife", value: "wildlife" },
                      { label: "Adventure", value: "adventure" },
                      { label: "Cultural", value: "cultural" },
                      { label: "Relaxation", value: "relaxation" },
                      { label: "Urban", value: "urban" }
                    ]}
                    value={category}
                    onChange={(value) => setCategory(value)}
                    placeholder="Select Category"
                    className="w-full mt-1"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Location (City)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="Enter location or select from map"
                  />
                </div>

                {/* Best Time to Visit */}
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Best Time to Visit</label>
                  <input
                    type="text"
                    value={bestTimeToVisit}
                    onChange={(e) => setBestTimeToVisit(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="e.g. November to April"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-700 text-[12px] md:text-[13px] font-poppins">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 py-2 outline-none text-[14px] font-poppins"
                      placeholder="6.9271"
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
                      placeholder="79.8612"
                    />
                  </div>
                </div>
              </div>

              {/* Map Selection */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins mb-2 block font-semibold text-left">
                  Or Select Location on Map
                </label>
                <div className="mb-4">
                  <SriLankaMap
                    selectedCities={location ? [location] : []}
                    onCityClick={handleCityClick}
                    onLocationSelect={handleMapClick}
                    destinations={existingDestinations}
                    currentLocation={latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude)) ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : undefined}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins text-left">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter destination description"
                  rows={3}
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins text-left">Highlights</label>
                <textarea
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter key highlights, separated by commas or new lines"
                  rows={2}
                />
              </div>

              {/* Destination Images */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins font-semibold">Destination Images</label>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
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

              {/* Action Buttons */}
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
                      Creating...
                    </>
                  ) : (
                    "Create Destination"
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
