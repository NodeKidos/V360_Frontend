import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/AdminSidebar";
import TopBar from "../../components/Topbar";
import { Loader } from "../../components/ui/Loader";
import { FaArrowLeft, FaHotel, FaTrash } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { toast } from "react-toastify";
import { itineraryService } from "../../services/itinerary.service";
import { adminDriverService, type Driver } from "../../services/admin.service";
import type { Itinerary, ItineraryStatus } from "../../types/itinerary.types";
import SriLankaMap from "../../components/home/SriLankaMap";
import { useItineraryStore } from "../../store/useItineraryStore";
import colombo from "../../assets/packages/family.png";
import { DayPlannerTab } from "../../components/dashboard/Itinerary/DayPlannerTab";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

const EditItinerary = () => {
  const { itineraryId } = useParams<{ itineraryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchDestinations, destinations, formData: storeFormData, updateFormData: updateStoreFormData } = useItineraryStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDangerous?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "destinations" | "dayPlanner" | "quote" | "management">(
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

  // Driver assignment state
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchDestinations();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper function to detect date-destination mismatch
  const hasDateDestinationMismatch = (): { hasMismatch: boolean; days: number; destinations: number } => {
    if (!itinerary?.startDate || !itinerary?.endDate || !itinerary?.days) {
      return { hasMismatch: false, days: 0, destinations: 0 };
    }

    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const dateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Count unique destinations
    const uniqueDestinations = new Set(
      itinerary.days
        .map((day: any) => day.destination?.id)
        .filter(Boolean)
    );
    const destinationCount = uniqueDestinations.size;

    return {
      hasMismatch: destinationCount > dateDays,
      days: dateDays,
      destinations: destinationCount
    };
  };

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

        console.log("📥 Loaded itinerary from backend:", data);
        console.log("📅 Days from backend:", data.days);

        // Extract selected cities and destinations from days
        const cities: string[] = [];
        const destData: any = {};

        console.log("🔍 Extracting destinations and hotels from days...");

        data.days?.forEach((day: any) => {
          const destName = day.destination?.name;
          console.log(`  Day ${day.dayNumber} (${destName}):`, {
            hotel: day.hotel,
            hotelId: day.hotelId,
            excursions: day.excursions?.length || 0
          });

          if (destName && !cities.includes(destName)) {
            cities.push(destName);
          }
          if (destName) {
            if (!destData[destName]) {
              // Include room details from the day
              const hotelWithRoomDetails = day.hotel ? {
                ...day.hotel,
                roomDetails: {
                  roomType: day.roomType,
                  bedTypes: day.bedTypes,
                  dietPlans: day.dietPlans,
                }
              } : null;

              destData[destName] = {
                hotel: hotelWithRoomDetails,
                excursions: [],
              };
              console.log(`    Created destData for ${destName}:`, destData[destName]);
            }
            // Add excursions, avoiding duplicates
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

        console.log("✅ Extracted destData:", destData);
        console.log("✅ Extracted cities:", cities);

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
                  excursions: (storeSelection.excursions?.length ?? 0) > 0
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

        // Helper function to format date for input[type="date"]
        const formatDateForInput = (dateString: string) => {
          if (!dateString) return "";
          // Extract yyyy-MM-dd from ISO string
          return dateString.split('T')[0];
        };

        // Pre-populate form
        setFormData({
          startDate: formatDateForInput(data.startDate) || "",
          endDate: formatDateForInput(data.endDate) || "",
          numberOfParticipants: data.numberOfParticipants || 1,
          groupComposition: data.metadata?.groupComposition || "",
          duration: data.metadata?.duration || "",

          dietaryPreferences: data.lead?.dietaryRequirements || "",
          medicalConditions: data.lead?.medicalNotes || "",
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

        console.log("🎯 Final selectedDestinations to be used:", finalSelectedDestinations);
        console.log("🏨 Hotels status:");
        Object.keys(finalSelectedDestinations).forEach(city => {
          const hotel = finalSelectedDestinations[city]?.hotel;
          console.log(`  ${city}:`, {
            hotelName: hotel ? hotel.name : 'NOT SELECTED',
            address: hotel?.address || hotel?.location,
            roomDetails: hotel?.roomDetails
          });
        });

        // Sync with itinerary store so hotels/excursions show as selected
        // Use finalSelectedCities and finalSelectedDestinations to preserve selections
        updateStoreFormData({
          selectedCities: finalSelectedCities,
          selectedDestinations: finalSelectedDestinations,
        });

        // Pre-populate quote data if exists
        console.log('📊 Loaded itinerary data:', data);
        console.log('💰 Quote data:', data.quote);

        if (data.quote) {
          console.log('✅ Quote exists, populating form...');
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
        } else {
          console.log('❌ No quote found in itinerary data');
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

  // Fetch available drivers for assignment
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await adminDriverService.getAllDrivers();
        setAvailableDrivers(response.drivers || []);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
        toast.error('Failed to load drivers list');
      }
    };

    const validStatuses = ['accepted', 'in_progress', 'on_hold'];
    if (validStatuses.includes(formData.status)) {
      fetchDrivers();
    }
  }, [formData.status]);

  // Regenerate days when returning from hotel/excursion selection
  useEffect(() => {
    // Only regenerate if we have the necessary data and are returning from selection
    if (
      formData.startDate &&
      formData.endDate &&
      formData.selectedCities?.length > 0 &&
      destinations.length > 0 &&
      (location.state as any)?.returnTab === "destinations"
    ) {
      const regeneratedDays = regenerateDays(
        formData.startDate,
        formData.endDate,
        formData.selectedCities,
        formData.selectedDestinations
      );

      // Only update if days actually changed
      if (JSON.stringify(regeneratedDays) !== JSON.stringify(formData.days)) {
        setFormData(prev => ({
          ...prev,
          days: regeneratedDays
        }));
      }
    }
  }, [formData.selectedDestinations, destinations]);

  // Helper function to regenerate days based on selected destinations
  const regenerateDays = (
    startDate: string,
    endDate: string,
    selectedCities: string[],
    selectedDestinations: any
  ) => {
    if (!startDate || !endDate) return [];

    console.log("🔄 Regenerating days with:", {
      startDate,
      endDate,
      selectedCities,
      selectedDestinations,
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateDiffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // CRITICAL FIX: Use MAXIMUM of date range OR number of cities
    const totalDays = Math.max(dateDiffDays, selectedCities.length);

    console.log('🗓️ ADMIN - Date days:', dateDiffDays, '| Cities:', selectedCities.length, '| Using:', totalDays);

    const newDays: any[] = [];

    // Calculate days per destination
    const citiesCount = selectedCities.length || 1;
    const daysPerDestination = Math.floor(totalDays / citiesCount);
    let remainingDays = totalDays % citiesCount;

    let currentDayNumber = 1;
    let currentDate = new Date(start);

    selectedCities.forEach((cityName) => {
      const destination = destinations.find(d => d.name === cityName);
      const destData = selectedDestinations?.[cityName];

      console.log(`📍 Processing ${cityName}:`, {
        destination,
        destData,
        hotel: destData?.hotel,
        excursions: destData?.excursions,
      });

      // Days for this destination (add 1 extra day if there are remaining days)
      const daysForThisCity = daysPerDestination + (remainingDays > 0 ? 1 : 0);
      if (remainingDays > 0) remainingDays--;

      for (let i = 0; i < daysForThisCity; i++) {
        const dayObj = {
          id: `day-${currentDayNumber}`,
          dayNumber: currentDayNumber,
          date: currentDate.toISOString().split('T')[0],
          title: `${cityName} - Day ${i + 1}`,
          description: `Explore ${cityName}`,
          destination: destination,
          destinationId: destination?.id,
          hotel: destData?.hotel || null,
          hotelId: destData?.hotel?.id || null,
          excursions: destData?.excursions || [],
          excursionIds: destData?.excursions?.map((e: any) => e.id) || [],
        };

        console.log(`  📅 Day ${currentDayNumber}:`, dayObj);
        newDays.push(dayObj);

        currentDayNumber++;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    console.log("✅ Generated days:", newDays);
    return newDays;
  };

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

    // Regenerate days based on new city selection
    const regeneratedDays = regenerateDays(
      formData.startDate,
      formData.endDate,
      newCities,
      updatedSelectedDestinations
    );

    setFormData({
      ...formData,
      selectedCities: newCities,
      selectedDestinations: updatedSelectedDestinations,
      days: regeneratedDays
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
      // Format days for backend
      const formattedDays = formData.days.map(day => ({
        dayNumber: day.dayNumber,
        date: day.date,
        title: day.title,
        description: day.description,
        notes: day.notes,
        destinationId: day.destinationId || day.destination?.id,
        hotelId: day.hotelId || day.hotel?.id,
        roomType: day.hotel?.roomDetails?.roomType,
        bedTypes: day.hotel?.roomDetails?.bedTypes,
        dietPlans: day.hotel?.roomDetails?.dietPlans,
        excursionIds: day.excursionIds || day.excursions?.map((e: any) => e.id) || [],
      }));

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
        days: formattedDays,
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

      console.log('📤 Sending quote data:', quoteDto);
      const savedQuote = await itineraryService.createQuote(itineraryId!, quoteDto);
      console.log('✅ Quote saved, response:', savedQuote);
      toast.success("Quote created successfully!");

      // Refresh itinerary data
      const refreshedData = await itineraryService.getById(itineraryId!);
      console.log('🔄 Refreshed itinerary data:', refreshedData);
      console.log('🔄 Refreshed quote data:', refreshedData.quote);
      setItinerary(refreshedData);
      setFormData(prev => ({ ...prev, status: refreshedData.status }));

      // Update quote data state with refreshed values
      if (refreshedData.quote) {
        console.log('✅ Updating quote form with refreshed data');
        setQuoteData({
          totalCost: refreshedData.quote.totalCost || 0,
          accommodationCost: refreshedData.quote.breakdown?.accommodationCost || 0,
          excursionsCost: refreshedData.quote.breakdown?.excursionsCost || 0,
          transportCost: refreshedData.quote.breakdown?.transportCost || 0,
          guideCost: refreshedData.quote.breakdown?.guideCost || 0,
          otherCosts: refreshedData.quote.breakdown?.otherCosts || 0,
          taxes: refreshedData.quote.breakdown?.taxes || 0,
          serviceCharge: refreshedData.quote.breakdown?.serviceCharge || 0,
          discount: refreshedData.quote.discount || 0,
          discountReason: refreshedData.quote.discountReason || "",
          finalPrice: refreshedData.quote.finalPrice || 0,
          termsAndConditions: refreshedData.quote.termsAndConditions || "",
          internalNotes: refreshedData.quote.internalNotes || "",
          validUntil: refreshedData.quote.validUntil || "",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create quote");
    } finally {
      setSaving(false);
    }
  };

  // Note: Status changes should be done through specific quote/accept/reject actions
  // not through a general status change handler

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

  const handleRemoveDay = (dayIndexToRemove: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Day',
      message: 'Are you sure you want to remove this day?',
      isDangerous: true,
      onConfirm: () => {
        const newDays = formData.days.filter(
          (_, index: number) => index !== dayIndexToRemove
        );
        // Renumber remaining days
        const renumbered = newDays.map((day: any, index: number) => ({
          ...day,
          dayNumber: index + 1,
        }));
        setFormData(prev => ({ ...prev, days: renumbered }));
      },
    });
  };

  const handleAssignDriver = async () => {
    if (!selectedDriverId || !itineraryId) return;

    setAssigning(true);
    try {
      await itineraryService.assignDriver(itineraryId, selectedDriverId);
      setSelectedDriverId('');
      toast.success('Driver assigned successfully!');

      const refreshed = await itineraryService.getById(itineraryId);
      setItinerary(refreshed);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to assign driver');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignDriver = async () => {
    if (!itineraryId) return;

    setConfirmModal({
      isOpen: true,
      title: 'Remove Driver Assignment',
      message: 'Remove driver assignment?',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await itineraryService.unassignDriver(itineraryId);
          toast.success('Driver unassigned successfully!');
          const refreshedData = await itineraryService.getById(itineraryId);
          setItinerary(refreshedData);
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to unassign driver');
        }
      },
    });
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
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  formData.status === 'pending_quote' ? 'bg-yellow-100 text-yellow-700' :
                    formData.status === 'quoted' ? 'bg-blue-100 text-blue-700' :
                      formData.status === 'negotiating' ? 'bg-orange-100 text-orange-700' :
                        formData.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          formData.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            formData.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                              formData.status === 'on_hold' ? 'bg-amber-100 text-amber-700' :
                                formData.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                  formData.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                    'bg-gray-100 text-gray-700'
                  }`}>
                  {formData.status?.toUpperCase().replace(/_/g, ' ')}
                </span>

                {/* Date-Destination Mismatch Warning */}
                {(() => {
                  const mismatch = hasDateDestinationMismatch();
                  if (mismatch.hasMismatch) {
                    return (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border-2 border-orange-300 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        DATE MISMATCH: {mismatch.destinations} destinations for {mismatch.days}-day trip
                      </span>
                    );
                  }
                  return null;
                })()}
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
            <Loader message="Loading itinerary details..." size={250} />
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === "details"
                    ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Trip Details
                </button>
                <button
                  onClick={() => setActiveTab("destinations")}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === "destinations"
                    ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Destinations & Days
                </button>
                <button
                  onClick={() => setActiveTab("dayPlanner")}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === "dayPlanner"
                    ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Day Planner
                </button>
                <button
                  onClick={() => setActiveTab("quote")}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === "quote"
                    ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Quote & Pricing
                </button>
                <button
                  onClick={() => setActiveTab("management")}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === "management"
                    ? "text-[#B749DB] border-b-2 border-[#B749DB]"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Trip Management
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
                    {/* Note: Status Management and Driver Assignment moved to Trip Management tab */}
                    {false && (formData.status === 'accepted' || formData.status === 'in_progress' || formData.status === 'on_hold') && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-[#B749DB] rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                          Itinerary Status Management
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {formData.status === 'accepted' && (
                            <button
                              onClick={async () => {
                                if (!itinerary?.driver) {
                                  setConfirmModal({
                                    isOpen: true,
                                    title: 'No Driver Assigned',
                                    message: '⚠️ No driver assigned to this trip.\n\nIt is recommended to assign a driver before starting. Do you want to proceed anyway?',
                                    isDangerous: true,
                                    onConfirm: () => {
                                      setConfirmModal({
                                        isOpen: true,
                                        title: 'Start Trip',
                                        message: 'Start this itinerary? The trip will begin.',
                                        onConfirm: async () => {
                                          try {
                                            await itineraryService.startItinerary(itineraryId!);
                                            toast.success('Itinerary started successfully!');
                                            const refreshedData = await itineraryService.getById(itineraryId!);
                                            setItinerary(refreshedData);
                                            setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                          } catch (error: any) {
                                            toast.error(error.response?.data?.message || 'Failed to start itinerary');
                                          }
                                        },
                                      });
                                    },
                                  });
                                  return;
                                }
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Start Trip',
                                  message: 'Start this itinerary? The trip will begin.',
                                  onConfirm: async () => {
                                    try {
                                      await itineraryService.startItinerary(itineraryId!);
                                      toast.success('Itinerary started successfully!');
                                      const refreshedData = await itineraryService.getById(itineraryId!);
                                      setItinerary(refreshedData);
                                      setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                    } catch (error: any) {
                                      toast.error(error.response?.data?.message || 'Failed to start itinerary');
                                    }
                                  },
                                });
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                            >
                              🚀 Start Trip
                            </button>
                          )}

                          {formData.status === 'in_progress' && (
                            <>
                              <button
                                onClick={() => {
                                  setConfirmModal({
                                    isOpen: true,
                                    title: 'Put Trip on Hold',
                                    message: 'Put this trip on hold? You can provide a reason.',
                                    isDangerous: true,
                                    onConfirm: async () => {
                                      const reason = prompt('Reason for hold (optional):');
                                      try {
                                        await itineraryService.holdItinerary(itineraryId!, reason || undefined);
                                        toast.success('Trip put on hold');
                                        const refreshed = await itineraryService.getById(itineraryId!);
                                        setItinerary(refreshed);
                                        setFormData(prev => ({ ...prev, status: refreshed.status }));
                                      } catch (error: any) {
                                        toast.error(error.response?.data?.message || 'Failed to hold trip');
                                      }
                                    },
                                  });
                                }}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
                              >
                                ⏸️ Put On Hold
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmModal({
                                    isOpen: true,
                                    title: 'Mark Trip as Completed',
                                    message: 'Mark this itinerary as completed?',
                                    onConfirm: async () => {
                                      try {
                                        await itineraryService.completeItinerary(itineraryId!);
                                        toast.success('Itinerary completed successfully!');
                                        const refreshedData = await itineraryService.getById(itineraryId!);
                                        setItinerary(refreshedData);
                                        setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                      } catch (error: any) {
                                        toast.error(error.response?.data?.message || 'Failed to complete itinerary');
                                      }
                                    },
                                  });
                                }}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                              >
                                ✅ Mark Completed
                              </button>
                            </>
                          )}

                          {formData.status === 'on_hold' && (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Resume Trip',
                                  message: 'Resume this itinerary?',
                                  onConfirm: async () => {
                                    try {
                                      await itineraryService.resumeItinerary(itineraryId!);
                                      toast.success('Itinerary resumed');
                                      const refreshedData = await itineraryService.getById(itineraryId!);
                                      setItinerary(refreshedData);
                                      setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                    } catch (error: any) {
                                      toast.error(error.response?.data?.message || 'Failed to resume itinerary');
                                    }
                                  },
                                });
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                            >
                              ▶️ Resume Trip
                            </button>
                          )}

                          {(formData.status === 'accepted' || formData.status === 'in_progress' || formData.status === 'on_hold') && (
                            <button
                              onClick={async () => {
                                const reason = window.prompt('Reason for cancellation:');
                                if (reason) {
                                  try {
                                    await itineraryService.cancelItinerary(itineraryId!, reason);
                                    toast.success('Itinerary cancelled');
                                    const refreshedData = await itineraryService.getById(itineraryId!);
                                    setItinerary(refreshedData);
                                    setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                  } catch (error: any) {
                                    toast.error(error.response?.data?.message || 'Failed to cancel itinerary');
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
                            >
                              ❌ Cancel Trip
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Driver Assignment Section - Moved to Trip Management tab */}
                    {false && (formData.status === 'accepted' || formData.status === 'in_progress' || formData.status === 'on_hold') && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                          🚗 Driver Assignment
                        </h2>

                        {itinerary?.driver ? (
                          <div className="bg-white p-4 rounded-lg mb-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Assigned Driver</p>
                                <p className="font-semibold text-gray-900">{itinerary.driver.user ? `${itinerary.driver.user.firstName} ${itinerary.driver.user.lastName}` : 'Unknown'}</p>
                                <p className="text-sm text-gray-600">{itinerary.driver.user?.email}</p>
                                <p className="text-sm text-gray-600">{itinerary.driver.user?.contact || itinerary.driver.user?.phone}</p>
                                {itinerary.assignedAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Assigned: {new Date(itinerary.assignedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={handleUnassignDriver}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                              >
                                Unassign
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg mb-4">
                            <p className="text-sm text-yellow-800">⚠️ No driver assigned yet</p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {itinerary?.driver ? 'Reassign Driver' : 'Assign Driver'}
                          </label>
                          <div className="flex gap-3">
                            <select
                              value={selectedDriverId}
                              onChange={(e) => setSelectedDriverId(e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                            >
                              <option value="">Select a driver...</option>
                              {availableDrivers
                                .filter(d => d.status === 'Active')
                                .map(driver => (
                                  <option key={driver.id} value={driver.id}>
                                    {driver.name} - {driver.email}
                                  </option>
                                ))
                              }
                            </select>
                            <button
                              onClick={handleAssignDriver}
                              disabled={!selectedDriverId || assigning}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {assigning ? 'Assigning...' : 'Assign'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

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
                            {itinerary?.lead?.user?.firstName} {itinerary?.lead?.user?.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{itinerary?.lead?.user?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <p className="text-gray-900">{itinerary?.lead?.user?.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <p className="text-gray-900">{itinerary?.lead?.country || "N/A"}</p>
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
                                className={`cursor-pointer text-3xl transition ${i <= formData.hotelCategory
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
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-[#5B247A]">
                          Day-by-Day Itinerary
                        </h2>
                        <button
                          onClick={() => {
                            const regeneratedDays = regenerateDays(
                              formData.startDate,
                              formData.endDate,
                              formData.selectedCities,
                              formData.selectedDestinations
                            );
                            setFormData(prev => ({
                              ...prev,
                              days: regeneratedDays
                            }));
                            toast.success("Days regenerated based on current selections");
                          }}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Regenerate Days
                        </button>
                      </div>
                      <div className="space-y-4">
                        {formData.days
                          .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
                          .map((day) => (
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
                                      <div className="space-y-2">
                                        <p>
                                          <span className="font-medium">Hotel:</span> {day.hotel.name}
                                        </p>
                                        {/* Room details from day object (or from hotel.roomDetails for backward compatibility) */}
                                        {(day.roomType || day.hotel.roomDetails) && (
                                          <div className="ml-4 space-y-1 text-xs text-gray-600">
                                            {(day.roomType || day.hotel.roomDetails?.roomType) && (
                                              <p>
                                                <span className="font-medium">Room Type:</span> {(day.roomType || day.hotel.roomDetails?.roomType) === 'single' ? 'Single Room' : 'Double Room'}
                                              </p>
                                            )}
                                            {(day.bedTypes || day.hotel.roomDetails?.bedTypes)?.length > 0 && (
                                              <p>
                                                <span className="font-medium">Bed Types:</span> {(day.bedTypes || day.hotel.roomDetails?.bedTypes).join(', ')}
                                              </p>
                                            )}
                                            {(day.dietPlans || day.hotel.roomDetails?.dietPlans)?.length > 0 && (
                                              <p>
                                                <span className="font-medium">Diet Plan:</span> {(day.dietPlans || day.hotel.roomDetails?.dietPlans).join(', ')}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                        {day.hotel.features && day.hotel.features.length > 0 && (
                                          <div className="ml-4">
                                            <span className="font-medium text-xs">Room Features:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {day.hotel.features.map((feature: string, i: number) => (
                                                <span
                                                  key={i}
                                                  className="px-2 py-1 bg-[#F8EDFC] border border-[#D9B7F2] text-[#5B247A] rounded-full text-xs"
                                                >
                                                  {feature}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
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

                {/* DAY PLANNER TAB */}
                {activeTab === "dayPlanner" && itinerary && (
                  <DayPlannerTab
                    itinerary={itinerary}
                    onSave={async (dayPlans) => {
                      try {
                        // Convert day plans to DTO format
                        const daysUpdate = dayPlans.map((plan) => ({
                          dayNumber: plan.dayNumber,
                          date: plan.date,
                          destinationId: plan.destination?.id,
                          hotelId: plan.hotel?.id,
                          excursionIds: plan.excursions.map((ex) => ex.id),
                        }));

                        // Update itinerary with new day plans
                        await itineraryService.update(itinerary.id, {
                          days: daysUpdate,
                        });

                        // Refresh itinerary data
                        const updated = await itineraryService.getById(itinerary.id);
                        setItinerary(updated);
                      } catch (error) {
                        console.error("Failed to save day plans:", error);
                        throw error;
                      }
                    }}
                  />
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
                            onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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

                {/* TRIP MANAGEMENT TAB */}
                {activeTab === "management" && (
                  <div className="space-y-8">
                    {/* Status Management Section */}
                    {(formData.status === 'accepted' || formData.status === 'in_progress' || formData.status === 'on_hold') && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-[#B749DB] rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-[#5B247A] mb-4">
                          Itinerary Status Management
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {formData.status === 'accepted' && (
                            <button
                              onClick={async () => {
                                if (!itinerary?.driver) {
                                  setConfirmModal({
                                    isOpen: true,
                                    title: 'No Driver Assigned',
                                    message: '⚠️ No driver assigned to this trip.\n\nIt is recommended to assign a driver before starting. Do you want to proceed anyway?',
                                    isDangerous: true,
                                    onConfirm: () => {
                                      setConfirmModal({
                                        isOpen: true,
                                        title: 'Start Trip',
                                        message: 'Start this itinerary? The trip will begin.',
                                        onConfirm: async () => {
                                          try {
                                            await itineraryService.startItinerary(itineraryId!);
                                            toast.success('Itinerary started successfully!');
                                            const refreshedData = await itineraryService.getById(itineraryId!);
                                            setItinerary(refreshedData);
                                            setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                          } catch (error: any) {
                                            toast.error(error.response?.data?.message || 'Failed to start itinerary');
                                          }
                                        },
                                      });
                                    },
                                  });
                                  return;
                                }
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Start Trip',
                                  message: 'Start this itinerary? The trip will begin.',
                                  onConfirm: async () => {
                                    try {
                                      await itineraryService.startItinerary(itineraryId!);
                                      toast.success('Itinerary started successfully!');
                                      const refreshedData = await itineraryService.getById(itineraryId!);
                                      setItinerary(refreshedData);
                                      setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                    } catch (error: any) {
                                      toast.error(error.response?.data?.message || 'Failed to start itinerary');
                                    }
                                  },
                                });
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                            >
                              🚀 Start Trip
                            </button>
                          )}

                          {formData.status === 'in_progress' && (
                            <>
                              <button
                                onClick={() => {
                                  setConfirmModal({
                                    isOpen: true,
                                    title: 'Put Trip on Hold',
                                    message: 'Put this trip on hold? You can provide a reason.',
                                    isDangerous: true,
                                    onConfirm: async () => {
                                      const reason = prompt('Reason for hold (optional):');
                                      try {
                                        await itineraryService.holdItinerary(itineraryId!, reason || undefined);
                                        toast.success('Trip put on hold');
                                        const refreshed = await itineraryService.getById(itineraryId!);
                                        setItinerary(refreshed);
                                        setFormData(prev => ({ ...prev, status: refreshed.status }));
                                      } catch (error: any) {
                                        toast.error(error.response?.data?.message || 'Failed to hold trip');
                                      }
                                    },
                                  });
                                }}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
                              >
                                ⏸️ Put On Hold
                              </button>

                              <button
                                onClick={() => {
                                  setConfirmModal({
                                    isOpen: true,
                                    title: 'Mark Trip as Completed',
                                    message: 'Mark this itinerary as completed?',
                                    onConfirm: async () => {
                                      try {
                                        await itineraryService.completeItinerary(itineraryId!);
                                        toast.success('Itinerary completed successfully!');
                                        const refreshedData = await itineraryService.getById(itineraryId!);
                                        setItinerary(refreshedData);
                                        setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                      } catch (error: any) {
                                        toast.error(error.response?.data?.message || 'Failed to complete itinerary');
                                      }
                                    },
                                  });
                                }}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                              >
                                ✅ Mark Completed
                              </button>
                            </>
                          )}

                          {formData.status === 'on_hold' && (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Resume Trip',
                                  message: 'Resume this itinerary?',
                                  onConfirm: async () => {
                                    try {
                                      await itineraryService.resumeItinerary(itineraryId!);
                                      toast.success('Itinerary resumed');
                                      const refreshedData = await itineraryService.getById(itineraryId!);
                                      setItinerary(refreshedData);
                                      setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                    } catch (error: any) {
                                      toast.error(error.response?.data?.message || 'Failed to resume itinerary');
                                    }
                                  },
                                });
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                              ▶️ Resume Trip
                            </button>
                          )}

                          {(formData.status === 'accepted' || formData.status === 'in_progress' || formData.status === 'on_hold') && (
                            <button
                              onClick={async () => {
                                const reason = window.prompt('Reason for cancellation (optional):');
                                if (reason !== null) {
                                  try {
                                    await itineraryService.cancelItinerary(itineraryId!, reason || undefined);
                                    toast.success('Itinerary cancelled');
                                    const refreshedData = await itineraryService.getById(itineraryId!);
                                    setItinerary(refreshedData);
                                    setFormData(prev => ({ ...prev, status: refreshedData.status }));
                                  } catch (error: any) {
                                    toast.error(error.response?.data?.message || 'Failed to cancel itinerary');
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
                            >
                              ❌ Cancel Trip
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Driver Assignment Section */}
                    {(formData.status === 'accepted' || formData.status === 'in_progress' || formData.status === 'on_hold') && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                          🚗 Driver Assignment
                        </h2>

                        {itinerary?.driver ? (
                          <div className="bg-white p-4 rounded-lg mb-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Assigned Driver</p>
                                <p className="font-semibold text-gray-900">{itinerary.driver.user ? `${itinerary.driver.user.firstName} ${itinerary.driver.user.lastName}` : 'Unknown'}</p>
                                <p className="text-sm text-gray-600">{itinerary.driver.user?.email}</p>
                                <p className="text-sm text-gray-600">{itinerary.driver.user?.contact || itinerary.driver.user?.phone}</p>
                                {itinerary.assignedAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Assigned: {new Date(itinerary.assignedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={handleUnassignDriver}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                              >
                                Unassign
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg mb-4">
                            <p className="text-sm text-yellow-800">⚠️ No driver assigned yet</p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {itinerary?.driver ? 'Reassign Driver' : 'Assign Driver'}
                          </label>
                          <div className="flex gap-3">
                            <select
                              value={selectedDriverId}
                              onChange={(e) => setSelectedDriverId(e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                            >
                              <option value="">Select a driver...</option>
                              {availableDrivers
                                .filter(d => d.status === 'Active')
                                .map(driver => (
                                  <option key={driver.id} value={driver.id}>
                                    {driver.name} - {driver.email}
                                  </option>
                                ))
                              }
                            </select>
                            <button
                              onClick={handleAssignDriver}
                              disabled={!selectedDriverId || assigning}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {assigning ? 'Assigning...' : 'Assign'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Info Message if no active trip */}
                    {!(formData.status === 'accepted' || formData.status === 'in_progress' || formData.status === 'on_hold') && (
                      <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg text-center">
                        <p className="text-gray-600 font-medium mb-2">Trip management is only available for accepted, in-progress, or on-hold itineraries.</p>
                        <p className="text-sm text-gray-500">Current status: <span className="font-semibold">{formData.status?.toUpperCase().replace(/_/g, ' ')}</span></p>
                      </div>
                    )}
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

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDangerous={confirmModal.isDangerous}
      />
    </div>
  );
};

export default EditItinerary;
