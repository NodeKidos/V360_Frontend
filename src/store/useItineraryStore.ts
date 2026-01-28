import { create } from "zustand";
import { itineraryService } from "../services/itinerary.service";
import { destinationService, type Destination } from "../services/destination.service";
import type {
  Itinerary,
  CreateItineraryDto,
  UpdateItineraryDto,
  ItineraryFormData,
  CreateItineraryDayDto,
} from "../types/itinerary.types";
import { ItineraryType } from "../types/itinerary.types";
import { toast } from "react-toastify";

interface ItineraryState {
  itineraries: Itinerary[];
  currentItinerary: Itinerary | null;
  destinations: Destination[];
  formData: Partial<ItineraryFormData>;
  isLoading: boolean;
  error: string | null;

  // Form data management
  updateFormData: (data: Partial<ItineraryFormData>) => void;
  resetFormData: () => void;

  // API actions
  fetchDestinations: () => Promise<void>;
  createItinerary: (data: CreateItineraryDto) => Promise<Itinerary | null>;
  updateItinerary: (id: string, data: UpdateItineraryDto) => Promise<boolean>;
  deleteItinerary: (id: string) => Promise<boolean>;
  getMyItineraries: () => Promise<void>;
  getItineraryById: (id: string) => Promise<void>;
  submitForQuote: (id: string) => Promise<boolean>;
  acceptQuote: (id: string) => Promise<boolean>;
  rejectQuote: (id: string, reason?: string) => Promise<boolean>;

