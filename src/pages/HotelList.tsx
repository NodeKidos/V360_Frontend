import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaStar, FaRegStar } from "react-icons/fa";
import { useState } from "react";
import Navbar from "../components/Navbar"; 
import { IoCloseSharp } from "react-icons/io5"; 
import grandWard from "../assets/packages/family.png"; 
import cinnamon from "../assets/packages/family.png";
import shangri from "../assets/packages/family.png";
import jetwing from "../assets/packages/family.png";
import kingsbury from"../assets/packages/family.png";
import taj from "../assets/packages/family.png";

// --- CUSTOM TAILWIND PAGINATION COMPONENT ---
// This replaces the need for Shadcn UI components.
interface CustomPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Generate page numbers array (1, 2, 3, ...)
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const baseClass = "h-9 w-15 flex justify-center items-center rounded-md text-sm transition-colors duration-200 font-medium";
    const linkClass = "hover:bg-[#B749DB]/10 text-gray-700 hover:text-[#B749DB] cursor-pointer";
    const activeClass = "bg-[#B749DB] text-white pointer-events-none";
    const disabledClass = "text-gray-400 pointer-events-none opacity-50";

    if (totalPages <= 1) return null;

    return (
        <nav className="flex justify-center mt-10" aria-label="Pagination">
            <ul className="flex items-center space-x-2">
                {/* Previous Button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${baseClass} px-3 ${currentPage === 1 ? disabledClass : linkClass}`}
                    >
                        <FaArrowLeft className="w-3 h-3 mr-1" />
                        Previous
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                    <li key={page}>
                        <button
                            onClick={() => onPageChange(page)}
                            className={`${baseClass} ${page === currentPage ? activeClass : linkClass}`}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${baseClass} px-3 ${currentPage === totalPages ? disabledClass : linkClass}`}
                    >
                        Next
                        
                    </button>
                </li>
            </ul>
        </nav>
    );
};
// --- END CUSTOM PAGINATION ---


// --- START OF HOTEL LIST COMPONENT ---
export default function HotelList() {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination || "Colombo";

  const steps = [
    "Personal Details",
    "Preferences & Requirements",
    "Travel Details",
    "Notes",
  ];
  const [step, setStep] = useState<number>(3);
  const [selectedHotel, setSelectedHotel] = useState<any>(null); // Modal state

  // --- PAGINATION STATE & LOGIC ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const hotelsPerPage: number = 2; // Display 2 hotels per page

  // Dummy Data matching UI requirements (UNMODIFIED)
  const hotels = [
    {
      name: "The Grand Ward Place - Colombo 7",
      img: grandWard,
      desc: "Just a 14-minute walk from Colombo Town Hall and 1.1 miles from National Art Gallery, The Grand Ward Place features modern rooms, luxurious dining, and an indoor pool.",
      rating: 4,
      gallery: [grandWard, cinnamon, shangri, jetwing, kingsbury, taj],
      features: ["Outdoor swimming pool", "Fitness center", "Spa", "Airport shuttle", "3 restaurants", "Bar", "Free Wifi", "Tea/Coffee Maker in All Rooms", "Wonderful Breakfast", "Family rooms"],
    },
    {
      name: "Cinnamon Grand Colombo",
      img: cinnamon,
      desc: "A 5-star hotel offering elegant rooms, outdoor pools, and award-winning restaurants near Galle Face Green. Perfect for business and leisure.",
      rating: 5,
      gallery: [cinnamon, shangri, taj, kingsbury, grandWard, jetwing],
      features: ["Outdoor pool", "Free Wifi", "5 restaurants", "Bar", "Business Center", "Spa & Wellness"],
    },
    {
      name: "Shangri-La Colombo",
      img: shangri,
      desc: "Shangri-La Colombo offers world-class service, ocean views, fine dining, and modern luxury, located in the heart of the city.",
      rating: 5,
      gallery: [shangri, cinnamon, grandWard, jetwing, kingsbury, taj],
      features: ["Infinity Pool", "Ocean View", "Fine Dining", "Gym", "Airport shuttle (paid)", "Free Wifi", "Family rooms"],
    },
    {
      name: "Jetwing Colombo Seven",
      img: jetwing,
      desc: "A stylish urban hotel featuring a rooftop infinity pool, spa, and city skyline views — blending comfort and luxury.",
      rating: 4,
      gallery: [jetwing, taj, cinnamon, kingsbury, grandWard, shangri],
      features: ["Rooftop Pool", "Spa", "Free Wifi", "City View Rooms", "Restaurant", "Bar"],
    },
    {
      name: "The Kingsbury Colombo",
      img: kingsbury,
      desc: "A contemporary beachfront property with spacious rooms, gourmet cuisine, and proximity to major attractions.",
      rating: 4,
      gallery: [kingsbury, grandWard, taj, cinnamon, jetwing, shangri],
      features: ["Beachfront", "Gourmet Dining", "Spa", "Fitness center", "Free Wifi", "Airport shuttle"],
    },
  ];

  const totalHotels = hotels.length;
  const totalPages = Math.ceil(totalHotels / hotelsPerPage);
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        // Scroll to the top of the hotel list when page changes
        const listTop = document.getElementById("hotel-list-start");
        if (listTop) {
            listTop.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };


  const handleStepClick = (clickedStep: number) => {
    navigate("/itinerary", { state: { destination, step: clickedStep } });
  };

  const renderStars = (count: number) => {
    const stars = [];
    const displayedRating = count === 4 && hotels[0].name === "The Grand Ward Place - Colombo 7" ? 3.5 : count; 
    const fullStars = Math.floor(displayedRating);
    const hasHalfStar = displayedRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }

    const totalStars = fullStars + (hasHalfStar ? 1 : 0);
    for (let i = totalStars; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  // --- Hotel Details Modal Component (UNMODIFIED) ---
  const HotelDetailsModal = ({ hotel, onClose }: { hotel: any; onClose: () => void }) => {
    const [roomType, setRoomType] = useState('single');
    const galleryImages = hotel.gallery.slice(0, 6);

    const getToggleClass = (type: 'single' | 'double') => {
      return roomType === type
        ? { container: 'bg-[#B749DB]', circle: 'right-1' }
        : { container: 'bg-gray-300', circle: 'left-1' };
    };

    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-6 my-10 relative overflow-y-scroll hide-scrollbar max-h-[90vh]"
      >
        {/* Header Section - Title, Rating, Address, Close Button */}
        <div className="px-6 md:px-10 pt-8 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-2">
            {/* Hotel Title and Address */}
            <div>
              <h1 className="text-[24px] font-inter font-bold text-[#401A4D]">
                {hotel.name}
              </h1>
              <p className="text-gray-600 font-inter text-sm mt-1">
                No 64 Ward Place Building No 64, Floor No 18, Cinnamon Gardens, <br />
                00700 Colombo, Sri Lanka
              </p>
            </div>

            {/* Rating and Close Button */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1">
                {renderStars(hotel.rating)}
              </div>
              <p className="text-sm text-blue-700 mt-2">
                <span className="text-gray-600 mr-2">Excellent location -</span> <a href="#" className="font-medium hover:underline">show map</a>
              </p>
              <IoCloseSharp className="text-xl text-gray-500 cursor-pointer absolute top-4 right-4" onClick={onClose} />
            </div>
          </div>
        </div>

        {/* --- Image Gallery Section (Fixed Grid Layout) --- */}
        <div className="p-6 pt-0 md:p-10 md:pt-0">
          <div className="grid grid-cols-3 gap-4 mt-6">
            
            <img
              src={galleryImages[0]}
              alt="hotel-main-view"
              className="w-full h-48 object-cover rounded-xl shadow-md col-span-1"
            />
            <img
              src={galleryImages[1]}
              alt="hotel-bedroom"
              className="w-full h-48 object-cover rounded-xl shadow-md col-span-1"
            />
            <img
              src={galleryImages[2]}
              alt="hotel-lounge"
              className="w-full h-48 object-cover rounded-xl shadow-md col-span-1"
            />

            {/* Bottom Row Images */}
            {galleryImages.slice(3).map((img: string, i: number) => (
              <img
                key={i + 3}
                src={img}
                alt={`hotel-gallery-${i + 4}`}
                className="w-full h-48 object-cover rounded-xl shadow-md col-span-1"
              />
            ))}
          </div>
            
        </div>

        {/* --- Room Details Section (Input Toggles) --- */}
        <div className="px-6 md:px-10 py-5 space-y-5 border-t border-gray-200 mt-4">
          <h3 className="text-[20px] font-bold font-roboto text-gray-800">Room Details</h3>

          {/* Room Type - Toggle Logic */}
          <div className="space-y-3 font-roboto">
            <p className="font-semibold text-gray-700">Room Type</p>
            <div className="flex gap-8">
              {/* Single Room Toggle */}
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setRoomType('single')}
              >
                <div className={`w-10 h-6 ${getToggleClass('single').container} rounded-full p-1 relative transition-colors duration-300`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${getToggleClass('single').circle}`}></div>
                </div>
                <span className="text-gray-600">Single Room</span>
              </div>

              {/* Double Room Toggle */}
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setRoomType('double')}
              >
                <div className={`w-10 h-6 ${getToggleClass('double').container} rounded-full p-1 relative transition-colors duration-300`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${getToggleClass('double').circle}`}></div>
                </div>
                <span className="text-gray-600">Double Room</span>
              </div>
            </div>
          </div>

          {/* Bed Type (Checkbox style) */}
          <div className="space-y-3 font-roboto">
            <p className="font-semibold text-gray-700">Bed Type</p>
            <div className="flex flex-wrap gap-8 ">
              {["1 King Bed", "2 Twin Beds", "3 Twin Beds", "1 full bed"].map(
                (bed, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox text-[#5B247A] rounded-sm cursor-pointer"
                      defaultChecked={i === 0}
                    />
                    <span className="text-gray-600 cursor-pointer">{bed}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Diet Plan (Checkbox style) */}
          <div className="space-y-3 font-roboto">
            <p className="font-semibold text-gray-700">Diet Plan</p>
            <div className="flex flex-wrap gap-8">
              {["Full Board", "Half Board", "BB"].map((plan, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-[#5B247A] rounded-sm cursor-pointer"
                    defaultChecked={i === 1} // Half Board checked
                  />
                  <span className="text-gray-600 cursor-pointer">{plan}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* --- Room Features Section --- */}
        <div className="px-6 md:px-10 py-6 space-y-4 border-t border-gray-200 font-roboto">
          <h3 className="text-[20px] font-bold text-gray-800">Room Features</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-gray-600">
            {hotel.features.map((feature: string, index: number) => (
              <span key={index} className="text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };
  // --- Modal Component ends here ---

  return (
    <div className="bg-white min-h-screen font-['Roboto_Condensed'] overflow-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row px-8 md:px-20 py-16 gap-10">
        {/* --- Sidebar Section (UNMODIFIED) --- */}
        <div className="md:w-1/4">
          <h2 className="text-[26px] font-bold mb-10 text-[#1E1E1E]">
            Create Itinerary
          </h2>
          <div className="relative ml-4">
            <div className="absolute top-[18px] left-[15px] w-[2px] bg-[#B749DB] h-[calc(100%-40px)]"></div>
            {steps.map((title, i) => (
              <div
                key={i}
                onClick={() => handleStepClick(i + 1)}
                className="relative flex items-start mb-12 cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold text-sm z-10 transition-all duration-200 ${
                    step === i + 1
                      ? "border-[#B749DB] bg-[#B749DB] text-white scale-110"
                      : "border-[#B749DB] text-[#B749DB] bg-white group-hover:scale-105"
                  }`}
                >
                  {i + 1}
                </div>

                <div className="ml-4">
                  <p
                    className={`text-[20px] font-bold ${
                      step === i + 1
                        ? "text-[#B749DB]"
                        : "text-[#000] group-hover:text-[#B749DB]"
                    }`}
                  >
                    {title}
                  </p>
                  <p className="text-[15px] text-gray-400">Step description</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Main Content Area (Hotels List) --- */}
        <div id="hotel-list-start" className="md:w-3/4 bg-white border border-purple-200 rounded-2xl shadow-sm p-12 min-h-[85vh]">
          {/* Breadcrumb */}
          <p className="text-[#B749DB] font-semibold mb-8">
            <span
              onClick={() => navigate("/destination")}
              className="underline cursor-pointer hover:text-[#8B2BB9] transition-colors"
            >
              Destination
            </span>{" "}
            &gt;{" "}
            <span
              onClick={() =>
                navigate("/itinerary", { state: { destination, step: 3 } })
              }
              className="underline cursor-pointer hover:text-[#8B2BB9] transition-colors"
            >
              {destination}
            </span>{" "}
            &gt; Hotels
          </p>

          <h2 className="text-2xl font-bold mb-10 text-[#1E1E1E]">
            Hotels in {destination}
          </h2>

          {/* --- Hotel Cards Section (PAGINATED List) --- */}
          <div className="flex flex-col gap-8">
            {/* Maps over the sliced list of hotels (currentHotels) */}
            {currentHotels.map((hotel, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.005 }}
                onClick={() => setSelectedHotel(hotel)} // open modal
                className="bg-[#F8ECFF] rounded-2xl shadow-lg border border-[#E2C6F4] overflow-hidden cursor-pointer p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  
                  {/* LEFT SIDE: Main Image */}
                  <div className="relative md:w-1/3 min-w-[200px] h-[200px] md:h-auto"> 
                    <img
                      src={hotel.img}
                      alt={hotel.name}
                      className="w-full h-58 object-cover rounded-2xl" 
                    />
                    {/* Heart Icon */}
                    <div className="absolute top-4 left-4 bg-white/70 p-2 rounded-full shadow-md">
                      <svg 
                        className="w-5 h-5 text-gray-800"
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                    
                  {/* RIGHT SIDE: Details */}
                  <div className="md:w-2/3 flex flex-col justify-start pt-2">
                    <div>
                      <h3 className="text-[24px] font-bold text-[#5F3396] mb-2">
                        {hotel.name}
                      </h3>
                      <p className="text-[16px] text-gray-700 mb-3 leading-snug">
                        {hotel.desc}
                      </p>
                      <div className="flex gap-1 mb-2">
                        {renderStars(hotel.rating)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: Horizontal Gallery Row */}
                <div className="flex gap-3 mt-4 overflow-x-scroll hide-scrollbar pb-2 justify-start px-1">
                  {hotel.gallery.slice(0, 6).map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      alt={`gallery-${i}`}
                      className="min-w-[220px] h-[200px] object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- CUSTOM TAILWIND PAGINATION CONTROLS --- */}
          <CustomPagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
          />

          {/* --- Navigation Buttons (Separate from pagination) --- */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() =>
                navigate("/itinerary", { state: { destination, step: 3 } })
              }
              className="flex items-center gap-2 border border-[#B749DB] text-[#B749DB] px-8 py-2.5 rounded-lg font-semibold hover:bg-[#B749DB]/10 transition-all"
            >
              <FaArrowLeft className="text-[#B749DB]" /> Previous
            </button>

            {/* Navigates to the next step (Notes) */}
            <button
              onClick={() =>
                navigate("/itinerary", { state: { destination, step: 4 } })
              }
              className="flex items-center gap-2 bg-[#B749DB] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-[#8B2BB9] transition-all"
            >
              Next <FaArrowRight className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Modal Wrapper (UNMODIFIED) --- */}
      <AnimatePresence>
        {selectedHotel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <HotelDetailsModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}