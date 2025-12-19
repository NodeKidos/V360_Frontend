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

  // Get driver earnings and statistics
  getEarnings: async () => {
    const response = await axios.get(`${API_URL}/earnings`, getAuthHeader());
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

  // Update trip status (START, ARRIVED, FINISHED)
  updateTripStatus: async (itineraryId: string, locationId: string, status: 'started' | 'arrived' | 'completed') => {
    const response = await axios.patch(
      `${API_URL}/itineraries/${itineraryId}/locations/${locationId}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  },

  // Update overall itinerary status
  updateItineraryStatus: async (itineraryId: string, status: 'in_progress' | 'completed') => {
    const response = await axios.patch(
      `${API_URL}/itineraries/${itineraryId}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  },

  // Get location progress for an itinerary
  getLocationProgress: async (itineraryId: string) => {
    const response = await axios.get(
      `${API_URL}/itineraries/${itineraryId}/progress`,
      getAuthHeader()
    );
    return response.data;
  },

  // Update specific location progress
  updateLocationProgress: async (
    itineraryId: string,
    locationId: string,
    status: 'not_started' | 'started' | 'arrived' | 'completed'
  ) => {
    const response = await axios.patch(
      `${API_URL}/itineraries/${itineraryId}/locations/${locationId}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  },

  // Get assigned vehicles
  getAssignedVehicles: async () => {
    const response = await axios.get(
      `${API_URL}/vehicles`,
      getAuthHeader()
    );
    return response.data;
  },
};
