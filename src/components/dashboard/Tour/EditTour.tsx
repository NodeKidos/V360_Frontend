import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditTour() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [tourData, setTourData] = useState({
    name: "",
    tour: "",
    destination: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dummy data fetch simulation (replace with actual data fetching logic)
  useEffect(() => {
    setTourData({
      name: "Alice",
      tour: "Beach",
    destination: "Colombo",
    startDate: "July 25, 2025",
    endDate: "July 28, 2025",
    status: "Completed",
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  toast.success("Tour updated successfully!", {
    position: "top-right",
    autoClose: 2000,
  });

  setTimeout(() => {
    navigate("/tour");
  }, 2000);
};


  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
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
          <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/tour")}>
            Tour
          </span>
          <span className="text-gray-500">›</span>
          <span className="font-semibold text-black">Edit Tour</span>
        </div>

        {/* Form Container */}
        <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
          {/* Title */}
          <div>
            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
              Edit a tour
            </h2>
            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
              Update the tour details
            </p>
          </div>

          {/* FORM START */}
          <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {/* Customer Name */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Customer Name</label>
              <input
                type="text"
                value={tourData.name}
                onChange={(e) => setTourData({ ...tourData, name: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Tour */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Tour</label>
              <input
                type="tour"
                value={tourData.tour}
                onChange={(e) => setTourData({ ...tourData, tour: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                Destination
              </label>
              <input
                type="text"
                value={tourData.destination}
                onChange={(e) =>
                  setTourData({ ...tourData, destination: e.target.value })
                }
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>
               
           {/* Start and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tourData.startDate}
                  onChange={(e) =>
                    setTourData({ ...tourData, startDate: e.target.value })
                  }
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
              </div>

              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                  End Date
                </label>
                <input
                  type="date"
                  value={tourData.endDate}
                  onChange={(e) =>
                    setTourData({ ...tourData, endDate: e.target.value })
                  }
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
              <select
                value={tourData.status}
                onChange={(e) => setTourData({ ...tourData, status: e.target.value })}
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Started">Started</option>
                  <option value="Initiated">Initiated</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-row sm:flex-row justify-end gap-4 md:gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/tour")}
                className="px-8 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
              >
                Save
              </button>
            </div>
          </form>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
