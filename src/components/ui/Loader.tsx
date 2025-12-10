import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

interface LoaderProps {
    className?: string;
    src?: string;
    size?: number;
    message?: string;
    fullScreen?: boolean;
}

export const Loader = ({
    className = "",
    src = "/loaders/Traveler.lottie",
    size = 300,
    message,
    fullScreen = false
}: LoaderProps) => {
    const containerClass = fullScreen
        ? "flex flex-col justify-center items-center min-h-screen"
        : "flex flex-col justify-center items-center py-20";

    return (
        <div className={`${containerClass} ${className}`}>
            <DotLottiePlayer
                src={src}
                autoplay
                loop
                style={{ width: size, height: size }}
            />
            {message && (
                <p className="mt-4 text-gray-600 font-poppins text-base md:text-lg text-center px-4">
                    {message}
                </p>
            )}
        </div>
    );
};
