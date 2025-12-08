import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

interface LoaderProps {
    className?: string; // Container styles
    src?: string;       // Path to lottie file
    width?: string | number;
    height?: string | number;
}

export const Loader = ({
    className = "w-24 h-24",
    src = "/loaders/loginloading.lottie",
    width,
    height
}: LoaderProps) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <DotLottiePlayer
                src={src}
                autoplay
                loop
                style={{
                    width: width || '100%',
                    height: height || '100%'
                }}
            />
        </div>
    );
};
