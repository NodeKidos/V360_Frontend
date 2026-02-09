import api from './api';

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
  allDestinations?: string[];
  totalDays?: number;
  totalHotels?: number;
  totalExcursions?: number;
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
    customerPhone?: string;
    customerEmail?: string;
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
  make?: string;
  model: string;
  year?: number;
  type: string;
  plateNumber: string;
  registrationNumber?: string;
  capacity: number;
  status: string;
  fuelType?: string;
  fuelEfficiency?: number;
  mileage?: number;
  color?: string;
  insuranceExpiry?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  features?: string[];
  currentMileage?: number;
}

export const driverService = {
  // Get all assigned itineraries
  getAssignedItineraries: async (): Promise<ItinerarySummary[]> => {
    const response = await api.get<ItinerarySummary[]>('/driver/itineraries');
    return response.data;
  },

  // Get detailed itinerary schedule
  getItinerarySchedule: async (itineraryId: string): Promise<ItinerarySchedule> => {
    const response = await api.get<ItinerarySchedule>(`/driver/itineraries/${itineraryId}/schedule`);
    return response.data;
  },

  // Get assigned vehicle
  getAssignedVehicle: async (): Promise<Vehicle | null> => {
    const response = await api.get<Vehicle | null>('/driver/vehicle');
    return response.data;
  },

  // Get driver profile
  getProfile: async () => {
    const response = await api.get('/driver/profile');
    return response.data;
  },

  // Get driver earnings and statistics
  getEarnings: async () => {
    const response = await api.get('/driver/earnings');
    return response.data;
  },

  // Update driver location
  updateLocation: async (location: { lat: number; lng: number }) => {
    const response = await api.put('/driver/location', { location });
    return response.data;
  },

  // Update trip status (START, ARRIVED, FINISHED)
  updateTripStatus: async (itineraryId: string, locationId: string, status: 'started' | 'arrived' | 'completed') => {
    const response = await api.patch(
      `/driver/itineraries/${itineraryId}/locations/${locationId}/status`,
      { status }
    );
    return response.data;
  },

  // Update overall itinerary status
  updateItineraryStatus: async (itineraryId: string, status: 'in_progress' | 'completed') => {
    const response = await api.patch(`/driver/itineraries/${itineraryId}/status`, { status });
    return response.data;
  },

  // Get location progress for an itinerary
  getLocationProgress: async (itineraryId: string) => {
    const response = await api.get(`/driver/itineraries/${itineraryId}/progress`);
    return response.data;
  },

  // Update specific location progress
  updateLocationProgress: async (
    itineraryId: string,
    locationId: string,
    status: 'not_started' | 'started' | 'arrived' | 'completed'
  ) => {
    const response = await api.patch(
      `/driver/itineraries/${itineraryId}/locations/${locationId}/status`,
      { status }
    );
    return response.data;
  },

  // Get assigned vehicles
  getAssignedVehicles: async () => {
    const response = await api.get('/driver/vehicles');
    return response.data;
  },
};
