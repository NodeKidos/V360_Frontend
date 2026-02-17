import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiCheck, FiDownload, FiPlay, FiImage, FiX } from "react-icons/fi";
import memoriesService from "../../../services/memories.service";
import type { Memory, ItineraryMemoryBook } from "../../../services/memories.service";
import { Loader } from "../../ui/Loader";
import { MemorySlideshow } from "./MemorySlideshow";

interface Props {
    itineraryId: string;
    itineraryNumber: string;
}

export const MemorySelectionGrid = ({ itineraryId, itineraryNumber }: Props) => {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [memoryBook, setMemoryBook] = useState<ItineraryMemoryBook | null>(null);
    const [showSlideshow, setShowSlideshow] = useState(false);

    useEffect(() => {
        fetchMemories();
        fetchMemoryBook();
    }, [itineraryId]);

    const fetchMemories = async () => {
        setLoading(true);
        try {
            const data = await memoriesService.getByItinerary(itineraryId);
            setMemories(data);
        } catch (error) {
            console.error("Failed to fetch memories", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMemoryBook = async () => {
        try {
            const data = await memoriesService.getMemoryBook(itineraryId);
            setMemoryBook(data);
        } catch (error: any) {
            // Book might not exist yet, don't log as error if 404
            if (error.response?.status !== 404) {
                console.error("Failed to fetch memory book", error);
            }
            setMemoryBook(null);
        }
    };

    const toggleMediaSelection = async (memoryId: string, url: string, type: 'image' | 'video') => {
        const memory = memories.find(m => m.id === memoryId);
        if (!memory) return;

        if (type === 'image') {
            const currentSelection = memory.selectedImages || [];
            const isSelected = currentSelection.includes(url);
            const newSelection = isSelected ? currentSelection.filter(u => u !== url) : [...currentSelection, url];

            try {
                await memoriesService.updateSelection(memoryId, { selectedImages: newSelection });
                setMemories(memories.map(m => m.id === memoryId ? { ...m, selectedImages: newSelection } : m));
            } catch (error) {
                toast.error("Failed to update image selection");
            }
        } else {
            const currentSelection = memory.selectedVideos || [];
            const isSelected = currentSelection.includes(url);
            const newSelection = isSelected ? currentSelection.filter(u => u !== url) : [...currentSelection, url];

            try {
                await memoriesService.updateSelection(memoryId, { selectedVideos: newSelection });
                setMemories(memories.map(m => m.id === memoryId ? { ...m, selectedVideos: newSelection } : m));
            } catch (error) {
                toast.error("Failed to update video selection");
            }
        }
    };

    const handleGenerate = async () => {
        const hasSelection = memories.some(m =>
            (m.selectedImages && m.selectedImages.length > 0) ||
            (m.selectedVideos && m.selectedVideos.length > 0)
        );
        if (!hasSelection) {
            toast.warning("Please select at least one photo or video first");
            return;
        }

        setGenerating(true);
        try {
            const book = await memoriesService.generateBook(itineraryId);
            setMemoryBook(book);
            toast.success("Memory Book generated successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to generate Memory Book");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <Loader message="Loading memories..." size={100} />;

    const totalSelected = memories.reduce((acc, m) => acc + (m.selectedImages?.length || 0) + (m.selectedVideos?.length || 0), 0);

    return (
        <div className="space-y-8 font-poppins">
            <div className="flex justify-between items-center bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <div>
                    <h3 className="text-xl font-bold text-purple-900">Curation Tools - {itineraryNumber}</h3>
                    <p className="text-purple-700 text-sm">Select photos and videos from customer uploads to include in the book.</p>
                    <div className="mt-2 flex items-center gap-4">
                        <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {totalSelected} Items Selected
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerate}
                        disabled={generating || totalSelected === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${generating || totalSelected === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                            }`}
                    >
                        {generating ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <FiPlay />}
                        {generating ? "Generating..." : "Generate Memory Book"}
                    </button>
                    {memoryBook?.pdfUrl && (
                        <a
                            href={memoryBook.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all hover:shadow-lg"
                        >
                            <FiDownload /> Download PDF
                        </a>
                    )}
                </div>
            </div>

            {memories.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <FiImage className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">No memories have been uploaded for this trip yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {memories.map((memory) => (
                        <div key={memory.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-900">{memory.title || "Untitled Memory"}</h4>
                                    <p className="text-xs text-gray-500">{new Date(memory.date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                    {(memory.images?.length || 0) + (memory.videos?.length || 0)} Items
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 p-1">
                                {[
                                    ...(memory.images || []).map(url => ({ url, type: 'image' as const })),
                                    ...(memory.videos || []).map(url => ({ url, type: 'video' as const }))
                                ].map((item, idx) => {
                                    const isSelected = item.type === 'image'
                                        ? memory.selectedImages?.includes(item.url)
                                        : memory.selectedVideos?.includes(item.url);

                                    return (
                                        <div
                                            key={idx}
                                            className="relative aspect-square cursor-pointer group"
                                            onClick={() => toggleMediaSelection(memory.id, item.url, item.type)}
                                        >
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.url}
                                                    alt={`Trip photo ${idx}`}
                                                    className={`w-full h-full object-cover transition-all ${isSelected ? "brightness-50" : "group-hover:brightness-90"}`}
                                                />
                                            ) : (
                                                <div className="w-full h-full relative">
                                                    <video
                                                        src={item.url}
                                                        className={`w-full h-full object-cover transition-all ${isSelected ? "brightness-50" : "group-hover:brightness-90"}`}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                                                            <FiPlay className="text-purple-600 ml-0.5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-purple-600 text-white p-2 rounded-full shadow-lg">
                                                        <FiCheck size={20} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {memoryBook && (
                <div className="mt-12 bg-gray-900 rounded-3xl p-8 text-white">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold">Digital Slideshow</h3>
                            <p className="text-gray-400">Interactive web experience generated for this trip.</p>
                        </div>
                        <button
                            onClick={() => setShowSlideshow(true)}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md transition-all"
                        >
                            Open Fullscreen
                        </button>
                    </div>

                    <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-black/40">
                            <div className="text-center">
                                <p className="text-xl font-medium mb-4">Click to play memory reel</p>
                                <button
                                    onClick={() => setShowSlideshow(true)}
                                    className="w-20 h-20 bg-white text-purple-600 rounded-full flex items-center justify-center text-3xl hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] mx-auto"
                                >
                                    <FiPlay className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Slideshow Modal */}
            {showSlideshow && memoryBook && (
                <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
                    <button
                        onClick={() => setShowSlideshow(false)}
                        className="absolute top-8 right-8 text-white/70 hover:text-white z-50 transition-colors"
                    >
                        <FiX size={32} />
                    </button>
                    <div className="w-full h-full max-w-6xl max-h-[85vh]">
                        <MemorySlideshow memoryBook={memoryBook} onClose={() => setShowSlideshow(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};
