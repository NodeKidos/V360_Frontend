export enum ItineraryType {
  PACKAGE = 'package',
  CUSTOM = 'custom',
}

export enum ItineraryStatus {
  DRAFT = 'draft',
  PENDING_QUOTE = 'pending_quote',
  QUOTED = 'quoted',
  NEGOTIATING = 'negotiating',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  CONVERTED = 'converted',
}

export type ItineraryDay = {
  id?: string;
  dayNumber: number;
  date: string;
  title?: string;
  description?: string;
  notes?: string;
  destinationId?: string;
  hotelId?: string;
  excursionIds?: string[];
  destination?: any;
  hotel?: any;
  excursions?: any[];
}

export type Itinerary = {
  id: string;
  itineraryNumber: string;
  type: ItineraryType;
  status: ItineraryStatus;
  startDate: string;
  endDate: string;
  numberOfParticipants: number;
  specialRequests?: string;
  notes?: string;
  rejectionReason?: string;
  submittedAt?: string;
  quotedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  lead: any;
  package?: any;
  days?: ItineraryDay[];
  quote?: any;
  negotiations?: any[];
  issues?: any[];
  booking?: any;
  createdAt: string;
  updatedAt: string;
}

export type CreateItineraryDayDto = {
  dayNumber: number;
  date: string;
  title?: string;
  description?: string;
  notes?: string;
  destinationId?: string;
  hotelId?: string;
  excursionIds?: string[];
}

export type CreateItineraryDto = {
  type: ItineraryType;
  startDate: string;
  endDate: string;
  numberOfParticipants: number;
  specialRequests?: string;
  packageId?: string;
  days?: CreateItineraryDayDto[];
}

export type UpdateItineraryDto = Partial<CreateItineraryDto>;

export interface ItineraryFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  groupComposition: string;
  contactNumber: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  duration: string;
  dietaryPreferences: string;
  hotelCategory: number;
  roomCategory: string[];
  vehicleType: string[];
  medicalConditions: string;
  specialRequirements: string;
  selectedDestinations?: {
    [destinationName: string]: {
      hotel?: any;
      excursions?: any[];
    };
  };
  selectedCities?: string[];
}