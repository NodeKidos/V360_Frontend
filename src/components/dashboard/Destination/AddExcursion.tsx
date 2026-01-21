import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar"; // Assuming Sidebar component is reusable
import TopBar from "../../Topbar"; // Assuming TopBar component is reusable
import StarRating from "../../ui/StarRating";

export default function AddExcursion() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track form data
  const [excursionName, setExcursionName] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [excursionImages, setExcursionImages] = useState<File[]>([]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setExcursionImages(Array.from(event.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!excursionName || !destinationId || !bestTime || !duration || !rating || !location || !category || excursionImages.length === 0) {
      toast.error("All fields are required!");
      return;
    }

    const newExcursion = {
      excursionName,
      destinationId,
      bestTime,
      duration,
      rating,
      location,
      category,
      excursionImages,
    };

    // Handle the backend save or API call here (e.g., save to database)
    console.log("New Excursion added:", newExcursion);

    toast.success("Excursion added successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    // Navigate back to excursion list page
    navigate("/destination-hotel");
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
              Excursion
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Add Excursion</span>
          </div>

          {/* Form Container */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
            {/* Title */}
            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                Add an Excursion
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                Details about the excursion
              </p>
            </div>

            {/* Form */}
            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Excursion Name */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Excursion Name</label>
                <input
                  type="text"
                  value={excursionName}
                  onChange={(e) => setExcursionName(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter excursion name"
                />
              </div>

              {/* Destination Selection */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Select Destination</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
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

              {/* Best Time */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Best Time</label>
                <input
                  type="text"
                  value={bestTime}
                  onChange={(e) => setBestTime(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter best time"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter duration"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Rating</label>
                <div className="mt-2">
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    maxStars={5}
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
                  placeholder="Enter location"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter category"
                />
              </div>

              {/* Excursion Images */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Excursion Images (Multiple)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
                {excursionImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-poppins">{excursionImages.length} image(s) selected</p>
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
                  className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
                >
                  Submit
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
