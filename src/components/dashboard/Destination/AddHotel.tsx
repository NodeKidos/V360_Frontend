import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar"; // Assuming Sidebar component is reusable
import TopBar from "../../Topbar"; // Assuming TopBar component is reusable
import StarRating from "../../ui/StarRating";

export default function AddHotel() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track form data
  const [hotelName, setHotelName] = useState("");
  const [hotelType, setHotelType] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [location, setLocation] = useState("");
  const [reviews, setReviews] = useState("");
  const [starRating, setStarRating] = useState(1);
  const [hotelImages, setHotelImages] = useState<File[]>([]);

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
      setHotelImages(Array.from(event.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!hotelName || !hotelType || !contactNo || !location || !reviews || hotelImages.length === 0) {
      toast.error("All fields are required!");
      return;
    }

    const newHotel = {
      hotelName,
      hotelType,
      contactNo,
      location,
      reviews,
      starRating,
      hotelImages,
    };

    // Handle the backend save or API call here (e.g., save to database)
    console.log("New Hotel added:", newHotel);

    toast.success("Hotel added successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    // Navigate back to hotel list page
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
              Hotel
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Add Hotel</span>
          </div>

          {/* Form Container */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
            {/* Title */}
            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                Add a Hotel
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                Details about the hotel
              </p>
            </div>

            {/* Form */}
            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Hotel Name */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Name</label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter hotel name"
                />
              </div>

              {/* Hotel Type */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Type</label>
                <select
                  value={hotelType}
                  onChange={(e) => setHotelType(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                >
                  <option value="">Select Hotel Type</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>
                <input
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter contact number"
                />
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

              {/* Reviews */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Reviews</label>
                <textarea
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  placeholder="Enter reviews"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Star Rating</label>
                <div className="mt-2">
                  <StarRating
                    rating={starRating}
                    onRatingChange={setStarRating}
                    maxStars={5}
                  />
                </div>
              </div>

              {/* Hotel Images */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Hotel Images (Multiple)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
                {hotelImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-poppins">{hotelImages.length} image(s) selected</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                      {hotelImages.map((file, index) => (
                        <div key={index} className="relative border border-purple-200 rounded-lg p-1">
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
