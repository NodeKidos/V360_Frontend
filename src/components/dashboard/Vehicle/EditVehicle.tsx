import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditVehicle() {
  const navigate = useNavigate();
  const { vehicleId } = useParams(); // Assuming the vehicleId is passed in the URL
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [vehicleData, setVehicleData] = useState<{
    vehicleName: string;
    vehicleType: string;
    vehicleNoPlate: string;
    vehicleModel: string;
    seatCount: string;
    assignDriver: string;
    status: string;
    vehicleImage: File | null;
  }>({
    vehicleName: "",
    vehicleType: "",
    vehicleNoPlate: "",
    vehicleModel: "",
    seatCount: "",
    assignDriver: "",
    status: "Active",
    vehicleImage: null,
  });

  // Fetch vehicle data on page load
  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // ✅ Simulated fetch (now valid)
    setTimeout(() => {
      setVehicleData({
        vehicleName: "Car #201",
        vehicleType: "Car",
        vehicleNoPlate: "NP QL-9505",
        vehicleModel: "Toyota",
        seatCount: "3",
        assignDriver: "John",
        status: "Active",
        vehicleImage: null,
      });
    }, 1000);

    return () => window.removeEventListener("resize", handleResize);

}, [vehicleId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVehicleData({ ...vehicleData, vehicleImage: event.target.files[0] });
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Simulate submitting form data
    toast.success("Vehicle updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    navigate("/vehicle"); // Redirect to the vehicle list page after saving
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
            <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/vehicle")}>
              Vehicle
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Edit Vehicle</span>
          </div>

          {/* Form Container */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">

            {/* Title */}
            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                Edit Vehicle
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                Edit the details of the vehicle
              </p>
            </div>

            {/* FORM START */}
            <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>

              {/* Vehicle Name + Vehicle Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Name</label>
                  <input
                    type="text"
                    name="vehicleName"
                    value={vehicleData.vehicleName}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="Enter Vehicle Name"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={vehicleData.vehicleType}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="Enter Vehicle Type"
                  />
                </div>
              </div>

              {/* Vehicle No plate + Vehicle Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle No Plate</label>
                  <input
                    type="text"
                    name="vehicleNoPlate"
                    value={vehicleData.vehicleNoPlate}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="Enter Vehicle No Plate"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={vehicleData.vehicleModel}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="Enter Vehicle Model"
                  />
                </div>
              </div>

              {/* Seat Count + Assign Driver */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Seat Count</label>
                  <input
                    type="number"
                    name="seatCount"
                    min="1"
                    step="1"
                    value={vehicleData.seatCount}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="Enter Seat Count"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Assign Driver</label>
                  <input
                    type="text"
                    name="assignDriver"
                    value={vehicleData.assignDriver}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                    placeholder="Enter Driver Name"
                  />
                </div>
              </div>

              {/* Vehicle Image */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Vehicle Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                />
                {vehicleData.vehicleImage && <p className="text-gray-500 mt-2">{vehicleData.vehicleImage.name}</p>}
              </div>

              {/* Vehicle Status */}
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input type="radio" name="status" value="Active" checked={vehicleData.status === "Active"} onChange={handleChange} />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="status" value="In Service" checked={vehicleData.status === "In Service"} onChange={handleChange} />
                    <span className="ml-2 text-gray-700">In Service</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="status" value="Need Repair" checked={vehicleData.status === "Need Repair"} onChange={handleChange} />
                    <span className="ml-2 text-gray-700">Need Repair</span>
                  </label>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/vehicle")}
                  className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
                >
                  Submit
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
