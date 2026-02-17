import { api } from "./api";

export interface Memory {
    id: string;
    title: string;
    description: string;
    images: string[];
    videos?: string[];
    date: string;
    isPublic: boolean;
    booking?: {
        id: string;
        bookingNumber: string;
    };
    itineraryId?: string;
    destinationId?: string;
    selectedImages?: string[];
    selectedVideos?: string[];
}

export interface ItineraryMemoryBook {
    id: string;
    itineraryId: string;
    pdfUrl: string;
    slideshowConfig: {
        sequence: {
            url: string;
            type?: 'image' | 'video';
            caption?: string;
            duration?: number;
            transition?: string;
        }[];
        musicUrl?: string;
        theme?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateMemoryDto {
    title: string;
    description?: string;
    images: string[];
    videos?: string[];
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

    async uploadLargeFile(
        file: File,
        target: { itineraryId?: string; bookingId?: string },
        onProgress: (progress: number) => void
    ): Promise<string> {
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        // 1. Init
        const initResp = await api.post("/memories/upload/init", {
            fileName: file.name,
            mimetype: file.type,
            ...target
        });
        const { uploadId, key } = initResp.data;

        const parts: { ETag: string; PartNumber: number }[] = [];

        // 2. Upload chunks
        for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append("chunk", chunk);
            formData.append("uploadId", uploadId);
            formData.append("key", key);
            formData.append("partNumber", (i + 1).toString());

            let retries = 3;
            let success = false;
            while (retries > 0 && !success) {
                try {
                    const chunkResp = await api.post("/memories/upload/chunk", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    parts.push(chunkResp.data);
                    success = true;
                    onProgress(Math.round(((i + 1) / totalChunks) * 100));
                } catch (error) {
                    retries--;
                    if (retries === 0) throw error;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s before retry
                }
            }
        }

        // 3. Complete
        const completeResp = await api.post("/memories/upload/complete", {
            uploadId,
            key,
            parts
        });

        return completeResp.data.url;
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

    async updateSelection(id: string, selection: { selectedImages?: string[]; selectedVideos?: string[] }): Promise<Memory> {
        const response = await api.patch(`/memories/${id}/selection`, selection);
        return response.data;
    },

    async generateBook(itineraryId: string): Promise<ItineraryMemoryBook> {
        const response = await api.post(`/memories/itinerary/${itineraryId}/generate-book`);
        return response.data;
    },

    async getMemoryBook(itineraryId: string): Promise<ItineraryMemoryBook> {
        const response = await api.get(`/memories/itinerary/${itineraryId}/book`);
        return response.data;
    },
};

export default memoriesService;
