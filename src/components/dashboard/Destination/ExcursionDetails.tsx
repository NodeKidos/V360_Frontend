import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Import motion from Framer Motion
import { FaStar } from "react-icons/fa"; // Star Icon for ratings
import { MdKeyboardArrowLeft } from "react-icons/md";
import excursionService, { type Excursion } from "../../../services/excursion.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ExDetails() {
  const navigate = useNavigate();
  const { excursionId } = useParams<{ excursionId: string }>();
  const [isMobile, setIsMobile] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [excursion, setExcursion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch excursion data from API
  useEffect(() => {
    const fetchExcursion = async () => {
      if (!excursionId) {
        toast.error("Excursion ID not found");
        navigate(-1);
        return;
      }

      try {
        setLoading(true);
        const data = await excursionService.getById(excursionId);
        setExcursion(data);
      } catch (error) {
        console.error("Failed to fetch excursion:", error);
        toast.error("Failed to load excursion details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchExcursion();
  }, [excursionId, navigate]);

  // Change review every 5 seconds (auto-slide)
  useEffect(() => {
    if (!excursion?.reviews || excursion.reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % excursion.reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [excursion]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar collapsed={false} setCollapsed={() => {}} isMobile={isMobile} sidebarOpen={false} setSidebarOpen={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading excursion details...</p>
        </div>
      </div>
    );
  }

  if (!excursion) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar collapsed={false} setCollapsed={() => {}} isMobile={isMobile} sidebarOpen={false} setSidebarOpen={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Excursion not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar collapsed={false} setCollapsed={() => {}} isMobile={isMobile} sidebarOpen={false} setSidebarOpen={() => {}} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar isMobile={isMobile} setSidebarOpen={() => {}} />

          {/* Back Button */}
          <button
            onClick={() => navigate('/destination-hotel?tab=excursion')}
            className="flex items-center text-black text-[16px] font-poppins mt-4 mb-4 hover:text-[#B749DB]"
          >
            <MdKeyboardArrowLeft/> Back to Excursions
          </button>

          {/* Card Container */}
          <div className="bg-[#F8F3FF] p-4 md:p-6 rounded-2xl shadow-sm border border-purple-100">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Image */}
              {excursion.images && excursion.images.length > 0 && (
                <img
                  src={excursion.images[0]}
                  alt={excursion.name}
                  className="w-full md:w-[320px] h-[260px] rounded-xl object-cover shadow-md"
                />
              )}

              {/* Right Content */}
              <div className="flex-1">
                <h2 className="sm:text-[12px] md:text-[16px] lg:text-[24px] font-bold text-black font-roboto-condensed mb-2">
                  {excursion.name}
                </h2>

                <p className="text-gray-600 sm:text-[12px] md:text-[16px] lg:text-[18px] leading-relaxed font-Roboto">
                  {excursion.description || "No description available"}
                </p>

                {/* Tags/Details */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {excursion.difficulty && (
                    <span className="flex items-center gap-1 px-4 py-2 border border-[#768A79] font-regular rounded-full sm:text-[12px] md:text-[14px] lg:text-[15px] bg-white">
                      <span className="font-semibold">Difficulty:</span> {excursion.difficulty}
                    </span>
                  )}
                  {excursion.duration && (
                    <span className="flex items-center gap-1 px-4 py-2 border border-[#768A79] font-regular rounded-full sm:text-[12px] md:text-[14px] lg:text-[15px] bg-white">
                      <span className="font-semibold">Duration:</span> {excursion.duration} hours
                    </span>
                  )}
                  {excursion.price && (
                    <span className="flex items-center gap-1 px-4 py-2 border border-[#768A79] font-regular rounded-full sm:text-[12px] md:text-[14px] lg:text-[15px] bg-white">
                      <span className="font-semibold">Price:</span> ${excursion.price}
                    </span>
                  )}
                  {excursion.rating && (
                    <span className="flex items-center gap-1 px-4 py-2 border border-[#768A79] font-regular rounded-full sm:text-[12px] md:text-[14px] lg:text-[15px] bg-white">
                      ⭐ {excursion.rating}/5
                    </span>
                  )}
                </div>

                {/* Additional Details */}
                <div className="mt-6 space-y-3">
                  {excursion.bestTime && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-700 min-w-[140px]">Best Time to Visit:</span>
                      <span className="text-gray-600">{excursion.bestTime}</span>
                    </div>
                  )}
                  {excursion.meetingPoint && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-700 min-w-[140px]">Meeting Point:</span>
                      <span className="text-gray-600">{excursion.meetingPoint}</span>
                    </div>
                  )}
                  {excursion.category && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-700 min-w-[140px]">Category:</span>
                      <span className="text-gray-600">{excursion.category}</span>
                    </div>
                  )}
                  {excursion.destination && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-700 min-w-[140px]">Destination:</span>
                      <span className="text-gray-600">{excursion.destination.name}</span>
                    </div>
                  )}
                  {(excursion.minParticipants || excursion.maxParticipants) && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-700 min-w-[140px]">Participants:</span>
                      <span className="text-gray-600">
                        {excursion.minParticipants && excursion.maxParticipants
                          ? `${excursion.minParticipants} - ${excursion.maxParticipants}`
                          : excursion.minParticipants
                          ? `Min: ${excursion.minParticipants}`
                          : `Max: ${excursion.maxParticipants}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            {excursion.images && excursion.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 pt-5">
                {excursion.images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${excursion.name} - ${idx + 1}`}
                    className="w-full h-[220px] md:h-[260px] rounded-xl object-cover shadow-sm"
                  />
                ))}
              </div>
            )}

            {/* === Reviews Section === */}
            {excursion.reviews && excursion.reviews.length > 0 ? (
              <div className="relative overflow-hidden pt-20 h-[470px] md:h-[270px] lg:h-80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReview}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute w-full"
                  >
                    <div className="bg-white border border-purple-200 rounded-lg p-5 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < excursion.reviews[currentReview].rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                          {excursion.reviews[currentReview].date}
                        </p>
                      </div>

                      <h4 className="font-semibold text-[#1E1E1E] py-3 mb-2 sm:text-[12px] md:text-[16px] lg:text-[20px] font-roboto-condensed">
                        {excursion.reviews[currentReview].name}
                      </h4>
                      <p className="text-gray-700 font-roboto leading-relaxed sm:text-[12px] md:text-[16px] lg:text-[18px]">
                        {excursion.reviews[currentReview].comment}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="pt-20 text-center text-gray-500">
                <p>No reviews available yet</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