  // Helpers
  convertFormDataToDto: () => CreateItineraryDto | null;
}

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  itineraries: [],
  currentItinerary: null,
  destinations: [],
  formData: {},
  isLoading: false,
  error: null,

  // Update form data for multi-step form
  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  // Reset form data
  resetFormData: () => {
    set({ formData: {} });
  },

  // Fetch destinations
  fetchDestinations: async () => {
    try {
      const destinations = await destinationService.getAll();
      set({ destinations });
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
    }
  },

  // Convert form data to DTO
  convertFormDataToDto: () => {
    const { formData, destinations } = get();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.arrivalDate ||
      !formData.departureDate
    ) {
      return null;
    }

    // Map selected destinations to days
    const days: CreateItineraryDayDto[] = [];

    // Calculate number of days
    const start = new Date(formData.arrivalDate);
    const end = new Date(formData.departureDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const selectedCityNames = formData.selectedCities || [];
    const daysPerCity = selectedCityNames.length > 0 ? Math.ceil(diffDays / selectedCityNames.length) : diffDays;

    // Create days
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      let destinationId = undefined;
      let hotelId = undefined;
      let excursionIds: string[] = [];

      // Determine destination for this day
      if (selectedCityNames.length > 0) {
        const cityIndex = Math.min(Math.floor(i / daysPerCity), selectedCityNames.length - 1);
        const cityName = selectedCityNames[cityIndex];

        // Find destination ID
        const destination = destinations.find(d => d.name === cityName);
        if (destination) {
          destinationId = destination.id;

          // Get additional data for this destination
          const selectedDestData = formData.selectedDestinations?.[cityName];

          // changed from single hotel to hotels array - use first hotel for now
          // TODO: Admin will later choose which hotel from the selections when creating quotation
          if (selectedDestData?.hotels && selectedDestData.hotels.length > 0) {
            hotelId = selectedDestData.hotels[0].id;
          }

          if (selectedDestData?.excursions && selectedDestData.excursions.length > 0) {
            // Distribute excursions across days for this destination
            // Calculate which day within this city's stay (0-indexed)
            const dayWithinCity = i - (cityIndex * daysPerCity);
            const excursionsPerDay = Math.ceil(selectedDestData.excursions.length / daysPerCity);

            // Get excursions for this specific day
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

    // Calculate total number of participants based on traveler type
    let totalParticipants = 1;
    let numberOfAdults = 0;
    let numberOfChildrenUnder5 = 0;
    let numberOfChildren5Plus = 0;

    if (formData.travelerType === "Solo") {
      totalParticipants = 1;
    } else if (formData.travelerType === "Couple") {
      totalParticipants = 2;
    } else if (formData.travelerType === "Group") {
      numberOfAdults = formData.numberOfAdults || 0;
      numberOfChildrenUnder5 = formData.numberOfChildrenUnder5 || 0;
      numberOfChildren5Plus = formData.numberOfChildren5Plus || 0;
      totalParticipants = numberOfAdults + numberOfChildrenUnder5 + numberOfChildren5Plus || 1;
    } else {
      // Default if no traveler type selected
      totalParticipants = 1;
    }


    // Determine duration
    const actualDuration = formData.duration === "Custom"
      ? formData.customDuration || formData.duration
      : formData.duration;

    const dto: CreateItineraryDto = {
      type: ItineraryType.CUSTOM,
      startDate: formData.arrivalDate,
      endDate: formData.departureDate,
      numberOfParticipants: totalParticipants,
      numberOfAdults,
      numberOfChildrenUnder5,
      numberOfChildren5Plus,
      specialRequests: formData.specialRequirements,
      metadata: {
        hotelCategory: formData.hotelCategory,
        roomCategory: formData.roomCategory,
        vehicleType: formData.vehicleType,
        duration: actualDuration,
      },
      days,
      // Add guest fields if provided (for unauthenticated users)
      guestEmail: formData.email,
      guestFirstName: formData.firstName,
      guestLastName: formData.lastName,
      guestPhone: formData.contactNumber,
      guestCountry: formData.country,
      guestDateOfBirth: formData.dateOfBirth,
      guestGender: formData.gender,
      guestMedicalConditions: formData.medicalConditions,
      guestDietaryPreferences: formData.dietaryPreferences,
      guestAllergies: formData.allergies,
      guestSpecialConditions: formData.specialConditions,
    };

    return dto;
  },
  // Create new itinerary
  createItinerary: async (data) => {
    set({ isLoading: true, error: null });
    try {
      console.log('📤 Sending itinerary data:', JSON.stringify(data, null, 2));
      const itinerary = await itineraryService.create(data);
      set((state) => ({
        itineraries: [...state.itineraries, itinerary],
        currentItinerary: itinerary,
        isLoading: false,
      }));
      toast.success("Itinerary created successfully!");
      return itinerary;
    } catch (error: any) {
      console.error('❌ Itinerary creation error:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to create itinerary";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  // Update itinerary
  updateItinerary: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await itineraryService.update(id, data);
      set((state) => ({
        itineraries: state.itineraries.map((it) => (it.id === id ? updated : it)),
        currentItinerary: updated,
        isLoading: false,
      }));
      toast.success("Itinerary updated successfully!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update itinerary";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Delete itinerary
  deleteItinerary: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await itineraryService.delete(id);
      set((state) => ({
        itineraries: state.itineraries.filter((it) => it.id !== id),
        currentItinerary: null,
        isLoading: false,
      }));
      toast.success("Itinerary deleted successfully!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete itinerary";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Get all my itineraries
  getMyItineraries: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('📡 Calling API: GET /itineraries/my-itineraries');
      const itineraries = await itineraryService.getMyItineraries();
      console.log('📦 API Response:', itineraries);
      console.log('📦 Number of itineraries:', itineraries.length);
      set({ itineraries, isLoading: false });
    } catch (error: any) {
      console.error('❌ API Error:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to fetch itineraries";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  // Get itinerary by ID
  getItineraryById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const itinerary = await itineraryService.getById(id);
      set({ currentItinerary: itinerary, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch itinerary";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  // Submit for quote
  submitForQuote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await itineraryService.submitForQuote(id);
      set((state) => ({
        itineraries: state.itineraries.map((it) => (it.id === id ? updated : it)),
        currentItinerary: updated,
        isLoading: false,
      }));
      toast.success("Itinerary submitted for quote!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to submit itinerary";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Accept quote
  acceptQuote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await itineraryService.acceptQuote(id);
      set((state) => ({
        itineraries: state.itineraries.map((it) => (it.id === id ? updated : it)),
        currentItinerary: updated,
        isLoading: false,
      }));
      toast.success("Quote accepted successfully!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to accept quote";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Reject quote
  rejectQuote: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await itineraryService.rejectQuote(id, reason);
      set((state) => ({
        itineraries: state.itineraries.map((it) => (it.id === id ? updated : it)),
        currentItinerary: updated,
        isLoading: false,
      }));
      toast.success("Quote rejected");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reject quote";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },
}));
