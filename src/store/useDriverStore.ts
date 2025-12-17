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

    // Clear current schedule
    clearSchedule: () => {
        set({ currentSchedule: null });
    },
}));
