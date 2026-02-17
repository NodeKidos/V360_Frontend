import type { FC } from 'react';
import './ShinyText.css';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: FC<ShinyTextProps> = ({ text, disabled = false, speed = 3, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
            style={{ animationDuration } as React.CSSProperties}
        >
            {text}
        </div>
    );
};

export default ShinyText;
