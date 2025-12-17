import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/driver`;

// Helper to get auth token
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

export interface ItinerarySummary {
  id: string;
  itineraryNumber: string;
  customerName: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  numberOfParticipants: number;
  assignedVehicle?: {
    id: string;
    name: string;
    plateNumber: string;
  };
}

export interface ItinerarySchedule {
  itinerary: {
    id: string;
    itineraryNumber: string;
    customerName: string;
    startDate: string;
    endDate: string;
    status: string;
    numberOfParticipants: number;
    specialRequests?: string;
    vehicle?: any;
  };
  schedule: Array<{
    dayNumber: number;
    date: string;
    destination: any;
    hotel: any;
    excursions: any[];
    notes?: string;
  }>;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  plateNumber: string;
  capacity: number;
  status: string;
  currentMileage?: number;
}

export const driverService = {
  // Get all assigned itineraries
  getAssignedItineraries: async (): Promise<ItinerarySummary[]> => {
    const response = await axios.get(`${API_URL}/itineraries`, getAuthHeader());
    return response.data;
  },

  // Get detailed itinerary schedule
  getItinerarySchedule: async (itineraryId: string): Promise<ItinerarySchedule> => {
    const response = await axios.get(
      `${API_URL}/itineraries/${itineraryId}/schedule`,
      getAuthHeader()
    );
    return response.data;
  },

  // Get assigned vehicle
  getAssignedVehicle: async (): Promise<Vehicle | null> => {
    const response = await axios.get(`${API_URL}/vehicle`, getAuthHeader());
    return response.data;
  },

  // Get driver profile
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeader());
    return response.data;
  },

  // Update driver location
  updateLocation: async (location: { lat: number; lng: number }) => {
    const response = await axios.put(
      `${API_URL}/location`,
      { location },
      getAuthHeader()
    );
    return response.data;
  },
};
