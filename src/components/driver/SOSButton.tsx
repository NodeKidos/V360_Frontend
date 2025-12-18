import React from 'react';

interface SOSButtonProps {
    onClick?: () => void;
    disabled?: boolean;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onClick, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 
        flex items-center justify-center shadow-lg 
        transition-all duration-200 transform hover:scale-110
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
            title="Emergency SOS"
        >
            <span className="text-white font-bold text-lg">SOS</span>
        </button>
    );
};

export default SOSButton;
