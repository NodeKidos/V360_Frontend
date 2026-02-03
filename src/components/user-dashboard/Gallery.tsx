import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import memoriesService from "../../services/memories.service";
import type { Memory } from "../../services/memories.service";
import { Loader } from "../ui/Loader";

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

  const [itineraryMemories, setItineraryMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  const { place: itineraryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const destinationName = (location?.state as any)?.name || "Trip Memory Book";
  const destinationId = (location?.state as any)?.destinationId;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchMemories = async () => {
    if (!itineraryId) return;
    setLoading(true);
    try {
      const data = await memoriesService.getByItinerary(itineraryId, destinationId);
      setItineraryMemories(data);
    } catch (error) {
      console.error("Failed to fetch memories:", error);
      toast.error("Failed to load memories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [itineraryId, destinationId]);

  /* ---------- FILE HANDLING ---------- */
  const addFiles = (acceptedFiles: File[]) => {
    const mapped: FileItem[] = acceptedFiles
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        name: f.name,
        preview: URL.createObjectURL(f),
      }));

    setFiles((prev) => [...mapped, ...prev]); // newest first
  };

  const onDrop = (acceptedFiles: File[]) => addFiles(acceptedFiles);

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
    return files;
  }, [files]);

  const removeOne = async (id: string, isFromBackend: boolean = false) => {
    if (isFromBackend) {
      if (!window.confirm("Are you sure you want to delete this memory?")) return;
      try {
        await memoriesService.delete(id);
        toast.success("Memory deleted");
        fetchMemories();
      } catch (error) {
        toast.error("Failed to delete memory");
      }
    } else {
      setFiles((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const clearAll = () => setFiles([]);

  /* ---------- UPLOAD ---------- */
  const handleUpload = async () => {
    if (files.length === 0) {
      open();
      return;
    }

    if (!itineraryId) return;

    setIsUploading(true);
    try {
      // 1. Upload files to S3
      const fileObjects = files.map(f => f.file);
      const { urls } = await memoriesService.uploadItineraryImages(itineraryId, fileObjects);

      // 2. Create memory records for each or group them
      // For now, let's create one memory record with all images
      await memoriesService.create({
        title: `Memories from ${destinationName}`,
        description: `Uploaded on ${new Date().toLocaleDateString()}`,
        images: urls,
        date: new Date(),
        itineraryId,
        destinationId,
      });

      toast.success("Memories uploaded successfully!");
      setFiles([]);
      fetchMemories();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload memories");
    } finally {
      setIsUploading(false);
    }
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

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/memories", { state: { selectedItineraryId: itineraryId } })}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <IoArrowBackOutline className="text-xl" />
            </button>

            <div>
              <p className="text-sm text-gray-500">Memories for</p>
              <h2 className="text-xl font-semibold">{destinationName}</h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition shadow-sm ${isUploading || files.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#B749DB] text-white hover:bg-[#a33cc4]"
                }`}
            >
              {isUploading ? "Uploading..." : "Save Memories"}
            </button>
          </div>
        </div>

        {/* EXISTING MEMORIES */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Saved Memories</h3>
          {loading ? (
            <Loader size={100} />
          ) : itineraryMemories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {itineraryMemories.flatMap(m => m.images.map(imgUrl => (
                <div key={imgUrl} className="group relative rounded-xl overflow-hidden shadow-sm border h-40">
                  <img src={imgUrl} className="w-full h-full object-cover" alt="Memory" />
                  <button
                    onClick={() => removeOne(m.id, true)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600/80 text-white p-1.5 rounded-full transition"
                    title="Delete Memory"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              )))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-500">
              No memories uploaded yet for this trip.
            </div>
          )}
        </div>

        {/* DROPZONE */}
        <div
          {...getRootProps()}
          className={`rounded-2xl border-2 border-dashed border-[#B749DB] p-6 mb-8 ${isDragActive ? "bg-[#B749DB]/5" : "bg-white"
            }`}
        >
          <input {...getInputProps()} />

          {/*   PREVIEW ON TOP */}
          {filtered.length > 0 ? (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Selected for upload:{" "}
                <span className="font-semibold">{filtered.length}</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {filtered.map((f) => (
                  <div
                    key={f.id}
                    className="group relative rounded-xl overflow-hidden border"
                  >
                    <img
                      src={f.preview}
                      alt={f.name}
                      className="w-full h-28 object-cover"
                    />

                    <button
                      onClick={(e) => { e.stopPropagation(); removeOne(f.id); }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs px-2 py-1 rounded"
                    >
                      <IoClose className="text-sm" />
                    </button>

                    <div className="p-2 bg-white">
                      <p className="text-xs truncate">{f.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">
                Drag and drop images here to add to your Memory Book
              </p>
            </div>
          )}

          {/* dashed boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-white" />
            ))}
          </div>

          {/* upload button */}
          <div className="flex flex-col items-center gap-3">
            <button
              disabled={isUploading}
              onClick={open}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#D7B5F3] font-semibold hover:bg-[#c9a1eb] transition"
            >
              <FiUploadCloud className="text-xl" />
              {isUploading ? "Uploading..." : "Choose a file or drag and drop it here"}
            </button>

            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-gray-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default GalleryUpload;
