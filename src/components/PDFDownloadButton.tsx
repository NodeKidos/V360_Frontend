import React, { useState } from 'react';
import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import pdfService from '../services/pdf.service';
import { toast } from 'react-toastify';

interface PDFDownloadButtonProps {
    itineraryId: string;
    itineraryNumber: string;
    variant?: 'download' | 'preview' | 'both';
    className?: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
    itineraryId,
    itineraryNumber,
    variant = 'both',
    className = '',
}) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            await pdfService.downloadPDF(itineraryId, itineraryNumber);
            toast.success('PDF downloaded successfully!');
        } catch (error: any) {
            console.error('Error downloading PDF:', error);
            toast.error(error.response?.data?.message || 'Failed to download PDF');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        try {
            setLoading(true);
            await pdfService.previewPDF(itineraryId);
        } catch (error: any) {
            console.error('Error previewing PDF:', error);
            toast.error(error.response?.data?.message || 'Failed to preview PDF');
        } finally {
            setLoading(false);
        }
    };

    if (variant === 'preview') {
        return (
            <button
                onClick={handlePreview}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        <FaEye />
                        <span>Preview PDF</span>
                    </>
                )}
            </button>
        );
    }

    if (variant === 'download') {
        return (
            <button
                onClick={handleDownload}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Downloading...</span>
                    </>
                ) : (
                    <>
                        <FaDownload />
                        <span>Download PDF</span>
                    </>
                )}
            </button>
        );
    }

    // Both buttons
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={handlePreview}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Preview PDF"
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <FaEye />
                )}
                <span className="hidden sm:inline">Preview</span>
            </button>

            <button
                onClick={handleDownload}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Download PDF"
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <FaFilePdf />
                )}
                <span className="hidden sm:inline">Download</span>
            </button>
        </div>
    );
};

export default PDFDownloadButton;
