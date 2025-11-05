import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import Navbar from "../components/Navbar";

import lotus from "../assets/packages/family.png";
import temple from "../assets/packages/family.png";
import fort from "../assets/packages/family.png";
import lighthouse from "../assets/packages/family.png";
import sigiriya from "../assets/packages/family.png";
import bridge from "../assets/packages/family.png";

export default function ExcursionPoints() {
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

  const excursions = [
    { name: "Lotus Tower", img: lotus },
    { name: "Temple of Tooth", img: temple },
    { name: "Dutch Fort", img: fort },
    { name: "Light House", img: lighthouse },
    { name: "Sigiriya", img: sigiriya },
    { name: "Nine Arch Bridge", img: bridge },
  ];

  // ✅ Function to handle sidebar navigation
  const handleStepClick = (clickedStep: number) => {
    setStep(clickedStep);

    // Navigate to Itinerary page with correct step
    navigate("/itinerary", { state: { destination, step: clickedStep } });
  };

  return (
    <div className="bg-white min-h-screen font-roboto relative overflow-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row px-8 md:px-20 py-16 gap-10 relative z-10">
        {/* ===== Sidebar ===== */}
        <div className="relative md:w-1/4 font-roboto-condensed">
          <h2 className="text-[24px] md:text-[26px] font-bold mb-10 text-[#1E1E1E]">
            Create Itinerary
          </h2>

          <div className="relative ml-4">
            <div className="absolute top-[18px] left-[15px] w-[2px] bg-[#B749DB] h-[calc(100%-40px)]"></div>

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
                    className={`text-[20px] font-bold transition-colors duration-200 ${
                      step === i + 1
                        ? "text-[#B749DB]"
                        : "text-[#000] group-hover:text-[#B749DB]"
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
        <div className="md:w-3/4 bg-white border border-purple-200 rounded-2xl shadow-sm p-12 min-h-[85vh]">
          {/* ===== Breadcrumb ===== */}
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
            &gt; Excursion Points
          </p>

          <h2 className="text-2xl font-bold mb-8 text-[#1E1E1E]">
            Excursion Points
          </h2>

          {/* ===== Excursion Cards ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.map((place, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  navigate("/excursion-details", {
                    state: { excursion: place, fromDestination: destination },
                  })
                }
                className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group"
              >
                <img
                  src={place.img}
                  alt={place.name}
                  className="w-full h-[220px] object-cover"
                />

                <div className="absolute bottom-0 w-full bg-black/60 py-3 px-4 flex items-center justify-between">
                  <p className="text-white font-semibold text-[16px]">
                    {place.name}
                  </p>
                  <motion.div
                    className="p-2 bg-[#B749DB] rounded-full shadow-md cursor-pointer"
                    whileHover={{ rotate: -45 }}
                  >
                    <FaArrowRight size={16} className="text-white" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ===== Buttons ===== */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() =>
                navigate("/itinerary", { state: { destination, step: 3 } })
              }
              className="flex items-center gap-2 border border-[#B749DB] 
              text-[#B749DB] px-8 py-2.5 rounded-lg font-semibold hover:bg-[#B749DB]/10 transition-all"
            >
              <FaArrowLeft className="text-[#B749DB]" /> Previous
            </button>

            <button
              onClick={() =>
                navigate("/itinerary", { state: { destination, step: 4 } })
              }
              className="flex items-center gap-2 border border-[#B749DB] 
              text-[#B749DB] px-8 py-2.5 rounded-lg font-semibold hover:bg-[#B749DB]/10 transition-all"
            >
              Next <FaArrowRight className="text-[#B749DB]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
