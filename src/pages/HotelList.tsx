import { useState, useEffect, type Key } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { IoSearch, IoCloseSharp } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import CustomPagination from "../components/CustomPagination";
import { useItineraryStore } from "../store/useItineraryStore";
import { toast } from "react-toastify";
import { hotelService, type Hotel } from "../services/hotel.service";
import defaultImage from "../assets/packages/family.png";

const HotelDetailsModal = ({ hotel, onClose }: { hotel: any; onClose: () => void }) => {
  const { formData, updateFormData } = useItineraryStore();
  const { destination } = useLocation().state || { destination: "Colombo" };

  const isSelected = formData.selectedDestinations?.[destination]?.hotel?.name === hotel.name;
  const existingRoomDetails = formData.selectedDestinations?.[destination]?.hotel?.roomDetails;

  // Initialize state with existing room details if available, otherwise use defaults
  const [roomType, setRoomType] = useState(existingRoomDetails?.roomType || 'single');
  const [selectedBedTypes, setSelectedBedTypes] = useState<string[]>(
    existingRoomDetails?.bedTypes || ["1 King Bed"]
  );
  const [selectedDietPlans, setSelectedDietPlans] = useState<string[]>(
    existingRoomDetails?.dietPlans || ["Half Board"]
  );

  // Update state when modal opens with saved room details
  useEffect(() => {
    if (existingRoomDetails) {
      setRoomType(existingRoomDetails.roomType || 'single');
      setSelectedBedTypes(existingRoomDetails.bedTypes || ["1 King Bed"]);
      setSelectedDietPlans(existingRoomDetails.dietPlans || ["Half Board"]);
    }
  }, [hotel.id, existingRoomDetails]);

  const galleryImages = hotel.gallery.slice(0, 6);

  const getToggleClass = (type: 'single' | 'double') => {
    return roomType === type
      ? { container: 'bg-[#B749DB]', circle: 'right-1' }
      : { container: 'bg-gray-300', circle: 'left-1' };
  };

  const handleBedTypeChange = (bedType: string) => {
    setSelectedBedTypes(prev =>
      prev.includes(bedType)
        ? prev.filter(b => b !== bedType)
        : [...prev, bedType]
    );
  };

  const handleDietPlanChange = (dietPlan: string) => {
    setSelectedDietPlans(prev =>
      prev.includes(dietPlan)
        ? prev.filter(d => d !== dietPlan)
        : [...prev, dietPlan]
    );
  };

  const handleSelectHotel = () => {
    const currentSelection = formData.selectedDestinations?.[destination] || {};

    if (isSelected) {
      // Unselect the hotel
      const { hotel: _, ...rest } = currentSelection;
      updateFormData({
        selectedDestinations: {
          ...formData.selectedDestinations,
          [destination]: rest
        }
      });
      toast.info(`${hotel.name} removed from ${destination}`);
    } else {
      // Select the hotel with room details
      updateFormData({
        selectedDestinations: {
          ...formData.selectedDestinations,
          [destination]: {
            ...currentSelection,
            hotel: {
              ...hotel,
              roomDetails: {
                roomType,
                bedTypes: selectedBedTypes,
                dietPlans: selectedDietPlans,
              }
            }
          }
        }
      });
      toast.success(`${hotel.name} selected for ${destination}`);
    }

    onClose();
  };

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-6 my-10 relative overflow-y-scroll hide-scrollbar max-h-screen"
    >
      <div className="px-6 md:px-10 pt-8 pb-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-[24px] sm:text-[26px] font-inter font-bold text-[#401A4D]">
              {hotel.name}
            </h1>
            <p className="text-gray-600 font-inter sm:text-[16px] md:text-[18px] lg:text-[20px] mt-1">
              {hotel.address || hotel.location || "Address not available"}
            </p>
          </div>
          <div className="flex flex-col items-center sm:mt-4 lg:mt-0 sm:items-start">
            <div className="flex gap-2 mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < (hotel.rating || hotel.starRating || 0) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
            {(hotel.address || hotel.location) && (
              <p className="text-sm text-blue-700 mt-2">
                <span className="text-gray-600 mr-1">Location -</span>
                <a href="#" className="font-medium hover:underline">show map</a>
              </p>
            )}
            <IoCloseSharp
              className="text-xl text-gray-500 cursor-pointer absolute top-4 right-4 md:right-10"
              onClick={onClose}
            />
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 md:p-10 md:pt-0">
        <div className="md:hidden lg:hidden flex overflow-x-scroll gap-4 pb-4">
          {galleryImages.map((img: string | undefined, i: Key | null | undefined) => (
            <img
              key={i}
              src={img}
              alt={`gallery-${i}`}
              className="w-[300px] h-[200px] object-cover rounded-lg shadow-sm hover:scale-[1.03] transition-transform"
            />
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 gap-4 mt-6">
          {galleryImages.map((img: string | undefined, i: Key | null | undefined) => (
            <img
              key={i}
              src={img}
              alt={`gallery-${i}`}
              className="w-full h-48 object-cover rounded-xl shadow-md"
            />
          ))}
        </div>
      </div>

      <div className="px-6 md:px-10 py-5 space-y-5 border-t border-gray-200 mt-4">
        <h3 className="text-[24px] font-bold font-roboto text-gray-800">Room Details</h3>
        <div className="space-y-3 font-roboto">
          <p className="font-semibold sm:md:text-[18px] md:text-[18px] lg:text-[20px] text-gray-700">Room Type</p>
          <div className="flex gap-8">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setRoomType('single')}
            >
              <div className={`w-10 h-6 ${getToggleClass('single').container} rounded-full p-1 relative transition-colors duration-300`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${getToggleClass('single').circle}`}></div>
              </div>
              <span className="text-gray-600 sm:md:text-[18px] md:text-[18px] lg:text-[20px]">Single Room</span>
            </div>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setRoomType('double')}
            >
              <div className={`w-10 h-6 ${getToggleClass('double').container} rounded-full p-1 relative transition-colors duration-300`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${getToggleClass('double').circle}`}></div>
              </div>
              <span className="text-gray-600 sm:md:text-[18px] md:text-[18px] lg:text-[20px]">Double Room</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 font-roboto">
          <p className="font-semibold text-gray-700 sm:md:text-[18px] md:text-[18px] lg:text-[20px]">Bed Type</p>
          <div className="flex flex-wrap gap-8 ">
            {["1 King Bed", "2 Twin Beds", "3 Twin Beds", "1 full bed"].map(
              (bed, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 form-checkbox text-[#5B247A] rounded-sm cursor-pointer"
                    checked={selectedBedTypes.includes(bed)}
                    onChange={() => handleBedTypeChange(bed)}
                  />
                  <span className="text-gray-600 cursor-pointer sm:md:text-[18px] md:text-[18px] lg:text-[20px]">{bed}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="space-y-3 font-roboto">
          <p className="font-semibold text-gray-700 sm:md:text-[18px] md:text-[18px] lg:text-[20px]">Diet Plan</p>
          <div className="flex flex-wrap gap-8">
            {["Full Board", "Half Board", "BB"].map((plan, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 form-checkbox text-[#5B247A] rounded-sm cursor-pointer"
                  checked={selectedDietPlans.includes(plan)}
                  onChange={() => handleDietPlanChange(plan)}
                />
                <span className="text-gray-600 cursor-pointer sm:md:text-[18px] md:text-[18px] lg:text-[20px]">{plan}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-9 space-y-4 border-t border-gray-200 font-roboto">
        <h3 className="text-[24px] font-bold text-gray-800">Room Features</h3>
        <div className="flex flex-wrap gap-3">
          {hotel.features.map((feature: string, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-[#F8EDFC] border border-[#D9B7F2] text-[#5B247A] rounded-full text-sm md:text-base font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-10 pb-10 pt-4 flex justify-end">
        <button
          onClick={handleSelectHotel}
          className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${isSelected
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-[#B749DB] hover:bg-[#8B2BB9]"
            }`}
        >
          {isSelected ? "Unselect Hotel" : "Select Hotel"}
        </button>
      </div>
    </motion.div>
  );
};

const HotelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination, destinationId, step, fromEdit, fromCustomerEdit, itineraryId, returnTab } = location.state || { destination: "Colombo", destinationId: null, step: 3, fromEdit: false, fromCustomerEdit: false, itineraryId: null, returnTab: "destinations" };

  const { formData } = useItineraryStore();
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // Fetch hotels from API filtered by destination
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        let data: Hotel[];
        if (destinationId) {
          data = await hotelService.getByDestination(destinationId);
        } else {
          data = await hotelService.getAll();
        }

        // Transform the API data to match the expected format
        const transformedHotels = data.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name,
          desc: hotel.description || "No description available",
          rating: hotel.rating || hotel.starRating || 0,
          img: hotel.images && hotel.images.length > 0 ? hotel.images[0] : defaultImage,
          gallery: hotel.images && hotel.images.length > 0 ? hotel.images : [defaultImage],
          features: hotel.amenities || [],
          address: hotel.address,
          location: hotel.location,
          contactInfo: hotel.contactInfo,
          roomTypes: hotel.roomTypes || [],
          bedTypes: hotel.bedTypes || [],
          dietPlans: hotel.dietPlans || [],
        }));

        setHotels(transformedHotels);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        toast.error("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destinationId]);

  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const currentHotels = hotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const steps = [
    "Personal Details",
    "Preferences & Requirements",
    "Travel Details",
    "Notes",
  ];

  const handleStepClick = (stepId: number) => {
    if (fromCustomerEdit && itineraryId) {
      navigate(`/edit-my-itinerary/${itineraryId}`, { state: { step: 3 } });
    } else if (fromEdit && itineraryId) {
      navigate(`/itinerary/${itineraryId}/edit`, { state: { returnTab } });
    } else {
      navigate("/itinerary", { state: { step: stepId } });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const isHotelSelected = (hotelName: string) => {
    return formData.selectedDestinations?.[destination]?.hotel?.name === hotelName;
  };

  return (
    <div className="bg-white min-h-screen font-['Roboto_Condensed'] overflow-hidden">
      <Navbar />
      <div className="block lg:hidden w-full flex-col items-center mb-8 mt-6 px-4">
        <h2 className="text-[24px] font-bold text-black mb-4 md:pl-10 text-left md:text-left">
          Create Itinerary
        </h2>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here"
            className="w-full h-[50px] rounded-xl border border-[#E5D4EF] bg-[#F8EDFC] pl-12 pr-4 text-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-[#B749DB]/40 outline-none"
          />
          <IoSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B749DB]"
            size={20}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center mt-6 gap-2 sm:gap-4">
          {[
            { id: 1, title: "Personal Details" },
            { id: 2, title: "Preferences & Requirements" },
            { id: 3, title: "Travel Details" },
            { id: 4, title: "Notes" },
          ].map((item, i) => (
            <div key={item.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 ${step === item.id
                    ? "bg-[#B749DB] border-[#B749DB] text-white scale-110"
                    : "border-[#B749DB] text-[#B749DB] bg-white"
                    }`}
                >
                  {item.id}
                </div>
                <span
                  className={`text-[12px] sm:text-[13px] mt-1 font-semibold ${step === item.id ? "text-[#B749DB]" : "text-gray-600"}`}
                  onClick={() => handleStepClick(item.id)}
                >
                  {item.title}
                </span>
              </div>
              {i < 3 && (
                <div className="w-8 sm:w-10 h-0.5 bg-[#B749DB] mx-1 sm:mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row px-8 md:px-20 py-16 gap-10">
        <div className="hidden lg:block lg:w-1/4 font-roboto-condensed">
          <h2 className="text-[26px] font-bold mb-10 text-[#1E1E1E]">
            Create Itinerary
          </h2>
          <div className="relative ml-4">
            <div className="absolute top-[18px] left-[15px] w-0.5 bg-[#B749DB] h-[calc(100%-40px)]"></div>
            {steps.map((title, i) => (
              <div
                key={i}
                onClick={() => handleStepClick(i + 1)}
                className="relative flex items-start mb-12 cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold text-sm z-10 transition-all duration-200 ${step === i + 1
                    ? "border-[#B749DB] bg-[#B749DB] text-white scale-110"
                    : "border-[#B749DB] text-[#B749DB] bg-white group-hover:scale-105"
                    }`}
                >
                  {i + 1}
                </div>

                <div className="ml-4">
                  <p
                    className={`text-[20px] font-bold ${step === i + 1
                      ? "text-[#B749DB]"
                      : "text-black group-hover:text-[#B749DB]"
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

        <div id="hotel-list-start" className="md:w-6/6 lg:w-3/4 bg-white border border-purple-200 rounded-2xl shadow-sm p-6 md:p-10 min-h-[70vh]">
          <p className="text-[#B749DB] font-semibold mb-8">
            {!fromEdit && (
              <>
                <span
                  onClick={() => navigate("/destination")}
                  className="underline cursor-pointer hover:text-[#8B2BB9] transition-colors"
                >
                  Destination
                </span>{" "}
                &gt;{" "}
              </>
            )}
            <span
              onClick={() => {
                if (fromCustomerEdit && itineraryId) {
                  navigate(`/edit-my-itinerary/${itineraryId}`, { state: { step: 3 } });
                } else if (fromEdit && itineraryId) {
                  navigate(`/itinerary/${itineraryId}/edit`, { state: { returnTab } });
                } else {
                  navigate("/itinerary", { state: { destination, step: 3 } });
                }
              }}
              className="underline cursor-pointer hover:text-[#8B2BB9] transition-colors"
            >
              {fromCustomerEdit || fromEdit ? "Back to Edit" : destination}
            </span>{" "}
            &gt; Hotels
          </p>

          <h2 className="text-2xl font-bold mb-10 text-[#1E1E1E]">
            Hotels in {destination}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B749DB] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading hotels...</p>
              </div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <p className="text-gray-600 text-lg">No hotels found for this destination</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-8">
                {currentHotels.map((hotel, index) => {
                  const isSelected = isHotelSelected(hotel.name);
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.005 }}
                      onClick={() => setSelectedHotel(hotel)}
                      className={`bg-[#F8ECFF] rounded-2xl shadow-lg border ${isSelected ? "border-green-500 ring-2 ring-green-500" : "border-[#E2C6F4]"} overflow-hidden cursor-pointer p-4`}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative md:w-1/3 min-w-[200px] ">
                          <img
                            src={hotel.img}
                            alt={hotel.name}
                            className="w-full sm:h-48 md:h-48 lg:h-58 object-cover rounded-2xl"
                          />
                          <div className="absolute top-4 left-4 bg-white/70 p-2 rounded-full shadow-md">
                            <svg
                              className="w-5 h-5 text-gray-800"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </div>
                          {isSelected && (
                            <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                              Selected
                            </div>
                          )}
                        </div>

                        <div className="md:w-2/3 flex flex-col justify-start pt-2">
                          <div>
                            <h3 className="text-[24px] font-bold text-[#5F3396] mb-2">
                              {hotel.name}
                            </h3>
                            <p className="md:text-[20px] lg:text-[24px] text-gray-700 mb-3 leading-snug">
                              {hotel.desc}
                            </p>
                            <div className="flex gap-1 mb-2">
                              {renderStars(hotel.rating)}
                            </div>
                          </div>
                        </div>
                      </div>

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
                  );
                })}
              </div>

              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          <div className="flex justify-between mt-12">
            <button
              onClick={() => {
                if (fromCustomerEdit && itineraryId) {
                  navigate(`/edit-my-itinerary/${itineraryId}`, { state: { step: 3 } });
                } else if (fromEdit && itineraryId) {
                  navigate(`/itinerary/${itineraryId}/edit`, { state: { returnTab } });
                } else {
                  navigate("/itinerary", { state: { destination, step: 3 } });
                }
              }}
              className="flex items-center gap-2 border border-[#B749DB] text-[#B749DB] px-8 py-2.5 rounded-lg font-semibold hover:bg-[#B749DB]/10 transition-all"
            >
              <FaArrowLeft className="text-[#B749DB]" /> {fromCustomerEdit || fromEdit ? "Back to Edit" : "Previous"}
            </button>

            {!fromEdit && !fromCustomerEdit && (
              <button
                onClick={() =>
                  navigate("/itinerary", { state: { destination, step: 4 } })
                }
                className="flex items-center gap-2 bg-[#B749DB] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-[#8B2BB9] transition-all"
              >
                Next <FaArrowRight className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

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

export default HotelList;