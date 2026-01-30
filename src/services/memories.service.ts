import { api } from "./api";

export interface Memory {
    id: string;
    title: string;
    description: string;
    images: string[];
    date: string;
    isPublic: boolean;
    booking?: {
        id: string;
        bookingNumber: string;
    };
    itineraryId?: string;
    destinationId?: string;
}

export interface CreateMemoryDto {
    title: string;
    description?: string;
    images: string[];
    date: Date;
    bookingId?: string;
    itineraryId?: string;
    destinationId?: string;
}

const memoriesService = {
    async create(data: CreateMemoryDto): Promise<Memory> {
        const response = await api.post("/memories", data);
        return response.data;
    },

    async uploadImages(bookingId: string, files: File[]): Promise<{ message: string; urls: string[] }> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });

        const response = await api.post(`/memories/upload/booking/${bookingId}`, formData);
        return response.data;
    },

    async uploadItineraryImages(itineraryId: string, files: File[]): Promise<{ message: string; urls: string[] }> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });

        const response = await api.post(`/memories/upload/itinerary/${itineraryId}`, formData);
        return response.data;
    },

    async getByBooking(bookingId: string, destinationId?: string): Promise<Memory[]> {
        const response = await api.get(`/memories/booking/${bookingId}`, {
            params: { destinationId }
        });
        return response.data;
    },

    async getByItinerary(itineraryId: string, destinationId?: string): Promise<Memory[]> {
        const response = await api.get(`/memories/itinerary/${itineraryId}`, {
            params: { destinationId }
        });
        return response.data;
    },

    async getMyMemories(): Promise<Memory[]> {
        const response = await api.get("/memories/my-memories");
        return response.data;
    },

    async delete(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/memories/${id}`);
        return response.data;
    },
};

export default memoriesService;
