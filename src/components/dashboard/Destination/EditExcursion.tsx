import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import StarRating from "../../ui/StarRating";
import excursionService from "../../../services/excursion.service";
import destinationService from "../../../services/destination.service";

export default function EditExcursion() {
  const navigate = useNavigate();
  const { excursionId: id } = useParams(); // Match route param name from App.tsx
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [excursionName, setExcursionName] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [excursionImages, setExcursionImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch destinations
        const destinationsData = await destinationService.getAll();
        setAvailableDestinations(destinationsData);

        // Fetch excursion data
        if (id) {
          const excursion = await excursionService.getById(id);
          setExcursionName(excursion.name);
          setDescription(excursion.description || "");
          setDestinationId(excursion.destination?.id || "");
          setBestTime(excursion.bestTime || "");
          setDuration(excursion.duration?.toString() || "");
          setPrice(excursion.price?.toString() || "");
          setDifficulty(excursion.difficulty || "easy");
          setRating(excursion.rating || 0);
          setCategory(excursion.category || "");
          setExistingImages(excursion.images || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load excursion details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setExcursionImages(Array.from(event.target.files));
    }
  };

  const removeExistingImage = (imgUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imgUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excursionName || !destinationId || !bestTime || !duration || !price || !description || !category) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", excursionName);
      formData.append("description", description);
      formData.append("destinationId", destinationId);
      formData.append("bestTime", bestTime);
      formData.append("duration", duration);
      formData.append("price", price);
      formData.append("difficulty", difficulty);
      formData.append("rating", rating.toString());
      formData.append("category", category);

      // Append existing images that were kept
      existingImages.forEach((img) => {
        formData.append("existingImages[]", img);
      });

      // Append new images
      excursionImages.forEach((image) => {
        formData.append("images", image);
      });

      if (id) {
        await excursionService.update(id, formData);
        toast.success("Excursion updated successfully!");
        setTimeout(() => {
          navigate("/destination-hotel");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error updating excursion:", error);
      toast.error(error.response?.data?.message || "Failed to update excursion");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-[#515151]">
        <div className="w-12 h-12 border-4 border-[#B749DB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden text-[#515151]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins text-left">
            <span className="text-gray-500 cursor-pointer text-left" onClick={() => navigate("/destination-hotel")}>
              Excursion
            </span>
            <span className="text-gray-500">›</span>
            <span className="font-semibold text-black">Edit Excursion</span>
          </div>

          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm relative overflow-hidden">
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-[#B749DB] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-[#B749DB]">Updating Excursion...</p>
              </div>
            )}

            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins text-left">
                Edit Excursion
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins text-left">
                Update the excursion details
              </p>
            </div>

            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Excursion Name</label>
                  <input
                    type="text"
                    value={excursionName}
                    onChange={(e) => setExcursionName(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Select Destination</label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  >
                    <option value="">Select a destination</option>
                    {availableDestinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  >
                    <option value="">Select Category</option>
                    <option value="historical_cultural">Historical & Cultural</option>
                    <option value="beach_nature">Beach & Nature</option>
                    <option value="hiking_spiritual">Hiking & Spiritual</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="relaxation">Relaxation</option>
                    <option value="urban">Urban</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="difficult">Difficult</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Price (USD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Best Time</label>
                  <input
                    type="text"
                    value={bestTime}
                    onChange={(e) => setBestTime(e.target.value)}
                    className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Rating</label>
                  <div className="mt-2 text-2xl">
                    <StarRating
                      rating={rating}
                      onRatingChange={setRating}
                      maxStars={5}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins text-left">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins font-semibold">Excursion Images</label>

                {existingImages.length > 0 && (
                  <div className="mb-4 mt-2">
                    <p className="text-sm text-gray-500 font-poppins mb-2">Current Images:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {existingImages.map((img, index) => (
                        <div key={index} className="relative border border-purple-200 rounded-lg p-1 group">
                          <img
                            src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}${img}`}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover rounded shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500 font-poppins mb-2">Add New Images:</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />

                {excursionImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 font-poppins">{excursionImages.length} new image(s) selected</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
                      {excursionImages.map((file, index) => (
                        <div key={index} className="relative border border-purple-200 rounded-lg p-1 group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setExcursionImages(excursionImages.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row justify-end gap-3 md:gap-4 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/destination-hotel")}
                  className="px-6 md:px-10 py-2.5 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 md:px-10 py-2.5 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-semibold shadow-md transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Excursion"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
