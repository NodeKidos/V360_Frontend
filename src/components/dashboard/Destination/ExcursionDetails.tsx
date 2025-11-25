import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Import motion from Framer Motion
import { FaStar } from "react-icons/fa"; // Star Icon for ratings
import sigiriyaImage from '../../../assets/dashboard/sigiriya.jpg';
import sigiriyaTopImage from '../../../assets/dashboard/sigiriyatop.jpg';
import stairsImage from '../../../assets/dashboard/stairs-3215722_1280.jpg';
import stairImage from '../../../assets/dashboard/stairs.jpg';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function ExDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);

  const excursion = {
    id: id,
    title: "Sigiriya Guided Climb",
    description:
      "Enjoy a guided climb to the top of Sigiriya Rock Fortress with stunning panoramic views. Discover ancient frescoes, the mirror wall, and the historical significance of this UNESCO World Heritage site.",
    tags: [
      "Adventure & Cultural",
      "Hiking",
      "Photography Spot",
      "UNESCO Heritage",
      "Nature & Views"
    ],
    mainImage: sigiriyaImage,
    gallery: [
      sigiriyaImage,
      sigiriyaTopImage,
      stairsImage,
      stairImage,
    ],
    reviews: [
      {
        name: "John Traveler",
        date: "March 2025",
        rating: 5,
        comment:
          "The climb was challenging but absolutely worth it! The guide explained every historical detail. The view from the top is the best I’ve seen in Sri Lanka. Must visit!"
      },
      {
        name: "Sara Wilson",
        date: "April 2025",
        rating: 4,
        comment:
          "Amazing experience! The view is stunning, but the climb was tough. Highly recommend it if you're up for the challenge!"
      },
      {
        name: "David Brown",
        date: "May 2025",
        rating: 5,
        comment:
          "The best experience in Sri Lanka! The history, the view, everything was perfect. A must-visit for any traveler!"
      }
    ]
  };

  // Change review every 5 seconds (auto-slide)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % excursion.reviews.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar collapsed={false} setCollapsed={() => {}} isMobile={isMobile} sidebarOpen={false} setSidebarOpen={() => {}} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar isMobile={isMobile} setSidebarOpen={() => {}} />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-black text-[16px] font-poppins mt-4 mb-4 hover:text-[#B749DB]"
          >
            <MdKeyboardArrowLeft/> Back
          </button>

          {/* Card Container */}
          <div className="bg-[#F8F3FF] p-4 md:p-6 rounded-2xl shadow-sm border border-purple-100">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Image */}
              <img
                src={excursion.mainImage}
                alt={excursion.title}
                className="w-full md:w-[320px] h-[260px] rounded-xl object-cover shadow-md"
              />

              {/* Right Content */}
              <div className="flex-1">
                <h2 className="sm:text-[12px] md:text-[16px] lg:text-[24px] font-bold text-black font-roboto-condensed mb-2">
                  {excursion.title}
                </h2>

                <p className="text-gray-600 sm:text-[12px] md:text-[16px] lg:text-[18px] leading-relaxed font-Roboto">
                  {excursion.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-5">
                  {excursion.tags.map((t, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 border border-[#768A79] font-regular rounded-full sm:text-[12px] md:text-[16px] lg:text-[16px] bg-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 pt-5">
              {excursion.gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className="w-full h-[220px] md:h-[260px] rounded-xl object-cover shadow-sm"
                />
              ))}
            </div>

            {/* === Auto-Animated Reviews === */}
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

          </div>
        </div>
      </div>
    </div>
  );
}
