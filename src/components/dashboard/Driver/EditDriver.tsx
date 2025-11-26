import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditDriver() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize driver data
  const [driverData, setDriverData] = useState({
    name: "",
    email: "",
    contact: "",
    licenseNo: "",
    assignedVehicle: "",
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
    setDriverData({
      name: "John Doe",
      email: "johndoe@gmail.com",
      contact: "+94 762347830",
      licenseNo: "L1234567890",
      assignedVehicle: "Van #201",
      status: "Active",
    });
  }, []);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Driver updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    setTimeout(() => {
      navigate("/driver");
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
          {/* Top Bar */}
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
            <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/driver")}>
              Driver
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Edit Driver</span>
          </div>

          {/* Form Container */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
            {/* Title */}
            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                Edit a Driver
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                Update the driver details
              </p>
            </div>

            {/* FORM START */}
            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Driver Name */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Driver Name</label>
                <input
                  type="text"
                  value={driverData.name}
                  onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Email Address</label>
                <input
                  type="email"
                  value={driverData.email}
                  onChange={(e) => setDriverData({ ...driverData, email: e.target.value })}
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>
                <div className="flex items-center border border-purple-300 rounded-xl px-2 md:px-3 py-2 mt-1">
                  <select
                    className="text-gray-700 border-r pr-2 md:pr-3 mr-2 md:mr-3 outline-none text-[12px] md:text-[14px] font-poppins"
                    value={driverData.contact}
                    onChange={(e) => setDriverData({ ...driverData, contact: e.target.value })}
                  >
                    <option>🇱🇰 +94</option>
                    <option>🇮🇳 +91</option>
                    <option>🇦🇺 +61</option>
                  </select>
                  <input
                    type="text"
                    value={driverData.contact}
                    onChange={(e) => setDriverData({ ...driverData, contact: e.target.value })}
                    className="flex-1 outline-none px-2 text-[14px] md:text-[16px] font-poppins"
                  />
                </div>
              </div>

              {/* License No */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">License No</label>
                <input
                  type="text"
                  value={driverData.licenseNo}
                  onChange={(e) => setDriverData({ ...driverData, licenseNo: e.target.value })}
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
              </div>

              {/* Assigned Vehicle */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assigned Vehicle</label>
                <select
                  value={driverData.assignedVehicle}
                  onChange={(e) => setDriverData({ ...driverData, assignedVehicle: e.target.value })}
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                >
                  <option>Van #201</option>
                  <option>Van #202</option>
                  <option>Van #203</option>
                  <option>Van #204</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                <select
                  value={driverData.status}
                  onChange={(e) => setDriverData({ ...driverData, status: e.target.value })}
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/driver")}
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
            {/* FORM END */}
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
