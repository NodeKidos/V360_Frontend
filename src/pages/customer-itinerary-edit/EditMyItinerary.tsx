import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaHotel } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MdOutlineTravelExplore } from "react-icons/md";
import type { Variants } from "framer-motion";
import SriLankaMap from "../../components/home/SriLankaMap";
import { useItineraryStore } from "../../store/useItineraryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import CustomPagination from "../../components/CustomPagination";
import { Loader } from "../../components/ui/Loader";
import { CountrySelect } from "../../components/ui/CountrySelect";
import { PhoneInput } from "../../components/ui/PhoneInput";
import Sidebar from "../../components/AdminSidebar";
import TopBar from "../../components/Topbar";
import { itineraryService } from "../../services/itinerary.service";
import colombo from "../../assets/packages/family.png";
import type { Itinerary } from "../../types/itinerary.types";

export default function EditMyItinerary() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    // Always start with step 1
    const [step, setStep] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [dateWarningOpen, setDateWarningOpen] = useState(false);

    // Auth and Itinerary stores
    const { isLoggedIn } = useAuthStore();
    const {
        updateFormData,
        updateItinerary,
        formData,
        fetchDestinations,
        destinations,
        resetFormData
    } = useItineraryStore();

    const isEditable = !['quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'].includes(itinerary?.status || '');

    // CRITICAL: Update step from location.state when navigating back from hotel/excursion pages
    useEffect(() => {
        if (location.state?.step) {
            console.log('🔄 Setting step from location.state:', location.state.step, ' current step:', step);
            setStep(location.state.step);
        }
    }, [location.key]); // Trigger whenever navigation happens

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    // Load itinerary data ONLY ONCE on mount
    useEffect(() => {
        const loadItinerary = async () => {
            if (!id) {
                toast.error("No itinerary ID provided");
                navigate("/my-itineraries");
                return;
            }

            if (!isLoggedIn) {
                navigate("/login");
                return;
            }

            setLoading(true);
            try {
                const data = await itineraryService.getById(id);
                setItinerary(data);

                // Check if editable
                const readOnlyStatuses = ['quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];
                if (readOnlyStatuses.includes(data.status)) {
                    toast.warning(`This itinerary cannot be edited in its current state (${data.status}).`);
                    navigate("/my-itineraries");
                    return;
                }

                // Extract cities and destinations from days
                const cities: string[] = [];
                const destData: any = {};

                data.days?.forEach((day: any) => {
                    const destName = day.destination?.name;
                    if (destName && !cities.includes(destName)) {
                        cities.push(destName);
                    }
                    if (destName) {
                        if (!destData[destName]) {
                            destData[destName] = {
                                hotel: day.hotel || null,
                                excursions: [],
                            };
                        }
                        // Add excursions (avoid duplicates)
                        if (day.excursions) {
                            day.excursions.forEach((excursion: any) => {
                                const exists = destData[destName].excursions.some(
                                    (ex: any) => ex.id === excursion.id
                                );
                                if (!exists) {
                                    destData[destName].excursions.push(excursion);
                                }
                            });
                        }
                    }
                });

                // Pre-populate form data - ONLY if formData is empty
                // This prevents overwriting user selections when returning from hotel/excursion pages
                if (!formData.firstName) {
                    // Determine traveler type from existing data
                    let travelerType = "";
                    let numAdults = data.numberOfAdults || 0;
                    let numChildUnder5 = data.numberOfChildrenUnder5 || 0;
                    let numChild5Plus = data.numberOfChildren5Plus || 0;

                    if (numAdults || numChildUnder5 || numChild5Plus) {
                        travelerType = "Group";
                    } else if (data.numberOfParticipants === 1) {
                        travelerType = "Solo";
                    } else if (data.numberOfParticipants === 2) {
                        travelerType = "Couple";
                    } else if (data.numberOfParticipants > 2) {
                        travelerType = "Group";
                        numAdults = data.numberOfParticipants;
                    }
                    updateFormData({
                        firstName: data.lead?.user?.firstName || "",
                        lastName: data.lead?.user?.lastName || "",
                        email: data.lead?.user?.email || "",
                        contactNumber: data.lead?.user?.phone || "",
                        dateOfBirth: data.lead?.dateOfBirth?.split('T')[0] || "",
                        gender: data.lead?.gender || "",
                        travelerType: travelerType,
                        numberOfAdults: numAdults,
                        numberOfChildrenUnder5: numChildUnder5,
                        numberOfChildren5Plus: numChild5Plus,
                        country: data.lead?.nationality || "",
                        arrivalDate: data.startDate?.split('T')[0] || "",
                        departureDate: data.endDate?.split('T')[0] || "",
                        duration: data.metadata?.duration || "",

                        dietaryPreferences: data.lead?.dietaryRequirements || "",
                        medicalConditions: data.lead?.medicalNotes || "",
                        allergies: data.lead?.allergies || "",
                        specialConditions: data.lead?.specialConditions || "",
                        hotelCategory: data.metadata?.hotelCategory || 0,
                        roomCategory: data.metadata?.roomCategory || [],
                        vehicleType: data.metadata?.vehicleType || [],

                        specialRequirements: data.specialRequests || "",

                        selectedCities: cities,
                        selectedDestinations: destData,
                    });
                }

            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to load itinerary");
                navigate("/my-itineraries");
            } finally {
                setLoading(false);
            }
        };

        loadItinerary();
        // Only run on mount - id and isLoggedIn are stable
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isLoggedIn]);

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
        setStep((s: number) => Math.min(4, s + 1));
    };

    const prevStep = () => setStep((s: number) => Math.max(1, s - 1));

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

    // Convert form data to days format
    const convertToDays = () => {
        if (!formData.arrivalDate || !formData.departureDate) return [];

        const start = new Date(formData.arrivalDate);
        const end = new Date(formData.departureDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const dateDiffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const selectedCityNames = formData.selectedCities || [];

        // CRITICAL FIX: Use MAXIMUM of date range OR number of destinations
        // This ensures all destinations are included even if dates are the same
        const totalDays = Math.max(dateDiffDays, selectedCityNames.length);

        const daysPerCity = selectedCityNames.length > 0 ? Math.ceil(totalDays / selectedCityNames.length) : totalDays;

        console.log('🗓️ Date range days:', dateDiffDays, '| Destinations:', selectedCityNames.length, '| Using:', totalDays);

        const days: any[] = [];

        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);

            let destinationId = undefined;
            let hotelId = undefined;
            let excursionIds: string[] = [];

            if (selectedCityNames.length > 0) {
                const cityIndex = Math.min(Math.floor(i / daysPerCity), selectedCityNames.length - 1);
                const cityName = selectedCityNames[cityIndex];

                const destination = destinations.find(d => d.name === cityName);
                if (destination) {
                    destinationId = destination.id;

                    const selectedDestData = formData.selectedDestinations?.[cityName];
                    if (selectedDestData?.hotel) {
                        hotelId = selectedDestData.hotel.id;
                    }

                    if (selectedDestData?.excursions && selectedDestData.excursions.length > 0) {
                        const dayWithinCity = i - (cityIndex * daysPerCity);
                        const excursionsPerDay = Math.ceil(selectedDestData.excursions.length / daysPerCity);
                        const startIdx = dayWithinCity * excursionsPerDay;
                        const endIdx = Math.min(startIdx + excursionsPerDay, selectedDestData.excursions.length);

                        excursionIds = selectedDestData.excursions
                            .slice(startIdx, endIdx)
                            .map((ex: any) => ex.id)
                            .filter(Boolean);
                    }
                }
            }

            days.push({
                dayNumber: i + 1,
                date: currentDate.toISOString().split('T')[0],
                title: `Day ${i + 1}`,
                description: "",
                destinationId,
                hotelId,
                excursionIds
            });
        }

        return days;
    };

    // Handle form submission
    const handleUpdate = async (skipWarning = false) => {
        if (!id) return;

        // Validate required fields
        if (!formData.arrivalDate || !formData.departureDate) {
            toast.error("Please provide arrival and departure dates");
            return;
        }

        // Check if destinations > days and warn user (unless they already confirmed)
        const start = new Date(formData.arrivalDate);
        const end = new Date(formData.departureDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const dateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const destinationCount = (formData.selectedCities || []).length;

        if (!skipWarning && destinationCount > dateDays) {
            setDateWarningOpen(true);
            return;
        }

        const days = convertToDays();

        // Calculate total number of participants based on traveler type
        let totalParticipants = 1;
        if (formData.travelerType === "Solo") {
            totalParticipants = 1;
        } else if (formData.travelerType === "Couple") {
            totalParticipants = 2;
        } else if (formData.travelerType === "Group") {
            totalParticipants = (formData.numberOfAdults || 0) + (formData.numberOfChildrenUnder5 || 0) + (formData.numberOfChildren5Plus || 0) || 1;
        } else {
            totalParticipants = formData.numberOfParticipants || 1;
        }

        const updateData = {
            startDate: formData.arrivalDate,
            endDate: formData.departureDate,
            numberOfParticipants: totalParticipants,
            numberOfAdults: formData.numberOfAdults,
            numberOfChildrenUnder5: formData.numberOfChildrenUnder5,
            numberOfChildren5Plus: formData.numberOfChildren5Plus,
            specialRequests: formData.specialRequirements,
            metadata: {
                groupComposition: formData.groupComposition, // Keep for backward compatibility if needed
                hotelCategory: formData.hotelCategory,
                roomCategory: formData.roomCategory,
                vehicleType: formData.vehicleType,
                duration: formData.duration,
            },
            days,
        };

        console.log('📤 Sending update data:', JSON.stringify(updateData, null, 2));

        const success = await updateItinerary(id, updateData);

        if (success) {
            toast.success("Itinerary updated successfully!");
            resetFormData();
            navigate("/my-itineraries");
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex overflow-hidden bg-gray-50">
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    isMobile={isMobile}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />
                        <div className="flex justify-center items-center h-96">
                            <Loader message="Loading itinerary..." size={150} />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins">Edit Itinerary</h1>
                            <p className="text-gray-600 mt-1">{itinerary?.itineraryNumber}</p>
                        </div>
                        <button
                            onClick={() => navigate("/my-itineraries")}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                        >
                            <FaArrowLeft className="text-sm sm:text-base" /> Cancel
                        </button>
                    </div>

                    {/* Step Indicator - Mobile */}
                    <div className="block lg:hidden mb-6">
                        <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-4">
                            {[
                                { id: 1, title: "Personal Details" },
                                { id: 2, title: "Preferences" },
                                { id: 3, title: "Travel" },
                                { id: 4, title: "Notes" },
                            ].map((item, i) => (
                                <div key={item.id} className="flex items-start">
                                    <div className="flex flex-col items-center cursor-pointer" onClick={() => setStep(item.id)}>
                                        <div
                                            className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 ${step === item.id
                                                ? "bg-[#B749DB] border-[#B749DB] text-white scale-110"
                                                : "border-[#B749DB] text-[#B749DB] bg-white"
                                                }`}
                                        >
                                            {item.id}
                                        </div>
                                        <span
                                            className={`text-[12px] sm:text-[13px] mt-1 font-semibold text-center ${step === item.id ? "text-[#B749DB]" : "text-gray-600"
                                                }`}
                                        >
                                            {item.title}
                                        </span>
                                    </div>
                                    {i < 3 && <div className="w-8 sm:w-10 h-0.5 bg-[#B749DB] mx-1 sm:mx-2 mt-4 shrink"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar (Desktop only) */}
                        <div className="hidden lg:block lg:w-1/4">
                            <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-6 sticky top-6">
                                <h2 className="text-2xl font-bold mb-6 text-[#1E1E1E]">Steps</h2>
                                <div className="relative ml-4">
                                    <div className="absolute top-5 left-4 w-0.5 bg-[#B749DB] h-[calc(100%-50px)]"></div>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            onClick={() => setStep(i)}
                                            className="relative flex items-center mb-10 last:mb-0 cursor-pointer group"
                                        >
                                            <div
                                                className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border-2 font-semibold text-sm z-10 transition-all duration-200 ${step === i
                                                    ? "border-[#B749DB] bg-[#B749DB] text-white scale-110 shadow-lg"
                                                    : "border-[#B749DB] text-[#B749DB] bg-white group-hover:scale-105 group-hover:shadow-md"
                                                    }`}
                                            >
                                                {i}
                                            </div>
                                            <div className="ml-4">
                                                <p
                                                    className={`text-lg font-bold ${step === i ? "text-[#B749DB]" : "text-black group-hover:text-[#B749DB]"
                                                        }`}
                                                >
                                                    {["Personal Details", "Preferences", "Travel", "Notes"][i - 1]}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="lg:w-3/4 bg-white border border-purple-200 rounded-2xl shadow-sm p-4 sm:p-6 md:p-10 min-h-[70vh]">
                            <motion.div
                                variants={fadeAnim}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                {/* STEP 1 - Personal Details */}
                                {step === 1 && (
                                    <motion.div
                                        variants={fadeAnim}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                            {[
                                                { label: "First Name", type: "text", placeholder: "Enter first name", fieldName: "firstName" },
                                                { label: "Last Name", type: "text", placeholder: "Enter last name", fieldName: "lastName" },
                                                { label: "Date of Birth", type: "date", fieldName: "dateOfBirth" },
                                                {
                                                    label: "Gender",
                                                    type: "select",
                                                    options: ["Choose gender", "male", "female", "other"],
                                                    fieldName: "gender",
                                                },
                                                { label: "Email Address", type: "email", placeholder: "Enter email", fieldName: "email" },
                                                {
                                                    label: "Contact Number",
                                                    type: "phone",
                                                    fieldName: "contactNumber",
                                                },
                                                {
                                                    label: "Country of Residence",
                                                    type: "country",
                                                    fieldName: "country",
                                                },
                                                { label: "Arrival Date", type: "date", fieldName: "arrivalDate" },
                                                { label: "Departure Date", type: "date", fieldName: "departureDate" },
                                            ].map((field: any, i: number) => (
                                                <div key={i} className="flex flex-col gap-2">
                                                    <label className="text-[16px] sm:text-[18px] font-medium">{field.label}</label>
                                                    {field.type === "phone" ? (
                                                        <PhoneInput
                                                            value={(formData as any)[field.fieldName || ""] || ""}
                                                            onChange={(value) =>
                                                                updateFormData({ [field.fieldName || ""]: value })
                                                            }
                                                        />
                                                    ) : field.type === "country" ? (
                                                        <CountrySelect
                                                            value={(formData as any)[field.fieldName || ""] || ""}
                                                            onChange={(e) =>
                                                                updateFormData({ [field.fieldName || ""]: e.target.value })
                                                            }
                                                            className="w-full h-12 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                                                        />
                                                    ) : field.type === "select" ? (
                                                        <select
                                                            value={(formData as any)[field.fieldName || ""] || ""}
                                                            onChange={(e) =>
                                                                updateFormData({ [field.fieldName || ""]: e.target.value })
                                                            }
                                                            className="w-full h-12 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition">
                                                            {field.options?.map((opt: string, idx: number) => (
                                                                <option key={idx}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type={field.type}
                                                            placeholder={field.placeholder}
                                                            value={(formData as any)[field.fieldName || ""] || ""}
                                                            onChange={(e) =>
                                                                updateFormData({ [field.fieldName || ""]: e.target.value })
                                                            }
                                                            max={field.fieldName === 'dateOfBirth' ? new Date().toISOString().split('T')[0] : undefined}
                                                            className="w-full h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-2">
                                            {/* Traveler Type */}
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-[16px] sm:text-[18px] font-medium">Traveler Type</label>
                                                <select
                                                    value={formData.travelerType || ""}
                                                    onChange={(e) => updateFormData({ travelerType: e.target.value })}
                                                    disabled={!isEditable}
                                                    className="w-full h-12 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <option value="">Select traveler type</option>
                                                    <option value="Solo">Solo</option>
                                                    <option value="Couple">Couple</option>
                                                    <option value="Group">Group</option>
                                                </select>
                                            </div>

                                            {/* Total Participants Info */}
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-[16px] sm:text-[18px] font-medium">Total Participants</label>
                                                <div className="h-12 border border-[#E5D4EF] bg-gray-50 rounded-lg px-4 flex items-center text-[#5B247A] font-bold">
                                                    {formData.travelerType === "Solo" ? 1 :
                                                        formData.travelerType === "Couple" ? 2 :
                                                            ((formData.numberOfAdults || 0) + (formData.numberOfChildrenUnder5 || 0) + (formData.numberOfChildren5Plus || 0)) || formData.numberOfParticipants || 1}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Group Composition Section - Only show for Groups */}
                                        {formData.travelerType === "Group" && (
                                            <div>
                                                <p className="font-semibold mb-3 text-[16px] sm:text-[20px]">Group Composition</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[16px] sm:text-[18px] font-medium">Number of Adults</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter number"
                                                            value={formData.numberOfAdults || ""}
                                                            onChange={(e) => updateFormData({ numberOfAdults: parseInt(e.target.value) || 0 })}
                                                            disabled={!isEditable}
                                                            className="w-full h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[16px] sm:text-[18px] font-medium">Children (Under 5)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter number"
                                                            value={formData.numberOfChildrenUnder5 || ""}
                                                            onChange={(e) => updateFormData({ numberOfChildrenUnder5: parseInt(e.target.value) || 0 })}
                                                            disabled={!isEditable}
                                                            className="w-full h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[16px] sm:text-[18px] font-medium">Children (5 and above)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter number"
                                                            value={formData.numberOfChildren5Plus || ""}
                                                            onChange={(e) => updateFormData({ numberOfChildren5Plus: parseInt(e.target.value) || 0 })}
                                                            disabled={!isEditable}
                                                            className="w-full h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2"><em>Note: Children aged 5+ are considered adults in most Sri Lankan hotels</em></p>
                                            </div>
                                        )}

                                        {/* Duration */}
                                        <div>
                                            <p className="font-semibold mb-3 text-[16px] sm:text-[20px]">Preferred Duration of Stay</p>
                                            <div className="flex gap-6 flex-wrap">
                                                {["1 week", "2 weeks", "3 weeks", "Custom"].map((label) => (
                                                    <label key={label} className="flex items-center gap-4 text-[18px] md:text-[20px]">
                                                        <input
                                                            type="radio"
                                                            name="duration"
                                                            className="w-6 h-6 accent-[#B749DB]"
                                                            checked={formData.duration === label}
                                                            onChange={() => updateFormData({ duration: label })}
                                                        />
                                                        {label}
                                                    </label>
                                                ))}
                                            </div>

                                            {formData.duration === "Custom" && (
                                                <div className="mt-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter custom duration (e.g., 10 days, 5 weeks)"
                                                        value={formData.customDuration || ""}
                                                        onChange={(e) => updateFormData({ customDuration: e.target.value })}
                                                        className="w-full max-w-[620px] h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2 - Preferences */}
                                {step === 2 && (
                                    <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[20px] font-medium">Dietary Preferences</label>
                                            <input
                                                placeholder="Enter dietary preferences"
                                                value={formData.dietaryPreferences || ""}
                                                onChange={(e) => updateFormData({ dietaryPreferences: e.target.value })}
                                                className="w-full max-w-[820px] h-12 placeholder-gray-500 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition"
                                            />
                                        </div>

                                        {/* Hotel Category */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[20px] font-semibold">Hotel Category</label>
                                            <div className="flex items-center gap-2 text-[50px] mt-2">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <span
                                                        key={i}
                                                        onClick={() => updateFormData({ hotelCategory: i })}
                                                        className={`cursor-pointer transition ${i <= (formData.hotelCategory || 0) ? "text-yellow-400" : "text-gray-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Room Category */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[20px] font-medium">Room Category</label>
                                            <div className="flex gap-6">
                                                {["Double", "Single", "Triple"].map((label) => (
                                                    <label key={label} className="flex items-center gap-2 text-[18px] md:text-[20px] cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="w-6 h-6 accent-[#B749DB]"
                                                            checked={formData.roomCategory?.includes(label) || false}
                                                            onChange={(e) => {
                                                                const current = formData.roomCategory || [];
                                                                const updated = e.target.checked
                                                                    ? [...current, label]
                                                                    : current.filter((c) => c !== label);
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
                                                                    : current.filter((c) => c !== label);
                                                                updateFormData({ vehicleType: updated });
                                                            }}
                                                        />
                                                        {label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-[20px] font-medium">Medical Conditions or Special Needs</label>
                                            <input
                                                placeholder="Enter medical conditions"
                                                value={formData.medicalConditions || ""}
                                                onChange={(e) => updateFormData({ medicalConditions: e.target.value })}
                                                className="w-full max-w-[820px] h-12 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition placeholder-gray-500"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-[20px] font-medium">Allergies</label>
                                            <input
                                                placeholder="Enter any allergies"
                                                value={formData.allergies || ""}
                                                onChange={(e) => updateFormData({ allergies: e.target.value })}
                                                className="w-full max-w-[820px] h-12 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition placeholder-gray-500"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-[20px] font-medium">Special Conditions</label>
                                            <input
                                                placeholder="Enter any special conditions"
                                                value={formData.specialConditions || ""}
                                                onChange={(e) => updateFormData({ specialConditions: e.target.value })}
                                                className="w-full max-w-[820px] h-12 border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition placeholder-gray-500"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3 - Travel Details */}
                                {step === 3 && (
                                    <>
                                        {/* Map */}
                                        <div className="mb-8">
                                            <h3 className="text-[22px] font-semibold text-[#5B247A] mb-4">Select Destinations on Map</h3>
                                            <SriLankaMap
                                                selectedCities={formData.selectedCities || []}
                                                onCityClick={handleCityClick}
                                                destinations={destinations}
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

                                        {/* Destination Details */}
                                        <div className="border-t border-[#E5D4EF] pt-6">
                                            <h3 className="text-[22px] font-semibold text-[#5B247A] mb-4">Destination Details</h3>

                                            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {currentDestinations.map((d, i) => {
                                                    const isSelected = (formData.selectedCities || []).includes(d.name);
                                                    const destinationData = formData.selectedDestinations?.[d.name];
                                                    const hasHotel = !!destinationData?.hotel;
                                                    const excursionCount = destinationData?.excursions?.length || 0;

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`relative rounded-xl overflow-hidden shadow-md group cursor-pointer transition-all ${isSelected ? "ring-4 ring-[#B749DB]" : ""
                                                                }`}
                                                            onClick={() => handleCityClick(d.name)}
                                                        >
                                                            <img
                                                                src={d.images && d.images.length > 0 ? d.images[0] : colombo}
                                                                alt={d.name}
                                                                className={`w-full h-[230px] object-cover transition-all ${isSelected ? "brightness-90" : ""
                                                                    }`}
                                                            />

                                                            {isSelected && (
                                                                <div className="absolute top-3 left-3 bg-[#22c55e] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                                                                    <span>✓</span> Selected
                                                                </div>
                                                            )}

                                                            <div
                                                                className={`absolute bottom-0 left-0 w-full py-3 px-4 ${isSelected ? "bg-[#B749DB]" : "bg-black/60"
                                                                    }`}
                                                            >
                                                                <p className="text-white font-bold text-[18px]">{d.name}</p>
                                                            </div>

                                                            <div className="absolute top-3 right-3 flex flex-col gap-3">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate("/excursion-points", {
                                                                            state: {
                                                                                destination: d.name,
                                                                                destinationId: d.id,
                                                                                step: 3,
                                                                                fromCustomerEdit: true,
                                                                                itineraryId: id
                                                                            },
                                                                        });
                                                                    }}
                                                                    className={`relative p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition ${isSelected && excursionCount === 0 ? "animate-pulse ring-2 ring-yellow-400" : ""
                                                                        }`}
                                                                    title={
                                                                        excursionCount > 0
                                                                            ? `${excursionCount} excursion${excursionCount > 1 ? "s" : ""} selected`
                                                                            : "Select excursions"
                                                                    }
                                                                >
                                                                    <MdOutlineTravelExplore
                                                                        size={20}
                                                                        className={excursionCount > 0 ? "text-green-600" : "text-[#B749DB]"}
                                                                    />
                                                                    {excursionCount > 0 && (
                                                                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                                            {excursionCount}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate("/hotel-list", {
                                                                            state: {
                                                                                destination: d.name,
                                                                                destinationId: d.id,
                                                                                step: 3,
                                                                                fromCustomerEdit: true,
                                                                                itineraryId: id
                                                                            },
                                                                        });
                                                                    }}
                                                                    className={`relative p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition ${isSelected && !hasHotel ? "animate-pulse ring-2 ring-yellow-400" : ""
                                                                        }`}
                                                                    title={hasHotel ? "Hotel selected" : "Select a hotel"}
                                                                >
                                                                    <FaHotel size={20} className={hasHotel ? "text-green-600" : "text-[#B749DB]"} />
                                                                    {hasHotel && (
                                                                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                                            ✓
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

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

                                {/* STEP 4 - Notes */}
                                {step === 4 && (
                                    <motion.div variants={fadeAnim} initial="hidden" animate="visible" className="space-y-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[20px] font-medium">Any Special Requirements</label>
                                            <textarea
                                                placeholder="Enter any special requests (e.g., wheelchair access, birthday cake, Anniversary)"
                                                value={formData.specialRequirements || ""}
                                                onChange={(e) => updateFormData({ specialRequirements: e.target.value })}
                                                className="w-full max-w-[820px] h-[200px] border border-[#E5D4EF] rounded-lg px-4 py-2 outline-none focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition resize-none placeholder:text-gray-400"
                                            ></textarea>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Navigation Buttons */}
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
                                            onClick={() => handleUpdate()}
                                            className="flex items-center gap-2 bg-[#B749DB] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#8B2BB9]"
                                        >
                                            Save Changes
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Date-Destination Mismatch Warning Dialog */}
                {dateWarningOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setDateWarningOpen(false)}
                        ></div>

                        <div className="relative z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Date Range Too Short</h3>

                                <p className="text-gray-600 mb-2">
                                    You've selected <strong>{(formData.selectedCities || []).length} destinations</strong>, but your trip is only <strong>
                                        {(() => {
                                            const start = new Date(formData.arrivalDate || '');
                                            const end = new Date(formData.departureDate || '');
                                            const diffTime = Math.abs(end.getTime() - start.getTime());
                                            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                        })()} day(s)</strong> long.
                                </p>
                                <p className="text-gray-500 text-sm mb-6">
                                    Please extend your departure date, or proceed anyway for admin review.
                                </p>

                                <div className="flex flex-col gap-3 w-full">
                                    <button
                                        onClick={() => {
                                            setDateWarningOpen(false);
                                            setStep(1);
                                        }}
                                        className="w-full px-4 py-3 bg-[#B749DB] text-white rounded-lg font-semibold hover:bg-[#8B2BB9] transition-colors"
                                    >
                                        Go Back & Adjust Dates
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDateWarningOpen(false);
                                            handleUpdate(true);
                                        }}
                                        className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Proceed Anyway
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
