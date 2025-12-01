import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/home/Navbar";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHotel } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import type { Variants } from "framer-motion";
import SriLankaMap from "../../components/home/SriLankaMap";
import { useItineraryStore } from "../../store/useItineraryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

import colombo from "../../assets/packages/family.png";
import { IoSearch } from "react-icons/io5";

import CustomPagination from "../../components/CustomPagination";

export default function Itinerary() {
    const [step, setStep] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    // Auth and Itinerary stores
    const { isLoggedIn } = useAuthStore();
    const {
        updateFormData,
        createItinerary,
        convertFormDataToDto,
        isLoading,
        formData,
        fetchDestinations,
        destinations
    } = useItineraryStore();

    useEffect(() => {
        fetchDestinations();
    }, []);

    const destinationsPerPage = 6;

    const totalPages = Math.ceil(destinations.length / destinationsPerPage);
    const currentDestinations = destinations.slice(
        (currentPage - 1) * destinationsPerPage,
        currentPage * destinationsPerPage
    );

    const handlePageChange = (p: number) => setCurrentPage(p);

    // Validation for steps
    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!formData.firstName) return "First Name is required";
            if (!formData.lastName) return "Last Name is required";
            if (!formData.email) return "Email is required";
            if (!formData.contactNumber) return "Contact Number is required";
            if (!formData.arrivalDate) return "Arrival Date is required";
            if (!formData.departureDate) return "Departure Date is required";
        }
        return null;
    };

    const nextStep = () => {
        const error = validateStep(step);
        if (error) {
            toast.error(error);
            return;
        }
        setStep((s) => Math.min(4, s + 1));
    };

    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    // Handle city selection/deselection
    const handleCityClick = (cityName: string) => {
        const currentCities = formData.selectedCities || [];
        const newCities = currentCities.includes(cityName)
            ? currentCities.filter((c) => c !== cityName)
            : [...currentCities, cityName];

        updateFormData({ selectedCities: newCities });
    };

    const fadeAnim: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    };

    useEffect(() => {
        if (location.state?.step) setStep(location.state.step);
    }, [location.state]);

    // Handle form submission
    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.arrivalDate || !formData.departureDate) {
            toast.error("Please provide arrival and departure dates");
            return;
        }

        // If not logged in, validate guest fields
        if (!isLoggedIn) {
            if (!formData.email || !formData.firstName || !formData.lastName) {
                toast.error("Please provide your email, first name, and last name");
                return;
            }
        }

        // Convert and create itinerary
        const dto = convertFormDataToDto();
        if (!dto) return;

        const itinerary = await createItinerary(dto);

        if (itinerary) {
            toast.success("Itinerary created successfully!");
            navigate("/my-itineraries");
        }
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
                <div className="flex flex-wrap items-start justify-center mt-6 gap-2 sm:gap-4">
                    {[
                        { id: 1, title: "Personal Details" },
                        { id: 2, title: "Preferences & Requirements" },
                        { id: 3, title: "Travel Details" },
                        { id: 4, title: "Notes" },
                    ].map((item, i) => (
                        <div key={item.id} className="flex items-start">
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => setStep(item.id)}>
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 ${step === item.id
                                        ? "bg-[#B749DB] border-[#B749DB] text-white scale-110"
                                        : "border-[#B749DB] text-[#B749DB] bg-white"
                                        }`}
                                >
                                    {item.id}
                                </div>
                                <span
                                    className={`text-[12px] sm:text-[13px] mt-1 font-semibold text-center ${step === item.id ? "text-[#B749DB]" : "text-gray-600"}`}
                                >
                                    {item.title}
                                </span>
                            </div>
                            {i < 3 && (
                                <div className="w-8 sm:w-10 h-0.5 bg-[#B749DB] mx-1 sm:mx-2 mt-4 shrink"></div>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {/* -------- DESKTOP MAIN CONTENT -------- */}
            <div className="flex flex-col lg:flex-row px-4 sm:px-10 md:px-14 lg:px-20 py-10 gap-10 relative z-10">
                {/* Sidebar (only desktop visible) */}
                <div className="hidden lg:block lg:w-1/4 font-roboto-condensed">
                    <h2 className="text-[30px] font-bold mb-10 text-[#1E1E1E]">
                        Create Itinerary
                    </h2>
                    <div className="relative ml-4">
                        <div className="absolute top-[18px] left-[15px] w-0.5 bg-[#B749DB] h-[calc(100%-40px)]"></div>
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                onClick={() => setStep(i)}
                                className="relative flex items-start mb-12 cursor-pointer group"
                            >
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold text-sm z-10 transition-all duration-200 ${step === i
                                        ? "border-[#B749DB] bg-[#B749DB] text-white scale-110"
                                        : "border-[#B749DB] text-[#B749DB] bg-white group-hover:scale-105"
                                        }`}
                                >
                                    {i}
                                </div>
                                <div className="ml-4">
                                    <p
                                        className={`text-[18px] font-bold ${step === i
                                            ? "text-[#B749DB]"
                                            : "text-black group-hover:text-[#B749DB]"
                                            }`}
                                    >
                                        {["Personal Details", "Preferences", "Travel", "Notes"][i - 1]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main content (visible in all views) */}
                <div className="lg:w-3/4 bg-white border border-purple-200 rounded-2xl shadow-sm p-6 md:p-10 min-h-[70vh]">
                    <motion.div
                        variants={fadeAnim}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >

                        {/* === STEP 1 (Personal Details) === */}
                        {step === 1 && (
                            <motion.div
                                variants={fadeAnim}
                                initial="hidden"
                                animate="visible"
                                className="space-y-8"
                            >
                                {/* Grid Layout for Inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 ">
                                    {[
                                        { label: "First Name", type: "text", placeholder: "Enter first name", fieldName: "firstName" },
                                        { label: "Last Name", type: "text", placeholder: "Enter last name", fieldName: "lastName" },
                                        { label: "Date of Birth", type: "date", fieldName: "dateOfBirth" },
                                        { label: "Gender", type: "select", options: ["Choose gender", "Male", "Female"], fieldName: "gender" },
                                        { label: "Email Address", type: "email", placeholder: "Enter email", fieldName: "email" },
                                        { label: "Group Composition", type: "select", options: ["Select group type", "Solo", "Couple", "Family"], fieldName: "groupComposition" },
                                        { label: "Contact Number", type: "text", placeholder: "Enter contact number", fieldName: "contactNumber" },
                                        { label: "Country of Residence", type: "select", options: ["Select country", "Sri Lanka", "India", "UK", "USA", "Australia"], fieldName: "country" },
                                        { label: "Arrival Date", type: "date", fieldName: "arrivalDate" },
                                        { label: "Departure Date", type: "date", fieldName: "departureDate" },
                                    ].map((field: any, i: number) => (
                                        <div key={i} className="flex flex-col gap-2">
                                            <label className="text-[16px] sm:text-[18px] font-medium ">{field.label}</label>
                                            {field.type === "select" ? (
                                                <select
                                                    value={(formData as any)[field.fieldName || ""] || ""}
                                                    onChange={(e) => updateFormData({ [field.fieldName || ""]: e.target.value })}
                                                    className="w-full max-w-full sm:max-w-[400px] md:max-w-[270px] lg:max-w-[420px] h-12 border border-[#E5D4EF]  rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition">
                                                    {field.options?.map((opt: string, idx: number) => (
                                                        <option key={idx}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                    value={(formData as any)[field.fieldName || ""] || ""}
                                                    onChange={(e) => updateFormData({ [field.fieldName || ""]: e.target.value })}
                                                    className="w-full max-w-full sm:max-w-[400px] md:max-w-[270px] lg:max-w-[420px] h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Preferred Duration of Stay */}
                                <div>
                                    <p className="font-semibold mb-3 text-[16px] sm:text-[20px]">Preferred Duration of Stay</p>
                                    <div className="flex gap-6 sm:gap-6 flex-wrap">
                                        {["1 week", "2 weeks", "3 weeks", "Custom"].map((label) => (
                                            <label key={label} className="flex items-center gap-4 md:gap-5 lg:gap-5 text-[18px] md:text-[20px] lg:text-[20px]">
                                                <input type="checkbox" className="w-6 h-6 accent-[#B749DB]" />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
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
                                        value={formData.dietaryPreferences || ""}
                                        onChange={(e) => updateFormData({ dietaryPreferences: e.target.value })}
                                        className="w-full max-w-full sm:max-w-[400px] md:max-w-[570px] lg:max-w-[820px] h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                                    />
                                </div>

                                {/* Hotel Category */}
                                <div className="flex flex-col gap-1 mt-4">
                                    <label className="text-[20px] font-semibold">Hotel Category</label>
                                    <div className="flex items-center gap-2 text-[50px] mt-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span
                                                key={i}
                                                onClick={() => updateFormData({ hotelCategory: i })}
                                                className={`cursor-pointer  transition ${i <= (formData.hotelCategory || 0) ? "text-yellow-400" : "text-gray-300"}`}
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
                                            <label key={label} className="flex items-center gap-2 text-[18px] md:text-[20px] lg:text-[20px] cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-6 h-6 accent-[#B749DB]"
                                                    checked={formData.roomCategory?.includes(label) || false}
                                                    onChange={(e) => {
                                                        const current = formData.roomCategory || [];
                                                        const updated = e.target.checked
                                                            ? [...current, label]
                                                            : current.filter(c => c !== label);
                                                        updateFormData({ roomCategory: updated });
                                                    }}
                                                />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Vehicle Type */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[20px] font-medium">Vehicle Type</label>
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        {["Standard", "Semi-Luxury", "Super Luxury"].map((label) => (
                                            <label key={label} className="flex items-center gap-2 text-[18px] sm:text-[20px] cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-6 h-6 accent-[#B749DB]"
                                                    checked={formData.vehicleType?.includes(label) || false}
                                                    onChange={(e) => {
                                                        const current = formData.vehicleType || [];
                                                        const updated = e.target.checked
                                                            ? [...current, label]
                                                            : current.filter(c => c !== label);
                                                        updateFormData({ vehicleType: updated });
                                                    }}
                                                />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[20px] font-medium">Any Medical condition or special needs</label>
                                    <input
                                        placeholder="Enter medical conditions"
                                        value={formData.medicalConditions || ""}
                                        onChange={(e) => updateFormData({ medicalConditions: e.target.value })}
                                        className="w-full max-w-full sm:max-w-[400px] md:max-w-[570px] lg:max-w-[820px] h-12 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition placeholder-gray-500"
                                    />
                                </div>

                            </motion.div>
                        )}
                        {step === 3 && (
                            <>
                                {/* Sri Lanka Map */}
                                <div className="mb-8">
                                    <h3 className="text-[22px] font-semibold text-[#5B247A] mb-4">
                                        Select Destinations on Map
                                    </h3>
                                    <SriLankaMap
                                        selectedCities={formData.selectedCities || []}
                                        onCityClick={handleCityClick}
                                    />
                                    {(formData.selectedCities || []).length > 0 && (
                                        <div className="mt-4 p-4 bg-[#F8EDFC] rounded-lg border border-[#E5D4EF]">
                                            <p className="text-[16px] font-medium text-[#5B247A] mb-2">
                                                Selected Cities ({(formData.selectedCities || []).length}):
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {(formData.selectedCities || []).map((city) => (
                                                    <span
                                                        key={city}
                                                        className="px-3 py-1 bg-[#B749DB] text-white rounded-full text-sm font-medium flex items-center gap-2"
                                                    >
                                                        {city}
                                                        <button
                                                            onClick={() => handleCityClick(city)}
                                                            className="hover:bg-white/20 rounded-full p-0.5"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Destination Details Section */}
                                <div className="border-t border-[#E5D4EF] pt-6">
                                    <h3 className="text-[22px] font-semibold text-[#5B247A] mb-4">
                                        Destination Details
                                    </h3>

                                    {/* Image Grid */}
                                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentDestinations.map((d, i) => {
                                            const isSelected = (formData.selectedCities || []).includes(d.name);
                                            return (
                                                <div
                                                    key={i}
                                                    className={`relative rounded-xl overflow-hidden shadow-md group cursor-pointer transition-all ${isSelected ? "ring-4 ring-[#B749DB]" : ""
                                                        }`}
                                                    onClick={() => handleCityClick(d.name)}
                                                >
                                                    {/* Image */}
                                                    <img
                                                        src={d.images && d.images.length > 0 ? d.images[0] : colombo}
                                                        alt={d.name}
                                                        className={`w-full h-[230px] object-cover transition-all ${isSelected ? "brightness-90" : ""
                                                            }`}
                                                    />

                                                    {/* Selection Badge */}
                                                    {isSelected && (
                                                        <div className="absolute top-3 left-3 bg-[#22c55e] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                                                            <span>✓</span> Selected
                                                        </div>
                                                    )}

                                                    {/* Overlay with Text */}
                                                    <div className={`absolute bottom-0 left-0 w-full py-3 px-4 ${isSelected ? "bg-[#B749DB]" : "bg-black/60"
                                                        }`}>
                                                        <p className="text-white font-bold text-[18px]">{d.name}</p>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="absolute top-3 right-3 flex flex-col gap-3">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate("/excursion-points", {
                                                                    state: { destination: d.name, destinationId: d.id, step },
                                                                });
                                                            }}
                                                            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition"
                                                        >
                                                            <MdOutlineTravelExplore
                                                                size={20}
                                                                className="text-[#B749DB]"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate("/hotel-list", {
                                                                    state: { destination: d.name, destinationId: d.id, step },
                                                                });
                                                            }}
                                                            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition"
                                                        >
                                                            <FaHotel size={20} className="text-[#B749DB]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-6">
                                        <CustomPagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* === STEP 4 (Notes) === */}
                        {step === 4 && (
                            <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-10">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[20px] font-medium">Any Special Requirement</label>
                                    <textarea
                                        placeholder="Enter any special requests here (e.g., wheelchair access, birthday name, date and cake, Anniversary, Mobility Needs)"
                                        className="w-full max-w-full sm:max-w-[400px] md:max-w-[570px] lg:max-w-[820px] h-[200px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition resize-none placeholder:text-gray-400"
                                    ></textarea>
                                </div>
                            </motion.div>
                        )}
                        <div className="flex justify-between mt-10">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg hover:bg-[#B749DB]/10 disabled:opacity-50"
                            >
                                <FaArrowLeft className="text-[#B749DB]" /> Previous
                            </button>
                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg hover:bg-[#B749DB]/10"
                                >
                                    Next <FaArrowRight className="text-[#B749DB]" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-[#B749DB] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#8B2BB9] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
