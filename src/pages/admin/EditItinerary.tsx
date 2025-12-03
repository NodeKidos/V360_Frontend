import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/AdminSidebar";
import TopBar from "../../components/Topbar";
import { FaArrowLeft, FaHotel, FaTrash } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { toast } from "react-toastify";
import { itineraryService } from "../../services/itinerary.service";
import type { Itinerary, ItineraryStatus } from "../../types/itinerary.types";
import SriLankaMap from "../../components/home/SriLankaMap";
import { useItineraryStore } from "../../store/useItineraryStore";
import colombo from "../../assets/packages/family.png";

const EditItinerary = () => {
  const { itineraryId } = useParams<{ itineraryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchDestinations, destinations, formData: storeFormData, updateFormData: updateStoreFormData } = useItineraryStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "destinations" | "quote">(
    (location.state as any)?.returnTab || "details"
  );

  // Form data
  const [formData, setFormData] = useState({
    // Trip Details
    startDate: "",
    endDate: "",
    numberOfParticipants: 1,
    groupComposition: "",
    duration: "",

    // Preferences
    dietaryPreferences: "",
    medicalConditions: "",
    hotelCategory: 0,
    roomCategory: [] as string[],
    vehicleType: [] as string[],

    // Requests & Notes
    specialRequests: "",
    notes: "",

    // Destination Selection
    selectedCities: [] as string[],
    selectedDestinations: {} as any,

    // Days
    days: [] as any[],

    // Admin Fields
    status: "" as ItineraryStatus,
  });

  // Quote form data
  const [quoteData, setQuoteData] = useState({
    totalCost: 0,
    accommodationCost: 0,
    excursionsCost: 0,
    transportCost: 0,
    guideCost: 0,
    otherCosts: 0,
    taxes: 0,
    serviceCharge: 0,
    discount: 0,
    discountReason: "",
    finalPrice: 0,
    termsAndConditions: "",
    internalNotes: "",
    validUntil: "",
  });

  useEffect(() => {
    fetchDestinations();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load itinerary data
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itineraryId) {
        toast.error("No itinerary ID provided");
        navigate("/itineraries");
        return;
      }

      setLoading(true);
      try {
        const data = await itineraryService.getById(itineraryId);
        setItinerary(data);

        // Extract selected cities and destinations from days
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
                hotel: day.hotel,
                excursions: [],
              };
            }
            if (day.excursions) {
              destData[destName].excursions.push(...day.excursions);
            }
          }
        });

        // Check if coming back from hotel/excursion selection (returnTab is set)
        const isReturningFromSelection = (location.state as any)?.returnTab;

        // If returning from selection, prefer store selections over fetched data
        let finalSelectedCities = cities;
        let finalSelectedDestinations = destData;

        if (isReturningFromSelection) {
          // Preserve selected cities from store (includes newly added destinations)
          if (storeFormData.selectedCities && storeFormData.selectedCities.length > 0) {
            // Merge: keep all cities from store + any from fetched data
            const allCities = new Set([...cities, ...storeFormData.selectedCities]);
            finalSelectedCities = Array.from(allCities);
          }

          // Preserve selected destinations from store
          if (storeFormData.selectedDestinations) {
            // Merge store selections with fetched data
            // Store selections take priority (they're newer)
            finalSelectedDestinations = {
              ...destData,
              ...storeFormData.selectedDestinations
            };

            // For each destination in store, merge with fetched data
            Object.keys(storeFormData.selectedDestinations).forEach(destName => {
              const storeSelection = storeFormData.selectedDestinations?.[destName];
              const fetchedSelection = destData[destName];

              if (storeSelection && fetchedSelection) {
                // Merge: prefer store's hotel and excursions if they exist
                finalSelectedDestinations[destName] = {
                  hotel: storeSelection.hotel || fetchedSelection.hotel,
                  excursions: storeSelection.excursions?.length > 0
                    ? storeSelection.excursions
                    : fetchedSelection.excursions
                };
              } else if (storeSelection) {
                // Only in store (newly added)
                finalSelectedDestinations[destName] = storeSelection;
              }
            });
          }
        }

        // Pre-populate form
        setFormData({
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          numberOfParticipants: data.numberOfParticipants || 1,
          groupComposition: data.metadata?.groupComposition || "",
          duration: data.metadata?.duration || "",

          dietaryPreferences: data.lead?.dietaryPreferences || "",
          medicalConditions: data.lead?.medicalConditions || "",
          hotelCategory: data.metadata?.hotelCategory || 0,
          roomCategory: data.metadata?.roomCategory || [],
          vehicleType: data.metadata?.vehicleType || [],

          specialRequests: data.specialRequests || "",
          notes: data.notes || "",

          selectedCities: finalSelectedCities,
          selectedDestinations: finalSelectedDestinations,
          days: data.days || [],

          status: data.status,
        });

        // Sync with itinerary store so hotels/excursions show as selected
        // Use finalSelectedCities and finalSelectedDestinations to preserve selections
        updateStoreFormData({
          selectedCities: finalSelectedCities,
          selectedDestinations: finalSelectedDestinations,
        });

        // Pre-populate quote data if exists
        if (data.quote) {
          setQuoteData({
            totalCost: data.quote.totalCost || 0,
            accommodationCost: data.quote.breakdown?.accommodationCost || 0,
            excursionsCost: data.quote.breakdown?.excursionsCost || 0,
            transportCost: data.quote.breakdown?.transportCost || 0,
            guideCost: data.quote.breakdown?.guideCost || 0,
            otherCosts: data.quote.breakdown?.otherCosts || 0,
            taxes: data.quote.breakdown?.taxes || 0,
            serviceCharge: data.quote.breakdown?.serviceCharge || 0,
            discount: data.quote.discount || 0,
            discountReason: data.quote.discountReason || "",
            finalPrice: data.quote.finalPrice || 0,
            termsAndConditions: data.quote.termsAndConditions || "",
            internalNotes: data.quote.internalNotes || "",
            validUntil: data.quote.validUntil || "",
          });
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch itinerary");
        navigate("/itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId, navigate]);

  // Calculate total cost and final price
  useEffect(() => {
    const total =
      quoteData.accommodationCost +
      quoteData.excursionsCost +
      quoteData.transportCost +
      quoteData.guideCost +
      quoteData.otherCosts +
      quoteData.taxes +
      quoteData.serviceCharge;

    const final = total - (quoteData.discount || 0);

    setQuoteData(prev => ({
      ...prev,
      totalCost: total,
      finalPrice: final,
    }));
  }, [
    quoteData.accommodationCost,
    quoteData.excursionsCost,
    quoteData.transportCost,
    quoteData.guideCost,
    quoteData.otherCosts,
    quoteData.taxes,
    quoteData.serviceCharge,
    quoteData.discount,
  ]);

  const handleCityClick = (cityName: string) => {
    const currentCities = formData.selectedCities || [];
    const isRemoving = currentCities.includes(cityName);
    const newCities = isRemoving
      ? currentCities.filter((c) => c !== cityName)
      : [...currentCities, cityName];

    // If removing a city, also remove its hotel/excursion selections
    let updatedSelectedDestinations = { ...formData.selectedDestinations };
    if (isRemoving && updatedSelectedDestinations[cityName]) {
      delete updatedSelectedDestinations[cityName];
    }

    setFormData({
      ...formData,
      selectedCities: newCities,
      selectedDestinations: updatedSelectedDestinations
    });

    // Also update the store so the selection persists when navigating
    updateStoreFormData({
      selectedCities: newCities,
      selectedDestinations: updatedSelectedDestinations
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        numberOfParticipants: formData.numberOfParticipants,
        specialRequests: formData.specialRequests,
        notes: formData.notes,
        metadata: {
          groupComposition: formData.groupComposition,
          hotelCategory: formData.hotelCategory,
          roomCategory: formData.roomCategory,
          vehicleType: formData.vehicleType,
          duration: formData.duration,
        },
        // Include days if modified
        days: formData.days,
      };

      await itineraryService.update(itineraryId!, updateData);
      toast.success("Itinerary updated successfully!");
      navigate(`/itinerary/${itineraryId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update itinerary");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateQuote = async () => {
    setSaving(true);
    try {
      const quoteDto = {
        totalCost: quoteData.totalCost,
        breakdown: {
          accommodationCost: quoteData.accommodationCost,
          excursionsCost: quoteData.excursionsCost,
          transportCost: quoteData.transportCost,
          guideCost: quoteData.guideCost,
          otherCosts: quoteData.otherCosts,
          taxes: quoteData.taxes,
          serviceCharge: quoteData.serviceCharge,
        },
        discount: quoteData.discount || undefined,
        discountReason: quoteData.discountReason || undefined,
        finalPrice: quoteData.finalPrice,
        termsAndConditions: quoteData.termsAndConditions || undefined,
        internalNotes: quoteData.internalNotes || undefined,
        validUntil: quoteData.validUntil || undefined,
      };

      await itineraryService.createQuote(itineraryId!, quoteDto);
      toast.success("Quote created successfully!");

      // Refresh itinerary data
      const refreshedData = await itineraryService.getById(itineraryId!);
      setItinerary(refreshedData);
      setFormData(prev => ({ ...prev, status: refreshedData.status }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create quote");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: ItineraryStatus) => {
    // Status changes should be done through specific actions
    // This is just for informational purposes
    toast.info("Use quote/accept/reject actions to change status properly");
  };

  const fadeAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const handleNavigateToHotels = (destinationName: string) => {
    const destination = destinations.find(d => d.name === destinationName);
    if (destination) {
      navigate("/hotel-list", {
        state: {
          destination: destinationName,
          destinationId: destination.id,
          fromEdit: true,
          itineraryId,
          returnTab: "destinations" // Remember to return to destinations tab
        },
      });
    }
  };

  const handleNavigateToExcursions = (destinationName: string) => {
    const destination = destinations.find(d => d.name === destinationName);
    if (destination) {
      navigate("/excursion-points", {
        state: {
          destination: destinationName,
          destinationId: destination.id,
          fromEdit: true,
          itineraryId,
          returnTab: "destinations" // Remember to return to destinations tab
        },
      });
    }
  };

  const handleRemoveDay = async (dayId: string) => {
    if (window.confirm("Are you sure you want to remove this day?")) {
      const updatedDays = formData.days.filter(day => day.id !== dayId);
      setFormData({ ...formData, days: updatedDays });
      toast.success("Day removed. Don't forget to save changes!");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-[#5B247A]">
                Edit Itinerary
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {itinerary?.itineraryNumber}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  formData.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  formData.status === 'pending_quote' ? 'bg-yellow-100 text-yellow-700' :
                  formData.status === 'quoted' ? 'bg-blue-100 text-blue-700' :
                  formData.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  formData.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {formData.status?.toUpperCase().replace('_', ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/itinerary/${itineraryId}`)}
              className="text-[#B749DB] hover:text-[#9f37c9] font-poppins flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B749DB]"></div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "details"
                      ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Trip Details
                </button>
                <button
                  onClick={() => setActiveTab("destinations")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "destinations"
                      ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Destinations & Days
                </button>
                <button
                  onClick={() => setActiveTab("quote")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "quote"
                      ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Quote & Pricing
                </button>
              </div>

              <motion.div
                variants={fadeAnim}
                initial="hidden"
                animate="visible"
                className="bg-white border border-purple-200 rounded-2xl shadow-sm p-6 md:p-8"
              >
                {/* TRIP DETAILS TAB */}
                {activeTab === "details" && (
                  <div className="space-y-8">
                    {/* Customer Information (Read-only) */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Customer Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <p className="text-gray-900">
                            {itinerary?.lead?.firstName} {itinerary?.lead?.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{itinerary?.lead?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <p className="text-gray-900">{itinerary?.lead?.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <p className="text-gray-900">{itinerary?.lead?.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Trip Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Participants
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.numberOfParticipants}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                numberOfParticipants: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Group Composition
                          </label>
                          <select
                            value={formData.groupComposition}
                            onChange={(e) =>
                              setFormData({ ...formData, groupComposition: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                          >
                            <option value="">Select group type</option>
                            <option value="Solo">Solo</option>
                            <option value="Couple">Couple</option>
                            <option value="Family">Family</option>
                            <option value="Group">Group</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Dates cannot be changed after creation
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={formData.duration}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Preferences
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hotel Category
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <span
                                key={i}
                                onClick={() =>
                                  setFormData({ ...formData, hotelCategory: i })
                                }
                                className={`cursor-pointer text-3xl transition ${
                                  i <= formData.hotelCategory
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dietary Preferences
                          </label>
                          <input
                            type="text"
                            value={formData.dietaryPreferences}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Customer information (read-only)
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medical Conditions
                          </label>
                          <input
                            type="text"
                            value={formData.medicalConditions}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Customer information (read-only)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) =>
                          setFormData({ ...formData, specialRequests: e.target.value })
                        }
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                      />
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes (Internal)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                        placeholder="Internal notes for admin use only"
                      />
                    </div>
                  </div>
                )}

                {/* DESTINATIONS TAB */}
                {activeTab === "destinations" && (
                  <div className="space-y-8">
                    {/* Map Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Destination Selection
                      </h2>
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

                    {/* Destination Grid */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Manage Hotels & Excursions
                      </h2>
                      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations
                          .filter((d) => formData.selectedCities?.includes(d.name))
                          .map((d, i) => {
                            const destinationData = formData.selectedDestinations?.[d.name];
                            const hasHotel = !!destinationData?.hotel;
                            const excursionCount = destinationData?.excursions?.length || 0;

                            return (
                              <div
                                key={i}
                                className="relative rounded-xl overflow-hidden shadow-md ring-4 ring-[#B749DB]"
                              >
                                <img
                                  src={d.images && d.images.length > 0 ? d.images[0] : colombo}
                                  alt={d.name}
                                  className="w-full h-[230px] object-cover brightness-90"
                                />

                                <div className="absolute bottom-0 left-0 w-full py-3 px-4 bg-[#B749DB]">
                                  <p className="text-white font-bold text-[18px]">{d.name}</p>
                                </div>

                                <div className="absolute top-3 right-3 flex flex-col gap-3">
                                  <button
                                    onClick={() => handleNavigateToExcursions(d.name)}
                                    className="relative p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition"
                                    title={excursionCount > 0 ? `${excursionCount} excursion${excursionCount > 1 ? 's' : ''} selected` : 'Select excursions'}
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
                                    onClick={() => handleNavigateToHotels(d.name)}
                                    className="relative p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition"
                                    title={hasHotel ? 'Hotel selected' : 'Select a hotel'}
                                  >
                                    <FaHotel
                                      size={20}
                                      className={hasHotel ? "text-green-600" : "text-[#B749DB]"}
                                    />
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
                    </div>

                    {/* Day-by-Day Itinerary */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Day-by-Day Itinerary
                      </h2>
                      <div className="space-y-4">
                        {formData.days.map((day, index) => (
                          <div key={day.id} className="border border-gray-300 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-[#5B247A]">
                                    Day {day.dayNumber}
                                  </h3>
                                  <span className="text-sm text-gray-600">
                                    {day.destination?.name}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <span className="font-medium">Date:</span>{" "}
                                    {new Date(day.date).toLocaleDateString()}
                                  </p>
                                  {day.hotel && (
                                    <p>
                                      <span className="font-medium">Hotel:</span> {day.hotel.name}
                                    </p>
                                  )}
                                  {day.excursions && day.excursions.length > 0 && (
                                    <div>
                                      <span className="font-medium">Excursions:</span>
                                      <ul className="ml-4 list-disc">
                                        {day.excursions.map((exc: any, i: number) => (
                                          <li key={i}>{exc.name}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {day.description && (
                                    <p>
                                      <span className="font-medium">Description:</span> {day.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveDay(day.id)}
                                className="text-red-500 hover:text-red-700 p-2"
                                title="Remove day"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                        {formData.days.length === 0 && (
                          <p className="text-gray-500 text-center py-8">
                            No days scheduled yet. Add destinations to create the itinerary.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* QUOTE TAB */}
                {activeTab === "quote" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Cost Breakdown
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Accommodation Cost ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.accommodationCost}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                accommodationCost: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Excursions Cost ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.excursionsCost}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                excursionsCost: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transport Cost ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.transportCost}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                transportCost: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Guide Cost ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.guideCost}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                guideCost: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Other Costs ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.otherCosts}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                otherCosts: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taxes ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.taxes}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                taxes: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Charge ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.serviceCharge}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                serviceCharge: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* Calculated Total */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">Total Cost:</span>
                          <span className="text-xl font-bold text-[#5B247A]">
                            ${quoteData.totalCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Discount Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Discount (Optional)
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Amount ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteData.discount}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                discount: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Reason
                          </label>
                          <input
                            type="text"
                            value={quoteData.discountReason}
                            onChange={(e) =>
                              setQuoteData({ ...quoteData, discountReason: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="e.g., Early bird discount"
                          />
                        </div>
                      </div>

                      {/* Final Price */}
                      <div className="mt-6 p-4 bg-[#F8EDFC] rounded-lg border-2 border-[#B749DB]">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#5B247A] text-lg">Final Price:</span>
                          <span className="text-2xl font-bold text-[#B749DB]">
                            ${quoteData.finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Quote Details */}
                    <div>
                      <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                        Additional Details
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valid Until
                          </label>
                          <input
                            type="date"
                            value={quoteData.validUntil}
                            onChange={(e) =>
                              setQuoteData({ ...quoteData, validUntil: e.target.value })
                            }
                            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Terms and Conditions
                          </label>
                          <textarea
                            value={quoteData.termsAndConditions}
                            onChange={(e) =>
                              setQuoteData({
                                ...quoteData,
                                termsAndConditions: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="Enter terms and conditions for this quote"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Internal Notes
                          </label>
                          <textarea
                            value={quoteData.internalNotes}
                            onChange={(e) =>
                              setQuoteData({ ...quoteData, internalNotes: e.target.value })
                            }
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 outline-none"
                            placeholder="Internal notes (not visible to customer)"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quote Action Buttons */}
                    <div className="pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          {itinerary?.quote ? (
                            <p className="text-sm text-gray-600">
                              Quote already exists. Creating a new quote will replace it.
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Create a quote to send pricing to the customer.
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleCreateQuote}
                          disabled={saving || quoteData.finalPrice <= 0}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving ? (
                            <>
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Creating Quote...
                            </>
                          ) : (
                            <>
                              {itinerary?.quote ? "Update Quote" : "Create Quote"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons (for Details and Destinations tabs) */}
                {(activeTab === "details" || activeTab === "destinations") && (
                  <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                    <button
                      onClick={() => navigate(`/itinerary/${itineraryId}`)}
                      disabled={saving}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-[#B749DB] text-white rounded-lg hover:bg-[#9f37c9] disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditItinerary;
