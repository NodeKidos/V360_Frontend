import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";
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

type FolderItem = {
  id: string;
  name: string;
};

const GalleryUpload = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const { place } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const destinationName =
    (location?.state as any)?.name || place || "Destination";
  const destinationId = place || "";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (!searchQuery) return files;
    return files.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const removeOne = (id: string) =>
    setFiles((prev) => prev.filter((x) => x.id !== id));
  const clearAll = () => setFiles([]);

  /* ---------- FOLDER ---------- */
  const handleAddFolder = () => {
    const name = prompt("Folder name?");
    if (!name) return;

    const newFolder: FolderItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };

    setFolders((prev) => [newFolder, ...prev]);
    setActiveFolderId(newFolder.id);
  };

  const activeFolderName =
    folders.find((f) => f.id === activeFolderId)?.name ||
    "No folder selected";

  const handleFolderPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    addFiles(picked);
    e.target.value = "";
  };

  /* ---------- UPLOAD ---------- */
  const handleUpload = async () => {
    if (files.length === 0) {
      open();
      return;
    }

    alert(
      `Uploading ${files.length} image(s)\nDestination: ${destinationName} (${destinationId})\nFolder: ${activeFolderName}`
    );
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
        className={`flex-1 p-4 transition-all duration-300 ${
          collapsed ? "ml-2" : "ml-6"
        }`}
      >
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/memories")}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <IoArrowBackOutline className="text-xl" />
            </button>

            <div>
              <p className="text-sm text-gray-500">Memories</p>
              <h2 className="text-xl font-semibold">Image Gallery</h2>
            </div>
          </div>

          <div className="flex gap-2">
            <label className="px-4 py-2 rounded-lg border border-[#B749DB] text-[#B749DB] cursor-pointer">
              Add Folder
              <input
                type="file"
                // @ts-ignore
                webkitdirectory="true"
                multiple
                hidden
                onChange={handleFolderPick}
              />
            </label>

            <button
              onClick={handleAddFolder}
              className="px-4 py-2 rounded-lg border border-[#B749DB] text-[#B749DB]"
            >
              + New Folder
            </button>

            <button
              onClick={handleUpload}
              className="px-4 py-2 rounded-lg bg-[#B749DB] text-white"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Destination */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Destination</p>
          <h3 className="text-2xl font-bold">{destinationName}</h3>
          <p className="text-sm text-gray-500">
            Selected Folder:{" "}
            <span className="font-semibold">{activeFolderName}</span>
          </p>
        </div>

        {/* Folder chips */}
        {folders.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFolderId(f.id)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  activeFolderId === f.id
                    ? "bg-[#B749DB] text-white"
                    : "bg-white"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {/* DROPZONE */}
        <div
          {...getRootProps()}
          className={`rounded-2xl border-2 border-dashed border-[#B749DB] p-6 ${
            isDragActive ? "bg-[#B749DB]/5" : "bg-white"
          }`}
        >
          <input {...getInputProps()} />

          {/* ✅ PREVIEW ON TOP */}
          {filtered.length > 0 ? (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Selected:{" "}
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
                      onClick={() => removeOne(f.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs px-2 py-1 rounded"
                    >
                     <IoClose className="text-sm" />
                    </button>

                    <div className="p-2">
                      <p className="text-xs truncate">{f.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center mt-6">
              No images selected yet.
            </p>
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
              onClick={open}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#D7B5F3] font-semibold"
            >
              <FiUploadCloud className="text-xl" />
              Choose a file or drag and drop it here
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
      </div>
    </div>
  );
};

export default GalleryUpload;
