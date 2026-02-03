import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Navbar from "../components/home/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaStar,
  FaCar,
  FaUmbrellaBeach,
  FaLandmark,
  FaClock,
  FaGem,
  FaTaxi,
} from "react-icons/fa";
import lotus1 from "../assets/packages/family.png";
import lotus2 from "../assets/packages/family.png";
import lotus3 from "../assets/packages/family.png";
import lotus4 from "../assets/packages/family.png";

export default function ExcursionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { excursion } = location.state || { excursion: null };

  const fadeAnim: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const images = [lotus1, lotus2, lotus3, lotus4];
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: "Paul Walker",
      date: "July 2025",
      rating: 4,
      review:
        "I recently had dinner at Blue Orbit, Lotus Tower, and it was an absolutely spectacular experience. The food was excellent with a wide variety of options to choose from, and every dish was beautifully presented. The environment was elegant and welcoming, and the night view was truly a feast for the eyes.",
    },
    {
      name: "Sophia Perera",
      date: "June 2025",
      rating: 5,
      review:
        "Amazing place! The view from the top of Lotus Tower is one of a kind. Perfect for family trips or romantic evenings. The staff was courteous and the experience was well organized.",
    },
    {
      name: "Akeel Rahman",
      date: "May 2025",
      rating: 4,
      review:
        "One of the best experiences in Colombo. The architecture is stunning, and the elevator ride is thrilling. Great spot for photography and city views!",
    },
  ];

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const tags = [
    { label: "TUK TUK Tours", icon: <FaTaxi /> },
    { label: "Day Trips (10)", icon: <FaClock /> },
    { label: "Private & Luxury", icon: <FaGem /> },
    { label: "Full Day Tours", icon: <FaCar /> },
    { label: "Beaches (10)", icon: <FaUmbrellaBeach /> },
    { label: "Points of Interest & Landmarks (23)", icon: <FaLandmark /> },
  ];

  return (
    <div className="bg-white min-h-screen font-roboto relative overflow-hidden">
      <Navbar />

      <div className="relative px-8 md:px-20 py-16 z-10">
        <h2 className="text-[24px] md:text-[26px] font-roboto-condensed font-bold mb-10 text-[#401A4D]">
          Excursion Details
        </h2>

        <motion.div
          variants={fadeAnim}
          initial="hidden"
          animate="visible"
          className="bg-[#F8F2FB] border border-purple-200 rounded-2xl shadow-sm p-10 space-y-10 relative z-10"
        >
          {/* === Title Section === */}
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3">
              <img
                src={excursion?.img || lotus1}
                alt={excursion?.name || "Excursion"}
                className="rounded-lg shadow-md w-full sm:w-[300px] md:w-[350px] lg:w-[350px] lg:h-[350px] md:h-[350px] object-cover"
              />
            </div>

            <div className="md:w-2/3 flex flex-col justify-center">
              <h1 className="text-[36px] font-poppins font-semibold text-[#1E1E1E] mb-4">
                {excursion?.name || "Lotus Tower"}
              </h1>
              <p className="text-[#382A59] font-roboto sm:text-[18px] md:text-[20px] lg:text-[22px] leading-relaxed">
                The Lotus Tower, or “Nelum Kuluna,” is an iconic landmark in
                Colombo, Sri Lanka. Rising to a height of 356 meters, it is the
                tallest structure in South Asia and symbolizes Sri Lanka’s
                growth and ambition.
              </p>
            </div>
          </div>

          {/* === Icon Tags === */}
          <div className="flex gap-3 mt-6 lg:flex-wrap sm:flex-nowrap overflow-x-scroll pb-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-3 border  border-[#B749DB] text-black text-[16px] font-roboto font-medium px-3 py-1.5 rounded-full bg-white hover:bg-[#B749DB]/10 transition"
              >
                <span className="text-black">{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>

          {/* === Gallery === */}
          <div>
            <h3 className="font-semibold font-roboto-condensed text-[#1E1E1E] text-[24px] mb-4">
              Gallery
            </h3>

            {/* Gallery Grid for Desktop */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`gallery-${i}`}
                  className="w-full h-[300px] md:w-[400px] md:h-[250px] object-cover rounded-lg shadow-sm hover:scale-[1.03] transition-transform"
                />
              ))}
            </div>

            {/* Horizontal Scroll for Mobile and Tablet */}
            <div className="lg:hidden flex overflow-x-scroll gap-4 pb-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`gallery-${i}`}
                  className="w-[900px] h-[300px] object-cover rounded-lg shadow-sm hover:scale-[1.03] transition-transform"
                />
              ))}
            </div>
          </div>


          {/* === Auto-Animated Reviews === */}
          <div className="pt-4">
            <h3 className="font-semibold text-[#1E1E1E] text-[24px] mb-6 font-roboto-condensed">
              Reviews from our valued customers
            </h3>

            <div className="relative overflow-hidden h-[470px] md:h-[270px] lg:h-80">
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
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < reviews[currentReview].rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        {reviews[currentReview].date}
                      </p>
                    </div>

                    <h4 className="font-semibold text-[#1E1E1E] py-3 mb-2 text-[24px] font-roboto-condensed">
                      {reviews[currentReview].name}
                    </h4>
                    <p className="text-gray-700 font-roboto leading-relaxed sm:text-[12px] md:text-[16px] lg:text-[24px]">
                      {reviews[currentReview].review}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-4">
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: i === currentReview ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-3 h-3 rounded-full ${i === currentReview ? "bg-[#B749DB]" : "bg-[#E5D4EF]"
                      }`}
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/*   Back Button to Excursion Points */}
        <div className="flex justify-start mt-8 relative z-10">
          <button
            onClick={() =>
              navigate("/excursion-points", {
                state: {
                  step: 3,
                  destination: excursion?.fromDestination || null,
                },
              })
            }
            className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10 transition"
          >
            ← Back to Excursion Points
          </button>
        </div>

        {/* === Background Circles === */}
        <div className="absolute bottom-0 left-0 -z-10">
          <div className="relative w-[180px] h-[180px]">
            <div className="absolute bottom-[-300px] left-[-60px] w-[360px] h-[360px] bg-[#E5D4EF] opacity-70 rounded-full"></div>
            <div className="absolute bottom-[-200px] left-[-100px] w-[280px] h-[280px] bg-[#B749DB] opacity-90 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
