import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import type { ItineraryMemoryBook } from "../../../services/memories.service";
import ShinyText from "../../ui/ShinyText";
import AntigravityBackground from "../../ui/AntigravityBackground";

interface Props {
    memoryBook: ItineraryMemoryBook;
    onClose?: () => void;
}

export const MemorySlideshow = ({ memoryBook, onClose }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(-1); // -1 for opening slide
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const sequence = memoryBook.slideshowConfig.sequence;
    const currentItem = currentIndex === -1 ? null : sequence[currentIndex];

    const quotes = [
        "Adventure is worthwhile in itself.",
        "Traveling – it leaves you speechless, then turns you into a storyteller.",
        "To travel is to live.",
        "The world is a book and those who do not travel read only one page.",
        "Life is either a daring adventure or nothing at all."
    ];

    useEffect(() => {
        let timer: any;
        if (isPlaying) {
            const duration = currentIndex === -1 ? 4 : (currentItem?.duration || 4);
            timer = setTimeout(() => {
                nextSlide();
            }, duration * 1000);
        }
        return () => clearTimeout(timer);
    }, [currentIndex, isPlaying]);

    const nextSlide = () => {
        if (currentIndex === sequence.length - 1) {
            setCurrentIndex(-1); // Loop back to start
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex === -1) {
            setCurrentIndex(sequence.length - 1);
        } else {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className={`relative bg-black flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${isFullscreen ? 'fixed inset-0 z-[10000]' : 'w-full h-full rounded-2xl shadow-2xl'}`}>
            {/* Background Transitions */}
            <div className="absolute inset-0 overflow-hidden opacity-40 select-none pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`bg-${currentIndex}`}
                        className="absolute inset-0 bg-cover bg-center blur-3xl scale-110"
                        style={{ backgroundImage: currentItem && currentItem.type !== 'video' ? `url(${currentItem.url})` : 'none' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                    />
                </AnimatePresence>
                <AntigravityBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Content Area */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {currentIndex === -1 ? (
                        <motion.div
                            key="intro"
                            className="text-center space-y-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 1.2 }}
                        >
                            <motion.span
                                className="block text-purple-400 font-bold tracking-[0.3em] uppercase text-sm"
                                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                                transition={{ delay: 0.5, duration: 1 }}
                            >
                                Vibes Lanka Presents
                            </motion.span>
                            <div className="text-4xl md:text-7xl font-bold tracking-tight">
                                <ShinyText text="Our Sri Lankan Journey" speed={3} className="text-white" />
                            </div>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full" />
                            <p className="text-white/60 text-lg font-light tracking-wide max-w-lg mx-auto italic">
                                "Every journey has a secret destination of which the traveler is unaware."
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentIndex}
                            className="relative max-w-full max-h-full flex flex-col items-center"
                            initial={{ opacity: 0, x: 100, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -100, scale: 1.05 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <motion.div
                                className="relative group"
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                {currentItem?.type === 'video' ? (
                                    <video
                                        src={currentItem?.url}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-[75vh] w-auto max-w-full object-contain shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10"
                                    />
                                ) : (
                                    <img
                                        src={currentItem?.url}
                                        alt={currentItem?.caption}
                                        className="h-[75vh] w-auto max-w-full object-contain shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10"
                                    />
                                )}
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all duration-500 pointer-events-none" />
                            </motion.div>

                            {/* Caption & Animated Quote - Moved closer to content */}
                            <div className="absolute bottom-4 left-0 right-0 z-30 text-center space-y-2 px-4 pointer-events-none">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <ShinyText
                                        text={currentItem?.caption || "Trip Memory"}
                                        speed={4}
                                        className="text-xl md:text-2xl font-bold drop-shadow-lg"
                                    />
                                </motion.div>

                                <motion.p
                                    className="text-purple-300/90 font-medium italic text-sm md:text-base drop-shadow-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    "{quotes[currentIndex % quotes.length]}"
                                </motion.p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Premium Controls - Moved to top right or static position? Let's keep bottom but ensure z-index and spacing */}
            <div className="absolute bottom-8 z-50 flex items-center gap-4 px-6 py-3 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:bg-black/60">
                <button onClick={prevSlide} className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                    <FiChevronLeft size={24} />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-purple-500/20"
                >
                    {isPlaying ? (
                        <div className="flex gap-1.5">
                            <div className="w-2 h-5 bg-black rounded-sm" />
                            <div className="w-2 h-5 bg-black rounded-sm" />
                        </div>
                    ) : (
                        <div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-black border-b-[10px] border-b-transparent" />
                    )}
                </button>

                <button onClick={nextSlide} className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                    <FiChevronRight size={24} />
                </button>

                <div className="w-px h-8 bg-white/10 mx-2" />

                <button onClick={toggleFullscreen} className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                    {isFullscreen ? <FiMinimize2 size={24} /> : <FiMaximize2 size={24} />}
                </button>

                {onClose && (
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                        <FiX size={24} />
                    </button>
                )}
            </div>

            {/* Dynamic Progress Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 z-30">
                {isPlaying && (
                    <motion.div
                        key={`progress-${currentIndex}`}
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-[length:200%_100%]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%", backgroundPosition: ["0% 0%", "100% 0%"] }}
                        transition={{
                            width: { duration: currentIndex === -1 ? 4 : (currentItem?.duration || 4), ease: "linear" },
                            backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                        }}
                    />
                )}
            </div>

            {/* Metadata Badges */}
            <div className="absolute top-10 right-10 z-20 flex items-center gap-4">
                <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl text-white/50 text-sm font-bold border border-white/5">
                    {currentIndex === -1 ? "INTRO" : `${currentIndex + 1} / ${sequence.length}`}
                </div>
            </div>

            <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-purple-900/40">V</div>
                <div className="flex flex-col">
                    <span className="text-white font-bold tracking-widest text-[10px] leading-none uppercase">Vibes Lanka</span>
                    <span className="text-purple-400 font-medium text-[8px] leading-tight tracking-[0.2em] uppercase">Memories</span>
                </div>
            </div>
        </div>
    );
};
