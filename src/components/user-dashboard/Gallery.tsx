import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import { useDropzone } from "react-dropzone";

import Sidebar from "../AdminSidebar";
import TopBar from "../Topbar";

type FileItem = {
    id: string;
    file: File;
    name: string;
    preview: string;
};

const GalleryUpload = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [files, setFiles] = useState<FileItem[]>([]);

    // ✅ FIXED: your route param name is ":place"
    const { place } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ keep nice name coming from TripPhotos state
    const destinationName = (location?.state as any)?.name || place || "Destination";
    const destinationId = place || "";

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const onDrop = (acceptedFiles: File[]) => {
        const mapped: FileItem[] = acceptedFiles.map((f) => ({
            id: crypto.randomUUID(),
            file: f,
            name: f.name,
            preview: URL.createObjectURL(f),
        }));
        setFiles((prev) => [...mapped, ...prev]);
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
        noClick: true,
    });

    useEffect(() => {
        return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
    }, [files]);

    const filtered = useMemo(() => {
        if (!searchQuery) return files;
        return files.filter((f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [files, searchQuery]);

    const removeOne = (id: string) => setFiles((prev) => prev.filter((x) => x.id !== id));
    const clearAll = () => setFiles([]);

    const handleUpload = async () => {
        // TODO: backend upload (FormData)
        alert(`Upload ${files.length} image(s) to ${destinationName} (${destinationId})`);
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div
                className={`flex-1 p-4 transition-all duration-300 ${collapsed ? "ml-2" : "ml-6"
                    }`}
            >
                <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />
                {/* Search (mobile) */}
                <div className="mb-4 relative md:hidden">
                    <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
                    <input
                        type="text"
                        placeholder="Search here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-[14px] font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
                    />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/memories")}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <IoArrowBackOutline className="text-xl" />
                        </button>

                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Memories</span>
                            <h2 className="text-xl font-semibold text-black -mt-1">
                                Image Gallery
                            </h2>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border border-[#B749DB] text-[#B749DB] font-medium hover:bg-[#B749DB]/10"
                            onClick={() => alert("Add Folder clicked")}
                        >
                            + Add Folder
                        </button>

                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-[#B749DB] text-white font-medium hover:opacity-90 disabled:opacity-50"
                            onClick={handleUpload}
                            disabled={files.length === 0}
                        >
                            Upload
                        </button>
                    </div>
                </div>

                {/* Destination title */}
                <div className="mb-3">
                    <p className="text-sm text-gray-500">Destination</p>
                    <h3 className="text-2xl font-bold text-black">{destinationName}</h3>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`rounded-2xl border-2 border-dashed border-[#B749DB] p-6 md:p-8 ${isDragActive ? "bg-[#B749DB]/5" : "bg-white"
                        }`}
                >
                    <input {...getInputProps()} />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-28 rounded-xl border-2 border-dashed border-[#B749DB]/20 bg-white"
                            />
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <button
                            type="button"
                            onClick={open}
                            className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#D7B5F3] text-[#3b1b49] font-semibold hover:opacity-90"
                        >
                            <FiUploadCloud className="text-xl" />
                            Choose a file or drag and drop it here
                        </button>

                        {files.length > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {filtered.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm text-gray-600 mb-3">
                                Selected: <span className="font-semibold">{filtered.length}</span>
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {filtered.map((f) => (
                                    <div
                                        key={f.id}
                                        className="group relative rounded-xl overflow-hidden border"
                                    >
                                        <img src={f.preview} alt={f.name} className="w-full h-28 object-cover" />

                                        <button
                                            type="button"
                                            onClick={() => removeOne(f.id)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition px-2 py-1 rounded-md bg-black/60 text-white text-xs"
                                        >
                                            Remove
                                        </button>

                                        <div className="p-2">
                                            <p className="text-xs text-gray-700 truncate">{f.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryUpload;
