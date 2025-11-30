import { create } from "zustand";
import { itineraryService } from "../services/itinerary.service";
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
  formData: Partial<ItineraryFormData>;
  isLoading: boolean;
  error: string | null;

  // Form data management
  updateFormData: (data: Partial<ItineraryFormData>) => void;
  resetFormData: () => void;

  // API actions
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

  // Convert form data to DTO
  convertFormDataToDto: () => {
    const { formData } = get();

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

    // Create days
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      let destinationId = undefined;
      let hotelId = undefined;
      let excursionIds: string[] = [];

      // Check if we have a selected hotel for the current destination
      // This is a simplified logic - you might want to map specific days to specific destinations
      if (formData.selectedDestinations) {
        // Example: Check if any destination has a hotel selected
        // In a real app, you'd know which destination corresponds to which day
        const destinations = Object.keys(formData.selectedDestinations);
        if (destinations.length > 0) {
          // For simplicity, just taking the first one or matching by some logic
          const dest = destinations[0];
          const selectedDest = formData.selectedDestinations[dest];

          if (selectedDest?.hotel) {
            // Assuming hotel object has an ID, otherwise we might need to look it up or send the whole object
            // hotelId = selectedDest.hotel.id; 
          }

          if (selectedDest?.excursions) {
            excursionIds = selectedDest.excursions.map((ex: any) => ex.id).filter(Boolean);
          }
        }
      }

      days.push({
        dayNumber: i + 1,
        date: currentDate.toISOString().split('T')[0],
        title: `Day ${i + 1}`,
        description: "Day description placeholder",
        destinationId,
        hotelId,
        excursionIds
      });
    }

    const dto: CreateItineraryDto = {
      type: ItineraryType.CUSTOM,
      startDate: formData.arrivalDate,
      endDate: formData.departureDate,
      numberOfParticipants: parseInt(formData.groupComposition || "1") || 1,
      specialRequests: formData.specialRequirements,
      days,
      // Add guest fields if provided (for unauthenticated users)
      guestEmail: formData.email,
      guestFirstName: formData.firstName,
      guestLastName: formData.lastName,
      guestPhone: formData.contactNumber,
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
      const itineraries = await itineraryService.getMyItineraries();
      set({ itineraries, isLoading: false });
    } catch (error: any) {
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
