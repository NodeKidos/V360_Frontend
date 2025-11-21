import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AddCustomer() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/user")}>
            Customer
          </span>
          <span className="text-gray-500"><MdKeyboardArrowRight /></span>
          <span className="font-semibold text-black">Add Customer</span>
        </div>

        {/* Form Container */}
        <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">

          {/* Title */}
          <div>
            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
              Add a Customer
            </h2>
            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
              Details about Customer
            </p>
          </div>

          {/* FORM START */}
         <form
            className="mt-4 md:mt-6 space-y-4 md:space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Customer added successfully!", {
                position: "top-right",
                autoClose: 2000,
              });
            }}
          >

            {/* Customer Name */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Customer Name</label>
              <input
                type="text"
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Email Address</label>
              <input
                type="email"
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>

              <div className="flex items-center border border-purple-300 rounded-xl px-2 md:px-3 py-2 mt-1">
                <select className="text-gray-700 border-r pr-2 md:pr-3 mr-2 md:mr-3 outline-none text-[12px] md:text-[14px] font-poppins">
                  <option>🇱🇰 +94</option>
                  <option>🇮🇳 +91</option>
                  <option>🇦🇺 +61</option>
                </select>
                <input
                  type="text"
                  placeholder=""
                  className="flex-1 outline-none px-2 text-[14px] md:text-[16px] font-poppins"
                />
              </div>

            </div>

            {/* Passport */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Passport No</label>
              <input
                type="text"
                className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
              />
            </div>

            {/* Country + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Country</label>
                <select className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins">
                  <option>Select</option>
                  <option>Sri Lanka</option>
                  <option>Australia</option>
                  <option>Singapore</option>
                  <option>Canada</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Gender</label>
                <select className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Account Status</label>
              <select className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins">
                <option>Select</option>
                <option>Block</option>
                <option>Unblock</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/user")}
                className="px-4 md:px-6 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
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
