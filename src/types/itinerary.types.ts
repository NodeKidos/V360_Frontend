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
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
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
  numberOfAdults?: number;
  numberOfChildrenUnder5?: number;
  numberOfChildren5Plus?: number;
  specialRequests?: string;
  notes?: string;
  rejectionReason?: string;
  submittedAt?: string;
  quotedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  lead: any;
  package?: any;
  days?: ItineraryDay[];
  quote?: any;
  negotiations?: any[];
  issues?: any[];
  booking?: any;
  driver?: any;
  driverId?: string;
  assignedAt?: string;
  slackChannelId?: string;
  metadata?: {
    groupComposition?: string;
    hotelCategory?: number;
    roomCategory?: string[];
    vehicleType?: string[];
    duration?: string;
  };
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
  numberOfAdults?: number;
  numberOfChildrenUnder5?: number;
  numberOfChildren5Plus?: number;
  specialRequests?: string;
  metadata?: {
    hotelCategory?: number;
    roomCategory?: string[];
    vehicleType?: string[];
    duration?: string;
  };
  packageId?: string;
  days?: CreateItineraryDayDto[];
  // Guest user fields (for unauthenticated itinerary creation)
  guestEmail?: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestPhone?: string;
  guestCountry?: string;
  guestDateOfBirth?: string;
  guestGender?: string;
  guestMedicalConditions?: string;
  guestDietaryPreferences?: string;
  guestAllergies?: string;
  guestSpecialConditions?: string;
}

export type UpdateItineraryDto = Partial<CreateItineraryDto>;

export interface ItineraryFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  travelerType?: string; // Solo, Couple, or Group
  numberOfParticipants?: number;
  numberOfAdults?: number;
  numberOfChildrenUnder5?: number;
  numberOfChildren5Plus?: number;
  contactNumber: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  duration: string;
  customDuration?: string;
  dietaryPreferences: string;
  hotelCategory: number;
  roomCategory: string[];
  vehicleType: string[];
  medicalConditions: string;
  allergies?: string;
  specialConditions?: string;
  specialRequirements: string;
  groupComposition?: string;
  selectedDestinations?: {
    [destinationName: string]: {
      hotels?: any[];  // Changed from hotel?: any to hotels?: any[] for multi-selection
      excursions?: any[];
    };
  };
  selectedCities?: string[];
}