import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";

export default function EditExcursion() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { id } = useParams();
  const [excursionData, setExcursionData] = useState({
    name: "",
    location: "",
    category: "",
    bestTime: "",
    duration: "",
    rating: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch the excursion data based on the `id` (replace with actual API call)
    setExcursionData({
      name: "Sigiriya Guided Climb",
      location: "Sigiriya",
      category: "Adventure & Cultural",
      bestTime: "Jan – Apr",
      duration: "4 hrs",
      rating: 4.8,
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Logic for updating the excursion (replace with actual logic)
    toast.success("Excursion updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate("/excursion"); // Redirect to the excursion list page
    }, 2000);
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar
           collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />    
        {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/destination-hotel")}>
                            Hotel
                        </span>
                        <span className="text-gray-500">›</span>
                        <span className="font-semibold text-black">Edit Hotel</span>
                    </div>
                    {/* Form Container */}
                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
                        {/* Title */}
                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                                Edit Hotel
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Update the hotel details
                            </p>
                        </div>
      
           {/* FORM START */}
                        <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {/* Excursion Name */}
            <div>
              <label className="text-gray-700">Excursion Name</label>
              <input
                type="text"
                value={excursionData.name}
                onChange={(e) => setExcursionData({ ...excursionData, name: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-gray-700">Location</label>
              <input
                type="text"
                value={excursionData.location}
                onChange={(e) => setExcursionData({ ...excursionData, location: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-700">Category</label>
              <input
                type="text"
                value={excursionData.category}
                onChange={(e) => setExcursionData({ ...excursionData, category: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
              />
            </div>

            {/* Best Time */}
            <div>
              <label className="text-gray-700">Best Time</label>
              <input
                type="text"
                value={excursionData.bestTime}
                onChange={(e) => setExcursionData({ ...excursionData, bestTime: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-gray-700">Duration</label>
              <input
                type="text"
                value={excursionData.duration}
                onChange={(e) => setExcursionData({ ...excursionData, duration: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="text-gray-700">Rating</label>
              <input
                type="number"
                value={excursionData.rating}
                onChange={(e) => setExcursionData({ ...excursionData, rating: Number(e.target.value) })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                max={5}
                min={1}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/destination-hotel")}
                className="px-6 py-2 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
}
