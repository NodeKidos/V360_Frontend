import axios from './api';

class PDFService {
    /**
     * Generate PDF for itinerary (inline view)
     */
    async generatePDF(itineraryId: string): Promise<Blob> {
        const response = await axios.get(`/itineraries/${itineraryId}/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Download PDF for itinerary
     */
    async downloadPDF(itineraryId: string, itineraryNumber: string): Promise<void> {
        const response = await axios.get(`/itineraries/${itineraryId}/pdf/download`, {
            responseType: 'blob',
        });

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `itinerary-${itineraryNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Preview PDF in new tab
     */
    async previewPDF(itineraryId: string): Promise<void> {
        const response = await axios.get(`/itineraries/${itineraryId}/pdf`, {
            responseType: 'blob',
        });

        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }
}

export default new PDFService();
