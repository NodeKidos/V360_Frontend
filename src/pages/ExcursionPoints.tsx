import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import Navbar from "../components/home/Navbar";
import { useItineraryStore } from "../store/useItineraryStore";
import { toast } from "react-toastify";
import { excursionService, type Excursion } from "../services/excursion.service";

import defaultImage from "../assets/packages/family.png";
import { IoSearch } from "react-icons/io5";

export default function ExcursionPoints() {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination || "Colombo";
  const destinationId = location.state?.destinationId;
  const fromEdit = location.state?.fromEdit || false;
  const itineraryId = location.state?.itineraryId;
  const returnTab = location.state?.returnTab || "destinations";

  const { formData, updateFormData } = useItineraryStore();

  const steps = [
    "Personal Details",
    "Preferences & Requirements",
    "Travel Details",
    "Notes",
  ];

  const [step, setStep] = useState<number>(3);

  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch excursions from API filtered by destination
  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        setLoading(true);
        if (destinationId) {
          const data = await excursionService.getByDestination(destinationId);
          setExcursions(data);
        } else {
          const data = await excursionService.getAll();
          setExcursions(data);
        }
      } catch (error) {
        console.error("Failed to fetch excursions:", error);
        toast.error("Failed to load excursions");
      } finally {
        setLoading(false);
      }
    };

    fetchExcursions();
  }, [destinationId]);

  // ✅ Function to handle sidebar navigation
  const handleStepClick = (clickedStep: number) => {
    setStep(clickedStep);

    // Navigate to Itinerary page with correct step or back to edit
    if (fromEdit && itineraryId) {
      navigate(`/itinerary/${itineraryId}/edit`, { state: { returnTab } });
    } else {
      navigate("/itinerary", { state: { destination, step: clickedStep } });
    }
  };

  const isExcursionSelected = (excursionId: string) => {
    const selectedExcursions = formData.selectedDestinations?.[destination]?.excursions || [];
    return selectedExcursions.some((ex: any) => ex.id === excursionId);
  };

  const handleSelectExcursion = (excursion: Excursion) => {
    const currentSelection = formData.selectedDestinations?.[destination] || {};
    const currentExcursions = currentSelection.excursions || [];
    const isSelected = isExcursionSelected(excursion.id);

    let updatedExcursions;
    if (isSelected) {
      updatedExcursions = currentExcursions.filter((ex: any) => ex.id !== excursion.id);
      toast.info(`${excursion.name} removed from ${destination}`);
    } else {
      updatedExcursions = [...currentExcursions, excursion];
      toast.success(`${excursion.name} selected for ${destination}`);
    }

    updateFormData({
      selectedDestinations: {
        ...formData.selectedDestinations,
        [destination]: {
          ...currentSelection,
          excursions: updatedExcursions
        }
      }
    });
  };

  return (
    <div className="bg-white min-h-screen font-roboto relative overflow-hidden">
      <Navbar />
      {/* Background circles */}
      <div className="absolute left-30 bottom-0 w-[350px] h-[350px] bg-[#d0a2df] opacity-40 rounded-full translate-x-[-50%] translate-y-[50%] z-0"></div>
      <div className="absolute left-5 bottom-7 w-[350px] h-[350px] bg-[#B749DB] opacity-60 rounded-full translate-x-[-50%] translate-y-[50%] z-0"></div>

      {/* -------- MOBILE + TABLET HEADER (Hidden on desktop) -------- */}
      <div className="block lg:hidden w-full flex-col items-center mb-8 mt-6 px-4">
        <h2 className="text-[24px] font-bold text-black mb-4 md:pl-10 text-left md:text-left">
          Create Itinerary
        </h2>

        {/* Search */}
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

        {/* Step circles */}
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
                  onClick={() => setStep(item.id)}  // Add click handler
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

      <div className="flex flex-col lg:flex-row px-4 sm:px-10 md:px-14 lg:px-20 py-10 gap-10 relative z-10">
        {/* ===== Sidebar ===== */}
        <div className="hidden lg:block lg:w-1/4 font-roboto-condensed">
          <h2 className="text-[24px] md:text-[26px] font-bold mb-10 text-[#1E1E1E]">
            Create Itinerary
          </h2>

          <div className="relative ml-4">
            <div className="absolute top-[18px] left-[15px] w-0.5 bg-[#B749DB] h-[calc(100%-40px)]"></div>

            {steps.map((title, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: i * 0.1, duration: 0.4 },
                }}
                onClick={() => handleStepClick(i + 1)} // ✅ navigate on step click
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
                    className={`text-[20px] font-bold transition-colors duration-200 ${step === i + 1
                      ? "text-[#B749DB]"
                      : "text-black group-hover:text-[#B749DB]"
                      }`}
                  >
                    {title}
                  </p>
                  <p className="text-[15px] text-gray-400">Step description</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===== Main Section ===== */}
        <div className="lg:w-3/4 bg-white border border-purple-200 rounded-2xl shadow-sm p-12 min-h-[85vh]">
          {/* ===== Breadcrumb ===== */}
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
                if (fromEdit && itineraryId) {
                  navigate(`/itinerary/${itineraryId}/edit`, { state: { returnTab } });
                } else {
                  navigate("/itinerary", { state: { destination, step: 3 } });
                }
              }}
              className="underline cursor-pointer hover:text-[#8B2BB9] transition-colors"
            >
              {fromEdit ? "Back to Edit" : destination}
            </span>{" "}
            &gt; Excursion Points
          </p>

          <h2 className="text-2xl font-bold mb-8 text-[#1E1E1E]">
            Excursion Points
          </h2>

          {/* ===== Excursion Cards ===== */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B749DB] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading excursions...</p>
              </div>
            </div>
          ) : excursions.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <p className="text-gray-600 text-lg">No excursions found for this destination</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.map((place) => {
              const isSelected = isExcursionSelected(place.id);
              const imageUrl = place.images && place.images.length > 0 ? place.images[0] : defaultImage;
              return (
                <motion.div
                  key={place.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-xl overflow-hidden shadow-md cursor-pointer group border-2 transition-all ${isSelected ? "border-green-500 ring-2 ring-green-500" : "border-transparent"}`}
                >
                  <div onClick={() => handleSelectExcursion(place)}>
                    <img
                      src={imageUrl}
                      alt={place.name}
                      className="w-full h-[220px] object-cover"
                    />

                    <div className="absolute bottom-0 w-full bg-black/60 py-3 px-4 flex items-center justify-between">
                      <p className="text-white font-semibold text-[16px]">
                        {place.name}
                      </p>
                      {isSelected && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Button - Separate from selection click */}
                  <motion.div
                    className="absolute bottom-3 right-4 p-2 bg-[#B749DB] rounded-full shadow-md cursor-pointer z-10"
                    whileHover={{ rotate: -45 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selection toggle
                      navigate("/excursion-details", {
                        state: { excursion: place, fromDestination: destination },
                      });
                    }}
                  >
                    <FaArrowRight size={16} className="text-white" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          )}

          {/* ===== Buttons ===== */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() => {
                if (fromEdit && itineraryId) {
                  navigate(`/itinerary/${itineraryId}/edit`, { state: { returnTab } });
                } else {
                  navigate("/itinerary", { state: { destination, step: 3 } });
                }
              }}
              className="flex items-center gap-2 border border-[#B749DB]
              text-[#B749DB] px-8 py-2.5 rounded-lg font-semibold hover:bg-[#B749DB]/10 transition-all"
            >
              <FaArrowLeft className="text-[#B749DB]" /> {fromEdit ? "Back to Edit" : "Previous"}
            </button>

            {!fromEdit && (
              <button
                onClick={() =>
                  navigate("/itinerary", { state: { destination, step: 4 } })
                }
              className="flex items-center gap-2 border border-[#B749DB]
              text-[#B749DB] px-8 py-2.5 rounded-lg font-semibold hover:bg-[#B749DB]/10 transition-all"
            >
              Next <FaArrowRight className="text-[#B749DB]" />
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

