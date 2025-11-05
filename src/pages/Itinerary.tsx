import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHotel } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";

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

// --- CUSTOM TAILWIND PAGINATION COMPONENT ---
interface CustomPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Generate page numbers array (1, 2, 3, ...)
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const baseClass = "h-9 w-9 flex justify-center items-center rounded-md text-sm transition-colors duration-200 font-medium";
    const linkClass = "hover:bg-[#B749DB]/10 text-gray-700 hover:text-[#B749DB] cursor-pointer";
    const activeClass = "bg-[#B749DB] text-white pointer-events-none";
    const disabledClass = "text-gray-400 pointer-events-none opacity-50";

    if (totalPages <= 1) return null;

    // Logic to show a subset of page numbers (e.g., current, surrounding pages, and first/last)
    const renderPageNumbers = () => {
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <>
                {/* Show First Page and Ellipsis if needed */}
                {startPage > 1 && (
                    <>
                        <li key={1}>
                            <button
                                onClick={() => onPageChange(1)}
                                className={baseClass + " " + linkClass}
                            >
                                1
                            </button>
                        </li>
                        {startPage > 2 && <li className="px-1 text-gray-500">...</li>}
                    </>
                )}

                {/* Main Visible Pages */}
                {pages.map((page) => (
                    <li key={page}>
                        <button
                            onClick={() => onPageChange(page)}
                            className={`${baseClass} ${page === currentPage ? activeClass : linkClass}`}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Show Ellipsis and Last Page if needed */}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <li className="px-1 text-gray-500">...</li>}
                        <li key={totalPages}>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className={baseClass + " " + linkClass}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}
            </>
        );
    };

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
                        Prev
                    </button>
                </li>

                {/* Page Numbers */}
                {renderPageNumbers()}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${baseClass} px-3 ${currentPage === totalPages ? disabledClass : linkClass}`}
                    >
                        Next
                        <FaArrowRight className="w-3 h-3 ml-1" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};
// --- END CUSTOM TAILWIND PAGINATION COMPONENT ---


export default function Itinerary() {
    const [step, setStep] = useState<number>(1);
    const [rating, setRating] = useState<number>(0);
    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
    const [tab, setTab] = useState<string>("excursion"); // Track active tab
    const navigate = useNavigate();
    const location = useLocation();

    // --- PAGINATION STATE FOR STEP 3 ---
    const [currentPage, setCurrentPage] = useState<number>(1);
    const destinationsPerPage: number = 6; // Display 6 destinations per page


    // Restore state when coming back from ExcursionDetails or HotelList
    useEffect(() => {
        if (location.state?.step) setStep(location.state.step);
        if (location.state?.destination) setSelectedDestination(location.state.destination);
    }, [location.state]);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const steps = ["Personal Details", "Preferences & Requirements", "Travel Details", "Notes"];

    const fadeAnim = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    const destinations: Destination[] = [
        { name: "Colombo", img: colombo },
        { name: "Gampaha", img: kandy },
        { name: "Kalutara", img: galle },
        { name: "Kandy", img: matara },
        { name: "Matale", img: matale },
        { name: "Nuwara Eliya", img: nuwara },
        { name: "Galle", img: galle },
        { name: "Matara", img: matara },
        { name: "Hambantota", img: badulla },
        { name: "Jaffna", img: kandy },
        { name: "Kilinochchi", img: galle },
        { name: "Mannar", img: matara },
        { name: "Vavuniya", img: matale },
        { name: "Mullaitivu", img: badulla },
        { name: "Batticaloa", img: nuwara },
        { name: "Ampara", img: negombo },
        { name: "Trincomalee", img: anuradhapura },
        { name: "Kurunegala", img: colombo },
        { name: "Puttalam", img: kandy },
        { name: "Anuradhapura", img: anuradhapura },
        { name: "Polonnaruwa", img: badulla },
        { name: "Badulla", img: badulla },
        { name: "Monaragala", img: matale },
        { name: "Ratnapura", img: nuwara },
        { name: "Kegalle", img: negombo },
    ];

    // --- PAGINATION CALCULATIONS ---
    const totalDestinations = destinations.length;
    const totalPages = Math.ceil(totalDestinations / destinationsPerPage);
    const indexOfLastDestination = currentPage * destinationsPerPage;
    const indexOfFirstDestination = indexOfLastDestination - destinationsPerPage;
    const currentDestinations = destinations.slice(indexOfFirstDestination, indexOfLastDestination);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


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
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold text-sm z-10 transition-all duration-200 ${step === i + 1
                                        ? "border-[#B749DB] bg-[#B749DB] text-white scale-110"
                                        : "border-[#B749DB] text-[#B749DB] bg-white group-hover:scale-105"
                                        }`}
                                >
                                    {i + 1}
                                </div>

                                <div className="ml-4">
                                    <p
                                        className={`text-[20px] font-bold transition-colors duration-200 ${step === i + 1 ? "text-[#B749DB]" : "text-[#000] group-hover:text-[#B749DB]"}`
                                            }
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
                    {/* === STEP 1 (Personal Details) === */}
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
                                        <label className="text-[20px] font-medium">{field.label}</label>
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
                                <p className="font-semibold mb-3 text-[20px]">Preferred Duration of Stay</p>
                                <div className="flex gap-6 flex-wrap">
                                    {["1 week", "2 weeks", "3 weeks", "Custom"].map((label) => (
                                        <label key={label} className="flex items-center gap-2 text-[18px]">
                                            <input type="checkbox" className="w-5 h-5 accent-[#B749DB]" />
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

                    {/* === STEP 2 (Preferences & Requirements) === */}
                    {step === 2 && (
                        <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-10">
                            <div className="flex flex-col gap-3">
                                <label className="text-[20px] font-medium">Dietary Preferences</label>
                                <input
                                    placeholder="Enter dietary preferences"
                                    className="w-full md:w-[934px] h-[48px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
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
                                <label className="text-[20px] font-medium">Room Category</label>
                                <div className="flex gap-6 ">
                                    {["Double", "Single", "Triple"].map((label) => (
                                        <label key={label} className="flex items-center gap-2 text-[18px] cursor-pointer">
                                            <input type="checkbox" className="w-5 h-5 accent-[#B749DB]" />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Type */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[20px] font-medium">Vehicle Type</label>
                                <div className="flex gap-6">
                                    {["Standard", "Luxury", "Semi Luxury"].map((label) => (
                                        <label key={label} className="flex items-center gap-2 text-[18px] cursor-pointer">
                                            <input type="checkbox" className="w-5 h-5 accent-[#B749DB]" />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[20px] font-medium">Any Medical condition or special needs</label>
                                <input
                                    placeholder="Enter dietary preferences"
                                    className="w-full md:w-[934px] h-[48px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
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

                    {/* === STEP 3 (Travel Details - Destinations) === */}
                    {step === 3 && (
                        <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-8">

                            <h3 className="text-xl font-semibold text-[#1E1E1E]">
                                Choose Your Destination
                            </h3>

                            {/* Destination Cards - RENDER currentDestinations */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentDestinations.map((district, i) => (
                                    <div
                                        key={i}
                                        className="relative rounded-xl overflow-hidden shadow-md group"
                                    >
                                        {/* Destination Image */}
                                        <img
                                            src={district.img}
                                            alt={district.name}
                                            className="w-full h-[230px] object-cover"
                                        />

                                        {/* Bottom Destination Name */}
                                        <div className="absolute bottom-0 left-0 w-full bg-black/60 py-3 px-4">
                                            <p className="text-white font-bold text-[18px]">
                                                {district.name}
                                            </p>
                                        </div>

                                        {/* ICON BUTTONS */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-3">

                                            {/* Excursion Icon */}
                                            <button
                                                onClick={() =>
                                                    navigate("/excursion-points", {
                                                        state: { destination: district.name, step }
                                                    })
                                                }
                                                className="p-3 bg-white/90 cursor-pointer backdrop-blur-md rounded-full shadow-md hover:bg-white transition"
                                                title="Excursion Points"
                                            >
                                                <MdOutlineTravelExplore size={20} className="text-[#B749DB]" />
                                            </button>

                                            {/* Hotel Icon */}
                                            <button
                                                onClick={() =>
                                                    navigate("/hotel-list", {
                                                        state: { destination: district.name, step }
                                                    })
                                                }
                                                className="p-3 bg-white/90 cursor-pointer backdrop-blur-md rounded-full shadow-md hover:bg-white transition"
                                                title="Hotels"
                                            >
                                                <FaHotel size={20} className="text-[#B749DB]" />
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- PAGINATION CONTROLS --- */}
                            <CustomPagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />

                            {/* Prev + Next Buttons (Separate from pagination) */}
                            <div className="flex justify-between mt-10">
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-2 border border-[#B749DB] 
                                text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10"
                                >
                                    <FaArrowLeft className="text-[#B749DB]" /> Previous
                                </button>

                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 border border-[#B749DB] 
                                text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10"
                                >
                                    Next <FaArrowRight className="text-[#B749DB]" />
                                </button>
                            </div>

                        </motion.div>

                    )}

                    {/* === STEP 4 (Notes) === */}
                    {step === 4 && (
                        <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-10">
                            <div className="flex flex-col gap-3">
                                <label className="text-[20px] font-medium">Any Special Requirement</label>
                                <textarea
                                    placeholder="Enter any special requests here (e.g., wheelchair access, birthday name, date and cake, Anniversary, Mobility Needs)"
                                    className="w-full md:w-[934px] h-[200px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition resize-none"
                                ></textarea>
                            </div>
                            {/* Prev + Submit */}
                            <div className="flex justify-between mt-10">
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#B749DB]/10"
                                >
                                    <FaArrowLeft className="text-[#B749DB]" /> Previous
                                </button>
                                <button
                                    onClick={() => alert("Submitted!")}
                                    className="flex items-center gap-2 bg-[#B749DB] text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-[#8B2BB9] transition-all"
                                >
                                    Submit
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}