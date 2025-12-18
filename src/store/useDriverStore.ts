import { create } from 'zustand';
import { driverService, type ItinerarySummary, type ItinerarySchedule, type Vehicle } from '../services/driver.service';
import { toast } from 'react-toastify';

interface DriverState {
    // Itineraries
    itineraries: ItinerarySummary[];
    currentSchedule: ItinerarySchedule | null;
    isLoadingItineraries: boolean;
    isLoadingSchedule: boolean;

    // Vehicle
    assignedVehicle: Vehicle | null;
    isLoadingVehicle: boolean;

    // Actions
    fetchAssignedItineraries: () => Promise<void>;
    fetchItinerarySchedule: (itineraryId: string) => Promise<void>;
    fetchAssignedVehicle: () => Promise<void>;
    updateTripStatus: (itineraryId: string, status: string) => Promise<void>;
    clearSchedule: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
    // Initial state
    itineraries: [],
    currentSchedule: null,
    isLoadingItineraries: false,
    isLoadingSchedule: false,
    assignedVehicle: null,
    isLoadingVehicle: false,

    // Fetch assigned itineraries
    fetchAssignedItineraries: async () => {
        set({ isLoadingItineraries: true });
        try {
            const itineraries = await driverService.getAssignedItineraries();
            set({ itineraries, isLoadingItineraries: false });
        } catch (error: any) {
            console.error('Failed to fetch itineraries:', error);
            toast.error(error.response?.data?.message || 'Failed to load itineraries');
            set({ isLoadingItineraries: false });
        }
    },

    // Fetch detailed itinerary schedule
    fetchItinerarySchedule: async (itineraryId: string) => {
        set({ isLoadingSchedule: true });
        try {
            const schedule = await driverService.getItinerarySchedule(itineraryId);
            set({ currentSchedule: schedule, isLoadingSchedule: false });
        } catch (error: any) {
            console.error('Failed to fetch schedule:', error);
            toast.error(error.response?.data?.message || 'Failed to load schedule');
            set({ isLoadingSchedule: false });
        }
    },

    // Fetch assigned vehicle
    fetchAssignedVehicle: async () => {
        set({ isLoadingVehicle: true });
        try {
            const vehicle = await driverService.getAssignedVehicle();
            set({ assignedVehicle: vehicle, isLoadingVehicle: false });
        } catch (error: any) {
            console.error('Failed to fetch vehicle:', error);
            toast.error(error.response?.data?.message || 'Failed to load vehicle');
            set({ isLoadingVehicle: false });
        }
    },

    // Update trip status (START, ARRIVED, FINISHED)
    updateTripStatus: async (itineraryId: string, status: string) => {
        try {
            // Call backend API immediately
            await driverService.updateItineraryStatus(itineraryId, status === 'finished' ? 'completed' : 'in_progress');

            console.log(`Trip ${itineraryId} status updated to: ${status}`);
            toast.success(`Trip status updated: ${status.toUpperCase()}`);

            // Refresh the schedule to get updated data from backend
            const schedule = await driverService.getItinerarySchedule(itineraryId);
            set({ currentSchedule: schedule });
        } catch (error: any) {
            console.error('Failed to update status:', error);
            toast.error(error.response?.data?.message || 'Failed to update trip status');
            throw error; // Re-throw so caller knows it failed
        }
    },

    // Clear current schedule
    clearSchedule: () => {
        set({ currentSchedule: null });
    },
}));
