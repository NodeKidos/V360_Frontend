import { create } from 'zustand';
import { driverService, type ItinerarySummary, type ItinerarySchedule, type Vehicle } from '../services/driver.service';
import { toast } from 'react-toastify';

interface DriverState {
    // Itineraries
    itineraries: ItinerarySummary[];
    currentSchedule: ItinerarySchedule | null;
    isLoadingItineraries: boolean;
    isLoadingSchedule: boolean;

    // Vehicles (now supports multiple)
    assignedVehicles: any[];
    isLoadingVehicles: boolean;

    // Actions
    fetchAssignedItineraries: () => Promise<void>;
    fetchItinerarySchedule: (itineraryId: string) => Promise<void>;
    fetchAssignedVehicles: () => Promise<void>;
    updateTripStatus: (itineraryId: string, status: string) => Promise<void>;
    clearSchedule: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
    // Initial state
    itineraries: [],
    currentSchedule: null,
    isLoadingItineraries: false,
    isLoadingSchedule: false,
    assignedVehicles: [],
    isLoadingVehicles: false,

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

    // Fetch assigned vehicles (now returns array)
    fetchAssignedVehicles: async () => {
        set({ isLoadingVehicles: true });
        try {
            const vehicles = await driverService.getAssignedVehicles();
            set({ assignedVehicles: vehicles, isLoadingVehicles: false });
        } catch (error: any) {
            console.error('Failed to fetch vehicles:', error);
            toast.error(error.response?.data?.message || 'Failed to load vehicles');
            set({ isLoadingVehicles: false });
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
