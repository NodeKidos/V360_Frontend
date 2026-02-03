import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    altText?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText = "Image Preview" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 transition-all duration-300">
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <FaTimes size={24} />
                </button>

                <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}>
                    <img
                        src={imageUrl}
                        alt={altText}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
