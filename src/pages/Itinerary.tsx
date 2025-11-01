import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import colombo from "../assets/packages/family.png";
import kandy from "../assets/packages/family.png";
import galle from "../assets/packages/family.png";
import matara from "../assets/packages/family.png";
import matale from "../assets/packages/family.png";
import badulla from "../assets/packages/family.png";
import nuwara from "../assets/packages/family.png";
import negombo from "../assets/packages/family.png";
import anuradhapura from "../assets/packages/family.png";

interface Field {
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
}

interface Destination {
  name: string;
  img: string;
}

export default function Itinerary() {
  const [step, setStep] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const navigate = useNavigate();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    "Personal Details",
    "Preferences & Requirements",
    "Travel Details",
    "Notes",
  ];

  const fadeAnim = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const destinations: Destination[] = [
    { name: "Colombo", img: colombo },
    { name: "Kandy", img: kandy },
    { name: "Galle", img: galle },
    { name: "Matara", img: matara },
    { name: "Matale", img: matale },
    { name: "Badulla", img: badulla },
    { name: "Nuwara Eliya", img: nuwara },
    { name: "Negombo", img: negombo },
    { name: "Anuradhapura", img: anuradhapura },
  ];

  const excursionPoints: Destination[] = [
    { name: "Lotus Tower", img: colombo },
    { name: "Temple of Tooth", img: kandy },
    { name: "Dutch Fort", img: galle },
    { name: "Light House", img: matara },
    { name: "Sigiriya", img: matale },
    { name: "Nine Arch Bridge", img: badulla },
  ];

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
                onClick={() => setStep(i + 1)}
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

        {/* === Background Circles === */}
        <div className="absolute bottom-0 left-0 -z-10">
          <div className="relative w-[280px] h-[280px]">
            <div className="absolute bottom-[-200px] left-[-60px] w-[360px] h-[360px] bg-[#E5D4EF] opacity-70 rounded-full"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[280px] h-[280px] bg-[#B749DB] opacity-90 rounded-full"></div>
          </div>
        </div>

        {/* ===== Main Form ===== */}
        <div className="md:w-3/4 bg-white border border-purple-200 rounded-2xl shadow-sm p-12 min-h-[85vh]">
          {/* === STEP 1 === */}
          {step === 1 && (
            <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: "First Name", type: "text", placeholder: "Enter first name" },
                  { label: "Last Name", type: "text", placeholder: "Enter last name" },
                  { label: "Date of Birth", type: "date" },
                  { label: "Gender", type: "select", options: ["Choose gender", "Male", "Female"] },
                  { label: "Email Address", type: "email", placeholder: "Enter email" },
                  { label: "Group Composition", type: "select", options: ["Select group type", "Solo", "Couple", "Family"] },
                  { label: "Contact Number", type: "text", placeholder: "Enter contact number" },
                  { label: "Country of Residence", type: "select", options: ["Select country", "Sri Lanka", "India", "UK", "USA", "Australia"] },
                  { label: "Arrival Date", type: "date" },
                  { label: "Departure Date", type: "date" },
                ].map((field: Field, i: number) => (
                  <div key={i} className="flex flex-col gap-2">
                    <label className="text-[16px] font-medium">{field.label}</label>
                    {field.type === "select" ? (
                      <select className="w-[434px] h-[48px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition">
                        {field.options?.map((opt, idx) => (
                          <option key={idx}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-[434px] h-[48px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <p className="font-semibold mb-3 text-[16px]">Preferred Duration of Stay</p>
                <div className="flex gap-6 flex-wrap">
                  {["1 week", "2 weeks", "3 weeks", "Custom"].map((label) => (
                    <label key={label} className="flex items-center gap-2 text-[16px]">
                      <input type="checkbox" className="w-4 h-4 accent-[#B749DB]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-12">
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10"
                >
                  Next <FaArrowRight className="text-[#B749DB]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* === STEP 2 === */}
          {step === 2 && (
            <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-10">
              <div className="flex flex-col gap-3">
                <label className="text-[16px] font-medium">Dietary Preferences</label>
                <input
                  placeholder="Enter dietary preferences"
                  className="w-[934px] h-[48px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                />
              </div>

              {/* Hotel Category */}
              <div className="flex flex-col gap-3 mt-4 pb-4">
                <label className="text-[20px] font-semibold">Hotel Category</label>
                <div className="flex items-center gap-2 text-4xl mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      onClick={() => setRating(i)}
                      className={`cursor-pointer transition ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Room Category */}
              <div className="flex flex-col gap-3">
                <label className="text-[16px] font-medium">Room Category</label>
                <div className="flex gap-6">
                  {["Double", "Single", "Triple"].map((label) => (
                    <label key={label} className="flex items-center gap-2 text-[16px]">
                      <input type="checkbox" className="w-4 h-4 accent-[#B749DB]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

        {/* Vehicle Type */}
              <div className="flex flex-col gap-3">
                <label className="text-[16px] font-medium">Vehicle Type</label>
                <div className="flex gap-6">
                  {["Standard", "Luxury", "Semi Luxury"].map((label) => (
                    <label key={label} className="flex items-center gap-2 text-[16px]">
                      <input type="checkbox" className="w-4 h-4 accent-[#B749DB]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] font-medium">Any Medical condition or special needs</label>
                <input
                  placeholder="Enter dietary preferences"
                  className="w-[934px] h-[48px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                />
              </div>

              {/* Prev + Next */}
              <div className="flex justify-between mt-10">
                <button onClick={prevStep} className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10">
                  <FaArrowLeft className="text-[#B749DB]" /> Previous
                </button>
                <button onClick={nextStep} className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10">
                  Next <FaArrowRight className="text-[#B749DB]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* === STEP 3 === */}
          {step === 3 && (
            <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-8">
              <h3 className="text-xl font-semibold text-[#1E1E1E]">Choose Your Destination</h3>

              {!selectedDestination ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((district, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedDestination(district.name)}
                      className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group hover:scale-[1.02] transition-all"
                    >
                      <img src={district.img} alt={district.name} className="w-full h-[230px] object-cover" />
                      <div className="absolute bottom-0 left-0 w-full bg-black/60 py-3 px-4">
                        <p className="text-white font-bold text-[18px]">{district.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Excursion Points */}
                  <div className="text-sm text-[#B749DB] font-semibold flex gap-2 items-center">
                    <span className="cursor-pointer hover:underline" onClick={() => setSelectedDestination(null)}>
                      Destination
                    </span>
                    <span>&gt;</span>
                    <span>{selectedDestination}</span>
                    <span>&gt;</span>
                    <span className="text-[#B749DB]/70">Excursion Points</span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {excursionPoints.map((place, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          navigate("/excursion-details", { state: { excursion: place } })
                        }
                        className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group hover:scale-[1.02] transition-all"
                      >
                        <img src={place.img} alt={place.name} className="w-full h-[230px] object-cover" />
                        <div className="absolute bottom-0 left-0 w-full bg-black/60 py-3 px-4 flex items-center justify-between">
                          <p className="text-white font-bold text-[18px]">{place.name}</p>
                          <div className="bg-[#B749DB] p-2 rounded-full text-white text-sm">
                            <FaArrowRight />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* === STEP 4 === */}
          {step === 4 && (
            <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium">Any Special Requirement</label>
                <textarea
                  placeholder="Enter any special requests (e.g., wheelchair access, birthday cake, anniversary needs)"
                  className="w-[934px] border border-[#E5D4EF] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#B749DB]/30 focus:border-[#B749DB] min-h-[200px]"
                />
              </div>

              <div className="flex justify-between mt-10">
                <button onClick={prevStep} className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10">
                  <FaArrowLeft className="text-[#B749DB]" /> Previous
                </button>
                <button className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10">
                  Submit <FaArrowRight className="text-[#B749DB]" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
